import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center hero-bg network-bg relative overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <img
          src="./lovable-uploads/398ca217-7313-49b0-a990-12400b5781dc.png"
          alt="Web3 Radar Visualization"
          className="w-full h-full object-contain max-w-4xl"
        />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-primary rounded-full animate-float opacity-60"></div>
      <div className="absolute top-32 right-32 w-6 h-6 bg-primary rounded-full animate-float opacity-40" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-40 left-40 w-3 h-3 bg-primary rounded-full animate-float opacity-80" style={{animationDelay: '2s'}}></div>
      
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        {/* Main Hero Content */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Web3<span className="text-primary">Radar</span>
            <span className="block text-glow">Discovery</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Automate your Web3 prospecting with our AI-powered platform. 
            <span className="text-primary font-semibold"> Discover new projects</span>, 
            <span className="text-primary font-semibold"> extract contact data</span>, and 
            <span className="text-primary font-semibold"> close more deals</span> - all in one place.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button 
            size="lg" 
            className="btn-web3 px-8 py-4 text-lg font-semibold"
            onClick={() => navigate('/register')}
          >
            Start Free Trial
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg"
            onClick={() => window.open('https://calendly.com/filip-kollertfilip/30min?month=2025-08', '_blank')}
          >
            Book a Call
          </Button>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card-web3 p-6 rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-muted-foreground">Web3 Projects Tracked</div>
          </div>
          <div className="card-web3 p-6 rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">80%</div>
            <div className="text-muted-foreground">Time Saved on Prospecting</div>
          </div>
          <div className="card-web3 p-6 rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">Automated Monitoring</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-bounce">
          <ArrowDown className="w-6 h-6 mx-auto text-primary opacity-60" />
        </div>
      </div>
    </section>
  );
};

export default Hero;