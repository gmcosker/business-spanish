/**
 * Google Analytics 4 Service
 * Tracks page views and custom events
 */

// GA4 Measurement ID from environment variable
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize GA4
export const initGA = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  // Load gtag script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });
};

// Track page view
export const trackPageView = (path: string, title?: string) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  });
};

// Track custom events
export const trackEvent = (
  eventName: string,
  eventParams?: {
    [key: string]: any;
  }
) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, eventParams);
};

// Specific event tracking functions
export const analytics = {
  // Authentication events
  login: (method: string = 'email') => {
    trackEvent('login', { method });
  },
  
  signup: (method: string = 'email') => {
    trackEvent('sign_up', { method });
  },

  logout: () => {
    trackEvent('logout');
  },

  // Onboarding events
  startOnboarding: () => {
    trackEvent('onboarding_start');
  },

  completeOnboarding: (data: {
    level?: string;
    industry?: string;
    goal?: string;
  }) => {
    trackEvent('onboarding_complete', {
      language_level: data.level,
      selected_industry: data.industry,
      has_goal: !!data.goal,
    });
  },

  startAssessment: () => {
    trackEvent('assessment_start');
  },

  completeAssessment: (data: {
    score?: number;
    recommendedIndustry?: string;
  }) => {
    trackEvent('assessment_complete', {
      score: data.score,
      recommended_industry: data.recommendedIndustry,
    });
  },

  // Learning events
  lessonStart: (lessonId: string, moduleId: string, industry: string) => {
    trackEvent('lesson_start', {
      lesson_id: lessonId,
      module_id: moduleId,
      industry,
    });
  },

  lessonComplete: (lessonId: string, moduleId: string, industry: string, duration?: number) => {
    trackEvent('lesson_complete', {
      lesson_id: lessonId,
      module_id: moduleId,
      industry,
      duration_seconds: duration,
    });
  },

  moduleComplete: (moduleId: string, industry: string) => {
    trackEvent('module_complete', {
      module_id: moduleId,
      industry,
    });
  },

  // Vocabulary events
  vocabularyReview: (count: number) => {
    trackEvent('vocabulary_review', {
      vocabulary_count: count,
    });
  },

  vocabularyMastered: (term: string) => {
    trackEvent('vocabulary_mastered', {
      vocabulary_term: term,
    });
  },

  // Conversation practice events
  conversationStart: (industry: string) => {
    trackEvent('conversation_start', {
      industry,
    });
  },

  conversationComplete: (industry: string, duration?: number) => {
    trackEvent('conversation_complete', {
      industry,
      duration_seconds: duration,
    });
  },

  // Achievement events
  achievementUnlocked: (achievementId: string, achievementTitle: string) => {
    trackEvent('achievement_unlocked', {
      achievement_id: achievementId,
      achievement_title: achievementTitle,
    });
  },

  // Industry switching
  industrySwitch: (fromIndustry: string, toIndustry: string) => {
    trackEvent('industry_switch', {
      from_industry: fromIndustry,
      to_industry: toIndustry,
    });
  },

  // Payment events
  viewPricing: () => {
    trackEvent('view_pricing');
  },

  beginCheckout: (tier: string, price: number) => {
    trackEvent('begin_checkout', {
      subscription_tier: tier,
      price,
      currency: 'USD',
    });
  },

  purchase: (tier: string, price: number, transactionId?: string) => {
    trackEvent('purchase', {
      subscription_tier: tier,
      value: price,
      currency: 'USD',
      transaction_id: transactionId,
    });
  },

  // Search events
  search: (query: string, resultCount?: number) => {
    trackEvent('search', {
      search_term: query,
      result_count: resultCount,
    });
  },

  // Navigation events
  navigation: (destination: string) => {
    trackEvent('navigation', {
      destination,
    });
  },
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

