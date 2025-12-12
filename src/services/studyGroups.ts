import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  increment,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { StudyGroup, GroupMember, GroupStats, GroupActivity, Industry } from '../types';

/**
 * Get or create industry study group
 * Auto-creates if doesn't exist
 */
export async function getOrCreateIndustryGroup(industry: Industry, createdBy: string): Promise<StudyGroup> {
  const groupsRef = collection(db, 'studyGroups');
  const q = query(groupsRef, where('industry', '==', industry), limit(1));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    const groupData = snapshot.docs[0].data();
    return {
      id: snapshot.docs[0].id,
      ...groupData,
      createdAt: groupData.createdAt?.toDate().toISOString() || new Date().toISOString(),
    } as StudyGroup;
  }
  
  // Create new group
  const newGroup: Omit<StudyGroup, 'id'> = {
    industry,
    name: getIndustryGroupName(industry),
    description: getIndustryGroupDescription(industry),
    memberCount: 0,
    createdAt: new Date().toISOString(),
    createdBy: createdBy || 'system', // Ensure createdBy is never empty
    isPublic: true,
  };
  
  const docRef = await addDoc(groupsRef, {
    ...newGroup,
    createdAt: serverTimestamp(),
  });
  
  return {
    id: docRef.id,
    ...newGroup,
  };
}

/**
 * Join a study group
 */
export async function joinStudyGroup(
  groupId: string,
  userId: string,
  userName: string,
  userEmail: string,
  userAvatar?: string
): Promise<void> {
  // Check if already a member
  const memberRef = doc(db, 'studyGroups', groupId, 'members', userId);
  const memberDoc = await getDoc(memberRef);
  
  if (memberDoc.exists()) {
    // Update last active
    await updateDoc(memberRef, {
      isActive: true,
      lastActiveAt: serverTimestamp(),
    });
    return;
  }
  
  // Add member - only include userAvatar if it's defined
  const memberData: any = {
    groupId,
    userId,
    userName,
    userEmail,
    joinedAt: serverTimestamp(),
    role: 'member',
    isActive: true,
    lastActiveAt: serverTimestamp(),
  };
  
  // Only add userAvatar if it's defined (Firestore doesn't allow undefined)
  if (userAvatar) {
    memberData.userAvatar = userAvatar;
  }
  
  await setDoc(memberRef, memberData);
  
  // Increment member count
  await updateDoc(doc(db, 'studyGroups', groupId), {
    memberCount: increment(1),
  });
  
  // Create activity
  await createGroupActivity(groupId, userId, userName, userAvatar, 'member_joined', 
    `${userName} joined the group`);
}

/**
 * Leave a study group
 */
export async function leaveStudyGroup(groupId: string, userId: string): Promise<void> {
  const memberRef = doc(db, 'studyGroups', groupId, 'members', userId);
  await updateDoc(memberRef, {
    isActive: false,
  });
  
  // Decrement member count
  await updateDoc(doc(db, 'studyGroups', groupId), {
    memberCount: increment(-1),
  });
}

/**
 * Get user's study groups
 */
export async function getUserStudyGroups(userId: string): Promise<StudyGroup[]> {
  const allGroups: StudyGroup[] = [];
  const groupsSnapshot = await getDocs(collection(db, 'studyGroups'));
  
  for (const groupDoc of groupsSnapshot.docs) {
    const memberRef = doc(db, 'studyGroups', groupDoc.id, 'members', userId);
    const memberDoc = await getDoc(memberRef);
    
    if (memberDoc.exists() && memberDoc.data().isActive) {
      const groupData = groupDoc.data();
      allGroups.push({
        id: groupDoc.id,
        ...groupData,
        createdAt: groupData.createdAt?.toDate().toISOString() || new Date().toISOString(),
      } as StudyGroup);
    }
  }
  
  return allGroups;
}

/**
 * Get group members
 */
export async function getGroupMembers(groupId: string, limitCount?: number): Promise<GroupMember[]> {
  try {
    const membersRef = collection(db, 'studyGroups', groupId, 'members');
    
    // Try with orderBy first, but fall back to just where if index doesn't exist
    let q;
    try {
      q = query(membersRef, where('isActive', '==', true), orderBy('joinedAt', 'desc'));
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        joinedAt: doc.data().joinedAt?.toDate().toISOString() || new Date().toISOString(),
        lastActiveAt: doc.data().lastActiveAt?.toDate().toISOString() || new Date().toISOString(),
      } as GroupMember));
    } catch (orderByError: any) {
      // If orderBy fails (likely missing index), try without it
      if (orderByError.code === 'failed-precondition') {
        console.warn('Firestore index missing for orderBy, fetching without sort');
        q = query(membersRef, where('isActive', '==', true));
        if (limitCount) {
          q = query(q, limit(limitCount));
        }
        const snapshot = await getDocs(q);
        const members = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          joinedAt: doc.data().joinedAt?.toDate().toISOString() || new Date().toISOString(),
          lastActiveAt: doc.data().lastActiveAt?.toDate().toISOString() || new Date().toISOString(),
        } as GroupMember));
        // Sort manually
        return members.sort((a, b) => {
          const dateA = new Date(a.joinedAt).getTime();
          const dateB = new Date(b.joinedAt).getTime();
          return dateB - dateA;
        });
      }
      throw orderByError;
    }
  } catch (error) {
    console.error('Error getting group members:', error);
    return [];
  }
}

