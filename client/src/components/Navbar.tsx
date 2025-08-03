import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-pulse">
              <span className="text-primary-foreground font-bold text-sm">W3R</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              Web3<span className="text-primary">Radar</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="/#pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="/#about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-primary"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button 
              className="btn-web3"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            <div className="space-y-1">
              <div className="w-5 h-0.5 bg-foreground"></div>
              <div className="w-5 h-0.5 bg-foreground"></div>
              <div className="w-5 h-0.5 bg-foreground"></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-4 pb-6 space-y-4">
              <a href="/#features" className="block text-muted-foreground hover:text-primary transition-colors py-2">
                Features
              </a>
              <a href="/#pricing" className="block text-muted-foreground hover:text-primary transition-colors py-2">
                Pricing
              </a>
              <a href="/#about" className="block text-muted-foreground hover:text-primary transition-colors py-2">
                About
              </a>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors py-2">
                Contact
              </Link>
              <div className="pt-4 space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-primary"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button 
                  className="w-full btn-web3"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;