import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UserProgress, VocabularyItem, DailyActivity } from '../types';

/**
 * Save user progress to Firestore
 */
export async function saveUserProgress(uid: string, progress: UserProgress): Promise<void> {
  try {
    await setDoc(
      doc(db, 'users', uid, 'progress', 'current'),
      {
        ...progress,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
}

/**
 * Get user progress from Firestore
 */
export async function getUserProgress(uid: string): Promise<UserProgress | null> {
  try {
    const docRef = await getDoc(doc(db, 'users', uid, 'progress', 'current'));
    
    if (!docRef.exists()) {
      return null;
    }

    return docRef.data() as UserProgress;
  } catch (error) {
    console.error('Error getting progress:', error);
    return null;
  }
}

/**
 * Track daily activity
 */
export async function trackDailyActivity(
  uid: string, 
  activity: DailyActivity
): Promise<void> {
  try {
    await setDoc(
      doc(db, 'users', uid, 'activity', activity.date),
      {
        ...activity,
        timestamp: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error tracking activity:', error);
    throw error;
  }
}

/**
 * Get daily activity for a date range
 */
export async function getDailyActivity(
  uid: string, 
  startDate: string, 
  endDate: string
): Promise<DailyActivity[]> {
  try {
    const activityRef = collection(db, 'users', uid, 'activity');
    const q = query(
      activityRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as DailyActivity);
  } catch (error) {
    console.error('Error getting activity:', error);
    return [];
  }
}




