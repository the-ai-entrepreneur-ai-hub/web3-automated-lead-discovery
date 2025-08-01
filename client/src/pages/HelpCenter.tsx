import { Search, Book, MessageCircle, FileText, Video, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

export default function HelpCenter() {
  const categories = [
    {
      icon: Zap,
      title: "Getting Started",
      description: "Learn the basics of Web3Radar",
      articles: [
        "Quick Start Guide",
        "Setting up your first campaign",
        "Understanding Web3 leads",
        "Platform overview"
      ]
    },
    {
      icon: FileText,
      title: "Lead Discovery",
      description: "Master our lead discovery tools",
      articles: [
        "How lead scanning works",
        "Advanced filtering options",
        "Export and integration",
        "Lead scoring explained"
      ]
    },
    {
      icon: Book,
      title: "Best Practices",
      description: "Optimize your Web3 outreach",
      articles: [
        "Web3 outreach strategies",
        "Building effective campaigns",
        "Compliance guidelines",
        "ROI optimization"
      ]
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      articles: [
        "Platform walkthrough",
        "Lead discovery demo",
        "Integration setup",
        "Advanced features"
      ]
    }
  ];

  const popularArticles = [
    "How to set up your first Web3 lead generation campaign",
    "Understanding Web3 project lifecycle for better targeting",
    "Integrating Web3Radar with your CRM",
    "Best practices for Web3 cold outreach",
    "Compliance and regulations in Web3 marketing"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-6">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Find answers, guides, and resources to help you succeed with Web3Radar
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search help articles..."
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="card-web3 hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Get help from our support team
                </p>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    Contact Us
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-web3 hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Video className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Watch Demo</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  See Web3Radar in action
                </p>
                <Button variant="outline" className="w-full">
                  View Demo
                </Button>
              </CardContent>
            </Card>

            <Card className="card-web3 hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Book className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Documentation</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Technical docs and API guides
                </p>
                <Link to="/documentation">
                  <Button variant="outline" className="w-full">
                    Read Docs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Help Categories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {categories.map((category, index) => (
                <Card key={index} className="card-web3 hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <category.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.articles.map((article, articleIndex) => (
                        <li key={articleIndex}>
                          <a
                            href="#"
                            className="text-muted-foreground hover:text-primary transition-colors text-sm"
                          >
                            {article}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Popular Articles */}
          <Card className="card-web3">
            <CardHeader>
              <CardTitle className="text-2xl">Popular Articles</CardTitle>
              <CardDescription>
                Most viewed help articles this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {popularArticles.map((article, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary text-sm font-semibold rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <a
                      href="#"
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {article}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}