import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import ExportModal from "@/components/ExportModal";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/lib/types";
import { stripeApi } from "@/lib/stripe";
import { config } from "@/lib/config";

interface LeadAnalysis {
  state: string;
  value: string | null;
  isStale: boolean;
  errorType?: string;
}

interface Project {
  "Lead ID": string;
  "Website": string;
  "Status": string;
  "Source": string;
  "Deduplication Key": string;
  "Lead Summary": LeadAnalysis;
  "Competitor Analysis": LeadAnalysis;
  "Twitter": string;
  "LinkedIn": string;
  "Email": string;
  "Date Added": string;
  "Telegram": string;
  "Project Name": string;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [user, setUser] = useState<User | null>(null);
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [activeDiscountCode, setActiveDiscountCode] = useState<string | null>(null);
  const [trialInfo, setTrialInfo] = useState<{daysLeft: number; isExpiring: boolean} | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const navigate = useNavigate();

  // Check for payment status in URL and active discount code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    
    if (payment === 'success') {
      setPaymentStatus('Payment successful! Your account has been upgraded to Pro.');
      // Clear discount code after successful payment
      localStorage.removeItem('appliedDiscountCode');
      setActiveDiscountCode(null);
      // Refresh subscription data after successful payment
      setTimeout(refreshSubscriptionStatus, 2000);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname + '#/dashboard');
    } else if (payment === 'canceled') {
      setPaymentStatus('Payment was canceled. You can try again anytime.');
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname + '#/dashboard');
    }
    
    // Check for active discount code
    const storedDiscountCode = localStorage.getItem('appliedDiscountCode');
    setActiveDiscountCode(storedDiscountCode);
  }, []);

  // Refresh subscription status
  const refreshSubscriptionStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const data = await stripeApi.getSubscriptionStatus(token);
      setSubscriptionData(data);
      
      // Check trial status if user is on trial
      if (data.subscriptionStatus === 'trialing' && data.trialEnd) {
        const trialEndDate = new Date(data.trialEnd);
        const now = new Date();
        const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        const isExpiring = daysLeft <= 2; // Show warning if 2 days or less
        
        setTrialInfo({ daysLeft, isExpiring });
        console.log('🗓️ Trial info:', { daysLeft, isExpiring, trialEnd: data.trialEnd });
      } else {
        setTrialInfo(null);
      }
      
      // Update user data in localStorage if tier changed
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.tier !== data.tier) {
          userData.tier = data.tier;
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    }
  };

  // Enhanced authentication check with retry logic
  const fetchData = useCallback(async () => {
    console.log('🔍 Dashboard: Checking authentication...');
    const token = localStorage.getItem("token");
    console.log('🎫 Token found:', token ? 'YES' : 'NO');
    
    if (!token) {
      console.log('❌ No token found, redirecting to login');
      navigate("/login");
      return;
    }
    
    // Validate token format
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.log('❌ Invalid token format, clearing and redirecting');
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }
    
    console.log('✅ Valid token found, proceeding with data fetch');

    setIsLoading(true);
    setProjectsLoading(true);

    try {
      // Fetch user and projects in parallel for better performance
      const [userResponse, projectsResponse] = await Promise.all([
        fetch(`${config.API_URL}/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${config.API_URL}/projects`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      // Handle user response
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else if (userResponse.status === 401 || userResponse.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      // Handle projects response
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
        // Cache projects data for 5 minutes
        localStorage.setItem("projects", JSON.stringify({
          data: projectsData,
          timestamp: Date.now()
        }));
      } else if (projectsResponse.status === 401 || projectsResponse.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
      setProjectsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Check for cached projects data first
    const cachedProjects = localStorage.getItem("projects");
    if (cachedProjects) {
      try {
        const { data, timestamp } = JSON.parse(cachedProjects);
        const cacheAge = Date.now() - timestamp;
        // Use cached data if it's less than 5 minutes old
        if (cacheAge < 5 * 60 * 1000) {
          setProjects(data);
          setProjectsLoading(false);
        }
      } catch (error) {
        console.error('Error parsing cached projects:', error);
      }
    }

    // Check for cached user data
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      try {
        const userData = JSON.parse(cachedUser);
        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing cached user:', error);
      }
    }

    // Initial authentication check with adaptive delay
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        // Token exists, fetch data immediately
        fetchData();
      } else {
        // No token, wait a bit for OAuth flow to complete, then check again
        setTimeout(() => {
          const retryToken = localStorage.getItem("token");
          if (retryToken) {
            fetchData();
          } else {
            console.log('⏰ No token after retry, redirecting to login');
            navigate("/login");
          }
        }, 500);
      }
    };

    checkAuth();
  }, [fetchData]);


  const handleExport = () => {
    if (user?.tier === 'paid') {
      setIsExportModalOpen(true);
    } else {
      // Free users: Limited data (50 leads, project name and website only)
      if (projects.length === 0) {
        return;
      }
      
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const timestamp = now.toTimeString().split(' ')[0].replace(/:/g, '');
      
      const limitedProjects = projects.slice(0, 50);
      const headers = ["Project Name", "Website"];
      const csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(",") + "\n"
        + limitedProjects.map(p => `"${p["Project Name"]}","${p.Website}"`).join("\n");
      const filename = `web3-project-leads-sample-${date}&${timestamp}.csv`;
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleLoadMore = () => {
    setVisibleProjects(prevVisibleProjects => prevVisibleProjects + 6);
  };

  const handleUpgrade = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Get stored discount code if available
      const storedDiscountCode = localStorage.getItem('appliedDiscountCode');
      console.log('🏷️ Using stored discount code:', storedDiscountCode || 'NONE');

      setPaymentStatus('Redirecting to secure payment...');
      const response = await stripeApi.createCheckoutSession(token, storedDiscountCode || undefined);
      
      if (response.success && response.url) {
        console.log('🔄 Redirecting to Stripe checkout:', response.url);
        console.log('💳 Checkout details:', {
          scenario: response.scenario,
          amount: response.amount,
          trialDays: response.trialDays,
          hasDiscount: response.hasDiscount
        });
        window.location.href = response.url;
      } else {
        throw new Error(response.error || 'Failed to get checkout URL');
      }
    } catch (error) {
      console.error('❌ Error upgrading:', error);
      setPaymentStatus('Failed to start upgrade process. Please try again.');
      setTimeout(() => setPaymentStatus(null), 5000);
    }
  };

  const categories = ["All", "Recently Added", "Has Contact Info", "Early Stage", "Mainnet Live", "Token Launch", "Hiring"];
  
  // Calculate dynamic stats from actual project data
  const stats = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const newThisWeek = projects.filter(project => {
      const dateAdded = new Date(project["Date Added"]);
      return dateAdded >= oneWeekAgo;
    }).length;
    
    const newLastWeek = projects.filter(project => {
      const dateAdded = new Date(project["Date Added"]);
      return dateAdded >= twoWeeksAgo && dateAdded < oneWeekAgo;
    }).length;
    
    const withContactInfo = projects.filter(project => {
      return !!(project.Email && project.Email.trim() && 
               project.Email !== 'N/A' && 
               project.Email.includes('@'));
    }).length;
    
    const weekOverWeekChange = newLastWeek > 0 
      ? Math.round(((newThisWeek - newLastWeek) / newLastWeek) * 100)
      : newThisWeek > 0 ? 100 : 0;
    
    const contactInfoPercentage = projects.length > 0 
      ? Math.round((withContactInfo / projects.length) * 100)
      : 0;
    
    return {
      total: projects.length,
      newThisWeek,
      weekOverWeekChange,
      withContactInfo,
      contactInfoPercentage
    };
  }, [projects]);
  
  // Memoize expensive filtering and sorting operations
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = (project["Project Name"] && project["Project Name"].toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (project["Lead Summary"] && project["Lead Summary"].value && project["Lead Summary"].value.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchesCategory = true;
      if (selectedCategory !== "All") {
        const dateAdded = new Date(project["Date Added"]);
        const daysSinceAdded = Math.floor((Date.now() - dateAdded.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (selectedCategory) {
          case "Recently Added":
            matchesCategory = daysSinceAdded <= 7;
            break;
          case "Has Contact Info":
            matchesCategory = !!(project.Email && project.Email.trim() && 
                              project.Email !== 'N/A' && 
                              project.Email.includes('@'));
            break;
          case "Early Stage":
            matchesCategory = daysSinceAdded <= 30 || 
                            (project["Lead Summary"] && project["Lead Summary"].value && 
                             project["Lead Summary"].value.toLowerCase().includes("early"));
            break;
          case "Mainnet Live":
            matchesCategory = project["Lead Summary"] && project["Lead Summary"].value && 
                            (project["Lead Summary"].value.toLowerCase().includes("mainnet") || 
                             project["Lead Summary"].value.toLowerCase().includes("live") ||
                             project["Lead Summary"].value.toLowerCase().includes("launched"));
            break;
          case "Token Launch":
            matchesCategory = project["Lead Summary"] && project["Lead Summary"].value && 
                            (project["Lead Summary"].value.toLowerCase().includes("token") || 
                             project["Lead Summary"].value.toLowerCase().includes("launch") ||
                             project["Lead Summary"].value.toLowerCase().includes("ico"));
            break;
          case "Hiring":
            matchesCategory = project.LinkedIn || 
                            (project["Lead Summary"] && project["Lead Summary"].value && 
                             project["Lead Summary"].value.toLowerCase().includes("hiring"));
            break;
          default:
            matchesCategory = true;
        }
      }
      
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      // Sort by date added (most recent first)
      const dateA = new Date(a["Date Added"]);
      const dateB = new Date(b["Date Added"]);
      return dateB.getTime() - dateA.getTime();
    });
  }, [projects, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Payment Status Message */}
      {paymentStatus && (
        <div className={`mx-6 mt-4 px-6 py-3 rounded-lg border ${
          paymentStatus.includes('successful') 
            ? 'bg-green-500/10 border-green-500/20 text-green-700' 
            : paymentStatus.includes('canceled') 
            ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700'
            : paymentStatus.includes('Redirecting') || paymentStatus.includes('secure')
            ? 'bg-blue-500/10 border-blue-500/20 text-blue-700'
            : 'bg-red-500/10 border-red-500/20 text-red-700'
        }`}>
          <div className="flex items-center justify-between">
            <span>{paymentStatus}</span>
            <button 
              onClick={() => setPaymentStatus(null)}
              className="ml-4 text-current opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Trial Expiration Warning */}
      {trialInfo && trialInfo.isExpiring && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">⏰</span>
                <div>
                  <div className="font-bold text-lg">
                    Trial Ending {trialInfo.daysLeft === 0 ? 'Today' : `in ${trialInfo.daysLeft} day${trialInfo.daysLeft === 1 ? '' : 's'}`}!
                  </div>
                  <div className="text-sm opacity-90">
                    Upgrade now to keep access to premium features
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleUpgrade}
                className="bg-white text-orange-600 hover:bg-orange-50 font-semibold"
              >
                Upgrade Now - $99/month
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Dashboard Content Header */}
      <div className="bg-card/50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Web3Radar Latest Curated Leads
              </h1>
              <p className="text-muted-foreground">
                Get and connect with the latest Web3 projects leads with just a click!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={handleExport}
              >
                {user?.tier === 'paid' ? 'Export All Data' : 'Export Sample (50 Leads)'}
              </Button>
              {user?.tier !== 'paid' && (
                <Button 
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  onClick={handleUpgrade}
                >
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-web3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.total.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                +{stats.newThisWeek} this week
              </div>
            </CardContent>
          </Card>
          <Card className="card-web3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">New This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.newThisWeek}</div>
              <div className="text-xs text-muted-foreground">
                {stats.weekOverWeekChange >= 0 ? '+' : ''}{stats.weekOverWeekChange}% from last week
              </div>
            </CardContent>
          </Card>
          <Card className="card-web3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Has Contact Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.withContactInfo.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{stats.contactInfoPercentage}% of total</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card border-border"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "btn-web3" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projectsLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="card-web3 animate-pulse">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-6 bg-secondary rounded mb-2"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-20 bg-secondary rounded"></div>
                        <div className="h-4 w-24 bg-secondary rounded"></div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-secondary rounded-lg">
                    <div className="h-4 bg-secondary rounded mb-2"></div>
                    <div className="h-4 bg-secondary rounded"></div>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <div className="h-4 bg-secondary rounded mb-2"></div>
                    <div className="h-4 bg-secondary rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No projects found matching your criteria.</p>
            </div>
          ) : (
            filteredProjects.slice(0, user?.tier === 'paid' ? visibleProjects : Math.min(visibleProjects, 100)).map((project) => (
            <Card key={project["Lead ID"]} className="card-web3 hover:glow-effect group transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-primary mb-1 group-hover:text-primary/80 transition-colors">
                      {project["Project Name"]}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20">
                        Verified Lead
                      </Badge>
                      <span className="text-xs">• Added {project["Date Added"]}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Website - Always visible */}
                <div className="p-3 bg-card/50 rounded-lg border border-border/50">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Website</div>
                  <a 
                    href={project.Website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors font-medium break-all"
                  >
                    {project.Website}
                  </a>
                </div>

                {/* Contact Information - Premium Feature */}
                {user?.tier === 'paid' ? (
                  <div className="p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                    <div className="text-sm font-medium text-foreground mb-2">Direct Contact</div>
                    <div className="text-sm text-foreground font-medium break-all">
                      {project.Email}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gradient-to-r from-amber-500/5 to-amber-500/10 rounded-lg border border-amber-500/20 relative">
                    <div className="text-sm font-medium text-foreground mb-2">Direct Contact</div>
                    <div className="text-sm text-muted-foreground font-medium blur-sm select-none">
                      contact@••••••••••••••.com
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-lg">
                      <div className="text-center">
                        <div className="text-xs font-medium text-amber-600 mb-1">🔒 Pro Feature</div>
                        <Button 
                          size="sm" 
                          className="text-xs bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                          onClick={handleUpgrade}
                        >
                          Upgrade to Pro
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Media Links - Premium Feature */}
                {user?.tier === 'paid' ? (
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-sm text-muted-foreground">Socials:</span>
                    <div className="flex gap-3">
                      <a 
                        href={project.Twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                      >
                        Twitter
                      </a>
                      <span className="text-muted-foreground">•</span>
                      <a 
                        href={project.LinkedIn} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                      >
                        LinkedIn
                      </a>
                      <span className="text-muted-foreground">•</span>
                      <a 
                        href={project.Telegram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                      >
                        Telegram
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pt-2 relative">
                    <span className="text-sm text-muted-foreground">Socials:</span>
                    <div className="flex gap-3 blur-sm select-none">
                      <span className="text-primary text-sm font-medium">Twitter</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-primary text-sm font-medium">LinkedIn</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-primary text-sm font-medium">Telegram</span>
                    </div>
                    <div className="absolute right-0 top-0">
                      <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30">
                        Pro Only
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Value Proposition */}
                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-foreground">
                        {user?.tier === 'paid' ? 'Ready to Contact' : 'Preview Mode'}
                      </span>
                    </div>
                    {user?.tier !== 'paid' && (
                      <div className="text-xs text-muted-foreground">
                        {filteredProjects.length - 100 > 0 ? `+${filteredProjects.length - 100} more with Pro` : 'Limited to 100 companies'}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
          )}
        </div>

        {/* Load More */}
        {user?.tier === 'paid' ? (
          visibleProjects < filteredProjects.length && (
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" className="px-8" onClick={handleLoadMore}>
                Load More Projects
              </Button>
            </div>
          )
        ) : (
          visibleProjects >= 100 && filteredProjects.length > 100 && (
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
                <div className="text-xl font-bold text-foreground mb-4">
                  Want to see {filteredProjects.length - 100} more projects?
                </div>
                <p className="text-muted-foreground mb-6">
                  Upgrade to Pro to access our complete database of Web3 projects, contact information, and advanced filtering tools.
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8"
                  onClick={handleUpgrade}
                >
                  Upgrade to Pro - $99/month
                </Button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        userTier={user?.tier || 'free'}
      />
    </div>
  );
};

export default Dashboard;