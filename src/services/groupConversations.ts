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
  onSnapshot,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type {
  GroupConversationSession,
  ConversationParticipant,
  DialogueMessage,
  RoleAssignment,
} from '../types';
import { conversationScenarios, type ConversationScenario } from '../data/conversationScenarios';
import { analyzeResponseAdvanced } from '../utils/conversationAnalysis';

/**
 * Create a new group conversation session
 */
export async function createGroupConversationSession(
  groupId: string,
  scenarioId: string,
  type: 'role-play' | 'group-conversation',
  createdBy: string,
  userName: string,
  scheduledStartTime?: string
): Promise<GroupConversationSession> {
  const scenario = conversationScenarios.find(s => s.id === scenarioId);
  if (!scenario) {
    throw new Error('Scenario not found');
  }

  // Convert scenario to group format
  const roles = createRolesForScenario(scenario, type);
  const turnOrder = [createdBy];

  const session: Omit<GroupConversationSession, 'id'> = {
    groupId,
    scenarioId,
    type,
    status: 'scheduled',
    createdBy,
    createdAt: new Date().toISOString(),
    scheduledStartTime,
    participants: [
      {
        userId: createdBy,
        userName,
        role: roles[0].roleName,
        joinedAt: new Date().toISOString(),
        isActive: true,
        isReady: false,
        turnOrder: 0,
      },
    ],
    maxParticipants: type === 'role-play' ? 2 : 4,
    scenarioConfig: {
      scenarioId,
      roles: [
        {
          roleId: roles[0].roleId,
          roleName: roles[0].roleName,
          userId: createdBy,
          dialogueNodeIds: roles[0].dialogueNodeIds,
        },
      ],
      turnOrder,
      currentTurnIndex: 0,
    },
    conversationState: {
      currentNodeIndex: 0,
      dialogueHistory: [],
      completedNodes: [],
    },
  };

  const docRef = await addDoc(
    collection(db, 'groupConversationSessions'),
    {
      ...session,
      createdAt: serverTimestamp(),
      scheduledStartTime: scheduledStartTime ? Timestamp.fromDate(new Date(scheduledStartTime)) : null,
    }
  );

  return {
    id: docRef.id,
    ...session,
  };
}

/**
 * Join a conversation session
 */
export async function joinConversationSession(
  sessionId: string,
  userId: string,
  userName: string,
  userAvatar?: string
): Promise<void> {
  const sessionRef = doc(db, 'groupConversationSessions', sessionId);
  const sessionDoc = await getDoc(sessionRef);

  if (!sessionDoc.exists()) {
    throw new Error('Session not found');
  }

  const session = sessionDoc.data() as GroupConversationSession;

  // Check if already a participant
  if (session.participants.some(p => p.userId === userId)) {
    return;
  }

  // Check if session is full
  if (session.participants.length >= session.maxParticipants) {
    throw new Error('Session is full');
  }

  // Get scenario to assign role
  const scenario = conversationScenarios.find(s => s.id === session.scenarioId);
  if (!scenario) throw new Error('Scenario not found');

  const roles = createRolesForScenario(scenario, session.type);
  const availableRole = roles[session.participants.length];

  const newParticipant: ConversationParticipant = {
    userId,
    userName,
    userAvatar,
    role: availableRole.roleName,
    joinedAt: new Date().toISOString(),
    isActive: true,
    isReady: false,
    turnOrder: session.participants.length,
  };

  // Update session
  await updateDoc(sessionRef, {
    participants: [...session.participants, newParticipant],
    'scenarioConfig.roles': [
      ...session.scenarioConfig.roles,
      {
        roleId: availableRole.roleId,
        roleName: availableRole.roleName,
        userId,
        dialogueNodeIds: availableRole.dialogueNodeIds,
      },
    ],
    'scenarioConfig.turnOrder': [...session.scenarioConfig.turnOrder, userId],
  });

  // Add participant document
  await setDoc(
    doc(db, 'groupConversationSessions', sessionId, 'participants', userId),
    {
      ...newParticipant,
      joinedAt: serverTimestamp(),
    }
  );
}

/**
 * Start a conversation session
 */
export async function startConversationSession(sessionId: string): Promise<void> {
  const sessionRef = doc(db, 'groupConversationSessions', sessionId);
  const sessionDoc = await getDoc(sessionRef);

  if (!sessionDoc.exists()) {
    throw new Error('Session not found');
  }

  const session = sessionDoc.data() as GroupConversationSession;

  // Check if all participants are ready
  if (session.participants.length < session.maxParticipants) {
    throw new Error('Not all participants have joined');
  }

  await updateDoc(sessionRef, {
    status: 'active',
    startedAt: serverTimestamp(),
  });

  // Send initial system message
  const scenario = conversationScenarios.find(s => s.id === session.scenarioId);
  if (scenario && scenario.dialogueFlow[0]) {
    const firstNode = scenario.dialogueFlow[0];
    if (firstNode.speaker === 'ai' && firstNode.text) {
      await sendSystemMessage(sessionId, firstNode.text, firstNode.id);
    }
  }
}

