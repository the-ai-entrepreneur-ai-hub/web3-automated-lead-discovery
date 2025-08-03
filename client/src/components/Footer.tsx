import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg"></div>
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-md animate-[slowFloat_4s_ease-in-out_infinite]"></div>
              </div>
              <span className="text-xl font-bold text-foreground">
                Web3<span className="text-primary">Radar</span>
              </span>
            </div>
            <p className="text-muted-foreground">
              Automate your Web3 prospecting and discover new projects with our AI-powered platform.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold">Product</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="/#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><Link to="/api" className="hover:text-primary transition-colors">API</Link></li>
              <li><a href="/#features" className="hover:text-primary transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/#about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="/#careers" className="hover:text-primary transition-colors">Careers</a></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><a href="/#about" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/help-center" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/documentation" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-muted-foreground">
              © {currentYear} Web3Leads. All rights reserved.
            </p>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mt-4 md:mt-0">
              <div className="text-muted-foreground text-sm">
                Social media coming soon. Contact us at{" "}
                <a href="mailto:support@rawfreedomai.com" className="text-primary hover:underline">
                  support@rawfreedomai.com
                </a>{" "}
                or{" "}
                <a href="tel:+420603365013" className="text-primary hover:underline">
                  +420603365013
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;