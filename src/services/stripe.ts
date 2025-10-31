import { getStripe } from '../config/stripe';
import type { SubscriptionTier } from '../types';

/**
 * Create a Stripe checkout session for subscription
 * Note: This requires a backend API endpoint to create the checkout session
 * TODO: Create a backend API at /api/create-checkout-session
 */
export async function createCheckoutSession(tier: SubscriptionTier, email?: string): Promise<{ error?: Error; sessionId?: string; url?: string }> {
  try {
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
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error('Failed to create checkout session');
    }

    const { sessionId, url } = await response.json();
    
    return { sessionId, url };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return { error: new Error(error.message || 'Failed to create checkout session') };
  }
}

/**
 * Redirect to Stripe Checkout
 * Uses session URL directly instead of deprecated redirectToCheckout method
 */
export async function redirectToCheckout(sessionId: string, checkoutUrl?: string): Promise<void> {
  try {
    // If URL provided, use it directly (from createCheckoutSession response)
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      return;
    }

    // Fallback: construct Stripe Checkout URL manually
    // Format: https://checkout.stripe.com/c/pay/{sessionId}
    window.location.href = `https://checkout.stripe.com/c/pay/${sessionId}`;
  } catch (error: any) {
    console.error('Error redirecting to checkout:', error);
    // Final fallback
    window.location.href = `https://checkout.stripe.com/c/pay/${sessionId}`;
  }
}

/**
 * Subscribe to a plan
 */
export async function subscribeToPlan(tier: SubscriptionTier, email?: string): Promise<void> {
  try {
    // Create checkout session
    const { sessionId, url, error } = await createCheckoutSession(tier, email);
    
    if (error || !sessionId) {
      throw error || new Error('Failed to get session ID');
    }

    // Redirect to checkout using the URL from the session
    await redirectToCheckout(sessionId, url);
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

