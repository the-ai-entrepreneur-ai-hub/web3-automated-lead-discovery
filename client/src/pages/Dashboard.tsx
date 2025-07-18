import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
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
  const navigate = useNavigate();

  // Memoize API calls to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

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

    fetchData();
  }, [fetchData]);


  const handleExport = async () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = now.toTimeString().split(' ')[0].replace(/:/g, ''); // HHMMSS
    
    if (user?.tier === 'paid') {
      // Premium users: Fetch all projects with social media from server
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.API_URL}/export-premium`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch export data');
        }

        const exportData = await response.json();
        console.log(`Exporting ${exportData.withSocials} projects out of ${exportData.total} total`);

        const headers = ["Project Name", "Website", "Twitter", "LinkedIn", "Telegram"];
        const csvContent = "data:text/csv;charset=utf-8,"
          + headers.join(",") + "\n"
          + exportData.data.map(p => {
            const row = [
              `"${p["Project Name"] || ''}"`,
              `"${p.Website || ''}"`,
              `"${p.Twitter || ''}"`,
              `"${p.LinkedIn || ''}"`,
              `"${p.Telegram || ''}"`
            ];
            return row.join(",");
          }).join("\n");
        
        const filename = `web3-project-leads-with-socials-${date}&${timestamp}.csv`;
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export data. Please try again.');
      }
    } else {
      // Free users: Limited data (50 leads, project name and website only)
      if (projects.length === 0) {
        return;
      }
      
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

      const { url } = await stripeApi.createCheckoutSession(token);
      window.location.href = url;
    } catch (error) {
      console.error('Error upgrading:', error);
      alert('Failed to start upgrade process. Please try again.');
    }
  };

  const categories = ["All", "Recently Added", "High Funding", "Early Stage", "Mainnet Live", "Token Launch", "Hiring"];
  
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
          case "High Funding":
            matchesCategory = project["Lead Summary"] && project["Lead Summary"].value && 
                            (project["Lead Summary"].value.toLowerCase().includes("funding") || 
                             project["Lead Summary"].value.toLowerCase().includes("raised") ||
                             project["Lead Summary"].value.toLowerCase().includes("investment"));
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
              <div className="text-2xl font-bold text-primary">{projects.length}</div>
              <div className="text-xs text-muted-foreground">+127 this week</div>
            </CardContent>
          </Card>
          <Card className="card-web3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">New This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">127</div>
              <div className="text-xs text-muted-foreground">+23% from last week</div>
            </CardContent>
          </Card>
          <Card className="card-web3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">With Funding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">3,891</div>
              <div className="text-xs text-muted-foreground">38% of total</div>
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
    </div>
  );
};

export default Dashboard;