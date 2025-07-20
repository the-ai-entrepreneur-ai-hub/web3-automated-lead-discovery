import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();
  const plans = [
    {
      name: "Free Plan",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out our platform",
      features: [
        "Access to 100 companies",
        "48-hour scraper run time",
        "Basic search functionality",
        "Community support",
        "View project details"
      ],
      limitations: [
        "No data export",
        "No advanced filters",
        "Limited access"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Pro Plan",
      price: "$99",
      period: "per month",
      description: "For serious business development teams",
      features: [
        "Unlimited company access",
        "24/7 continuous scraping",
        "Advanced search & filters",
        "CSV data export",
        "Priority email support",
        "Real-time updates",
        "Contact information access",
        "Social media links",
        "Funding data when available"
      ],
      limitations: [],
      cta: "Start 14-Day Free Trial",
      popular: true
    }
  ];

  return (
    <section className="py-20 px-6 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
            Simple, Transparent
            <span className="block text-primary">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free and upgrade when you're ready to scale. 
            No hidden fees, no long-term contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`card-web3 relative ${plan.popular ? 'border-primary glow-effect' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <div className="font-semibold text-primary mb-3">What's included:</div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div>
                    <div className="font-semibold text-muted-foreground mb-3">Limitations:</div>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5">×</span>
                          <span className="text-muted-foreground">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button 
                  className={`w-full ${plan.popular ? 'btn-web3' : ''}`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  onClick={() => navigate(plan.popular ? '/register' : '/register')}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Need a custom solution? <a href="#contact" className="text-primary hover:underline">Contact our sales team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;