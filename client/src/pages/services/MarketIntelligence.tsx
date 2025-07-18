import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Globe,
  Target,
  Zap,
  Shield,
  Clock,
  Database,
  Brain,
  Sparkles,
  PieChart,
  Activity,
  LineChart
} from "lucide-react";
import Header from "@/components/Header";

const MarketIntelligence = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Market Trends",
      description: "Monitor emerging trends, hot sectors, and market movements as they happen. Get insights into what's driving the Web3 ecosystem forward."
    },
    {
      icon: Database,
      title: "Comprehensive Data Sources",
      description: "Access data from 200+ sources including DeFiLlama, CoinGecko, social media, funding databases, and blockchain analytics platforms."
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze market patterns, predict trends, and identify opportunities before they become obvious."
    },
    {
      icon: PieChart,
      title: "Funding Landscape",
      description: "Track funding rounds, investment patterns, and capital flows across different Web3 sectors and geographic regions."
    },
    {
      icon: Activity,
      title: "Token Performance",
      description: "Monitor token price movements, trading volumes, and market cap changes across thousands of Web3 projects."
    },
    {
      icon: Shield,
      title: "Regulatory Insights",
      description: "Stay informed about regulatory developments and their potential impact on different Web3 sectors and projects."
    }
  ];

  const useCases = [
    {
      title: "Strategic Planning Teams",
      description: "Make informed decisions about market entry, product development, and resource allocation based on comprehensive market intelligence.",
      metrics: "70% better strategic decisions",
      icon: Target
    },
    {
      title: "Investment Firms",
      description: "Identify emerging sectors, track competition, and time investments perfectly with real-time market intelligence.",
      metrics: "45% higher ROI",
      icon: TrendingUp
    },
    {
      title: "Web3 Startups",
      description: "Understand your market position, identify opportunities, and track competitor movements to stay ahead.",
      metrics: "3x faster market analysis",
      icon: Users
    },
    {
      title: "Research Analysts",
      description: "Access comprehensive datasets and automated analysis tools to produce high-quality market research reports.",
      metrics: "80% time savings",
      icon: BarChart3
    }
  ];

  const dataPoints = [
    {
      category: "Market Coverage",
      metrics: [
        "50+ blockchain networks",
        "10,000+ active projects",
        "5,000+ funding rounds",
        "200+ data sources"
      ]
    },
    {
      category: "Analysis Depth",
      metrics: [
        "Real-time trend detection",
        "Predictive modeling",
        "Sentiment analysis",
        "Competitive intelligence"
      ]
    },
    {
      category: "Update Frequency",
      metrics: [
        "Live market data",
        "Daily trend reports",
        "Weekly deep dives",
        "Monthly market summaries"
      ]
    }
  ];

  const pricingPlans = [
    {
      name: "Analyst",
      price: "$149",
      period: "per month",
      description: "Essential market intelligence for individual analysts",
      features: [
        "Real-time market data",
        "Basic trend analysis",
        "Weekly reports",
        "Email alerts",
        "Standard support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$399",
      period: "per month",
      description: "Advanced intelligence for growing teams",
      features: [
        "Advanced AI analysis",
        "Custom dashboards",
        "Predictive insights",
        "API access",
        "Priority support",
        "Custom reports"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "Comprehensive intelligence for large organizations",
      features: [
        "White-label solutions",
        "Custom data models",
        "Dedicated analyst",
        "Real-time integrations",
        "SLA guarantees",
        "On-site training"
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
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <BarChart3 className="w-3 h-3 mr-1" />
            Market Intelligence & Analytics
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Stay Ahead of Web3 Market Trends
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Get comprehensive market intelligence that helps you understand Web3 trends, track funding activities, 
            and identify emerging opportunities before your competitors do.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
              onClick={() => navigate('/register')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-50"
            >
              View Sample Report
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Comprehensive Market Intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10">
                        <IconComponent className="h-6 w-6 text-emerald-600" />
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

        {/* Data Coverage */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Comprehensive Data Coverage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dataPoints.map((section, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-center">{section.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.metrics.map((metric, metricIndex) => (
                      <li key={metricIndex} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                        <span className="text-muted-foreground">{metric}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Who Uses Market Intelligence?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => {
              const IconComponent = useCase.icon;
              return (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-emerald-500/10 flex-shrink-0">
                        <IconComponent className="h-8 w-8 text-emerald-600" />
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

        {/* Intelligence Types */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Types of Market Intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Trend Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Identify emerging trends and market movements across all Web3 sectors
              </p>
            </Card>
            
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <PieChart className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Funding Intelligence</h3>
              <p className="text-sm text-muted-foreground">
                Track investment flows, funding rounds, and capital allocation patterns
              </p>
            </Card>
            
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Competitive Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Monitor competitor activities, strategies, and market positioning
              </p>
            </Card>
            
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <LineChart className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Performance Metrics</h3>
              <p className="text-sm text-muted-foreground">
                Track token performance, TVL, and key protocol metrics
              </p>
            </Card>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Market Intelligence Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`border-border/50 bg-card/50 backdrop-blur-sm relative ${
                plan.popular ? 'ring-2 ring-emerald-500/20 border-emerald-500/30' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-500 text-white border-emerald-500">
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
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white' 
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
        <div className="text-center bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-12 border border-emerald-500/20">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-600 font-medium">Start Today</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Make Data-Driven Decisions?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join industry leaders who rely on our market intelligence to stay ahead 
            of trends and make strategic decisions with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
              onClick={() => navigate('/register')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-50"
            >
              Request Demo
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

export default MarketIntelligence;