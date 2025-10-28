import type { VocabularyItem } from '../types';

/**
 * Determine if a word is an English loanword (not valuable for learning)
 */
const ENGLISH_LOANWORDS = [
  'startup', 'ceo', 'cto', 'coo', 'cfo', 'pr', 'hr', 'vc', 'ipo',
  'mrr', 'cac', 'ltv', 'roi', 'kpi', 'saas', 'paas', 'iaas',
  'api', 'sdk', 'mvp', 'ui', 'ux', 'qa', 'devops', 'ci/cd',
  'agile', 'scrum', 'kanban', 'retro', 'standup', 'sprint',
  'backend', 'frontend', 'fullstack', 'deployment', 'pull request',
  'query', 'database', 'software', 'hardware', 'bug', 'feature',
  'wireframe', 'mockup', 'prototype', 'roadmap', 'backlog',
  'performance', 'issue', 'testing', 'refactoring'
];

function isEnglishLoanword(term: string): boolean {
  const normalized = term.toLowerCase().replace(/\s+/g, '-');
  return ENGLISH_LOANWORDS.includes(normalized);
}

/**
 * Calculate which vocabulary items need review today
 * Prioritizes Spanish-specific vocabulary over English loanwords
 */
export function getWordsToReview(vocabulary: VocabularyItem[], prioritizeSpanishFirst = true): VocabularyItem[] {
  const today = new Date().toISOString();
  
  const dueWords = vocabulary.filter(item => {
    const nextReviewDate = new Date(item.nextReview);
    return nextReviewDate <= new Date(today);
  });

  if (!prioritizeSpanishFirst) {
    return dueWords;
  }

  // Separate Spanish-specific words from English loanwords
  const spanishWords = dueWords.filter(item => !isEnglishLoanword(item.term));
  const englishLoanwords = dueWords.filter(item => isEnglishLoanword(item.term));

  // Return Spanish words first, then English loanwords at the end
  return [...spanishWords, ...englishLoanwords];
}

/**
 * Update vocabulary item after successful review (user got it right)
 */
export function updateItemAfterSuccess(item: VocabularyItem): VocabularyItem {
  let newInterval = item.interval;
  let newEaseFactor = item.easeFactor;
  
  // Increase repetitions
  const newRepetitions = item.repetitions + 1;
  
  // Adjust ease factor and interval based on performance
  if (item.repetitions === 0) {
    // First review: 1 day
    newInterval = 1;
  } else if (item.repetitions === 1) {
    // Second review: 3 days
    newInterval = 3;
  } else if (item.repetitions === 2) {
    // Third review: 7 days
    newInterval = 7;
  } else if (item.repetitions === 3) {
    // Fourth review: 14 days
    newInterval = 14;
  } else if (item.repetitions === 4) {
    // Fifth review: 30 days
    newInterval = 30;
  } else {
    // After that, exponential growth (current interval * ease factor)
    newInterval = Math.floor(item.interval * item.easeFactor);
    // Cap at 90 days
    newInterval = Math.min(newInterval, 90);
  }
  
  // Slightly increase ease factor for successful recall
  // This makes future intervals slightly longer
  newEaseFactor = Math.min(item.easeFactor + 0.05, 3.0);
  
  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
  
  return {
    ...item,
    nextReview: nextReviewDate.toISOString(),
    interval: newInterval,
    easeFactor: newEaseFactor,
    repetitions: newRepetitions,
  };
}

/**
 * Update vocabulary item after failed review (user got it wrong)
 */
export function updateItemAfterFailure(item: VocabularyItem): VocabularyItem {
  // Reset to shorter intervals
  let newInterval = 1;
  let newEaseFactor = item.easeFactor;
  
  // Slightly decrease ease factor
  newEaseFactor = Math.max(item.easeFactor - 0.15, 1.3);
  
  // Reset repetitions to 0 to start the cycle over
  const newRepetitions = 0;
  
  // Next review in 1 day
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
  
  return {
    ...item,
    nextReview: nextReviewDate.toISOString(),
    interval: newInterval,
    easeFactor: newEaseFactor,
    repetitions: newRepetitions,
  };
}

/**
 * Get the priority level for a vocabulary item
 */
export function getReviewPriority(item: VocabularyItem): 'high' | 'medium' | 'low' {
  const daysPastDue = Math.floor(
    (new Date().getTime() - new Date(item.nextReview).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysPastDue > 7) return 'high';
  if (daysPastDue > 3) return 'medium';
  return 'low';
}

/**
 * Get the number of days until next review (or negative if overdue)
 */
export function getDaysUntilReview(item: VocabularyItem): number {
  const today = new Date();
  const reviewDate = new Date(item.nextReview);
  const diffTime = reviewDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

