import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp, Users, Shield } from "lucide-react";

const DemoSection = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Demo projects data
  const demoProjects = [
    {
      id: 1,
      name: "AuroraSwap",
      description: "Next-generation AMM protocol built on Aurora blockchain with advanced yield farming mechanisms",
      status: "Active",
      source: "CryptoRank",
      website: "https://auroraswap.example",
      email: "contact@auroraswap.example",
      twitter: "https://twitter.com/auroraswap",
      linkedin: "https://linkedin.com/company/auroraswap",
      dateAdded: "2024-01-15",
      funding: "$2.5M",
      category: "DeFi"
    },
    {
      id: 2,
      name: "MetaVault",
      description: "Decentralized asset management platform offering institutional-grade portfolio tools for crypto investors",
      status: "New Lead",
      source: "ICO Drops",
      website: "https://metavault.example",
      email: "hello@metavault.example",
      twitter: "https://twitter.com/metavault",
      linkedin: "https://linkedin.com/company/metavault",
      dateAdded: "2024-01-12",
      funding: "$5.2M",
      category: "Asset Management"
    },
    {
      id: 3,
      name: "ChainBridge",
      description: "Cross-chain interoperability solution enabling seamless asset transfers between major blockchains",
      status: "In Progress",
      source: "CoinMarketCap",
      website: "https://chainbridge.example",
      email: "team@chainbridge.example",
      twitter: "https://twitter.com/chainbridge",
      linkedin: "https://linkedin.com/company/chainbridge",
      dateAdded: "2024-01-10",
      funding: "$8.7M",
      category: "Infrastructure"
    },
    {
      id: 4,
      name: "TokenFlow",
      description: "AI-powered token analytics platform providing real-time market insights and trading signals",
      status: "New Lead",
      source: "DeFiLlama",
      website: "https://tokenflow.example",
      email: "info@tokenflow.example",
      twitter: "https://twitter.com/tokenflow",
      linkedin: "https://linkedin.com/company/tokenflow",
      dateAdded: "2024-01-08",
      funding: "$3.1M",
      category: "Analytics"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "New Lead": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "In Progress": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">Live Demo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            See Web3Radar in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore a curated selection of Web3 projects with real-time data, contact information, and market insights
          </p>
        </div>

        {/* Demo Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {demoProjects.map((project, index) => (
            <Card 
              key={project.id} 
              className={`card-web3 hover:glow-effect transition-all duration-500 ${
                hoveredCard === index ? 'transform scale-[1.02] shadow-2xl' : ''
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl text-primary">{project.name}</CardTitle>
                      <Badge className={`${getStatusColor(project.status)} text-xs`}>
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Source:</span>
                    <div className="font-medium text-foreground">{project.source}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Funding:</span>
                    <div className="font-medium text-primary">{project.funding}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <div className="font-medium text-foreground">{project.category}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date Added:</span>
                    <div className="font-medium text-foreground">{project.dateAdded}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Website:</span>
                    <span className="ml-2 text-primary">{project.website}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="ml-2 text-foreground">{project.email}</span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span className="text-muted-foreground">Social:</span>
                    <span className="text-primary">Twitter</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-primary">LinkedIn</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-primary to-primary/80">
                    Add to Pipeline
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Professional CTA Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 md:p-12">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">Full Access</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                More Web3 Project Leads? No Problem...
              </h3>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                This is just a glimpse of what's possible. Get access to our complete database of 
                <span className="text-primary font-semibold"> 10,000+ Web3 projects</span>, 
                advanced filtering tools, real-time updates, and AI-powered insights.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center p-4 bg-card/30 rounded-lg border border-primary/10">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">10,000+ Projects</h4>
                  <p className="text-sm text-muted-foreground text-center">Comprehensive database updated daily</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-card/30 rounded-lg border border-primary/10">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-3">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Real-time Updates</h4>
                  <p className="text-sm text-muted-foreground text-center">Stay ahead with instant notifications</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-card/30 rounded-lg border border-primary/10">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-3">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Verified Data</h4>
                  <p className="text-sm text-muted-foreground text-center">Accurate, verified contact information</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-3 text-lg font-semibold group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                  onClick={() => navigate('/register')}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                No credit card required • 7-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;