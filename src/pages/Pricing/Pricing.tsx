import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, Users, Zap } from 'lucide-react';
import { PRICING_PLANS } from '../../config/stripe';
import { subscribeToPlan } from '../../services/stripe';
import { useStore } from '../../store/useStore';
import { analytics } from '../../services/analytics';
import { usePageSEO } from '../../hooks/usePageSEO';

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useStore();
  const [loading, setLoading] = useState<string | null>(null);

  // Track pricing page view
  useEffect(() => {
    analytics.viewPricing();
  }, []);

  usePageSEO({
    title: 'Avance Pricing | Choose Your Business Spanish Plan',
    description:
      'Find the right Avance plan to master business Spanish. Compare free and professional tiers with AI conversation practice, industry modules, and analytics.',
    canonicalPath: '/pricing',
  });

  const handleSubscribe = async (planKey: 'professional' | 'team') => {
    setLoading(planKey);
    
    const plan = PRICING_PLANS[planKey];
    
    // Track checkout initiation
    analytics.beginCheckout(planKey, plan.price);
    
    try {
      // Subscribe to plan via Stripe Checkout
      await subscribeToPlan(planKey, user?.email);
      // User will be redirected to Stripe checkout
    } catch (error: any) {
      console.error('Error:', error);
      alert(`⚠️ Please set up a backend API endpoint:\n\nPOST /api/create-checkout-session\n\nError: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Start learning Spanish for your business today
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 relative">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {PRICING_PLANS.free.name}
              </h3>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {PRICING_PLANS.free.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:border-gray-400 transition-colors"
            >
              Continue with Free
            </button>
          </div>

          {/* Professional Plan */}
          <div className="bg-white rounded-2xl border-2 border-primary-500 p-8 relative transform scale-105 shadow-xl">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                MOST POPULAR
              </span>
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {PRICING_PLANS.professional.name}
              </h3>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">
                  ${PRICING_PLANS.professional.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {PRICING_PLANS.professional.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('professional')}
              disabled={loading === 'professional'}
              className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading === 'professional' ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>

          {/* Team Plan */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 relative">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {PRICING_PLANS.team.name}
              </h3>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">
                  ${PRICING_PLANS.team.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {PRICING_PLANS.team.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-sky-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('team')}
              disabled={loading === 'team'}
              className="w-full px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50"
            >
              {loading === 'team' ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            All plans include a 7-day money-back guarantee
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <span>✓ Cancel anytime</span>
            <span>✓ Secure payments</span>
            <span>✓ 24/7 support</span>
          </div>
        </div>
      </div>
    </div>
  );
}





