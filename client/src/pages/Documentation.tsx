import { Code, Database, Zap, Shield, Book, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

export default function Documentation() {
  const apiEndpoints = [
    {
      method: "GET",
      path: "/api/v1/leads",
      description: "Retrieve Web3 leads with filtering options"
    },
    {
      method: "POST",
      path: "/api/v1/leads/search",
      description: "Search for leads based on criteria"
    },
    {
      method: "GET",
      path: "/api/v1/projects",
      description: "Get Web3 project information"
    },
    {
      method: "POST",
      path: "/api/v1/webhooks",
      description: "Create webhook for real-time updates"
    }
  ];

  const sdks = [
    {
      name: "JavaScript/Node.js",
      language: "JavaScript",
      status: "Available",
      link: "#"
    },
    {
      name: "Python",
      language: "Python",
      status: "Available",
      link: "#"
    },
    {
      name: "PHP",
      language: "PHP",
      status: "Coming Soon",
      link: "#"
    },
    {
      name: "Ruby",
      language: "Ruby",
      status: "Coming Soon",
      link: "#"
    }
  ];

  const integrations = [
    {
      name: "Salesforce",
      description: "Sync leads directly to Salesforce CRM",
      icon: Database,
      status: "Available"
    },
    {
      name: "HubSpot",
      description: "Integration with HubSpot CRM and marketing tools",
      icon: Database,
      status: "Available"
    },
    {
      name: "Zapier",
      description: "Connect to 3000+ apps via Zapier",
      icon: Zap,
      status: "Available"
    },
    {
      name: "Webhook",
      description: "Real-time data push to your endpoints",
      icon: Code,
      status: "Available"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-6">
              Documentation
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete technical documentation, API references, and integration guides for Web3Radar
            </p>
          </div>

          {/* Quick Start */}
          <Card className="card-web3 mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Zap className="w-8 h-8 text-primary mr-3" />
                Quick Start
              </CardTitle>
              <CardDescription>
                Get up and running with Web3Radar API in minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3">1. Get your API key</h4>
                <p className="text-muted-foreground mb-4">
                  Sign up for an account and generate your API key from the dashboard.
                </p>
                <Button variant="outline">
                  <Link to="/register" className="flex items-center">
                    Get Started <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3">2. Make your first API call</h4>
                <div className="bg-black p-4 rounded text-green-400 font-mono text-sm overflow-x-auto">
                  <div>curl -X GET "https://api.web3radar.com/v1/leads" \</div>
                  <div className="ml-4">-H "Authorization: Bearer YOUR_API_KEY"</div>
                </div>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3">3. Integrate with your workflow</h4>
                <p className="text-muted-foreground">
                  Use our SDKs or direct API calls to integrate Web3 lead data into your applications.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* API Reference */}
            <Card className="card-web3">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Code className="w-8 h-8 text-primary mr-3" />
                  API Reference
                </CardTitle>
                <CardDescription>
                  Complete API endpoint documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono">{endpoint.path}</code>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" variant="outline">
                  <Link to="/api" className="flex items-center">
                    View Full API Docs <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* SDKs */}
            <Card className="card-web3">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Book className="w-8 h-8 text-primary mr-3" />
                  SDKs & Libraries
                </CardTitle>
                <CardDescription>
                  Official SDKs for popular programming languages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sdks.map((sdk, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{sdk.name}</h4>
                        <p className="text-sm text-muted-foreground">{sdk.language}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={sdk.status === 'Available' ? 'default' : 'secondary'}>
                          {sdk.status}
                        </Badge>
                        {sdk.status === 'Available' && (
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Integrations */}
          <Card className="card-web3 mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Database className="w-8 h-8 text-primary mr-3" />
                Integrations
              </CardTitle>
              <CardDescription>
                Connect Web3Radar with your existing tools and workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <integration.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{integration.name}</h4>
                        <Badge variant="default">{integration.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="card-web3">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Shield className="w-8 h-8 text-primary mr-3" />
                Support & Resources
              </CardTitle>
              <CardDescription>
                Get help when you need it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Help Center</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse guides and tutorials
                  </p>
                  <Link to="/help">
                    <Button variant="outline" className="w-full">
                      Visit Help Center
                    </Button>
                  </Link>
                </div>
                
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Contact Support</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get personalized help
                  </p>
                  <Link to="/contact">
                    <Button variant="outline" className="w-full">
                      Contact Us
                    </Button>
                  </Link>
                </div>
                
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Community</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect with other users
                  </p>
                  <Link to="/community">
                    <Button variant="outline" className="w-full">
                      Join Community
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}