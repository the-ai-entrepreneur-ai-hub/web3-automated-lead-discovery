import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserCircle, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { User } from "@/lib/types";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isSuccessStoriesOpen, setIsSuccessStoriesOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            console.log('Header - Profile API response:', data);
            
            // Ensure email is always a string, not an array
            if (data.email && Array.isArray(data.email)) {
              data.email = data.email[0];
            }
            
            setUser(data);
            // Update localStorage with fresh data from server
            localStorage.setItem("user", JSON.stringify(data));
          } else {
            // Token is invalid, clean up
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        } else {
          // No token, ensure user is cleared
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        // Network error or other issues, clean up stored tokens
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    };

    // Clear any potentially corrupted localStorage data
    localStorage.removeItem("user");
    fetchUser();
  }, []);

  // Handle clicking outside profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    }
  };

  const isLoggedIn = !!user;
  const isDashboard = location.pathname === "/dashboard";

  const navigationItems = [
    { name: "Home", href: "/" },
    { 
      name: "Our Services", 
      href: "#", 
      dropdown: true,
      items: [
        { name: "Lead Discovery", href: "/dashboard", description: "AI-powered Web3 lead generation" },
        { name: "Market Intelligence", href: "#", description: "Real-time market insights" },
        { name: "Competitor Analysis", href: "#", description: "Track your competition" },
        { name: "Contact Enrichment", href: "#", description: "Enhanced contact information" }
      ]
    },
    { name: "Who We Are", href: "#about" },
    { 
      name: "Success Stories", 
      href: "#", 
      dropdown: true,
      items: [
        { name: "Case Studies", href: "#", description: "Real success stories from our clients" },
        { name: "ROI Calculator", href: "#", description: "Calculate your potential returns" },
        { name: "Best Practices", href: "#", description: "Tips for maximizing lead conversion" },
        { name: "Community", href: "#", description: "Join our Web3 professionals network" },
        { name: "Resources", href: "#", description: "Tools and guides for Web3 growth" }
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg group-hover:shadow-primary/25 transition-all duration-300"></div>
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-md animate-[slowFloat_4s_ease-in-out_infinite]"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-foreground tracking-tight">
                Web3<span className="text-primary">Radar</span>
              </span>
              <div className="text-xs text-muted-foreground -mt-1">
                Automated Lead Discovery
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <button
                    className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent/50"
                    onMouseEnter={() => {
                      if (item.name === "Our Services") setIsServicesOpen(true);
                      if (item.name === "Success Stories") setIsSuccessStoriesOpen(true);
                    }}
                    onMouseLeave={() => {
                      if (item.name === "Our Services") setIsServicesOpen(false);
                      if (item.name === "Success Stories") setIsSuccessStoriesOpen(false);
                    }}
                  >
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent/50"
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.dropdown && item.items && (
                  <div 
                    className={`absolute top-full left-0 mt-1 w-64 bg-card/95 backdrop-blur-lg rounded-lg shadow-lg border border-border/50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                      (item.name === "Our Services" && isServicesOpen) || 
                      (item.name === "Success Stories" && isSuccessStoriesOpen) ? 'opacity-100 visible' : ''
                    }`}
                    onMouseEnter={() => {
                      if (item.name === "Our Services") setIsServicesOpen(true);
                      if (item.name === "Success Stories") setIsSuccessStoriesOpen(true);
                    }}
                    onMouseLeave={() => {
                      if (item.name === "Our Services") setIsServicesOpen(false);
                      if (item.name === "Success Stories") setIsSuccessStoriesOpen(false);
                    }}
                  >
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className="block px-4 py-3 text-sm hover:bg-accent/50 transition-colors"
                      >
                        <div className="font-medium text-foreground">{subItem.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{subItem.description}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {!isDashboard && (
                  <Button
                    variant="outline"
                    className="border-primary/20 text-primary hover:bg-primary/10"
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </Button>
                )}
                
                {user?.tier !== 'paid' && (
                  <Badge variant="secondary" className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 border-amber-500/30">
                    Free Plan
                  </Badge>
                )}

                <div className="relative" ref={profileDropdownRef}>
                  <button
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    onClick={() => {
                      console.log('User object:', user);
                      setIsProfileOpen(!isProfileOpen);
                    }}
                  >
                    <UserCircle className="h-8 w-8 text-muted-foreground" />
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-card/95 backdrop-blur-lg rounded-lg shadow-lg border border-border/50 py-2 z-50">
                      <div className="px-4 py-3 border-b border-border/50">
                        <div className="font-medium text-foreground break-words">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground break-words mt-1">
                          Email: {Array.isArray(user.email) ? user.email[0] : user.email}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 break-words">
                          {user.company}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <span className="capitalize">{user.tier}</span> plan
                        </div>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-muted-foreground hover:bg-accent/50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-card/50 backdrop-blur-lg">
            <div className="px-2 pt-4 pb-6 space-y-2">
              {navigationItems.map((item) => (
                <div key={item.name} className="space-y-1">
                  {item.dropdown ? (
                    <div>
                      <button
                        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent/50"
                        onClick={() => {
                          if (item.name === "Our Services") setIsServicesOpen(!isServicesOpen);
                          if (item.name === "Success Stories") setIsSuccessStoriesOpen(!isSuccessStoriesOpen);
                        }}
                      >
                        {item.name}
                        <ChevronDown className={`h-4 w-4 transition-transform ${
                          (item.name === "Our Services" && isServicesOpen) || 
                          (item.name === "Success Stories" && isSuccessStoriesOpen) ? 'rotate-180' : ''
                        }`} />
                      </button>
                      {((item.name === "Our Services" && isServicesOpen) || 
                        (item.name === "Success Stories" && isSuccessStoriesOpen)) && 
                        item.items && (
                        <div className="pl-4 space-y-1">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className="block px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent/50"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-border/50 space-y-2">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm">
                      <div className="font-medium text-foreground">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">{user.company}</div>
                      <div className="text-xs text-muted-foreground">
                        <span className="capitalize">{user.tier}</span> plan
                      </div>
                    </div>
                    {!isDashboard && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          navigate('/dashboard');
                          setIsMenuOpen(false);
                        }}
                      >
                        Dashboard
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-muted-foreground hover:text-primary"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-muted-foreground hover:text-primary"
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-primary/80"
                      onClick={() => {
                        navigate('/register');
                        setIsMenuOpen(false);
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;