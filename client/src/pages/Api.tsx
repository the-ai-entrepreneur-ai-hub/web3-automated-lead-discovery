import { Code, Key, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

export default function Api() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-6">
              Web3Radar API
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful RESTful API to access Web3 lead data programmatically. Build custom integrations and automate your Web3 prospecting workflow.
            </p>
          </div>

          {/* API Overview */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="card-web3 text-center">
              <CardContent className="p-6">
                <Key className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Simple Authentication</h3>
                <p className="text-muted-foreground">
                  API key-based authentication with rate limiting and usage tracking
                </p>
              </CardContent>
            </Card>

            <Card className="card-web3 text-center">
              <CardContent className="p-6">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-time Data</h3>
                <p className="text-muted-foreground">
                  Access fresh Web3 project data updated in real-time
                </p>
              </CardContent>
            </Card>

            <Card className="card-web3 text-center">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Enterprise Ready</h3>
                <p className="text-muted-foreground">
                  99.9% uptime SLA with enterprise-grade security and compliance
                </p>
              </CardContent>
            </Card>
          </div>

          {/* API Endpoints */}
          <Card className="card-web3 mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">API Endpoints</CardTitle>
              <CardDescription>
                Complete list of available API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Leads Endpoints */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Leads
                  </h4>
                  <div className="space-y-3 ml-7">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="default">GET</Badge>
                        <code className="font-mono">/api/v1/leads</code>
                      </div>
                      <span className="text-sm text-muted-foreground">Get all leads</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="default">GET</Badge>
                        <code className="font-mono">/api/v1/leads/{"{id}"}</code>
                      </div>
                      <span className="text-sm text-muted-foreground">Get specific lead</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary">POST</Badge>
                        <code className="font-mono">/api/v1/leads/search</code>
                      </div>
                      <span className="text-sm text-muted-foreground">Search leads</span>
                    </div>
                  </div>
                </div>

                {/* Projects Endpoints */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Projects
                  </h4>
                  <div className="space-y-3 ml-7">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="default">GET</Badge>
                        <code className="font-mono">/api/v1/projects</code>
                      </div>
                      <span className="text-sm text-muted-foreground">Get Web3 projects</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="default">GET</Badge>
                        <code className="font-mono">/api/v1/projects/{"{id}"}</code>
                      </div>
                      <span className="text-sm text-muted-foreground">Get project details</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example Request */}
          <Card className="card-web3 mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Example Request</CardTitle>
              <CardDescription>
                Sample API call to get Web3 leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black p-6 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                <div className="mb-4">
                  <div className="text-gray-400"># Get leads with filtering</div>
                  <div>curl -X GET "https://api.web3radar.com/v1/leads?limit=10&category=defi" \</div>
                  <div className="ml-4">-H "Authorization: Bearer YOUR_API_KEY" \</div>
                  <div className="ml-4">-H "Content-Type: application/json"</div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-600">
                  <div className="text-gray-400 mb-2"># Response</div>
                  <div className="text-blue-400">{"{"}</div>
                  <div className="ml-4">"data": [</div>
                  <div className="ml-8">{"{"}</div>
                  <div className="ml-12">"id": "lead_123",</div>
                  <div className="ml-12">"name": "DeFi Protocol XYZ",</div>
                  <div className="ml-12">"category": "defi",</div>
                  <div className="ml-12">"stage": "mainnet",</div>
                  <div className="ml-12">"contact_email": "team@protocol.xyz"</div>
                  <div className="ml-8">{"}"}</div>
                  <div className="ml-4">],</div>
                  <div className="ml-4">"total": 1,</div>
                  <div className="ml-4">"page": 1</div>
                  <div className="text-blue-400">{"}"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Get Started */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Sign up for a free account and get your API key in minutes
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/register">
                <Button className="btn-web3">
                  Get API Key
                </Button>
              </Link>
              <Link to="/documentation">
                <Button variant="outline">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}