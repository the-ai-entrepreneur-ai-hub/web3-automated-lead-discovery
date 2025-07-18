import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, MessageCircle, Star, Calendar, Bell, ArrowRight, Sparkles } from "lucide-react";
import Header from "@/components/Header";

const Community = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-16">
        {/* Coming Soon Banner */}
        <div className="text-center mb-16">
          <div className="relative">
            {/* Floating Elements */}
            <div className="absolute top-10 left-20 w-4 h-4 bg-primary rounded-full animate-float opacity-60"></div>
            <div className="absolute top-20 right-16 w-3 h-3 bg-primary/70 rounded-full animate-float-delayed opacity-40"></div>
            <div className="absolute bottom-10 left-32 w-2 h-2 bg-primary/50 rounded-full animate-float opacity-50"></div>
            <div className="absolute bottom-16 right-24 w-5 h-5 bg-primary/80 rounded-full animate-float-delayed opacity-30"></div>
            
            <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-16 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse"></div>
              
              <div className="relative z-10">
                <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 text-lg px-6 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Coming Soon
                </Badge>
                
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                  Web3Radar Community
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                  Join the most engaged community of Web3 professionals, marketers, and entrepreneurs. 
                  Share insights, discover opportunities, and grow together in the decentralized future.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <div className="flex items-center gap-2 text-primary">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">10,000+ Members</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">Daily Discussions</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Star className="w-5 h-5" />
                    <span className="font-medium">Expert Insights</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Weekly Events</span>
                  </div>
                </div>
                
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-background/50 rounded-full px-4 py-2 backdrop-blur-sm">
                  <Bell className="w-4 h-4 text-primary" />
                  <span>Keep checking back for updates!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What to Expect Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What to Expect from Our Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're building something special. Here's what you can look forward to when we launch.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl mb-3">Expert Network</CardTitle>
              <CardContent className="p-0">
                <p className="text-muted-foreground text-sm">
                  Connect with leading Web3 marketers, founders, and industry experts. 
                  Learn from their experiences and build valuable relationships.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl mb-3">Daily Discussions</CardTitle>
              <CardContent className="p-0">
                <p className="text-muted-foreground text-sm">
                  Participate in meaningful conversations about Web3 trends, marketing strategies, 
                  and emerging opportunities in the space.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl mb-3">Exclusive Content</CardTitle>
              <CardContent className="p-0">
                <p className="text-muted-foreground text-sm">
                  Access community-only resources, case studies, and insights that you won't 
                  find anywhere else in the Web3 ecosystem.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl mb-3">Weekly Events</CardTitle>
              <CardContent className="p-0">
                <p className="text-muted-foreground text-sm">
                  Join AMAs, workshops, and networking events hosted by industry leaders. 
                  Stay ahead of the curve with exclusive insights.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl mb-3">Early Access</CardTitle>
              <CardContent className="p-0">
                <p className="text-muted-foreground text-sm">
                  Be the first to know about new features, tools, and opportunities. 
                  Community members get priority access to beta features.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6">
                <ArrowRight className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl mb-3">Career Growth</CardTitle>
              <CardContent className="p-0">
                <p className="text-muted-foreground text-sm">
                  Discover job opportunities, find co-founders, and build your professional 
                  network in the rapidly growing Web3 space.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Early Access Signup */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
          <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Get Early Access to Our Community
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our waitlist to be among the first to access the Web3Radar Community. 
            We'll notify you as soon as we launch and give you exclusive founding member benefits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8">
            <Input 
              type="email" 
              placeholder="Enter your email address"
              className="flex-1 bg-background border-border/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
            />
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              Join Waitlist
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Exclusive updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>First access</span>
            </div>
          </div>
        </div>

        {/* Social Links Preview */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            While you wait, stay connected with us on our existing channels:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="bg-background/50 border-border/50 hover:bg-primary/10 hover:border-primary/30">
              Twitter
            </Button>
            <Button variant="outline" className="bg-background/50 border-border/50 hover:bg-primary/10 hover:border-primary/30">
              LinkedIn
            </Button>
            <Button variant="outline" className="bg-background/50 border-border/50 hover:bg-primary/10 hover:border-primary/30">
              Newsletter
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;