/**
 * Send a message in the conversation
 */
export async function sendConversationMessage(
  sessionId: string,
  userId: string,
  userName: string,
  userAvatar: string | undefined,
  nodeId: string,
  text: string
): Promise<void> {
  const sessionRef = doc(db, 'groupConversationSessions', sessionId);
  const sessionDoc = await getDoc(sessionRef);

  if (!sessionDoc.exists()) {
    throw new Error('Session not found');
  }

  const session = sessionDoc.data() as GroupConversationSession;

  // Get participant role
  const participant = session.participants.find(p => p.userId === userId);
  if (!participant) {
    throw new Error('User is not a participant');
  }

  // Get scenario and current node
  const scenario = conversationScenarios.find(s => s.id === session.scenarioId);
  if (!scenario) throw new Error('Scenario not found');

  const currentNode = scenario.dialogueFlow.find(n => n.id === nodeId);
  if (!currentNode) throw new Error('Node not found');

  // Analyze response for feedback
  const feedback = (currentNode as any).expectedResponses
    ? analyzeResponseAdvanced(text, (currentNode as any).expectedResponses)
    : undefined;

  const message: Omit<DialogueMessage, 'id'> = {
    sessionId,
    userId,
    userName,
    userAvatar,
    role: participant.role,
    nodeId,
    messageType: 'user-response',
    text,
    timestamp: new Date().toISOString(),
    feedback: feedback ? {
      score: feedback.score,
      grammarIssues: feedback.grammarIssues,
      vocabularySuggestions: feedback.vocabularySuggestions,
      feedbackLevel: feedback.feedbackLevel,
    } : undefined,
  };

  // Add message
  await addDoc(
    collection(db, 'groupConversationSessions', sessionId, 'messages'),
    {
      ...message,
      timestamp: serverTimestamp(),
    }
  );

  // Update session state
  const nextNodeIndex = session.conversationState.currentNodeIndex + 1;
  const nextNode = scenario.dialogueFlow[nextNodeIndex];

  await updateDoc(sessionRef, {
    'conversationState.dialogueHistory': [
      ...session.conversationState.dialogueHistory,
      message,
    ],
    'conversationState.currentNodeIndex': nextNodeIndex,
    'conversationState.completedNodes': [
      ...session.conversationState.completedNodes,
      nodeId,
    ],
    'scenarioConfig.currentTurnIndex': (session.scenarioConfig.currentTurnIndex + 1) % session.scenarioConfig.turnOrder.length,
  });

  // Send next AI/system message if applicable
  if (nextNode && nextNode.speaker === 'ai' && nextNode.text) {
    await sendSystemMessage(sessionId, nextNode.text, nextNode.id);
  }

  // Check if conversation is complete
  if (!nextNode || !nextNode.followUpNodes || nextNode.followUpNodes.length === 0) {
    await completeConversationSession(sessionId);
  }
}

/**
 * Send system/AI message
 */
async function sendSystemMessage(
  sessionId: string,
  text: string,
  nodeId: string
): Promise<void> {
  await addDoc(
    collection(db, 'groupConversationSessions', sessionId, 'messages'),
    {
      sessionId,
      userId: 'system',
      userName: 'System',
      role: 'System',
      nodeId,
      messageType: 'ai-prompt',
      text,
      timestamp: serverTimestamp(),
    }
  );
}

/**
 * Add peer feedback to a message
 */
export async function addPeerFeedback(
  sessionId: string,
  messageId: string,
  fromUserId: string,
  fromUserName: string,
  feedback: {
    feedbackType: 'grammar' | 'vocabulary' | 'pronunciation' | 'general';
    comment: string;
    rating?: number;
  }
): Promise<void> {
  const messageRef = doc(db, 'groupConversationSessions', sessionId, 'messages', messageId);
  const messageDoc = await getDoc(messageRef);

  if (!messageDoc.exists()) {
    throw new Error('Message not found');
  }

  const message = messageDoc.data() as DialogueMessage;
  const peerFeedback = {
    fromUserId,
    fromUserName,
    ...feedback,
    timestamp: new Date().toISOString(),
  };

  await updateDoc(messageRef, {
    peerFeedback: [...(message.peerFeedback || []), peerFeedback],
  });
}