/**
 * Get group stats
 */
export async function getGroupStats(groupId: string): Promise<GroupStats | null> {
  const statsRef = doc(db, 'studyGroups', groupId, 'stats', 'current');
  const statsDoc = await getDoc(statsRef);
  
  if (!statsDoc.exists()) {
    // Calculate basic stats from members if stats don't exist
    const members = await getGroupMembers(groupId);
    if (members.length > 0) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const activeMembers = members.filter(m => {
        if (!m.lastActiveAt) return true;
        return new Date(m.lastActiveAt) >= sevenDaysAgo;
      }).length;

      return {
        groupId,
        totalMembers: members.length,
        activeMembers,
        totalLessonsCompleted: 0, // Would need to aggregate from member progress
        totalVocabularyMastered: 0, // Would need to aggregate from member progress
        averageStreak: 0, // Would need to calculate from member progress
        groupStreak: 0, // Would need to calculate from activity dates
        lastUpdated: new Date().toISOString(),
      };
    }
    return null;
  }
  
  const data = statsDoc.data();
  return {
    ...data,
    lastUpdated: data.lastUpdated?.toDate().toISOString() || new Date().toISOString(),
  } as GroupStats;
}

/**
 * Get group activities (feed)
 */
export async function getGroupActivities(
  groupId: string,
  limitCount: number = 20
): Promise<GroupActivity[]> {
  try {
    const activitiesRef = collection(db, 'studyGroups', groupId, 'activities');
    
    // Try with orderBy first, but fall back if index doesn't exist
    try {
      const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(limitCount));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString(),
      } as GroupActivity));
    } catch (orderByError: any) {
      // If orderBy fails (likely missing index), try without it
      if (orderByError.code === 'failed-precondition') {
        console.warn('Firestore index missing for activities orderBy, fetching without sort');
        const q = query(activitiesRef, limit(limitCount));
        const snapshot = await getDocs(q);
        const activities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString(),
        } as GroupActivity));
        // Sort manually
        return activities.sort((a, b) => {
          const dateA = new Date(a.timestamp).getTime();
          const dateB = new Date(b.timestamp).getTime();
          return dateB - dateA;
        });
      }
      throw orderByError;
    }
  } catch (error) {
    console.error('Error getting group activities:', error);
    return [];
  }
}

/**
 * Create group activity
 */
export async function createGroupActivity(
  groupId: string,
  userId: string,
  userName: string,
  userAvatar: string | undefined,
  type: GroupActivity['type'],
  content: string,
  metadata?: GroupActivity['metadata']
): Promise<void> {
  const activitiesRef = collection(db, 'studyGroups', groupId, 'activities');
  const activityData: any = {
    groupId,
    userId,
    userName,
    type,
    content,
    metadata: metadata || {},
    timestamp: serverTimestamp(),
  };
  
  // Only add userAvatar if it's defined (Firestore doesn't allow undefined)
  if (userAvatar) {
    activityData.userAvatar = userAvatar;
  }
  
  await addDoc(activitiesRef, activityData);
}

/**
 * Get a single study group by ID
 */
export async function getStudyGroup(groupId: string): Promise<StudyGroup | null> {
  const groupRef = doc(db, 'studyGroups', groupId);
  const groupDoc = await getDoc(groupRef);
  
  if (!groupDoc.exists()) {
    return null;
  }
  
  const groupData = groupDoc.data();
  return {
    id: groupDoc.id,
    ...groupData,
    createdAt: groupData.createdAt?.toDate().toISOString() || new Date().toISOString(),
  } as StudyGroup;
}

/**
 * Check if user is member of a group
 */
export async function isGroupMember(groupId: string, userId: string): Promise<boolean> {
  const memberRef = doc(db, 'studyGroups', groupId, 'members', userId);
  const memberDoc = await getDoc(memberRef);
  return memberDoc.exists() && memberDoc.data().isActive === true;
}

/**
 * Helper: Get industry group name
 */
function getIndustryGroupName(industry: Industry): string {
  const names: Record<Industry, string> = {
    'tech': 'Tech Professionals Learning Spanish',
    'finance': 'Finance & Banking Spanish Learners',
    'logistics': 'Logistics & Operations Spanish Group',
    'customer-service': 'Customer Service Spanish Learners',
    'architecture': 'Architecture & Construction Spanish Group',
    'healthcare': 'Healthcare Professionals Learning Spanish',
  };
  return names[industry] || 'Spanish Learners';
}

/**
 * Helper: Get industry group description
 */
function getIndustryGroupDescription(industry: Industry): string {
  const descriptions: Record<Industry, string> = {
    'tech': 'Connect with tech professionals learning Spanish for business communication.',
    'finance': 'Join finance professionals mastering Spanish for banking and finance contexts.',
    'logistics': 'Learn Spanish with logistics and operations professionals.',
    'customer-service': 'Practice customer service Spanish with fellow professionals.',
    'architecture': 'Study Spanish for architecture and construction with industry peers.',
    'healthcare': 'Learn medical Spanish with healthcare professionals.',
  };
  return descriptions[industry] || 'Learn Spanish with professionals in your industry.';
}

