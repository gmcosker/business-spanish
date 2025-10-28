import type { SubscriptionTier } from '../types';
import { PRICING_PLANS } from '../config/stripe';

/**
 * Check if user has access to a feature based on their subscription tier
 */
export function hasFeatureAccess(tier: SubscriptionTier | undefined, feature: string): boolean {
  const userTier = tier || 'free';
  const plan = PRICING_PLANS[userTier];
  
  switch (feature) {
    case 'multipleIndustries':
      return plan.limits.industries > 1;
    case 'conversationPractice':
      return plan.limits.conversationPractice;
    case 'advancedAnalytics':
      return plan.limits.advancedAnalytics;
    case 'unlimitedLessons':
      return plan.limits.lessonsPerMonth === Infinity;
    default:
      return false;
  }
}

/**
 * Check if user can access an industry
 */
export function canAccessIndustry(
  tier: SubscriptionTier | undefined,
  currentIndustries: number
): boolean {
  const userTier = tier || 'free';
  const plan = PRICING_PLANS[userTier];
  
  if (plan.limits.industries === Infinity) {
    return true;
  }
  
  return currentIndustries < plan.limits.industries;
}

/**
 * Check if user can complete more lessons this month
 */
export function canCompleteLesson(
  tier: SubscriptionTier | undefined,
  lessonsCompletedThisMonth: number
): boolean {
  const userTier = tier || 'free';
  const plan = PRICING_PLANS[userTier];
  
  if (plan.limits.lessonsPerMonth === Infinity) {
    return true;
  }
  
  return lessonsCompletedThisMonth < plan.limits.lessonsPerMonth;
}

/**
 * Get upgrade URL based on feature needed
 */
export function getUpgradeUrl(feature: string): string {
  return '/pricing';
}

/**
 * Get feature limit message
 */
export function getFeatureLimitMessage(feature: string): string {
  const messages: Record<string, string> = {
    multipleIndustries: 'Upgrade to access multiple industry paths',
    conversationPractice: 'Upgrade to unlock AI conversation practice',
    advancedAnalytics: 'Upgrade to access advanced analytics',
    unlimitedLessons: 'Monthly lesson limit reached. Upgrade for unlimited lessons',
  };
  
  return messages[feature] || 'Upgrade required';
}

