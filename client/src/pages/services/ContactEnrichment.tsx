import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Phone,
  Target,
  Zap,
  Shield,
  Clock,
  Globe,
  Search,
  Database,
  Sparkles,
  UserCheck,
  MessageSquare,
  Linkedin
} from "lucide-react";
import Header from "@/components/Header";

const ContactEnrichment = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: "Email Discovery",
      description: "Find verified business email addresses for key decision makers at Web3 companies with 95% accuracy guarantee."
    },
    {
      icon: UserCheck,
      title: "Decision Maker Identification",
      description: "Identify the right people to contact - from founders and CTOs to business development managers and investors."
    },
    {
      icon: Database,
      title: "Contact Verification",
      description: "All email addresses are verified in real-time to ensure high deliverability and avoid bounce rates."
    },
    {
      icon: Linkedin,
      title: "Social Profile Mapping",
      description: "Get complete LinkedIn, Twitter, and GitHub profiles to understand background and connection opportunities."
    },
    {
      icon: MessageSquare,
      title: "Personalized Templates",
      description: "AI-generated personalized outreach templates based on company information and contact background."
    },
    {
      icon: Zap,
      title: "CRM Integration",
      description: "Seamlessly integrate with Salesforce, HubSpot, Pipedrive, and other popular CRM platforms."
    }
  ];

  const enrichmentData = [
    {
      category: "Contact Information",
      items: [
        "Business email addresses",
        "Phone numbers",
        "LinkedIn profiles",
        "Twitter handles",
        "GitHub profiles"
      ],
      icon: Mail
    },
    {
      category: "Professional Data",
      items: [
        "Job titles and roles",
        "Company departments",
        "Years of experience",
        "Previous companies",
        "Educational background"
      ],
      icon: Users
    },
    {
      category: "Company Context",
      items: [
        "Company size and stage",
        "Funding information",
        "Technology stack",
        "Recent news and updates",
        "Partnership history"
      ],
      icon: Globe
    },
    {
      category: "Engagement Insights",
      items: [
        "Social media activity",
        "Content preferences",
        "Communication patterns",
        "Optimal outreach timing",
        "Response likelihood"
      ],
      icon: TrendingUp
    }
  ];

  const useCases = [
    {
      title: "Sales Teams",
      description: "Connect with decision makers faster and increase response rates with verified contact information and personalized outreach.",
      metrics: "60% higher response rates",
      icon: Target
    },
    {
      title: "Business Development",
      description: "Identify and reach key stakeholders for partnerships, integrations, and strategic alliances in the Web3 space.",
      metrics: "3x more qualified meetings",
      icon: Users
    },
    {
      title: "Marketing Teams",
      description: "Build targeted email campaigns with accurate contact data and personalized messaging for better engagement.",
      metrics: "45% better open rates",
      icon: Mail
    },
    {
      title: "Investor Relations",
      description: "Connect with potential investors, advisors, and partners using comprehensive contact profiles and insights.",
      metrics: "50% faster deal sourcing",
      icon: TrendingUp
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$79",
      period: "per month",
      description: "Perfect for small teams and individual professionals",
      features: [
        "Up to 1,000 enriched contacts",
        "Email verification",
        "Basic social profiles",
        "CSV export",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$199",
      period: "per month",
      description: "Ideal for growing sales and marketing teams",
      features: [
        "Up to 5,000 enriched contacts",
        "Full profile enrichment",
        "CRM integrations",
        "Email templates",
        "Priority support",
        "Advanced analytics"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large organizations with high-volume needs",
      features: [
        "Unlimited enrichment",
        "Custom integrations",
        "Dedicated account manager",
        "White-label solutions",
        "API access",
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
              onClick={() => navigate('/register')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-orange-500/30 text-orange-600 hover:bg-orange-50"
            >
              See Sample Data
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Complete Contact Intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
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

        {/* Data Enrichment */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            What We Enrich
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enrichmentData.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-orange-500/10">
                        <IconComponent className="h-6 w-6 text-orange-600" />
                      </div>
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
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

        {/* Process Flow */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            How Contact Enrichment Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Data Discovery</h3>
              <p className="text-muted-foreground text-sm">
                We search across multiple data sources to find contact information and professional details.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Verification</h3>
              <p className="text-muted-foreground text-sm">
                All contact information is verified in real-time to ensure accuracy and deliverability.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Enrichment</h3>
              <p className="text-muted-foreground text-sm">
                We compile comprehensive profiles with social media, professional history, and context.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">4. Delivery</h3>
              <p className="text-muted-foreground text-sm">
                Enriched contacts are delivered through your preferred method - CRM, CSV, or API.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Who Benefits from Contact Enrichment?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => {
              const IconComponent = useCase.icon;
              return (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-orange-500/10 flex-shrink-0">
                        <IconComponent className="h-8 w-8 text-orange-600" />
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

        {/* Quality Guarantee */}
        <div className="mb-20">
          <Card className="border-border/50 bg-gradient-to-r from-orange-500/5 to-red-500/5 border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Our Quality Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">95% Accuracy</h3>
                  <p className="text-muted-foreground">
                    Our email verification ensures 95% accuracy rate for all contact information
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Real-Time Updates</h3>
                  <p className="text-muted-foreground">
                    Contact information is updated in real-time to maintain accuracy
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">GDPR Compliant</h3>
                  <p className="text-muted-foreground">
                    All data collection and processing is fully GDPR and privacy compliant
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Contact Enrichment Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`border-border/50 bg-card/50 backdrop-blur-sm relative ${
                plan.popular ? 'ring-2 ring-orange-500/20 border-orange-500/30' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white border-orange-500">
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
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white' 
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
        <div className="text-center bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-12 border border-orange-500/20">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-orange-600 font-medium">Start Today</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Connect with Decision Makers?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your outreach with verified contact information and personalized messaging. 
            Join thousands of professionals who trust our enrichment platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
              onClick={() => navigate('/register')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-orange-500/30 text-orange-600 hover:bg-orange-50"
            >
              See Sample Data
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

export default ContactEnrichment;