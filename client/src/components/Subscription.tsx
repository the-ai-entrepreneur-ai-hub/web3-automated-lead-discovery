import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [discountCode, setDiscountCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState<any>(null);
  const [isValidatingCode, setIsValidatingCode] = useState(false);

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

  const handleValidateDiscountCode = async () => {
    if (!discountCode.trim()) return;
    
    setIsValidatingCode(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to validate discount code');
        return;
      }

      const result = await stripeApi.validateDiscountCode(token, discountCode);
      if (result.valid) {
        setDiscountInfo(result);
        setError(null);
      } else {
        setDiscountInfo(null);
        setError(result.message || 'Invalid discount code');
      }
    } catch (err) {
      console.error('Error validating discount code:', err);
      setDiscountInfo(null);
      setError('Failed to validate discount code');
    } finally {
      setIsValidatingCode(false);
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

      const { url } = await stripeApi.createCheckoutSession(token, discountCode.trim() || undefined);
      
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

        <div className="space-y-4">
          {!isPaid && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="discount-code">Discount Code (Optional)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="discount-code"
                    placeholder="Enter discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    disabled={isLoading || isValidatingCode}
                  />
                  <Button
                    onClick={handleValidateDiscountCode}
                    disabled={!discountCode.trim() || isValidatingCode}
                    variant="outline"
                    size="sm"
                  >
                    {isValidatingCode ? 'Checking...' : 'Apply'}
                  </Button>
                </div>
              </div>
              
              {discountInfo && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                  ✓ Code applied: {discountInfo.percentage}% off {discountInfo.duration === 'once' ? 'first month' : 'subscription'}
                </div>
              )}
              
              <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                ✨ Start with a 7-day free trial!
              </div>
            </div>
          )}
          
          {!isPaid ? (
            <Button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isLoading ? 'Processing...' : 'Start 7-Day Free Trial'}
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