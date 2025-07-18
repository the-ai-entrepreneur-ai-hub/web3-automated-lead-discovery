import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  ArrowRight, 
  Rocket, 
  TrendingUp, 
  Globe, 
  Target,
  Zap,
  Shield,
  Code,
  Lightbulb,
  Heart,
  Star,
  Building,
  Award,
  Coffee,
  Sparkles
} from "lucide-react";
import Header from "@/components/Header";

const About = () => {
  const navigate = useNavigate();

  const stats = [
    {
      number: "50+",
      label: "Web3 Projects Launched",
      icon: Rocket
    },
    {
      number: "10M+",
      label: "Leads Generated",
      icon: Target
    },
    {
      number: "200+",
      label: "Companies Served",
      icon: Building
    },
    {
      number: "5+",
      label: "Years in Web3",
      icon: Award
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Transparency First",
      description: "We believe in open communication and honest relationships. No hidden fees, no black boxes—just clear, effective solutions."
    },
    {
      icon: Zap,
      title: "Innovation Driven",
      description: "We're constantly pushing the boundaries of what's possible in Web3 lead generation, using cutting-edge AI and blockchain technology."
    },
    {
      icon: Heart,
      title: "Community Focused",
      description: "Web3 is about community, and so are we. We're building tools that help the entire ecosystem grow and thrive together."
    },
    {
      icon: Target,
      title: "Results Obsessed",
      description: "Pretty dashboards are nice, but what matters is ROI. We measure our success by the deals you close and the growth you achieve."
    }
  ];

  const teamHighlights = [
    {
      icon: Code,
      title: "Technical Excellence",
      description: "Our team includes blockchain engineers who've built protocols handling billions in TVL, and AI specialists who've architected systems processing millions of data points daily."
    },
    {
      icon: TrendingUp,
      title: "Market Veterans",
      description: "We've been in the trenches since the early days of DeFi, NFTs, and Web3. We understand the cycles, the players, and what actually moves the needle."
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "With team members across continents and experience in markets from Silicon Valley to Singapore, we bring a truly global view to Web3 opportunities."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Users className="w-3 h-3 mr-1" />
            Meet the Team
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            We're Not Your Typical Web3 Company
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            While others were busy creating another meme coin, we were building the infrastructure 
            that powers Web3 business growth. We're the team behind some of the most successful 
            projects in the space—and now we're sharing those insights with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg"
              onClick={() => navigate('/services/lead-discovery')}
            >
              Try Our Lead Discovery
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary/30 text-primary hover:bg-primary/10"
              onClick={() => navigate('/case-studies')}
            >
              See Our Results
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-foreground">{stat.number}</CardTitle>
                    <CardDescription className="text-muted-foreground">{stat.label}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Our Story: From Web3 Builders to Lead Generation Experts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Coffee className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">The Problem We Lived</h3>
                </div>
                <p className="text-muted-foreground">
                  Back in 2019, we were just another team building in Web3. We had great products, 
                  solid technology, and big dreams. What we didn't have was an easy way to find 
                  customers, partners, and investors in this rapidly evolving space.
                </p>
                <p className="text-muted-foreground">
                  Traditional lead generation didn't work. Web3 moves too fast, the players change 
                  constantly, and the data is scattered across hundreds of platforms. We spent 
                  countless hours manually researching projects, tracking funding rounds, and 
                  building prospect lists from scratch.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">The Solution We Built</h3>
                </div>
                <p className="text-muted-foreground">
                  So we did what any good developers would do—we automated it. We built internal 
                  tools that scraped data, analyzed trends, and identified opportunities. These 
                  tools helped us launch successful projects, close million-dollar deals, and 
                  build lasting partnerships.
                </p>
                <p className="text-muted-foreground">
                  After helping dozens of other Web3 companies achieve similar results, we realized 
                  we weren't just building products anymore—we were building the infrastructure 
                  that powers Web3 business growth. That's when Web3Radar was born.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Highlights */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamHighlights.map((highlight, index) => {
              const IconComponent = highlight.icon;
              return (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{highlight.title}</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">
                      {highlight.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Our Values: What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{value.title}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {value.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="mb-20">
          <Card className="border-border/50 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <div className="text-center">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl mb-4">Our Philosophy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <blockquote className="text-lg text-muted-foreground mb-6 italic">
                "Web3 isn't just about technology—it's about creating new ways for people to connect, 
                collaborate, and build value together. Our job isn't just to generate leads; it's to 
                help build the relationships that will define the future of the internet."
              </blockquote>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>The Web3Radar Team</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Behind the Scenes */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Behind the Scenes
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're not your typical suit-and-tie corporate team. We're developers who code in 
              coffee shops, analysts who track market trends at 3 AM, and entrepreneurs who 
              genuinely believe Web3 will change the world. We work remotely, think globally, 
              and ship fast.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-card/50 rounded-lg border border-border/50">
                <h3 className="font-semibold text-foreground mb-2">🌍 Global Team</h3>
                <p className="text-sm text-muted-foreground">
                  Distributed across 6 time zones, ensuring we're always monitoring the Web3 space
                </p>
              </div>
              <div className="p-6 bg-card/50 rounded-lg border border-border/50">
                <h3 className="font-semibold text-foreground mb-2">🚀 Ship Fast</h3>
                <p className="text-sm text-muted-foreground">
                  We deploy new features weekly and respond to market changes in real-time
                </p>
              </div>
              <div className="p-6 bg-card/50 rounded-lg border border-border/50">
                <h3 className="font-semibold text-foreground mb-2">💡 Always Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Web3 evolves daily, and so do we. We're constantly adapting our tools and strategies
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12 border border-primary/20">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">Ready to Work Together?</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Let's Build Something Amazing
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always excited to meet fellow builders, dreamers, and entrepreneurs who are 
            pushing the boundaries of what's possible in Web3. Whether you need leads, insights, 
            or just want to chat about the future of the space, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg"
              onClick={() => navigate('/register')}
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary/30 text-primary hover:bg-primary/10"
              onClick={() => navigate('/services/lead-discovery')}
            >
              Explore Our Services
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;