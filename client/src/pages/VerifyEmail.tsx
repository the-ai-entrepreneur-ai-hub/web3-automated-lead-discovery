import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { config } from "@/lib/config";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isResending, setIsResending] = useState(false);

  // Get email from location state
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      // If no email in state, redirect to register
      navigate('/register');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.API_URL}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          verificationCode: verificationCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Email verified successfully! Redirecting to dashboard...");
        
        // Store user data and token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast({
          title: "Success!",
          description: "Email verified successfully. Welcome to Web3Radar!",
        });

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(data.error || 'Email verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${config.API_URL}/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Code Resent",
          description: "A new verification code has been sent to your email.",
        });
      } else {
        setError(data.error || 'Failed to resend verification code');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only allow digits, max 6
    setVerificationCode(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center bg-background hero-bg network-bg px-6 py-20">
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-primary rounded-full animate-float opacity-60"></div>
        <div className="absolute top-32 right-32 w-6 h-6 bg-primary rounded-full animate-float opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-40 w-3 h-3 bg-primary rounded-full animate-float opacity-80" style={{animationDelay: '2s'}}></div>

        <div className="w-full max-w-md relative z-10">
          <Card className="card-web3 border-glow">
            <CardHeader className="text-center">
              <div className="relative w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-md animate-[slowFloat_4s_ease-in-out_infinite]"></div>
              </div>
              <CardTitle className="text-2xl text-glow">Verify Your Email</CardTitle>
              <CardDescription>
                We've sent a 6-digit verification code to<br />
                <span className="font-semibold text-primary">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="space-y-6">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-lg">
                    <p className="text-center">{success}</p>
                  </div>
                  <div className="text-center">
                    <Link to="/dashboard" className="text-primary hover:underline">
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="verificationCode" className="text-foreground">Verification Code</Label>
                    <Input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      placeholder="123456"
                      value={verificationCode}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="bg-secondary border-border text-center text-2xl font-mono tracking-widest"
                      maxLength={6}
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Enter the 6-digit code from your email
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full btn-web3" 
                    size="lg"
                    disabled={isLoading || verificationCode.length !== 6}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                  </Button>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the code?
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResendCode}
                      disabled={isResending}
                      className="text-primary hover:underline p-0 h-auto"
                    >
                      {isResending ? 'Resending...' : 'Resend Code'}
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <Link to="/register" className="text-primary hover:underline text-sm">
                      Back to Registration
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;