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
