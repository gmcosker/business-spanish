import type { VercelRequest, VercelResponse } from '@vercel/node';

// Lazy require to avoid bundling when not used in client
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tier = 'professional', email, priceId } = req.body || {};

    // Prefer explicit priceId from client when provided (e.g., yearly),
    // otherwise map by tier to default monthly price in config.
    const resolvedPriceId = priceId || process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY;

    if (!resolvedPriceId) {
      return res.status(400).json({ error: 'Missing priceId configuration' });
    }

    // Get origin from headers or use environment variable
    const origin = req.headers.origin || 
                   req.headers.referer?.split('/').slice(0, 3).join('/') ||
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
                   'http://localhost:4200';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [
        { price: resolvedPriceId, quantity: 1 },
      ],
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      allow_promotion_codes: true,
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}


