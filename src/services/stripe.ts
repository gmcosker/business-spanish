import { getStripe } from '../config/stripe';
import type { SubscriptionTier } from '../types';

/**
 * Create a Stripe checkout session for subscription
 * Note: This requires a backend API endpoint to create the checkout session
 * TODO: Create a backend API at /api/create-checkout-session
 */
export async function createCheckoutSession(tier: SubscriptionTier, email?: string): Promise<{ error?: Error; sessionId?: string }> {
  try {
    // For development, we'll use a mock implementation
    // In production, this should call your backend API
    console.warn('⚠️ Stripe checkout requires a backend API. Implement /api/create-checkout-session');
    
    // TODO: Replace with actual API call
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tier,
        email,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    
    return { sessionId };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return { error: new Error(error.message || 'Failed to create checkout session') };
  }
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(sessionId: string): Promise<void> {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error('Error redirecting to checkout:', error);
    throw new Error(error.message || 'Failed to redirect to checkout');
  }
}

/**
 * Subscribe to a plan
 */
export async function subscribeToPlan(tier: SubscriptionTier, email?: string): Promise<void> {
  try {
    // Create checkout session
    const { sessionId, error } = await createCheckoutSession(tier, email);
    
    if (error || !sessionId) {
      throw error || new Error('Failed to get session ID');
    }

    // Redirect to checkout
    await redirectToCheckout(sessionId);
  } catch (error: any) {
    console.error('Error subscribing to plan:', error);
    throw new Error(error.message || 'Failed to subscribe');
  }
}

/**
 * Handle successful payment (called from return URL)
 */
export async function handlePaymentSuccess(sessionId: string): Promise<SubscriptionTier | null> {
  try {
    // TODO: Verify session with backend API
    // This should check the session status and update user's subscription tier
    
    const response = await fetch(`/api/verify-session?sessionId=${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to verify session');
    }

    const { tier } = await response.json();
    
    return tier;
  } catch (error: any) {
    console.error('Error handling payment success:', error);
    return null;
  }
}

