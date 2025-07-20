import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Bot,
  Target,
  Zap,
  Shield,
  Clock,
  Globe,
  Database,
  BarChart3,
  Sparkles
} from "lucide-react";
import Header from "@/components/Header";

const LeadDiscovery = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Scanning",
      description: "Our advanced AI algorithms continuously scan thousands of Web3 data sources to identify new projects, funding announcements, and business opportunities in real-time."
    },
    {
      icon: Target,
      title: "Smart Filtering",
      description: "Advanced filters help you find exactly what you're looking for - by funding stage, technology stack, team size, geographic location, and market sector."
    },
    {
      icon: TrendingUp,
      title: "Trend Analysis",
      description: "Identify emerging trends and hot sectors before they become mainstream, giving you a competitive advantage in the market."
    },
    {
      icon: Shield,
      title: "Verified Data",
      description: "All project information is verified through multiple sources and regularly updated to ensure accuracy and reliability."
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Get instant notifications when new projects match your criteria, so you never miss an opportunity."
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Comprehensive coverage of Web3 projects across all major ecosystems including Ethereum, Polygon, Solana, and emerging chains."
    }
  ];

  const useCases = [
    {
      title: "Venture Capital Firms",
      description: "Discover promising startups before they hit the mainstream radar. Our platform helps VCs identify high-potential projects in their early stages.",
      metrics: "40% faster deal sourcing",
      icon: TrendingUp
    },
    {
      title: "Service Providers",
      description: "Find Web3 companies that need your specific services - from development to marketing, legal to advisory services.",
      metrics: "3x more qualified leads",
      icon: Users
    },
    {
      title: "Business Development",
      description: "Identify partnership opportunities, integration possibilities, and strategic alliances within the Web3 ecosystem.",
      metrics: "60% higher conversion rates",
      icon: Target
    },
    {
      title: "Market Research",
      description: "Gather comprehensive data on market trends, competitor landscape, and emerging opportunities for strategic planning.",
      metrics: "20+ hours saved per week",
      icon: BarChart3
    }
  ];

  const pricingPlan = {
    name: "Lead Discovery",
    price: "$99",
    period: "per month",
    description: "AI-powered Web3 lead discovery for professionals",
    features: [
      "Up to 1,000 leads per month",
      "AI-powered project scanning",
      "Smart filtering by funding stage",
      "Real-time notifications",
      "CSV export",
      "Email support"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Search className="w-3 h-3 mr-1" />
            AI-Powered Lead Discovery
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Find Your Next Web3 Opportunity
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover promising Web3 projects before your competitors do. Our AI-powered platform 
            scans thousands of sources to identify high-potential leads tailored to your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
              onClick={() => navigate('/register')}
            >
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-blue-500/30 text-blue-600 hover:bg-blue-50"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Powerful Features for Lead Discovery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <IconComponent className="h-6 w-6 text-blue-600" />
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

        {/* Use Cases */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Who Benefits from Lead Discovery?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => {
              const IconComponent = useCase.icon;
              return (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/10 flex-shrink-0">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{useCase.title}</CardTitle>
                        <CardDescription className="text-muted-foreground mb-4">
                          {useCase.description}
                        </CardDescription>
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                          {useCase.metrics}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            How Lead Discovery Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Data Collection</h3>
              <p className="text-muted-foreground text-sm">
                Our AI scans thousands of Web3 sources including funding databases, social media, and project launches.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Advanced algorithms analyze and categorize projects based on your specific criteria and preferences.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Smart Matching</h3>
              <p className="text-muted-foreground text-sm">
                Projects are matched to your profile and ranked by relevance, potential, and fit with your business.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">4. Real-Time Alerts</h3>
              <p className="text-muted-foreground text-sm">
                Get instant notifications when new opportunities match your criteria, so you never miss a deal.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="max-w-md mx-auto">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm ring-2 ring-blue-500/20 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-2xl text-center">{pricingPlan.name}</CardTitle>
                <div className="flex items-baseline gap-1 justify-center">
                  <span className="text-4xl font-bold text-foreground">{pricingPlan.price}</span>
                  <span className="text-muted-foreground">/{pricingPlan.period}</span>
                </div>
                <CardDescription className="text-center">{pricingPlan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {pricingPlan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-12 border border-blue-500/20">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-medium">Start Today</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Discover Your Next Big Opportunity?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of Web3 professionals who use our AI-powered lead discovery 
            to find opportunities before their competitors do.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
              onClick={() => navigate('/register')}
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-blue-500/30 text-blue-600 hover:bg-blue-50"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Premium access • Cancel anytime • Secure payment
          </p>
        </div>
      </main>
    </div>
  );
};

export default LeadDiscovery;