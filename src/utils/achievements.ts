import type { Achievement, UserProgress } from '../types';

export const ACHIEVEMENT_DEFINITIONS = {
  FIRST_LESSON: {
    id: 'first-lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    category: 'milestone' as const,
  },
  FIVE_LESSONS: {
    id: 'five-lessons',
    title: 'Getting Started',
    description: 'Complete 5 lessons',
    icon: '📚',
    category: 'milestone' as const,
  },
  FIRST_MODULE: {
    id: 'first-module',
    title: 'Module Master',
    description: 'Complete your first module',
    icon: '🏆',
    category: 'milestone' as const,
  },
  STREAK_3: {
    id: 'streak-3',
    title: '3-Day Streak',
    description: 'Study for 3 days in a row',
    icon: '🔥',
    category: 'streak' as const,
  },
  STREAK_7: {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    category: 'streak' as const,
  },
  STREAK_30: {
    id: 'streak-30',
    title: 'Month Champion',
    description: 'Maintain a 30-day streak',
    icon: '👑',
    category: 'streak' as const,
  },
  VOCAB_25: {
    id: 'vocab-25',
    title: 'Word Collector',
    description: 'Master 25 vocabulary words',
    icon: '📖',
    category: 'mastery' as const,
  },
  VOCAB_100: {
    id: 'vocab-100',
    title: 'Vocabulary Expert',
    description: 'Master 100 vocabulary words',
    icon: '🎓',
    category: 'mastery' as const,
  },
  VOCAB_500: {
    id: 'vocab-500',
    title: 'Polyglot',
    description: 'Master 500 vocabulary words',
    icon: '🌟',
    category: 'mastery' as const,
  },
  PERFECT_WEEK: {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Meet your weekly goal',
    icon: '✨',
    category: 'milestone' as const,
  },
  EARLY_BIRD: {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Study before 9 AM',
    icon: '🌅',
    category: 'milestone' as const,
  },
  NIGHT_OWL: {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Study after 10 PM',
    icon: '🦉',
    category: 'milestone' as const,
  },
};

export function checkNewAchievements(progress: UserProgress): Achievement[] {
  const newAchievements: Achievement[] = [];
  const existingIds = new Set(progress.achievements.map(a => a.id));

  // Check lesson milestones
  if (progress.completedLessons.length >= 1 && !existingIds.has('first-lesson')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.FIRST_LESSON,
      unlockedAt: new Date().toISOString(),
    });
  }

  if (progress.completedLessons.length >= 5 && !existingIds.has('five-lessons')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.FIVE_LESSONS,
      unlockedAt: new Date().toISOString(),
    });
  }

  // Check module completion
  if (progress.completedModules.length >= 1 && !existingIds.has('first-module')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.FIRST_MODULE,
      unlockedAt: new Date().toISOString(),
    });
  }

  // Check streaks
  if (progress.streakDays >= 3 && !existingIds.has('streak-3')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.STREAK_3,
      unlockedAt: new Date().toISOString(),
    });
  }

  if (progress.streakDays >= 7 && !existingIds.has('streak-7')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.STREAK_7,
      unlockedAt: new Date().toISOString(),
    });
  }

  if (progress.streakDays >= 30 && !existingIds.has('streak-30')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.STREAK_30,
      unlockedAt: new Date().toISOString(),
    });
  }

  // Check vocabulary mastery
  if (progress.vocabularyMastered >= 25 && !existingIds.has('vocab-25')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.VOCAB_25,
      unlockedAt: new Date().toISOString(),
    });
  }

  if (progress.vocabularyMastered >= 100 && !existingIds.has('vocab-100')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.VOCAB_100,
      unlockedAt: new Date().toISOString(),
    });
  }

  if (progress.vocabularyMastered >= 500 && !existingIds.has('vocab-500')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.VOCAB_500,
      unlockedAt: new Date().toISOString(),
    });
  }

  // Check weekly goal
  if (progress.weeklyProgress >= progress.weeklyGoal && !existingIds.has('perfect-week')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.PERFECT_WEEK,
      unlockedAt: new Date().toISOString(),
    });
  }

  return newAchievements;
}

export function getAllAchievements(): typeof ACHIEVEMENT_DEFINITIONS {
  return ACHIEVEMENT_DEFINITIONS;
}





