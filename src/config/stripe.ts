import { loadStripe, Stripe } from '@stripe/stripe-js';

// TODO: Replace with your actual Stripe publishable key
export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// Subscription tiers configuration
export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Access to 1 industry path',
      'Limited lessons',
      'Basic vocabulary review',
      'No conversation practice',
      'No advanced analytics'
    ],
    limits: {
      industries: 1,
      lessonsPerMonth: 5,
      conversationPractice: false,
      advancedAnalytics: false
    }
  },
  professional: {
    name: 'Professional',
    price: 29,
    stripePriceId: 'price_...', // TODO: Get from Stripe Dashboard
    interval: 'month',
    features: [
      'Access to ALL industry paths',
      'Unlimited lessons',
      'Unlimited vocabulary review',
      'AI conversation practice',
      'Advanced analytics & progress tracking',
      'Priority support',
      'Export progress & certificates'
    ],
    limits: {
      industries: Infinity,
      lessonsPerMonth: Infinity,
      conversationPractice: true,
      advancedAnalytics: true
    }
  },
  team: {
    name: 'Team',
    price: 99,
    stripePriceId: 'price_...', // TODO: Get from Stripe Dashboard
    interval: 'month',
    features: [
      'Everything in Professional',
      'Team dashboard & collaboration',
      'Custom learning paths',
      'Admin controls',
      'Usage analytics',
      'Dedicated support'
    ],
    limits: {
      industries: Infinity,
      lessonsPerMonth: Infinity,
      conversationPractice: true,
      advancedAnalytics: true,
      teamMembers: 10
    }
  }
} as const;

export type SubscriptionTier = keyof typeof PRICING_PLANS;
