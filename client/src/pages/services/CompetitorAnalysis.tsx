import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  Eye, 
  Target,
  Zap,
  Shield,
  Clock,
  Globe,
  Search,
  BarChart3,
  Sparkles,
  AlertCircle,
  Lightbulb,
  Bell
} from "lucide-react";
import Header from "@/components/Header";

const CompetitorAnalysis = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Eye,
      title: "Automated Monitoring",
      description: "Continuously track your competitors' activities across multiple channels including social media, product updates, and market moves."
    },
    {
      icon: BarChart3,
      title: "Performance Benchmarking",
      description: "Compare your metrics against competitors including TVL, user growth, token performance, and market share."
    },
    {
      icon: Search,
      title: "Deep Competitive Research",
      description: "Comprehensive analysis of competitor strategies, partnerships, funding, and positioning in the market."
    },
    {
      icon: Bell,
      title: "Real-Time Alerts",
      description: "Instant notifications when competitors make significant moves, launch new products, or announce partnerships."
    },
    {
      icon: Lightbulb,
      title: "Strategic Insights",
      description: "AI-powered analysis that identifies opportunities, threats, and gaps in the competitive landscape."
    },
    {
      icon: Target,
      title: "SWOT Analysis",
      description: "Automated SWOT analysis comparing your strengths and weaknesses against key competitors."
    }
  ];

  const monitoringAreas = [
    {
      category: "Product Intelligence",
      items: [
        "Feature launches and updates",
        "User interface changes",
        "Technical improvements",
        "Integration announcements"
      ],
      icon: Zap
    },
    {
      category: "Marketing Intelligence",
      items: [
        "Campaign launches",
        "Content strategy",
        "Social media activity",
        "Partnership announcements"
      ],
      icon: TrendingUp
    },
    {
      category: "Financial Intelligence",
      items: [
        "Funding rounds",
        "Revenue reports",
        "Token performance",
        "Expense patterns"
      ],
      icon: BarChart3
    },
    {
      category: "Strategic Intelligence",
      items: [
        "Market positioning",
        "Pricing changes",
        "Expansion plans",
        "Acquisition activity"
      ],
      icon: Target
    }
  ];

  const useCases = [
    {
      title: "Product Teams",
      description: "Stay informed about competitor feature releases, product strategies, and user feedback to guide your own product development.",
      metrics: "50% faster product decisions",
      icon: Zap
    },
    {
      title: "Marketing Teams",
      description: "Monitor competitor campaigns, messaging, and positioning to differentiate your brand and capitalize on market gaps.",
      metrics: "40% better campaign performance",
      icon: TrendingUp
    },
    {
      title: "Strategy Teams",
      description: "Get comprehensive competitive intelligence to inform strategic planning and identify market opportunities.",
      metrics: "3x more strategic insights",
      icon: Target
    },
    {
      title: "Leadership Teams",
      description: "Make informed decisions with real-time competitive intelligence and market positioning analysis.",
      metrics: "60% more confident decisions",
      icon: Users
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$199",
      period: "per month",
      description: "Essential competitor monitoring for small teams",
      features: [
        "Up to 5 competitors",
        "Basic monitoring alerts",
        "Monthly reports",
        "Email notifications",
        "Standard support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$499",
      period: "per month",
      description: "Advanced analysis for growing businesses",
      features: [
        "Up to 20 competitors",
        "Real-time monitoring",
        "SWOT analysis",
        "Custom dashboards",
        "API access",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "Comprehensive intelligence for large organizations",
      features: [
        "Unlimited competitors",
        "Custom intelligence models",
        "Dedicated analyst support",
        "White-label reporting",
        "Integration support",
        "SLA guarantees"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">
            <Users className="w-3 h-3 mr-1" />
            Competitor Analysis & Monitoring
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Know Your Competition Inside Out
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Stay ahead of your competition with comprehensive monitoring and analysis tools. 
            Track their moves, understand their strategies, and identify opportunities to outperform them.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
              onClick={() => navigate('/register')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-purple-500/30 text-purple-600 hover:bg-purple-50"
            >
              See Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Complete Competitive Intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <IconComponent className="h-6 w-6 text-purple-600" />
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

        {/* Monitoring Areas */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            What We Monitor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {monitoringAreas.map((area, index) => {
              const IconComponent = area.icon;
              return (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <IconComponent className="h-6 w-6 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg">{area.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {area.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Analysis Process */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Our Analysis Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Data Collection</h3>
              <p className="text-muted-foreground text-sm">
                We continuously monitor competitors across multiple channels and data sources.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Data Analysis</h3>
              <p className="text-muted-foreground text-sm">
                AI algorithms analyze patterns, trends, and strategic moves to extract insights.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Insight Generation</h3>
              <p className="text-muted-foreground text-sm">
                Generate actionable insights and recommendations based on competitive analysis.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">4. Alert & Report</h3>
              <p className="text-muted-foreground text-sm">
                Deliver timely alerts and comprehensive reports to keep you informed.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Who Benefits from Competitor Analysis?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => {
              const IconComponent = useCase.icon;
              return (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-purple-500/10 flex-shrink-0">
                        <IconComponent className="h-8 w-8 text-purple-600" />
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

        {/* Key Benefits */}
        <div className="mb-20">
          <Card className="border-border/50 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Why Choose Our Competitor Analysis?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <Shield className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Comprehensive Coverage</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor all aspects of competitor activity across multiple channels
                  </p>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Real-Time Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant alerts when competitors make significant moves
                  </p>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Actionable Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Turn competitive intelligence into strategic advantages
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Competitor Analysis Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`border-border/50 bg-card/50 backdrop-blur-sm relative ${
                plan.popular ? 'ring-2 ring-purple-500/20 border-purple-500/30' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white border-purple-500">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white' 
                        : 'bg-card hover:bg-accent'
                    }`}
                    onClick={() => navigate('/register')}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-12 border border-purple-500/20">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-purple-600 font-medium">Start Today</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Outperform Your Competition?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join smart teams who use our competitor analysis to stay one step ahead 
            and make strategic decisions with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
              onClick={() => navigate('/register')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-purple-500/30 text-purple-600 hover:bg-purple-50"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            7-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </main>
    </div>
  );
};

export default CompetitorAnalysis;