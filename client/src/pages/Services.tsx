import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Search, 
  BarChart3, 
  Users, 
  Mail, 
  Bot, 
  Target, 
  TrendingUp, 
  Globe, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Header from "@/components/Header";

const Services = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("lead-discovery");

  // Handle URL hash navigation
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['lead-discovery', 'market-intelligence', 'competitor-analysis', 'contact-enrichment'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.history.pushState(null, '', `#${value}`);
  };

  const services = [
    {
      id: "lead-discovery",
      title: "AI-Powered Lead Discovery",
      subtitle: "Find Your Next Web3 Opportunity",
      icon: Search,
      gradient: "from-blue-500 to-cyan-500",
      features: [
        "Real-time Web3 project scanning",
        "Advanced filtering by funding stage",
        "Technology stack identification",
        "Team and founder profiling",
        "Social media sentiment analysis",
        "Automated lead scoring"
      ],
      benefits: [
        "Save 20+ hours per week on research",
        "Discover projects before your competitors",
        "Focus on high-quality prospects only",
        "Increase conversion rates by 40%"
      ],
      pricing: "Starting at $99/month",
      ctaText: "Start Free Trial",
      description: "Our AI-powered lead discovery engine continuously scans the Web3 ecosystem to identify new projects, funding rounds, and business opportunities. Using advanced machine learning algorithms, we analyze thousands of data points to surface the most relevant prospects for your business."
    },
    {
      id: "market-intelligence",
      title: "Market Intelligence & Analytics",
      subtitle: "Stay Ahead of Web3 Trends",
      icon: BarChart3,
      gradient: "from-emerald-500 to-teal-500",
      features: [
        "Real-time market trend analysis",
        "Funding round tracking",
        "Ecosystem growth monitoring",
        "Token performance insights",
        "Regulatory impact assessment",
        "Custom market reports"
      ],
      benefits: [
        "Make data-driven decisions",
        "Identify emerging opportunities",
        "Track competitor movements",
        "Optimize market timing"
      ],
      pricing: "Starting at $149/month",
      ctaText: "Get Market Insights",
      description: "Comprehensive market intelligence that helps you understand Web3 trends, track funding activities, and identify emerging opportunities. Our analytics platform processes millions of data points to deliver actionable insights for strategic decision-making."
    },
    {
      id: "competitor-analysis",
      title: "Competitor Analysis & Monitoring",
      subtitle: "Know Your Competition Inside Out",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      features: [
        "Automated competitor tracking",
        "Product feature comparisons",
        "Pricing strategy analysis",
        "Marketing campaign monitoring",
        "Partnership tracking",
        "SWOT analysis reports"
      ],
      benefits: [
        "Stay ahead of competition",
        "Identify market gaps",
        "Benchmark your performance",
        "Discover partnership opportunities"
      ],
      pricing: "Starting at $199/month",
      ctaText: "Analyze Competitors",
      description: "Keep a close eye on your competition with our comprehensive monitoring and analysis tools. Track their product updates, marketing strategies, partnerships, and market positioning to maintain your competitive advantage."
    },
    {
      id: "contact-enrichment",
      title: "Contact Enrichment & Outreach",
      subtitle: "Connect with Decision Makers",
      icon: Mail,
      gradient: "from-orange-500 to-red-500",
      features: [
        "Email & social profile discovery",
        "Decision maker identification",
        "Contact verification",
        "Personalized outreach templates",
        "CRM integration",
        "Response tracking"
      ],
      benefits: [
        "Reach the right people faster",
        "Improve email deliverability",
        "Increase response rates by 60%",
        "Streamline your outreach process"
      ],
      pricing: "Starting at $79/month",
      ctaText: "Enrich Contacts",
      description: "Transform basic company information into comprehensive contact profiles with verified email addresses, social profiles, and decision-maker insights. Our enrichment engine ensures you're always reaching the right person with the right message."
    }
  ];

  const currentService = services.find(s => s.id === activeTab) || services[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            Our Services
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Complete Web3 Business Intelligence
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From lead discovery to market analysis, our comprehensive suite of AI-powered tools 
            helps Web3 businesses identify opportunities, understand markets, and connect with prospects.
          </p>
        </div>

        {/* Services Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12 bg-card/50 border border-border/50">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <TabsTrigger 
                  key={service.id} 
                  value={service.id}
                  className="flex flex-col gap-2 p-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-xs font-medium hidden sm:block">
                    {service.title.split(' ').slice(0, 2).join(' ')}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <TabsContent key={service.id} value={service.id} className="space-y-8">
                {/* Service Hero */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-card/50 to-card/30 border border-border/50 p-8 md:p-12">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
                  <div className={`absolute top-6 right-6 w-24 h-24 bg-gradient-to-br ${service.gradient} rounded-full opacity-10 blur-xl`}></div>
                  
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className={`inline-flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br ${service.gradient} bg-opacity-10 mb-6`}>
                        <IconComponent className="h-8 w-8 text-primary" />
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                            {service.title}
                          </h2>
                          <p className="text-primary font-medium">{service.subtitle}</p>
                        </div>
                      </div>
                      
                      <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                        {service.description}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          size="lg"
                          className={`bg-gradient-to-r ${service.gradient} hover:opacity-90 text-white shadow-lg`}
                          onClick={() => navigate('/register')}
                        >
                          {service.ctaText}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg"
                          className="border-primary/30 text-primary hover:bg-primary/10"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>

                    <div className="relative">
                      <div className={`w-full h-64 bg-gradient-to-br ${service.gradient} rounded-xl opacity-20`}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className="h-24 w-24 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features & Benefits */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Features */}
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Key Features
                      </CardTitle>
                      <CardDescription>
                        Powerful capabilities designed for Web3 professionals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Benefits */}
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Business Benefits
                      </CardTitle>
                      <CardDescription>
                        Measurable impact on your business growth
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {service.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            {service.pricing}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Start with a 14-day free trial. No credit card required.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Use Cases */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Perfect For
                    </CardTitle>
                    <CardDescription>
                      Who benefits most from {service.title.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {service.id === 'lead-discovery' && (
                        <>
                          <div className="text-center p-4 bg-card/30 rounded-lg border border-primary/10">
                            <Bot className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold text-foreground mb-2">VCs & Investors</h4>
                            <p className="text-sm text-muted-foreground">
                              Discover promising projects before they hit mainstream radar
                            </p>
                          </div>
                          <div className="text-center p-4 bg-card/30 rounded-lg border border-primary/10">
                            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold text-foreground mb-2">Service Providers</h4>
                            <p className="text-sm text-muted-foreground">
                              Find Web3 companies that need your services and solutions
                            </p>
                          </div>
                          <div className="text-center p-4 bg-card/30 rounded-lg border border-primary/10">
                            <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold text-foreground mb-2">Business Development</h4>
                            <p className="text-sm text-muted-foreground">
                              Identify partnership and collaboration opportunities
                            </p>
                          </div>
                        </>
                      )}
                      
                      {service.id === 'market-intelligence' && (
                        <>
                          <div className="text-center p-4 bg-card/30 rounded-lg border border-primary/10">
                            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold text-foreground mb-2">Strategy Teams</h4>
                            <p className="text-sm text-muted-foreground">
                              Make informed decisions with comprehensive market data
                            </p>
                          </div>
                          <div className="text-center p-4 bg-card/30 rounded-lg border border-primary/10">
                            <BarChart3 className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold text-foreground mb-2">Research Teams</h4>
                            <p className="text-sm text-muted-foreground">
                              Access real-time data and insights for market research
                            </p>
                          </div>
                          <div className="text-center p-4 bg-card/30 rounded-lg border border-primary/10">
                            <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold text-foreground mb-2">Web3 Startups</h4>
                            <p className="text-sm text-muted-foreground">
                              Understand your market position and opportunities
                            </p>
                          </div>
                        </>
                      )}
                      
                      {service.id === 'competitor-analysis' && (
                        <>
                          <div className="text-center p-4 bg-card/30 rounded-lg border border-primary/10">
                            <Target className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold text-foreground mb-2">Product Teams</h4>
                            <p className="text-sm text-muted-foreground">
                              Stay ahead with competitive intelligence and insights
                            </p>
                          </div>
                          <div className="text-center p-4 bg-card/30 rounded-lg border border-primary/10">
                            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold text-foreground mb-2">Marketing Teams</h4>
                            <p className="text-sm text-muted-foreground">
                              Understand competitor strategies and positioning
                            </p>
                          </div>
                          <div className="text-center p-4 bg-card/30 rounded-lg border border-primary/10">
                            <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold text-foreground mb-2">Leadership Teams</h4>
                            <p className="text-sm text-muted-foreground">
                              Make strategic decisions with competitive insights
                            </p>
                          </div>
                        </>
                      )}
                      
                      {service.id === 'contact-enrichment' && (
                        <>
                          <div className="text-center p-4 bg-card/30 rounded-lg border border-primary/10">
                            <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold text-foreground mb-2">Sales Teams</h4>
                            <p className="text-sm text-muted-foreground">
                              Connect with decision makers and close more deals
                            </p>
                          </div>
                          <div className="text-center p-4 bg-card/30 rounded-lg border border-primary/10">
                            <Bot className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold text-foreground mb-2">Marketing Teams</h4>
                            <p className="text-sm text-muted-foreground">
                              Build targeted campaigns with accurate contact data
                            </p>
                          </div>
                          <div className="text-center p-4 bg-card/30 rounded-lg border border-primary/10">
                            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold text-foreground mb-2">Partnership Teams</h4>
                            <p className="text-sm text-muted-foreground">
                              Reach key stakeholders for strategic partnerships
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Accelerate Your Web3 Growth?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of Web3 professionals who use our platform to discover opportunities, 
            analyze markets, and connect with prospects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-3 text-lg font-semibold"
              onClick={() => navigate('/register')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-3 text-lg"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </main>
    </div>
  );
};

export default Services;