/**
 * Set participant ready status
 */
export async function setParticipantReady(
  sessionId: string,
  userId: string,
  isReady: boolean
): Promise<void> {
  const sessionRef = doc(db, 'groupConversationSessions', sessionId);
  const sessionDoc = await getDoc(sessionRef);

  if (!sessionDoc.exists()) {
    throw new Error('Session not found');
  }

  const session = sessionDoc.data() as GroupConversationSession;
  const updatedParticipants = session.participants.map(p =>
    p.userId === userId ? { ...p, isReady } : p
  );

  await updateDoc(sessionRef, {
    participants: updatedParticipants,
  });
}

/**
 * Complete conversation session
 */
async function completeConversationSession(sessionId: string): Promise<void> {
  const sessionRef = doc(db, 'groupConversationSessions', sessionId);
  await updateDoc(sessionRef, {
    status: 'completed',
    completedAt: serverTimestamp(),
  });
}

/**
 * Listen to conversation messages in real-time
 */
export function subscribeToConversationMessages(
  sessionId: string,
  callback: (messages: DialogueMessage[]) => void
): () => void {
  const messagesRef = collection(db, 'groupConversationSessions', sessionId, 'messages');
  
  // Try with orderBy, fallback if index missing
  let q;
  try {
    q = query(messagesRef, orderBy('timestamp', 'asc'));
  } catch (error) {
    // If orderBy fails, use without it
    q = query(messagesRef);
  }

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString(),
    } as DialogueMessage));
    
    // Sort manually if orderBy didn't work
    messages.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
    
    callback(messages);
  });
}

/**
 * Listen to session updates in real-time
 */
export function subscribeToSession(
  sessionId: string,
  callback: (session: GroupConversationSession | null) => void
): () => void {
  const sessionRef = doc(db, 'groupConversationSessions', sessionId);
  return onSnapshot(sessionRef, (doc) => {
    if (!doc.exists()) {
      callback(null);
      return;
    }

    const data = doc.data();
    callback({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      scheduledStartTime: data.scheduledStartTime?.toDate().toISOString(),
      startedAt: data.startedAt?.toDate().toISOString(),
      completedAt: data.completedAt?.toDate().toISOString(),
    } as GroupConversationSession);
  });
}

/**
 * Get active sessions for a group
 */
export async function getGroupConversationSessions(
  groupId: string,
  status?: GroupConversationSession['status']
): Promise<GroupConversationSession[]> {
  const sessionsRef = collection(db, 'groupConversationSessions');
  let q = query(sessionsRef, where('groupId', '==', groupId));

  if (status) {
    q = query(q, where('status', '==', status));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
  } as GroupConversationSession));
}

/**
 * Helper: Create roles for scenario
 */
function createRolesForScenario(
  scenario: ConversationScenario,
  type: 'role-play' | 'group-conversation'
): Array<{ roleId: string; roleName: string; dialogueNodeIds: string[] }> {
  if (type === 'role-play') {
    // Two roles: User and AI
    const userNodes = scenario.dialogueFlow.filter(n => n.speaker === 'user');
    const aiNodes = scenario.dialogueFlow.filter(n => n.speaker === 'ai');

    // Determine role names based on scenario
    const roleNames = getRoleNamesForScenario(scenario);

    return [
      {
        roleId: 'user',
        roleName: roleNames.user,
        dialogueNodeIds: userNodes.map(n => n.id),
      },
      {
        roleId: 'ai',
        roleName: roleNames.ai,
        dialogueNodeIds: aiNodes.map(n => n.id),
      },
    ];
  } else {
    // Group conversation: create multiple roles
    return [
      {
        roleId: 'manager',
        roleName: 'Manager',
        dialogueNodeIds: [],
      },
      {
        roleId: 'member1',
        roleName: 'Team Member 1',
        dialogueNodeIds: [],
      },
      {
        roleId: 'member2',
        roleName: 'Team Member 2',
        dialogueNodeIds: [],
      },
    ];
  }
}

/**
 * Helper: Get role names based on scenario
 */
function getRoleNamesForScenario(scenario: ConversationScenario): { user: string; ai: string } {
  const roleMap: Record<string, { user: string; ai: string }> = {
    'tech-pitch-1': { user: 'Entrepreneur', ai: 'Investor' },
    'finance-deal-1': { user: 'Client', ai: 'Bank Representative' },
    'customer-complaint-1': { user: 'Customer Service Rep', ai: 'Customer' },
    'sales-call-1': { user: 'Sales Rep', ai: 'Potential Client' },
  };

  return roleMap[scenario.id] || { user: 'You', ai: 'Partner' };
}

