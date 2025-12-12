import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Module, UserProgress, OnboardingData, VocabularyItem, Achievement, UserPreferences, DailyActivity, StudyGroup, GroupMember, GroupStats, GroupActivity, Industry, GroupConversationSession, DialogueMessage } from '../types';
import { checkNewAchievements } from '../utils/achievements';
import { saveUserProgress, getUserProgress, trackDailyActivity as saveDailyActivityToFirestore } from '../services/firestore';
import { analytics } from '../services/analytics';
import * as studyGroupsService from '../services/studyGroups';
import * as groupConversationsService from '../services/groupConversations';

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
  
  // Study Groups
  studyGroups: StudyGroup[];
  currentGroup: StudyGroup | null;
  groupMembers: GroupMember[];
  groupActivities: GroupActivity[];
  groupStats: GroupStats | null;
  
  // Group Conversations
  groupConversationSessions: GroupConversationSession[];
  currentConversationSession: GroupConversationSession | null;
  conversationMessages: DialogueMessage[];
  
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
  
  // Study Groups Actions
  loadUserStudyGroups: () => Promise<void>;
  joinIndustryGroup: (industry: Industry) => Promise<void>;
  leaveStudyGroup: (groupId: string) => Promise<void>;
  loadGroupDetails: (groupId: string) => Promise<void>;
  loadGroupActivities: (groupId: string) => Promise<void>;
  createGroupActivity: (groupId: string, type: GroupActivity['type'], content: string, metadata?: any) => Promise<void>;
  
  // Group Conversations Actions
  loadGroupConversationSessions: (groupId: string) => Promise<void>;
  createConversationSession: (groupId: string, scenarioId: string, type: 'role-play' | 'group-conversation', scheduledStartTime?: string) => Promise<void>;
  joinConversationSession: (sessionId: string) => Promise<void>;
  sendConversationMessage: (sessionId: string, nodeId: string, text: string) => Promise<void>;
  subscribeToConversation: (sessionId: string) => () => void;
  setParticipantReady: (sessionId: string, isReady: boolean) => Promise<void>;
  startConversationSession: (sessionId: string) => Promise<void>;
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
      
      // Study Groups
      studyGroups: [],
      currentGroup: null,
      groupMembers: [],
      groupActivities: [],
      groupStats: null,
      
      // Group Conversations
      groupConversationSessions: [],
      currentConversationSession: null,
      conversationMessages: [],

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
            
            // Auto-join industry study group
            if (onboardingData.industry) {
              try {
                const { joinIndustryGroup } = get();
                await joinIndustryGroup(onboardingData.industry);
              } catch (error) {
                console.error('Failed to join study group:', error);
                // Don't block onboarding if this fails
              }
            }
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
          for (const achievement of newAchievements) {
            analytics.achievementUnlocked(achievement.id, achievement.title);
            
            // Create group activity for achievement
            const { user, studyGroups } = get();
            if (user && studyGroups.length > 0) {
              for (const group of studyGroups) {
                try {
                  await get().createGroupActivity(
                    group.id,
                    'achievement_earned',
                    `${user.name} earned the ${achievement.title} badge`,
                    { achievementId: achievement.id }
                  );
                } catch (error) {
                  console.error('Error creating achievement group activity:', error);
                }
              }
            }
          }
          
          // Track lesson completion
          analytics.lessonComplete(lessonId, module.id, currentIndustry || 'unknown', lesson.duration);
          
          set({
            progress: {
              ...updatedProgress,
              achievements: [...updatedProgress.achievements, ...newAchievements],
            },
            newAchievements,
          });
          
          // Create group activity if user is in groups
          const { user, studyGroups } = get();
          if (user && studyGroups.length > 0) {
            for (const group of studyGroups) {
              try {
                await get().createGroupActivity(
                  group.id,
                  'lesson_completed',
                  `${user.name} completed '${lesson.title}'`,
                  { lessonId }
                );
              } catch (error) {
                console.error('Error creating group activity:', error);
              }
            }
          }

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
      
      // Study Groups Actions
      loadUserStudyGroups: async () => {
        const { firebaseUser } = get();
        if (!firebaseUser) return;
        
        try {
          const groups = await studyGroupsService.getUserStudyGroups(firebaseUser.uid);
          set({ studyGroups: groups });
        } catch (error) {
          console.error('Error loading user study groups:', error);
        }
      },
      
      joinIndustryGroup: async (industry: Industry) => {
        const { firebaseUser, user } = get();
        if (!firebaseUser || !user) return;
        
        try {
          const group = await studyGroupsService.getOrCreateIndustryGroup(industry, firebaseUser.uid);
          await studyGroupsService.joinStudyGroup(
            group.id,
            firebaseUser.uid,
            user.name,
            user.email,
            user.avatar
          );
          
          // Reload user's groups
          await get().loadUserStudyGroups();
        } catch (error) {
          console.error('Error joining industry group:', error);
          throw error;
        }
      },
      
      leaveStudyGroup: async (groupId: string) => {
        const { firebaseUser } = get();
        if (!firebaseUser) return;
        
        try {
          await studyGroupsService.leaveStudyGroup(groupId, firebaseUser.uid);
          
          // Remove from local state
          set((state) => ({
            studyGroups: state.studyGroups.filter(g => g.id !== groupId),
            currentGroup: state.currentGroup?.id === groupId ? null : state.currentGroup,
          }));
        } catch (error) {
          console.error('Error leaving study group:', error);
          throw error;
        }
      },
      
      loadGroupDetails: async (groupId: string) => {
        try {
          const [group, members, stats] = await Promise.all([
            studyGroupsService.getStudyGroup(groupId),
            studyGroupsService.getGroupMembers(groupId),
            studyGroupsService.getGroupStats(groupId),
          ]);
          
          if (group) {
            set({
              currentGroup: group,
              groupMembers: members,
              groupStats: stats,
            });
          }
        } catch (error) {
          console.error('Error loading group details:', error);
        }
      },
      
      loadGroupActivities: async (groupId: string) => {
        try {
          const activities = await studyGroupsService.getGroupActivities(groupId, 20);
          set({ groupActivities: activities });
        } catch (error) {
          console.error('Error loading group activities:', error);
        }
      },
      
      createGroupActivity: async (
        groupId: string,
        type: GroupActivity['type'],
        content: string,
        metadata?: any
      ) => {
        const { firebaseUser, user } = get();
        if (!firebaseUser || !user) return;
        
        try {
          await studyGroupsService.createGroupActivity(
            groupId,
            firebaseUser.uid,
            user.name,
            user.avatar,
            type,
            content,
            metadata
          );
          
          // Reload activities
          await get().loadGroupActivities(groupId);
        } catch (error) {
          console.error('Error creating group activity:', error);
        }
      },
      
      // Group Conversations Actions
      loadGroupConversationSessions: async (groupId: string) => {
        try {
          const sessions = await groupConversationsService.getGroupConversationSessions(groupId);
          set({ groupConversationSessions: sessions });
        } catch (error) {
          console.error('Error loading conversation sessions:', error);
        }
      },
      
      createConversationSession: async (
        groupId: string,
        scenarioId: string,
        type: 'role-play' | 'group-conversation',
        scheduledStartTime?: string
      ) => {
        const { firebaseUser, user } = get();
        if (!firebaseUser || !user) return;
        
        try {
          const session = await groupConversationsService.createGroupConversationSession(
            groupId,
            scenarioId,
            type,
            firebaseUser.uid,
            user.name,
            scheduledStartTime
          );
          
          // Reload sessions
          await get().loadGroupConversationSessions(groupId);
        } catch (error) {
          console.error('Error creating conversation session:', error);
          throw error;
        }
      },
      
      joinConversationSession: async (sessionId: string) => {
        const { firebaseUser, user } = get();
        if (!firebaseUser || !user) return;
        
        try {
          await groupConversationsService.joinConversationSession(
            sessionId,
            firebaseUser.uid,
            user.name,
            user.avatar
          );
          
          // Reload sessions to update participant count
          const { currentGroup } = get();
          if (currentGroup) {
            await get().loadGroupConversationSessions(currentGroup.id);
          }
        } catch (error) {
          console.error('Error joining conversation session:', error);
          throw error;
        }
      },
      
      sendConversationMessage: async (sessionId: string, nodeId: string, text: string) => {
        const { firebaseUser, user } = get();
        if (!firebaseUser || !user) return;
        
        try {
          await groupConversationsService.sendConversationMessage(
            sessionId,
            firebaseUser.uid,
            user.name,
            user.avatar,
            nodeId,
            text
          );
        } catch (error) {
          console.error('Error sending message:', error);
          throw error;
        }
      },
      
      subscribeToConversation: (sessionId: string) => {
        // Subscribe to messages
        const unsubscribeMessages = groupConversationsService.subscribeToConversationMessages(
          sessionId,
          (messages) => {
            set({ conversationMessages: messages });
          }
        );
        
        // Subscribe to session updates
        const unsubscribeSession = groupConversationsService.subscribeToSession(
          sessionId,
          (session) => {
            set({ currentConversationSession: session });
          }
        );
        
        // Return cleanup function
        return () => {
          unsubscribeMessages();
          unsubscribeSession();
        };
      },
      
      setParticipantReady: async (sessionId: string, isReady: boolean) => {
        const { firebaseUser } = get();
        if (!firebaseUser) return;
        
        try {
          await groupConversationsService.setParticipantReady(sessionId, firebaseUser.uid, isReady);
        } catch (error) {
          console.error('Error setting participant ready:', error);
          throw error;
        }
      },
      
      startConversationSession: async (sessionId: string) => {
        try {
          await groupConversationsService.startConversationSession(sessionId);
        } catch (error) {
          console.error('Error starting conversation session:', error);
          throw error;
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
          studyGroups: [],
          currentGroup: null,
          groupMembers: [],
          groupActivities: [],
          groupStats: null,
        }),
    }),
    {
      name: 'business-spanish-storage',
    }
  )
);

