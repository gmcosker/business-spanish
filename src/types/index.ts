export type Industry = 'tech' | 'finance' | 'logistics' | 'customer-service' | 'architecture' | 'healthcare';

export type LanguageLevel = 'beginner' | 'intermediate' | 'advanced';

export type SubscriptionTier = 'free' | 'professional' | 'team';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  emailReminders: boolean;
  streakReminders: boolean;
  soundEnabled: boolean;
  autoPlayAudio: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  industry: Industry;
  level: LanguageLevel;
  goal: string;
  targetDate?: string;
  createdAt: string;
  avatar?: string;
  preferences?: UserPreferences;
  subscriptionTier?: SubscriptionTier;
  studyGroupIds?: string[]; // Array of group IDs user belongs to
}

export interface Module {
  id: string;
  title: string;
  description: string;
  industry: Industry;
  lessons: Lesson[];
  order: number;
  estimatedMinutes: number;
  completed: boolean;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  type: 'video' | 'dialogue' | 'vocabulary' | 'practice';
  content: LessonContent;
  order: number;
  completed: boolean;
  duration: number; // in minutes
}

export interface LessonContent {
  videoUrl?: string;
  dialogue?: DialogueLine[];
  vocabulary?: VocabularyItem[];
  practiceExercises?: PracticeExercise[];
  culturalNotes?: string[];
}

export interface DialogueLine {
  speaker: string;
  text: string;
  translation?: string;
}

export interface VocabularyItem {
  id: string;
  term: string;
  translation: string;
  context?: string;
  example?: string;
  nextReview: string; // ISO date
  interval: number; // days
  easeFactor: number; // SM-2 EF
  repetitions: number;
}

export interface PracticeExercise {
  id: string;
  type: 'multiple-choice' | 'speaking' | 'writing' | 'listening';
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  lessonsCompleted: number;
  timeSpent: number; // minutes
  vocabularyReviewed: number;
}

export interface WeeklyProgress {
  week: string;
  lessonsCompleted: number;
  timeSpentMinutes: number;
  averageAccuracy: number;
}

export interface UserProgress {
  userId: string;
  completedLessons: string[];
  completedModules: string[];
  vocabularyMastered: number;
  totalVocabulary: number;
  streakDays: number;
  lastActiveDate: string;
  weeklyGoal: number;
  weeklyProgressCount: number;
  achievements: Achievement[];
  totalTimeMinutes: number;
  dailyActivity: DailyActivity[];
  weeklyProgressData: WeeklyProgress[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  earnedAt?: string;
}

export interface Note {
  id: string;
  lessonId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  lessonId: string;
  vocabularyId?: string;
  type: 'lesson' | 'vocabulary';
  createdAt: string;
}

export interface OnboardingData {
  step: number;
  level?: LanguageLevel;
  industry?: Industry;
  goal?: string;
  targetDate?: string;
}

export interface StudyGroup {
  id: string;
  industry: Industry;
  name: string; // e.g., "Tech Professionals Learning Spanish"
  description: string;
  memberCount: number;
  createdAt: string;
  createdBy: string;
  isPublic: boolean;
  rules?: string[];
  bannerImage?: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  joinedAt: string;
  role: 'member' | 'moderator' | 'admin';
  isActive: boolean;
  lastActiveAt: string;
}

export interface GroupStats {
  groupId: string;
  totalMembers: number;
  activeMembers: number; // Active in last 7 days
  totalLessonsCompleted: number;
  totalVocabularyMastered: number;
  averageStreak: number;
  groupStreak: number; // Consecutive days with at least 1 member active
  lastUpdated: string;
}

export interface GroupActivity {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'lesson_completed' | 'achievement_earned' | 'member_joined' | 'challenge_created';
  content: string; // e.g., "Sarah completed 'Tech Meetings & Presentations'"
  metadata?: {
    lessonId?: string;
    achievementId?: string;
    challengeId?: string;
  };
  timestamp: string;
}

// Group Conversation Practice Types
export interface GroupConversationSession {
  id: string;
  groupId: string;
  scenarioId: string; // References existing ConversationScenario
  type: 'role-play' | 'group-conversation';
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  scheduledStartTime?: string;
  startedAt?: string;
  completedAt?: string;
  
  // Participants
  participants: ConversationParticipant[];
  maxParticipants: number; // 2 for role-play, 3-4 for group
  
  // Scenario configuration
  scenarioConfig: {
    scenarioId: string;
    roles: RoleAssignment[];
    turnOrder: string[]; // User IDs in order
    currentTurnIndex: number;
  };
  
  // Conversation state
  conversationState: {
    currentNodeIndex: number;
    dialogueHistory: DialogueMessage[];
    completedNodes: string[];
  };
}

export interface ConversationParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  role: string; // e.g., "Client", "Sales Rep", "Manager"
  joinedAt: string;
  isActive: boolean;
  isReady: boolean;
  turnOrder: number; // Position in turn sequence
}

export interface RoleAssignment {
  roleId: string; // e.g., "client", "sales-rep"
  roleName: string; // e.g., "Client", "Sales Representative"
  userId: string; // Assigned user
  dialogueNodeIds: string[]; // Which nodes this role speaks in
}

export interface DialogueMessage {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  role: string;
  nodeId: string; // Which dialogue node this corresponds to
  messageType: 'ai-prompt' | 'user-response' | 'system';
  text: string;
  timestamp: string;
  
  // For user responses
  feedback?: {
    score: number;
    grammarIssues?: string[];
    vocabularySuggestions?: string[];
    feedbackLevel: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  };
  
  // Peer feedback
  peerFeedback?: PeerFeedback[];
}

export interface PeerFeedback {
  fromUserId: string;
  fromUserName: string;
  feedbackType: 'grammar' | 'vocabulary' | 'pronunciation' | 'general';
  comment: string;
  rating?: number; // 1-5
  timestamp: string;
}

export interface GroupDialogueNode {
  id: string;
  speakerRole: string; // Which role speaks
  text?: string; // For AI/system prompts
  expectedResponses?: string[];
  followUpNodes?: string[];
  feedbackHints?: string;
  isSystemPrompt?: boolean;
}

export interface RoleDefinition {
  roleId: string;
  roleName: string;
  description: string;
  dialogueNodeIds: string[];
}
