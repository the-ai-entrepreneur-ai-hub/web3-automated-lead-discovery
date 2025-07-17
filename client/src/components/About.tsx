import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Target, Users } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Who We Are
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're a team of Web3 professionals and AI engineers dedicated to revolutionizing how businesses discover and connect with emerging Web3 projects.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              The Web3 ecosystem evolves rapidly, with new projects launching daily. Traditional prospecting methods simply can't keep up. We built Web3Radar to bridge this gap, providing real-time, AI-curated lead intelligence that helps businesses stay ahead of the curve.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform combines advanced AI algorithms with comprehensive data aggregation to deliver the most relevant and timely Web3 project information, helping you discover opportunities before your competitors do.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                Start Your Free Trial
              </Button>
              <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Card className="card-web3">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Precision Targeting</h4>
                  <p className="text-sm text-muted-foreground">AI-powered matching to find your ideal prospects</p>
                </CardContent>
              </Card>
              <Card className="card-web3">
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Real-Time Updates</h4>
                  <p className="text-sm text-muted-foreground">Fresh data updated continuously from multiple sources</p>
                </CardContent>
              </Card>
              <Card className="card-web3">
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Data Security</h4>
                  <p className="text-sm text-muted-foreground">Enterprise-grade security and privacy protection</p>
                </CardContent>
              </Card>
              <Card className="card-web3">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Expert Support</h4>
                  <p className="text-sm text-muted-foreground">Dedicated support from Web3 industry experts</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="bg-card/50 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Trusted by Leading Web3 Companies
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            From emerging startups to established enterprises, companies across the Web3 ecosystem trust Web3Radar to fuel their growth and connect them with the next generation of innovative projects.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-2xl font-bold text-foreground">500+</div>
            <div className="text-2xl font-bold text-foreground">50k+</div>
            <div className="text-2xl font-bold text-foreground">98%</div>
            <div className="text-2xl font-bold text-foreground">24/7</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center text-sm text-muted-foreground mt-2">
            <div>Active Companies</div>
            <div>Leads Generated</div>
            <div>Satisfaction Rate</div>
            <div>Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;