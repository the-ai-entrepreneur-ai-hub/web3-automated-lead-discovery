import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { useState } from "react";
import { Link } from "react-router-dom";
import { config } from "@/lib/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${config.API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage('An error occurred. Please try again.');
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
            <CardTitle className="text-2xl text-glow">Reset Password</CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message ? (
              <div className="space-y-6">
                <div className="p-4 bg-secondary rounded-lg border border-border">
                  <p className="text-foreground text-center">{message}</p>
                </div>
                <div className="text-center">
                  <Link to="/login" className="text-primary hover:underline">
                    Back to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="enter@youremail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-secondary border-border"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full btn-web3" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;