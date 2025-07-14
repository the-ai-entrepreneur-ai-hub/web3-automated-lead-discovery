import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useRef } from "react";
import { UserCircle, LogOut } from "lucide-react";
import { User } from "@/lib/types";

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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(6);
  const profileModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:3006/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          console.error('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:3006/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch user');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchProjects();
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileModalRef.current && !profileModalRef.current.contains(event.target as Node)) {
        setIsProfileModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileModalRef]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleExport = () => {
    if (projects.length === 0) {
      return;
    }
    const headers = Object.keys(projects[0]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + projects.map(p => headers.map(header => `"${p[header as keyof Project]}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "projects.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleLoadMore = () => {
    setVisibleProjects(prevVisibleProjects => prevVisibleProjects + 6);
  };

  const categories = ["All", "New Lead", "Contacted", "In-progress", "Closed"];
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = (project["Project Name"] && project["Project Name"].toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (project["Lead Summary"] && project["Lead Summary"].value && project["Lead Summary"].value.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || project.Status === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Web3Radar Curated Leads
              </h1>
              <p className="text-muted-foreground">
                Discover and connect with the latest Web3 projects leads with just a click!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleExport}>
                Export Data
              </Button>
              {user?.tier !== 'paid' && (
                <Button className="btn-web3">
                  Upgrade to Pro
                </Button>
              )}
              <div className="relative" ref={profileModalRef}>
                <UserCircle className="h-8 w-8 text-muted-foreground cursor-pointer" onClick={() => setIsProfileModalOpen(!isProfileModalOpen)} />
                {isProfileModalOpen && user &&
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-foreground">
                      <p className="font-bold">{user.firstName} {user.lastName}</p>
                      <p className="text-muted-foreground">{user.email}</p>
                      <p className="text-muted-foreground">{user.company}</p>
                      <p className="text-muted-foreground capitalize">{user.tier} User</p>
                    </div>
                  </div>
                }
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
          <Card className="card-web3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Contact Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">8,756</div>
              <div className="text-xs text-muted-foreground">85% of total</div>
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
          {filteredProjects.slice(0, visibleProjects).map((project) => (
            <Card key={project["Lead ID"]} className="card-web3 hover:glow-effect">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-primary mb-2">
                      {project["Project Name"]}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {project["Lead Summary"]?.value}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-4">
                    {project.Status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Source:</span>
                    <div className="font-medium text-foreground">{project.Source}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date Added:</span>
                    <div className="font-medium text-foreground">{project["Date Added"]}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Website:</span>
                    <a href={project.Website} target="_blank" rel="noopener noreferrer"
                       className="ml-2 text-primary hover:underline">
                      {project.Website}
                    </a>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="ml-2 text-foreground">{project.Email}</span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span className="text-muted-foreground">Social:</span>
                    <a href={project.Twitter} className="text-primary hover:underline">Twitter</a>
                    <span className="text-muted-foreground">•</span>
                    <a href={project.LinkedIn} className="text-primary hover:underline">LinkedIn</a>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1 btn-web3">
                    Add to CRM
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {visibleProjects < filteredProjects.length && (
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8" onClick={handleLoadMore}>
              Load More Projects
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;