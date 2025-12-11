import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Module, UserProgress, OnboardingData, VocabularyItem, Achievement, UserPreferences, DailyActivity } from '../types';
import { checkNewAchievements } from '../utils/achievements';
import { saveUserProgress, getUserProgress, trackDailyActivity as saveDailyActivityToFirestore } from '../services/firestore';
import { analytics } from '../services/analytics';

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
  setCurrentIndustry: (industry: string) => Promise<void>;
  setProgress: (progress: UserProgress) => void;
  updateOnboarding: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => Promise<void>;
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
  backfillCompletedModules: () => Promise<void>;
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
      
      setCurrentIndustry: async (industry) => {
        const state = get();
        let industryModules = state.allModules[industry];
        
        // Lazy-load modules if not loaded yet
        if (!industryModules || industryModules.length === 0) {
          try {
            if (industry === 'tech') {
              const { techModules } = await import('../data/sampleModules');
              industryModules = techModules;
            } else if (industry === 'finance') {
              const { financeModules } = await import('../data/financeModules');
              industryModules = financeModules;
            } else if (industry === 'logistics') {
              const { logisticsModules } = await import('../data/logisticsModules');
              industryModules = logisticsModules;
            } else if (industry === 'customer-service') {
              const { customerServiceModules } = await import('../data/customerServiceModules');
              industryModules = customerServiceModules;
            } else if (industry === 'architecture') {
              const { architectureModules } = await import('../data/architectureModules');
              industryModules = architectureModules;
            } else if (industry === 'healthcare') {
              const { healthcareModules } = await import('../data/healthcareModules');
              industryModules = healthcareModules;
            }
            if (industryModules) {
              set((s) => ({
                allModules: { ...s.allModules, [industry]: industryModules! },
              }));
            }
          } catch (e) {
            console.error('Error loading modules for industry:', industry, e);
          }
        }
        
        // Set current industry and active modules
        set({ currentIndustry: industry, modules: industryModules || [] });
      },
      
      setProgress: (progress) => set({ progress }),
      
      updateOnboarding: (data) => 
        set((state) => ({
          onboardingData: { ...state.onboardingData, ...data }
        })),
      
      completeOnboarding: async () => {
        const { onboardingData, firebaseUser, setCurrentIndustry } = get();
        
        // Lazy-load only the initial industry
        const initialIndustry = onboardingData.industry || 'tech';
        await setCurrentIndustry(initialIndustry);
        
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
        
        // Track onboarding completion
        analytics.completeOnboarding({
          level: onboardingData.level,
          industry: onboardingData.industry,
          goal: onboardingData.goal,
        });
        
        // Save to Firestore if authenticated
        if (firebaseUser) {
          try {
            const { saveUserProgress } = await import('../services/firestore');
            await saveUserProgress(firebaseUser.uid, progress);
            
            // Also save user profile data (industry, level, goal) to Firestore
            const { updateDoc, doc, serverTimestamp } = await import('firebase/firestore');
            const { db } = await import('../config/firebase');
            await updateDoc(doc(db, 'users', firebaseUser.uid), {
              industry: onboardingData.industry || 'tech',
              level: onboardingData.level || 'intermediate',
              goal: onboardingData.goal || '',
              targetDate: onboardingData.targetDate || null,
              updatedAt: serverTimestamp(),
            });
            
            console.log('✅ Onboarding complete - progress and profile saved to Firestore');
          } catch (error) {
            console.error('❌ Failed to save progress to Firestore:', error);
            // Don't throw - user can still continue, progress will sync later
          }
        } else {
          console.warn('⚠️ No firebaseUser - progress not saved to Firestore');
        }
      },
      
      completeLesson: async (lessonId) => {
        const { progress, firebaseUser, allModules, currentIndustry } = get();
        if (!progress) return;
        
        // Validate that the lesson exists and is in an accessible module
        const modules = currentIndustry ? (allModules[currentIndustry] || []) : [];
        const lesson = modules.flatMap(m => m.lessons).find(l => l.id === lessonId);
        const module = modules.find(m => m.lessons.some(l => l.id === lessonId));
        
        if (!lesson || !module) {
          console.warn(`Cannot complete lesson ${lessonId}: lesson or module not found`);
          return;
        }
        
        // Check if module is unlocked (first module is always unlocked, or previous module must be fully completed)
        const moduleIndex = modules.findIndex(m => m.id === module.id);
        const isModuleUnlocked = moduleIndex === 0 || (() => {
          const prevModule = modules[moduleIndex - 1];
          if (!prevModule) return true;
          const prevCompleted = prevModule.lessons.filter(l => 
            progress.completedLessons.includes(l.id)
          ).length;
          return prevCompleted === prevModule.lessons.length;
        })();
        
        if (!isModuleUnlocked) {
          console.warn(`Cannot complete lesson ${lessonId}: module is not unlocked yet`);
          return;
        }
        
        if (!progress.completedLessons.includes(lessonId)) {
          const updatedProgress = {
            ...progress,
            completedLessons: [...progress.completedLessons, lessonId],
            weeklyProgressCount: progress.weeklyProgressCount + 1,
            lastActiveDate: new Date().toISOString(),
          };
          
          // Check if all lessons in the module are now completed
          const completedLessonsInModule = module.lessons.filter(l =>
            updatedProgress.completedLessons.includes(l.id)
          ).length;
          const allLessonsCompleted = completedLessonsInModule === module.lessons.length;
          
          // Auto-complete the module if all lessons are done
          if (allLessonsCompleted && !progress.completedModules.includes(module.id)) {
            updatedProgress.completedModules = [...updatedProgress.completedModules, module.id];
            
            // Track module completion
            analytics.moduleComplete(module.id, currentIndustry || 'unknown');
          }
          
          // Check for new achievements
          const newAchievements = checkNewAchievements(updatedProgress);
          
          // Track achievement unlocks
          newAchievements.forEach(achievement => {
            analytics.achievementUnlocked(achievement.id, achievement.title);
          });
          
          // Track lesson completion
          analytics.lessonComplete(lessonId, module.id, currentIndustry || 'unknown', lesson.duration);
          
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
        const { firebaseUser, allModules } = get();
        if (!firebaseUser) return;
        
        try {
          const progress = await getUserProgress(firebaseUser.uid);
          if (progress) {
            // User has progress = onboarding is complete
            // Set both progress AND isOnboarding together to avoid race conditions
            set({ progress, isOnboarding: false });
            console.log('✅ Loaded progress from Firestore - onboarding complete');
            // Only backfill if modules are loaded
            if (Object.keys(allModules).length > 0) {
              // Backfill completed modules based on completed lessons
              const updatedCompletedModules = [...progress.completedModules];
              
              // Check all industries for modules that should be marked as completed
              Object.entries(allModules).forEach(([industry, modules]) => {
                modules.forEach((module) => {
                  // Skip if already marked as completed
                  if (updatedCompletedModules.includes(module.id)) return;
                  
                  // Check if all lessons in this module are completed
                  const completedLessonsCount = module.lessons.filter(lesson =>
                    progress.completedLessons.includes(lesson.id)
                  ).length;
                  
                  // If all lessons are completed, mark module as completed
                  if (completedLessonsCount === module.lessons.length && module.lessons.length > 0) {
                    updatedCompletedModules.push(module.id);
                  }
                });
              });
              
              // Update progress if we found any modules to backfill
              if (updatedCompletedModules.length > progress.completedModules.length) {
                const updatedProgress = {
                  ...progress,
                  completedModules: updatedCompletedModules,
                };
                set({ progress: updatedProgress });
                
                // Sync back to Firestore
                await saveUserProgress(firebaseUser.uid, updatedProgress);
                return;
              }
            }
            
            // If no backfill needed or modules not loaded, progress and isOnboarding already set above
          } else {
            // No progress found - user needs onboarding
            console.log('⚠️ No progress found in Firestore - user needs onboarding');
            set({ isOnboarding: true });
          }
        } catch (error) {
          console.error('Error loading from Firestore:', error);
          // On error, assume onboarding not complete to be safe
          set({ isOnboarding: true });
        }
      },
      
      clearNewAchievements: () => set({ newAchievements: [] }),
      
      toggleQuickMode: () => set((state) => ({ quickMode: !state.quickMode })),
      
      backfillCompletedModules: async () => {
        const { progress, firebaseUser, allModules } = get();
        if (!progress || Object.keys(allModules).length === 0) return;
        
        // Backfill completed modules based on completed lessons
        const updatedCompletedModules = [...progress.completedModules];
        
        // Check all industries for modules that should be marked as completed
        Object.entries(allModules).forEach(([industry, modules]) => {
          modules.forEach((module) => {
            // Skip if already marked as completed
            if (updatedCompletedModules.includes(module.id)) return;
            
            // Check if all lessons in this module are completed
            const completedLessonsCount = module.lessons.filter(lesson =>
              progress.completedLessons.includes(lesson.id)
            ).length;
            
            // If all lessons are completed, mark module as completed
            if (completedLessonsCount === module.lessons.length && module.lessons.length > 0) {
              updatedCompletedModules.push(module.id);
            }
          });
        });
        
        // Update progress if we found any modules to backfill
        if (updatedCompletedModules.length > progress.completedModules.length) {
          const updatedProgress = {
            ...progress,
            completedModules: updatedCompletedModules,
          };
          set({ progress: updatedProgress });
          
          // Sync back to Firestore if authenticated
          if (firebaseUser) {
            try {
              await saveUserProgress(firebaseUser.uid, updatedProgress);
            } catch (error) {
              console.error('Error saving backfilled progress:', error);
            }
          }
        }
      },
      
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

