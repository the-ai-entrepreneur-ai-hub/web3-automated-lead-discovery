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
  subscriptionStatus?: string;
  currentPeriodStart?: number;
  currentPeriodEnd?: number;
  cancelAtPeriodEnd?: boolean;
  trialEnd?: number;
  stripeError?: string;
}

const Subscription = ({ user, onSubscriptionUpdate }: SubscriptionProps) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState<any>(null);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [validationController, setValidationController] = useState<AbortController | null>(null);

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
      // Check for stored discount code on component mount
      const storedCode = localStorage.getItem('appliedDiscountCode');
      if (storedCode) {
        try {
          const parsedCode = JSON.parse(storedCode);
          if (parsedCode.expiresAt && Date.now() < parsedCode.expiresAt) {
            setDiscountCode(parsedCode.code);
            // Re-validate the stored code
            setTimeout(() => handleValidateDiscountCode(), 100);
          } else {
            localStorage.removeItem('appliedDiscountCode');
          }
        } catch {
          localStorage.removeItem('appliedDiscountCode');
        }
      }
    }
  }, [user]);
  
  // Cleanup controller on unmount
  useEffect(() => {
    return () => {
      if (validationController) {
        validationController.abort();
      }
    };
  }, [validationController]);

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
    const codeToValidate = discountCode.trim();
    if (!codeToValidate) return;
    
    // Cancel any ongoing validation
    if (validationController) {
      validationController.abort();
    }
    
    const controller = new AbortController();
    setValidationController(controller);
    setIsValidatingCode(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to validate discount code');
        return;
      }

      const result = await stripeApi.validateDiscountCode(token, codeToValidate);
      
      // Check if request was aborted
      if (controller.signal.aborted) {
        return;
      }
      
      if (result.valid) {
        setDiscountInfo(result);
        setError(null);
        // Store valid discount code with expiration (24 hours)
        const validCode = {
          code: codeToValidate,
          validatedAt: Date.now(),
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        localStorage.setItem('appliedDiscountCode', JSON.stringify(validCode));
        console.log('✅ Discount code stored for global use:', codeToValidate);
      } else {
        setDiscountInfo(null);
        setError(result.message || 'Invalid discount code');
        // Remove invalid discount code
        localStorage.removeItem('appliedDiscountCode');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return; // Request was cancelled
      }
      console.error('Error validating discount code:', err);
      setDiscountInfo(null);
      setError(err.message || 'Failed to validate discount code');
    } finally {
      if (!controller.signal.aborted) {
        setIsValidatingCode(false);
        setValidationController(null);
      }
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

      // Get valid discount code from storage or current input
      let finalDiscountCode = discountCode.trim();
      
      // Check if we have a stored valid discount code
      const storedCode = localStorage.getItem('appliedDiscountCode');
      if (storedCode) {
        try {
          const parsedCode = JSON.parse(storedCode);
          if (parsedCode.expiresAt && Date.now() < parsedCode.expiresAt) {
            finalDiscountCode = parsedCode.code;
          } else {
            // Stored code expired, remove it
            localStorage.removeItem('appliedDiscountCode');
          }
        } catch {
          // Invalid stored code format, remove it
          localStorage.removeItem('appliedDiscountCode');
        }
      }
      
      const response = await stripeApi.createCheckoutSession(token, finalDiscountCode || undefined);
      
      if (response.success && response.url) {
        console.log('💳 Subscription checkout details:', {
          scenario: response.scenario,
          amount: response.amount,
          trialDays: response.trialDays,
          hasDiscount: response.hasDiscount
        });
        // Redirect to Stripe Checkout
        window.location.href = response.url;
      } else {
        throw new Error(response.error || 'Failed to get checkout URL');
      }
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

      console.log('🚫 Initiating subscription cancellation...');
      const response = await stripeApi.cancelSubscription(token);
      console.log('✅ Cancellation response:', response);
      
      // Refresh subscription status to show updated cancellation state
      await fetchSubscriptionStatus();
      
      if (onSubscriptionUpdate) {
        onSubscriptionUpdate();
      }
      
      // Clear any existing errors on successful cancellation
      setError(null);
    } catch (err) {
      console.error('❌ Error cancelling subscription:', err);
      
      // Extract error message from response if available
      let errorMessage = 'Failed to cancel subscription. Please try again.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = (err as any).message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number | null | undefined): string => {
    if (!timestamp || typeof timestamp !== 'number' || timestamp <= 0) {
      return 'Invalid Date';
    }
    
    try {
      const date = new Date(timestamp * 1000);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error, 'timestamp:', timestamp);
      return 'Invalid Date';
    }
  };

  const formatDateSafe = (timestamp: number | null | undefined): string => {
    const formatted = formatDate(timestamp);
    return formatted === 'Invalid Date' ? 'Date unavailable' : formatted;
  };

  if (!user) return null;

  // Enhanced subscription status logic
  const isPaid = subscriptionStatus?.tier === 'paid' || subscriptionStatus?.status === 'active';
  const isTrialing = subscriptionStatus?.status === 'trialing' || subscriptionStatus?.subscriptionStatus === 'trial';
  const isActive = subscriptionStatus?.isActive || isPaid || isTrialing;
  const isCancelling = subscriptionStatus?.cancelAtPeriodEnd;

  // Determine display status and tier
  const displayTier = isPaid ? 'Pro' : isTrialing ? 'Pro (Trial)' : 'Free';
  const displayStatus = subscriptionStatus?.status || subscriptionStatus?.subscriptionStatus || 'none';

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Subscription Status
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {displayTier}
          </Badge>
        </CardTitle>
        <CardDescription>
          {isActive ? 'You have access to all premium features' : 'Upgrade to unlock all features'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {isActive && subscriptionStatus && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="capitalize">{displayStatus}</span>
            </div>
            
            {(subscriptionStatus.currentPeriodEnd || subscriptionStatus.trialEnd) && (
              <div className="flex justify-between">
                <span>{isCancelling && isTrialing ? 'Trial ends:' : isCancelling ? 'Subscription ends:' : isTrialing ? 'Trial ends:' : 'Next billing:'}:</span>
                <span>{formatDateSafe(subscriptionStatus.currentPeriodEnd || subscriptionStatus.trialEnd)}</span>
              </div>
            )}
            
            {isCancelling && (
              <div className="text-yellow-600 font-medium">
                {isTrialing 
                  ? `Your trial will end on ${formatDateSafe(subscriptionStatus.currentPeriodEnd || subscriptionStatus.trialEnd)}`
                  : `Your subscription will end on ${formatDateSafe(subscriptionStatus.currentPeriodEnd)}`
                }
              </div>
            )}
            
            {subscriptionStatus.stripeError && (
              <div className="text-orange-600 text-xs bg-orange-50 p-2 rounded">
                ⚠️ {subscriptionStatus.stripeError}
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          {!isActive && (
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
                ✨ Start with a 14-day free trial!
              </div>
            </div>
          )}
          
          {!isActive ? (
            <Button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isLoading ? 'Starting Trial...' : 'Start 14-Day Free Trial'}
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-green-600 font-medium">
                ✓ Premium features unlocked
              </div>
              {isActive && !isCancelling && subscriptionStatus?.stripeSubscriptionId && (
                <Button
                  onClick={handleCancel}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? 'Processing...' : 'Cancel Subscription'}
                </Button>
              )}
              {isCancelling && (
                <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                  ⏳ Cancellation scheduled - you'll retain access until {formatDateSafe(subscriptionStatus?.currentPeriodEnd || subscriptionStatus?.trialEnd)}
                </div>
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