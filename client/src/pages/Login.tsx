import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { config } from "@/lib/config";
import { storeGoogleAccessToken } from "@/lib/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGoogleTerms, setShowGoogleTerms] = useState(false);
  const [googleTermsAccepted, setGoogleTermsAccepted] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'Google' | 'Twitter'>('Google');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for OAuth errors in URL params
    const oauthError = searchParams.get('error');
    if (oauthError) {
      const errorMessages: { [key: string]: string } = {
        'oauth_failed': 'Google authentication failed. Please try again.',
        'oauth_not_configured': 'Google authentication is not properly configured. Please check your Google Client ID settings.',
        'no_user_data': 'Failed to get user information from Google. Please try again.',
        'oauth_callback_failed': 'Google authentication callback failed. Please try again.',
        'google_oauth_error': 'Google OAuth service error. Please try again later.',
        'oauth_initiation_failed': 'Failed to start Google authentication. Please try again.',
        'twitter_oauth_failed': 'Twitter authentication failed. Please try again.',
        'twitter_oauth_not_configured': 'Twitter authentication is not properly configured. Please check your Twitter API settings.',
        'twitter_oauth_error': 'Twitter OAuth service error. Please try again later.',
        'twitter_oauth_initiation_failed': 'Failed to start Twitter authentication. Please try again.',
        'twitter_oauth_callback_failed': 'Twitter authentication callback failed. Please try again.'
      };
      setError(errorMessages[oauthError] || 'Authentication failed. Please try again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${config.API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.log('API URL being used:', config.API_URL);
      console.log('Full fetch URL:', `${config.API_URL}/login`);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = (provider: string) => {
    if (provider === 'Google') {
      setSelectedProvider('Google');
      setShowGoogleTerms(true);
    } else if (provider === 'Twitter') {
      setSelectedProvider('Twitter');
      setShowGoogleTerms(true);
    } else {
      alert(`${provider} authentication is not yet implemented. Please use email/password login for now.`);
    }
  };

  const handleGoogleOAuthProceed = () => {
    if (!googleTermsAccepted) {
      setError(`You must accept the Terms of Service and Privacy Policy to continue with ${selectedProvider} authentication.`);
      return;
    }
    
    // Clear any existing errors
    setError("");
    setIsLoading(true);
    
    try {
      // Store terms acceptance for OAuth callback
      sessionStorage.setItem('termsAccepted', 'true');
      sessionStorage.setItem('authFlow', 'login');
      
      // Redirect to appropriate OAuth provider
      const authUrl = selectedProvider === 'Google' 
        ? `${config.API_URL}/auth/google`
        : `${config.API_URL}/auth/twitter`;
      
      console.log(`🔄 Initiating ${selectedProvider} OAuth...`);
      console.log('🌐 OAuth URL:', authUrl);
      window.location.href = authUrl;
    } catch (error) {
      console.error(`❌ Error initiating ${selectedProvider} OAuth:`, error);
      setError(`Failed to initialize ${selectedProvider} authentication. Please try again.`);
      setIsLoading(false);
    }
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
            <div className="relative w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg"></div>
              <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-md animate-[slowFloat_4s_ease-in-out_infinite]"></div>
            </div>
            <CardTitle className="text-2xl text-glow">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your Web3Leads account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="enter@youremail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="rounded border-border" disabled={isLoading} />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full btn-web3" size="lg" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Or continue with</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full" onClick={() => handleSocialAuth('Google')}>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleSocialAuth('Twitter')}>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                    Twitter
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>

      {/* Google OAuth Terms Modal */}
      {showGoogleTerms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Terms and Conditions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Before continuing with {selectedProvider} authentication, you must accept our Terms of Service and Privacy Policy.
            </p>
            <div className="flex items-start space-x-2 mb-6">
              <input 
                type="checkbox" 
                checked={googleTermsAccepted}
                onChange={(e) => setGoogleTermsAccepted(e.target.checked)}
                className="mt-1 rounded border-border" 
              />
              <span className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline" target="_blank">Terms of Service</Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-primary hover:underline" target="_blank">Privacy Policy</Link>
              </span>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowGoogleTerms(false);
                  setGoogleTermsAccepted(false);
                  setError("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleGoogleOAuthProceed}
                disabled={!googleTermsAccepted}
                className="flex-1"
              >
                Continue with {selectedProvider}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
