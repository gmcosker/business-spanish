export type Industry = 'tech' | 'finance' | 'logistics' | 'customer-service';

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
  translation: string;
  audioUrl?: string;
}

export interface VocabularyItem {
  id: string;
  term: string;
  translation: string;
  context: string;
  example: string;
  audioUrl?: string;
  nextReview: string;
  interval: number; // SRS interval in days
  easeFactor: number;
  repetitions: number;
}

export interface PracticeExercise {
  id: string;
  type: 'fill-blank' | 'multiple-choice' | 'speaking' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface DailyActivity {
  date: string;
  lessonsCompleted: number;
  timeSpent: number; // in minutes
  vocabularyReviewed: number;
}

export interface WeeklyProgress {
  week: string; // "YYYY-WW" format
  lessonsCompleted: number;
  timeSpent: number;
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
  weeklyProgressCount: number; // Renamed to avoid conflict
  achievements: Achievement[];
  totalTimeMinutes: number;
  dailyActivity: DailyActivity[];
  weeklyProgressData: WeeklyProgress[]; // Detailed weekly data
}

export interface OnboardingData {
  step: number;
  level?: LanguageLevel;
  industry?: Industry;
  goal?: string;
  targetDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'milestone' | 'streak' | 'mastery' | 'social';
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
