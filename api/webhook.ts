import type { VercelRequest, VercelResponse } from '@vercel/node';
const Stripe = require('stripe');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
  });

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!sig || !webhookSecret) {
      // If no signature configured, try parsing without verification for local testing
      event = req.body;
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // TODO: mark user as subscribed in Firestore based on session.customer_email
        console.log('Checkout session completed:', event.data.object?.id);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.created':
      case 'customer.subscription.deleted':
        console.log('Subscription event:', event.type);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return res.status(200).json({ received: true });
  } catch (e: any) {
    console.error('Webhook handler error:', e);
    return res.status(500).send('Webhook handler failed');
  }
}

export const config = {
  api: {
    bodyParser: false, // Stripe requires the raw body for signature verification
  },
};


