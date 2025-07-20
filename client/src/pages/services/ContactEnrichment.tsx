import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Target,
  Clock,
  Search,
  Database,
  Sparkles,
  Bell,
  UserCheck,
  MessageSquare
} from "lucide-react";
import Header from "@/components/Header";

const ContactEnrichment = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/join-waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          serviceTag: 'contact-enrichment'
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to join waitlist');
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      alert('Network error. Please try again.');
    }
  };

  const features = [
    {
      icon: Search,
      title: "Email Discovery",
      description: "Find verified business email addresses for key decision makers at Web3 companies."
    },
    {
      icon: UserCheck,
      title: "Decision Maker Identification",
      description: "Identify the right people to contact - from founders and CTOs to business development managers."
    },
    {
      icon: Database,
      title: "Contact Verification",
      description: "All email addresses are verified in real-time to ensure high deliverability."
    },
    {
      icon: MessageSquare,
      title: "Personalized Templates",
      description: "AI-generated personalized outreach templates based on company information and contact background."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-16">
        {/* Coming Soon Badge */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-orange-500/10 text-orange-600 border-orange-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Coming Soon
          </Badge>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-500/10 text-orange-600 border-orange-500/20">
            <Mail className="w-3 h-3 mr-1" />
            Contact Enrichment & Outreach
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Connect with Decision Makers
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Transform basic company information into comprehensive contact profiles with verified email addresses, 
            social profiles, and decision-maker insights. Reach the right people with the right message.
          </p>
        </div>

        {/* Features Preview */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            What's Coming
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-orange-500/10">
                        <IconComponent className="h-6 w-6 text-orange-600" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Waitlist Section */}
        <div className="max-w-2xl mx-auto mb-20">
          <Card className="border-border/50 bg-gradient-to-r from-orange-500/5 to-red-500/5 border-orange-500/20">
            <CardHeader>
              <div className="text-center">
                <Bell className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-2xl mb-2">Join the Waitlist</CardTitle>
                <CardDescription>
                  Be the first to know when Contact Enrichment launches. Get early access and special pricing.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">You're on the list!</h3>
                  <p className="text-muted-foreground">
                    We'll notify you as soon as Contact Enrichment is ready.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Join Waitlist
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    We'll only email you about Contact Enrichment updates. No spam, ever.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Meanwhile Section */}
        <div className="text-center bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-12 border border-blue-500/20">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-medium">Available Now</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Meanwhile, Try Lead Discovery
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            While we're building Contact Enrichment, you can start discovering Web3 opportunities 
            with our AI-powered Lead Discovery service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
              onClick={() => navigate('/services/lead-discovery')}
            >
              Try Lead Discovery
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-blue-500/30 text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('/register')}
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactEnrichment;