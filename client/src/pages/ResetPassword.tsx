import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid or missing reset token");
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          newPassword: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password reset successfully! You can now sign in with your new password.");
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.error || 'Password reset failed');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
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
            <CardTitle className="text-2xl text-glow">Set New Password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-6">
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-lg">
                  <p className="text-center">{success}</p>
                </div>
                <div className="text-center">
                  <Link to="/login" className="text-primary hover:underline">
                    Go to Sign In
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
                  <Label htmlFor="password" className="text-foreground">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading || !token}
                    className="bg-secondary border-border"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading || !token}
                    className="bg-secondary border-border"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full btn-web3" 
                  size="lg"
                  disabled={isLoading || !token}
                >
                  {isLoading ? 'Updating Password...' : 'Update Password'}
                </Button>
                
                <div className="text-center">
                  <Link to="/login" className="text-primary hover:underline">
                    Back to Sign In
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

export default ResetPassword;