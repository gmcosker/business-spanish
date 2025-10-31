import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionId = req.query.sessionId as string;

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId parameter' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY environment variable');
      return res.status(500).json({ error: 'Stripe secret key not configured' });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'subscription'],
    });

    // Verify the session is paid
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ 
        error: 'Payment not completed',
        payment_status: session.payment_status 
      });
    }

    // Get the subscription details if available
    let subscription = null;
    let priceId = null;
    let tier: 'professional' | 'team' = 'professional';

    if (session.subscription) {
      const sub = typeof session.subscription === 'string' 
        ? await stripe.subscriptions.retrieve(session.subscription)
        : session.subscription;
      
      if (sub.items.data.length > 0) {
        priceId = sub.items.data[0].price.id;
        subscription = {
          id: sub.id,
          status: sub.status,
          current_period_end: sub.current_period_end,
          cancel_at_period_end: sub.cancel_at_period_end,
        };
      }
    } else if (session.line_items && 'data' in session.line_items && session.line_items.data.length > 0) {
      priceId = session.line_items.data[0].price?.id;
    }

    // Determine tier based on price ID
    // Professional monthly: price_1SO29JRw1nAB2RQriiyEWOKB
    // Professional yearly: price_1SO2BuRw1nAB2RQroyWgMeNr
    // TODO: Add team plan price IDs when available
    if (priceId) {
      // For now, if it's not a known professional price, default to professional
      // You can expand this logic when you add team plans
      tier = 'professional';
    }

    return res.status(200).json({
      verified: true,
      tier,
      priceId,
      subscription,
      customerId: session.customer,
      customerEmail: session.customer_email,
      payment_status: session.payment_status,
    });
  } catch (err: any) {
    console.error('Session verification error:', err);
    
    // Handle Stripe-specific errors
    if (err.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: 'Invalid session ID',
        message: err.message 
      });
    }

    return res.status(500).json({ 
      error: err.message || 'Internal Server Error' 
    });
  }
}

