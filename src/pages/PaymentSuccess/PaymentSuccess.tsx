import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { updateUserSubscription } from '../../services/auth';
import type { SubscriptionTier } from '../../types';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { firebaseUser, setUser, user } = useStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    async function handlePaymentSuccess() {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId || !firebaseUser) {
        setStatus('error');
        return;
      }

      try {
        // Verify the session with Stripe via backend
        const verifyResponse = await fetch(`/api/verify-session?sessionId=${sessionId}`);
        
        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to verify payment session');
        }

        const { tier, verified, payment_status } = await verifyResponse.json();

        if (!verified || payment_status !== 'paid') {
          throw new Error('Payment verification failed');
        }

        // Update subscription in Firestore with verified tier
        await updateUserSubscription(firebaseUser.uid, tier);

        // Update local user data
        if (user) {
          setUser({
            ...user,
            subscriptionTier: tier,
          });
        }

        setStatus('success');

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error: any) {
        console.error('Error handling payment success:', error);
        setStatus('error');
      }
    }

    handlePaymentSuccess();
  }, [searchParams, firebaseUser, user, setUser, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-600 mb-6">
            There was an error processing your payment. Please try again.
          </p>
          <button
            onClick={() => navigate('/pricing')}
            className="btn-primary"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for subscribing. Your account has been upgraded.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
}

