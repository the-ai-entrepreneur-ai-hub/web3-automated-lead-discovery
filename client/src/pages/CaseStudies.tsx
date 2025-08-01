import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, DollarSign, Clock, Star } from "lucide-react";
import Header from "@/components/Header";

const CaseStudies = () => {
  const caseStudies = [
    {
      id: 1,
      title: "DeFi Startup Scales to $50M TVL",
      client: "DeFiVault Protocol",
      industry: "DeFi",
      image: "./lovable-uploads/e32f88c6-95cd-477e-a3c7-135bd8195930.png",
      challenge: "A new DeFi protocol needed to identify and engage with liquidity providers and yield farmers to bootstrap their platform.",
      solution: "Used Web3Radar to identify 2,500+ active DeFi users across 15 protocols, targeting high-value liquidity providers.",
      results: {
        metric1: { label: "TVL Growth", value: "$50M", icon: DollarSign },
        metric2: { label: "Active Users", value: "12,000+", icon: Users },
        metric3: { label: "Time to Market", value: "3 months", icon: Clock },
        metric4: { label: "ROI", value: "2,400%", icon: TrendingUp }
      },
      testimonial: "Web3Radar helped us identify the right DeFi users who became our core liquidity providers. The targeting precision was incredible.",
      author: "Sarah Chen, Co-founder",
      tags: ["DeFi", "Lead Generation", "Growth"],
      duration: "3 months"
    },
    {
      id: 2,
      title: "NFT Marketplace Reaches 100K Users",
      client: "ArtChain Marketplace",
      industry: "NFTs",
      image: "./lovable-uploads/4ab4d2bb-7213-4b49-8f09-cb1ae96595fe.png",
      challenge: "An NFT marketplace needed to connect with active collectors and creators to build a vibrant ecosystem.",
      solution: "Leveraged Web3Radar to identify 5,000+ NFT collectors and 1,200+ verified creators across major marketplaces.",
      results: {
        metric1: { label: "User Growth", value: "100K+", icon: Users },
        metric2: { label: "Trading Volume", value: "$25M", icon: DollarSign },
        metric3: { label: "Creator Onboarding", value: "1,200+", icon: Star },
        metric4: { label: "Market Share", value: "15%", icon: TrendingUp }
      },
      testimonial: "The quality of leads from Web3Radar was outstanding. We onboarded top-tier creators who brought their communities with them.",
      author: "Marcus Thompson, Head of Growth",
      tags: ["NFTs", "Marketplace", "Creator Economy"],
      duration: "6 months"
    },
    {
      id: 3,
      title: "Gaming DAO Builds 50K Community",
      client: "PlayToEarn Alliance",
      industry: "Gaming",
      image: "./lovable-uploads/39661301-d71f-4dc7-9970-c1f08082b338.png",
      challenge: "A gaming DAO needed to identify and recruit serious GameFi players and guild leaders for their ecosystem.",
      solution: "Utilized Web3Radar to map the GameFi landscape and identify 8,000+ active players and 200+ guild leaders.",
      results: {
        metric1: { label: "Community Size", value: "50K+", icon: Users },
        metric2: { label: "Guild Partners", value: "200+", icon: Star },
        metric3: { label: "Monthly Revenue", value: "$500K", icon: DollarSign },
        metric4: { label: "Player Retention", value: "75%", icon: TrendingUp }
      },
      testimonial: "Web3Radar's data helped us build the most engaged gaming community in the space. The guild partnerships were game-changing.",
      author: "Alex Rivera, Community Lead",
      tags: ["Gaming", "DAO", "Community Building"],
      duration: "4 months"
    },
    {
      id: 4,
      title: "Web3 Infrastructure Raises $20M",
      client: "ChainLink Solutions",
      industry: "Infrastructure",
      image: "./lovable-uploads/0d560163-3c3f-4d9e-8e8e-0ae7f2bf117d.png",
      challenge: "A Web3 infrastructure company needed to connect with enterprise clients and technical decision-makers.",
      solution: "Deployed Web3Radar to identify 500+ enterprise blockchain decision-makers and 1,000+ technical leads.",
      results: {
        metric1: { label: "Funding Raised", value: "$20M", icon: DollarSign },
        metric2: { label: "Enterprise Clients", value: "50+", icon: Users },
        metric3: { label: "Integration Partners", value: "100+", icon: Star },
        metric4: { label: "Revenue Growth", value: "800%", icon: TrendingUp }
      },
      testimonial: "The enterprise leads we found through Web3Radar directly contributed to our Series A success. The data quality was exceptional.",
      author: "David Kim, VP of Sales",
      tags: ["Infrastructure", "Enterprise", "B2B"],
      duration: "8 months"
    },
    {
      id: 5,
      title: "Metaverse Platform Scales to 1M Users",
      client: "VirtualWorlds Inc",
      industry: "Metaverse",
      image: "./lovable-uploads/8c3f1f57-bfd1-4d77-aa25-8518722c3878.png",
      challenge: "A metaverse platform needed to identify virtual world enthusiasts and land investors for their new platform.",
      solution: "Used Web3Radar to discover 10,000+ metaverse users and 2,000+ virtual real estate investors across platforms.",
      results: {
        metric1: { label: "User Base", value: "1M+", icon: Users },
        metric2: { label: "Land Sales", value: "$15M", icon: DollarSign },
        metric3: { label: "Active Builders", value: "5,000+", icon: Star },
        metric4: { label: "Daily Active Users", value: "100K+", icon: TrendingUp }
      },
      testimonial: "Web3Radar helped us identify the right metaverse enthusiasts who became our most valuable community members and land buyers.",
      author: "Lisa Park, Product Manager",
      tags: ["Metaverse", "Virtual Real Estate", "Community"],
      duration: "5 months"
    },
    {
      id: 6,
      title: "DeFi Analytics Platform Reaches $5M ARR",
      client: "DataChain Analytics",
      industry: "Analytics",
      image: "./lovable-uploads/171c74a3-9894-44e5-a9ee-4107954d54f1.png",
      challenge: "A DeFi analytics platform needed to find institutional investors and professional traders for their premium service.",
      solution: "Leveraged Web3Radar to identify 3,000+ institutional DeFi users and 5,000+ professional traders.",
      results: {
        metric1: { label: "Annual Revenue", value: "$5M", icon: DollarSign },
        metric2: { label: "Enterprise Clients", value: "100+", icon: Users },
        metric3: { label: "Premium Users", value: "10K+", icon: Star },
        metric4: { label: "User Retention", value: "90%", icon: TrendingUp }
      },
      testimonial: "The institutional leads from Web3Radar became our highest-value customers. The platform paid for itself within the first month.",
      author: "Robert Chen, CEO",
      tags: ["Analytics", "B2B", "Institutional"],
      duration: "6 months"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Success Stories
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Real Results from Real Clients
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how Web3Radar has helped leading companies build communities, 
            scale their platforms, and achieve remarkable growth in the Web3 space.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {caseStudies.map((study) => (
            <Card key={study.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted/20">
                  <img 
                    src={study.image} 
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {study.industry}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {study.duration}
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-2">{study.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {study.client}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Challenge & Solution */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-2">Challenge</h4>
                    <p className="text-sm text-muted-foreground">{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-2">Solution</h4>
                    <p className="text-sm text-muted-foreground">{study.solution}</p>
                  </div>
                </div>

                {/* Results Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Object.entries(study.results).map(([key, result]) => (
                    <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
                      <div className="p-2 rounded-full bg-primary/10">
                        <result.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-foreground">{result.value}</div>
                        <div className="text-xs text-muted-foreground">{result.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Testimonial */}
                <div className="bg-muted/20 rounded-lg p-4 mb-4">
                  <blockquote className="text-sm italic text-muted-foreground mb-3">
                    "{study.testimonial}"
                  </blockquote>
                  <div className="text-xs font-medium text-foreground">
                    — {study.author}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {study.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of Web3 companies that have transformed their growth with Web3Radar's 
            AI-powered lead generation and market intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary/20 text-primary hover:bg-primary/10"
              onClick={() => {
                window.open('https://calendly.com/filip-kollertfilip/30min?month=2025-08', '_blank');
              }}
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseStudies;