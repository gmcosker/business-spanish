import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Module, UserProgress, OnboardingData, VocabularyItem, Achievement, UserPreferences, DailyActivity } from '../types';
import { checkNewAchievements } from '../utils/achievements';
import { saveUserProgress, getUserProgress, trackDailyActivity as saveDailyActivityToFirestore } from '../services/firestore';

interface AppState {
  user: User | null;
  firebaseUser: any | null; // Firebase user object
  modules: Module[];
  allModules: { [key: string]: Module[] }; // Store modules by industry
  currentIndustry: string | null;
  progress: UserProgress | null;
  vocabularyItems: VocabularyItem[];
  onboardingData: OnboardingData;
  isOnboarding: boolean;
  newAchievements: Achievement[];
  quickMode: boolean; // For testing flexibility
  
  // Actions
  setUser: (user: User) => void;
  setFirebaseUser: (firebaseUser: any) => void;
  setModules: (modules: Module[]) => void;
  setAllModules: (industry: string, modules: Module[]) => void;
  setCurrentIndustry: (industry: string) => void;
  setProgress: (progress: UserProgress) => void;
  updateOnboarding: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
  completeLesson: (lessonId: string) => Promise<void>;
  completeModule: (moduleId: string) => Promise<void>;
  addVocabularyItem: (item: VocabularyItem) => void;
  updateVocabularyItem: (id: string, updates: Partial<VocabularyItem>) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  trackDailyActivity: (activity: { lessonsCompleted: number; timeSpent: number; vocabularyReviewed: number }) => Promise<void>;
  syncProgressToFirestore: () => Promise<void>;
  loadProgressFromFirestore: () => Promise<void>;
  clearNewAchievements: () => void;
  toggleQuickMode: () => void;
  resetApp: () => void;
}

