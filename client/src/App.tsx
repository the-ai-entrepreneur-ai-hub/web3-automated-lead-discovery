import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LogoutNotification from "./components/LogoutNotification";
import BackgroundShader from "./components/BackgroundShader";

// Lazy load components for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Settings = lazy(() => import("./pages/Settings"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const BestPractices = lazy(() => import("./pages/BestPractices"));
const Community = lazy(() => import("./pages/Community"));
const LeadGenerationStrategies = lazy(() => import("./pages/articles/LeadGenerationStrategies"));
const CommunityBuilding = lazy(() => import("./pages/articles/CommunityBuilding"));
const Web3Analytics = lazy(() => import("./pages/articles/Web3Analytics"));
const Services = lazy(() => import("./pages/Services"));
const LeadDiscovery = lazy(() => import("./pages/services/LeadDiscovery"));
const MarketIntelligence = lazy(() => import("./pages/services/MarketIntelligence"));
const CompetitorAnalysis = lazy(() => import("./pages/services/CompetitorAnalysis"));
const ContactEnrichment = lazy(() => import("./pages/services/ContactEnrichment"));
const About = lazy(() => import("./pages/About"));
const AuthSuccess = lazy(() => import("./pages/AuthSuccess"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full animate-pulse"></div>
        <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded-full animate-ping"></div>
      </div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

function App() {
  // Debug: Log environment variables on app load
  console.log('Environment Debug:', {
    API_URL: import.meta.env.VITE_API_URL,
    NODE_ENV: import.meta.env.NODE_ENV,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  });

  return (
    <Router>
      <LogoutNotification />
      {/* Global shader background behind all content */}
      <BackgroundShader />
      <div className="relative z-10">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth-success" element={<AuthSuccess />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/best-practices" element={<BestPractices />} />
            <Route path="/community" element={<Community />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/lead-discovery" element={<LeadDiscovery />} />
            <Route path="/services/market-intelligence" element={<MarketIntelligence />} />
            <Route path="/services/competitor-analysis" element={<CompetitorAnalysis />} />
            <Route path="/services/contact-enrichment" element={<ContactEnrichment />} />
            <Route path="/articles/lead-generation-strategies" element={<LeadGenerationStrategies />} />
            <Route path="/articles/community-building" element={<CommunityBuilding />} />
            <Route path="/articles/web3-analytics" element={<Web3Analytics />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
