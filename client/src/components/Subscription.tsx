import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStripe, stripeApi } from '@/lib/stripe';
import { User } from '@/lib/types';

interface SubscriptionProps {
  user: User | null;
  onSubscriptionUpdate?: () => void;
}

interface SubscriptionStatus {
  tier: string;
  isActive: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionId?: string;
  status?: string;
  currentPeriodStart?: number;
  currentPeriodEnd?: number;
  cancelAtPeriodEnd?: boolean;
}

const Subscription = ({ user, onSubscriptionUpdate }: SubscriptionProps) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user]);

  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const status = await stripeApi.getSubscriptionStatus(token);
      setSubscriptionStatus(status);
    } catch (err) {
      console.error('Error fetching subscription status:', err);
      setError('Failed to fetch subscription status');
    }
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to upgrade');
        return;
      }

      const { url } = await stripeApi.createCheckoutSession(token);
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError('Failed to create checkout session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to cancel subscription');
        return;
      }

      await stripeApi.cancelSubscription(token);
      await fetchSubscriptionStatus();
      if (onSubscriptionUpdate) {
        onSubscriptionUpdate();
      }
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError('Failed to cancel subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (!user) return null;

  const isPaid = subscriptionStatus?.tier === 'paid';
  const isActive = subscriptionStatus?.isActive;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Subscription Status
          <Badge variant={isPaid ? 'default' : 'secondary'}>
            {isPaid ? 'Pro' : 'Free'}
          </Badge>
        </CardTitle>
        <CardDescription>
          {isPaid ? 'You have access to all premium features' : 'Upgrade to unlock all features'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {isPaid && subscriptionStatus && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="capitalize">{subscriptionStatus.status}</span>
            </div>
            {subscriptionStatus.currentPeriodEnd && (
              <div className="flex justify-between">
                <span>Next billing:</span>
                <span>{formatDate(subscriptionStatus.currentPeriodEnd)}</span>
              </div>
            )}
            {subscriptionStatus.cancelAtPeriodEnd && (
              <div className="text-yellow-600 font-medium">
                Your subscription will end on {formatDate(subscriptionStatus.currentPeriodEnd!)}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          {!isPaid ? (
            <Button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isLoading ? 'Processing...' : 'Upgrade to Pro - $99/month'}
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-green-600 font-medium">
                ✓ Premium features unlocked
              </div>
              {!subscriptionStatus?.cancelAtPeriodEnd && (
                <Button
                  onClick={handleCancel}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? 'Processing...' : 'Cancel Subscription'}
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          Payments are securely processed by Stripe
        </div>
      </CardContent>
    </Card>
  );
};

export default Subscription;