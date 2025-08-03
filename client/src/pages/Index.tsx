import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DemoSection from "@/components/DemoSection";
import Features from "@/components/Features";
import About from "@/components/About";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle hash navigation for anchor links
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = location.hash;
      if (hash) {
        // Wait for component to render then scroll to element
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    };

    handleHashNavigation();
  }, [location.hash]);

  useEffect(() => {
    // Check if user is already logged in and redirect to dashboard
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      console.log('🔄 User already authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <section id="demo-section">
          <DemoSection />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <section id="careers">
          <div className="py-20 px-6 max-w-7xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Join Our Team
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                We're building the future of Web3 prospecting. Join our mission to revolutionize how businesses discover and connect with Web3 opportunities.
              </p>
              <div className="text-muted-foreground">
                <p>Exciting opportunities coming soon. Stay tuned for updates!</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;