const initialOnboarding: OnboardingData = {
  step: 0,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      firebaseUser: null,
      modules: [],
      allModules: {},
      currentIndustry: null,
      progress: null,
      vocabularyItems: [],
      onboardingData: initialOnboarding,
      isOnboarding: true,
      newAchievements: [],
      quickMode: false,

      setUser: (user) => set({ user }),
      
      setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
      
      setModules: (modules) => set({ modules }),
      
      setAllModules: (industry, modules) => 
        set((state) => ({
          allModules: { ...state.allModules, [industry]: modules },
          modules: state.currentIndustry === industry ? modules : state.modules,
        })),
      
      setCurrentIndustry: (industry) => 
        set((state) => {
          const industryModules = state.allModules[industry] || [];
          return { currentIndustry: industry, modules: industryModules };
        }),
      
      setProgress: (progress) => set({ progress }),
      
      updateOnboarding: (data) => 
        set((state) => ({
          onboardingData: { ...state.onboardingData, ...data }
        })),
      
      completeOnboarding: async () => {
        const { onboardingData, firebaseUser } = get();
        const user: User = {
          id: firebaseUser?.uid || Date.now().toString(),
          name: firebaseUser?.displayName || 'User',
          email: firebaseUser?.email || '',
          industry: onboardingData.industry || 'tech',
          level: onboardingData.level || 'intermediate',
          goal: onboardingData.goal || '',
          targetDate: onboardingData.targetDate,
          createdAt: new Date().toISOString(),
        };
        
        const progress: UserProgress = {
          userId: user.id,
          completedLessons: [],
          completedModules: [],
          vocabularyMastered: 0,
          totalVocabulary: 0,
          streakDays: 1,
          lastActiveDate: new Date().toISOString(),
          weeklyGoal: 5,
          weeklyProgressCount: 0,
          achievements: [],
          totalTimeMinutes: 0,
          dailyActivity: [],
          weeklyProgressData: [],
        };
        
        set({ user, progress, isOnboarding: false });
        
        // Save to Firestore if authenticated
        if (firebaseUser) {
          const { saveUserProgress } = await import('../services/firestore');
          await saveUserProgress(firebaseUser.uid, progress);
        }
      },
      
      completeLesson: async (lessonId) => {
        const { progress, firebaseUser } = get();
        if (!progress) return;
        
        if (!progress.completedLessons.includes(lessonId)) {
          const updatedProgress = {
            ...progress,
            completedLessons: [...progress.completedLessons, lessonId],
            weeklyProgressCount: progress.weeklyProgressCount + 1,
            lastActiveDate: new Date().toISOString(),
          };
          
          // Check for new achievements
          const newAchievements = checkNewAchievements(updatedProgress);
          
          set({
            progress: {
              ...updatedProgress,
              achievements: [...updatedProgress.achievements, ...newAchievements],
            },
            newAchievements,
          });

          // Track daily activity to Firestore
          if (firebaseUser) {
            try {
              const today = new Date().toISOString().split('T')[0];
              const todayActivity = updatedProgress.dailyActivity.find(a => a.date === today);
              const activity = todayActivity || { date: today, lessonsCompleted: 0, timeSpent: 0, vocabularyReviewed: 0 };
              
              await saveDailyActivityToFirestore(firebaseUser.uid, {
                date: today,
                lessonsCompleted: activity.lessonsCompleted + 1,
                timeSpent: activity.timeSpent,
                vocabularyReviewed: activity.vocabularyReviewed,
              });
            } catch (error) {
              console.error('Error tracking daily activity to Firestore:', error);
            }
          }
        }
      },
      
      completeModule: async (moduleId) => {
        const { progress, firebaseUser } = get();
        if (!progress) return;
        
        if (!progress.completedModules.includes(moduleId)) {
          const updatedProgress = {
            ...progress,
            completedModules: [...progress.completedModules, moduleId],
          };
          
          // Check for new achievements
          const newAchievements = checkNewAchievements(updatedProgress);
          
          set({
            progress: {
              ...updatedProgress,
              achievements: [...updatedProgress.achievements, ...newAchievements],
            },
            newAchievements,
          });

          // Track daily activity to Firestore
          if (firebaseUser) {
            try {
              const today = new Date().toISOString().split('T')[0];
              const todayActivity = updatedProgress.dailyActivity.find(a => a.date === today);
              
              await saveDailyActivityToFirestore(firebaseUser.uid, {
                date: today,
                lessonsCompleted: todayActivity?.lessonsCompleted || 0,
                timeSpent: todayActivity?.timeSpent || 0,
                vocabularyReviewed: todayActivity?.vocabularyReviewed || 0,
              });
            } catch (error) {
              console.error('Error tracking daily activity to Firestore:', error);
            }
          }
        }
      },
      
      addVocabularyItem: (item) =>
        set((state) => ({
          vocabularyItems: [...state.vocabularyItems, item],
        })),
      
      updateVocabularyItem: (id, updates) =>
        set((state) => ({
          vocabularyItems: state.vocabularyItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      
      updateUserPreferences: (preferences) =>
        set((state) => {
          if (!state.user || !state.user.preferences) return state;
          return {
            user: {
              ...state.user,
              preferences: { ...state.user.preferences, ...preferences } as UserPreferences
            }
          };
        }),
      
      trackDailyActivity: async (activity) => {
        const { progress, firebaseUser } = get();
        if (!progress) return;
        
        const today = new Date().toISOString().split('T')[0];
        const existingIndex = progress.dailyActivity.findIndex(a => a.date === today);
        
        let updatedActivity: DailyActivity[];
        if (existingIndex >= 0) {
          updatedActivity = progress.dailyActivity.map((a, i) =>
            i === existingIndex
              ? { ...a, ...activity }
              : a
          );
        } else {
          updatedActivity = [...progress.dailyActivity, { ...activity, date: today }];
        }
        
        // Update total time
        const newTotalTime = progress.totalTimeMinutes + activity.timeSpent;
        
        set({
          progress: {
            ...progress,
            dailyActivity: updatedActivity,
            totalTimeMinutes: newTotalTime,
            lastActiveDate: new Date().toISOString(),
          }
        });

        // Sync to Firestore
        if (firebaseUser) {
          try {
            await saveDailyActivityToFirestore(firebaseUser.uid, {
              date: today,
              ...activity,
            });
          } catch (error) {
            console.error('Error tracking daily activity to Firestore:', error);
          }
        }
      },
      
      syncProgressToFirestore: async () => {
        const { progress, firebaseUser } = get();
        if (!progress || !firebaseUser) return;
        
        try {
          await saveUserProgress(firebaseUser.uid, progress);
        } catch (error) {
          console.error('Error syncing to Firestore:', error);
        }
      },
      
      loadProgressFromFirestore: async () => {
        const { firebaseUser } = get();
        if (!firebaseUser) return;
        
        try {
          const progress = await getUserProgress(firebaseUser.uid);
          if (progress) {
            set({ progress });
          }
        } catch (error) {
          console.error('Error loading from Firestore:', error);
        }
      },
      
      clearNewAchievements: () => set({ newAchievements: [] }),
      
      toggleQuickMode: () => set((state) => ({ quickMode: !state.quickMode })),
      
      resetApp: () => 
        set({
          user: null,
          firebaseUser: null,
          modules: [],
          allModules: {},
          currentIndustry: null,
          progress: null,
          vocabularyItems: [],
          onboardingData: initialOnboarding,
          isOnboarding: true,
          newAchievements: [],
          quickMode: false,
        }),
    }),
    {
      name: 'business-spanish-storage',
    }
  )
);

