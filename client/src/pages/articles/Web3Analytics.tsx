import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, User, Share2, BarChart3, TrendingUp, Database, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const Web3Analytics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/best-practices')}
          className="mb-8 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Best Practices
        </Button>

        {/* Article Header */}
        <div className="mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Analytics & Data
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Data-Driven Web3 Marketing: Analytics That Actually Matter
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Learn how to use on-chain data, community metrics, and Web3-specific analytics to optimize your marketing strategies and maximize ROI.
          </p>
          
          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Web3Radar Analytics Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>May 30, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>10 min read</span>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Featured Image */}
          <div className="aspect-video rounded-lg overflow-hidden mb-12 bg-gradient-to-r from-primary/10 to-primary/5">
            <img 
              src="../lovable-uploads/0d560163-3c3f-4d9e-8e8e-0ae7f2bf117d.png" 
              alt="Web3 Analytics Dashboard"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none text-foreground">
          <div className="text-lg text-muted-foreground mb-8">
            In Web3, data is everywhere—but knowing what to track and how to use it effectively can make the difference between explosive growth and stagnant metrics. Unlike traditional marketing where you're often flying blind, Web3 offers unprecedented transparency through on-chain data, community metrics, and real-time user behavior.
          </div>

          <div className="text-lg text-muted-foreground mb-12">
            The challenge isn't finding data—it's knowing which metrics actually matter and how to turn insights into action. After analyzing the analytics strategies of successful Web3 projects and working with companies that have achieved 10x growth through data-driven decisions, we've identified the metrics, tools, and techniques that deliver real results.
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">The Web3 Analytics Advantage</h2>
          
          <p className="text-muted-foreground mb-6">
            Web3 analytics offers several unique advantages over traditional digital marketing analytics:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-primary/5 border-primary/20 p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-6 w-6 text-primary" />
                  <h4 className="font-semibold text-foreground">On-Chain Transparency</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Every transaction is public and verifiable, giving you complete visibility into user behavior, wallet activity, and protocol interactions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20 p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h4 className="font-semibold text-foreground">Real-Time Insights</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Blockchain data updates in real-time, allowing you to spot trends, identify opportunities, and respond to changes instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20 p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-6 w-6 text-primary" />
                  <h4 className="font-semibold text-foreground">Behavioral Targeting</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Target users based on actual behavior (transactions, holdings, protocol usage) rather than demographics or interests.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20 p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <h4 className="font-semibold text-foreground">Community Metrics</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Track engagement across Discord, Telegram, Twitter, and other platforms where your community lives.
                </p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">Essential Web3 Metrics</h2>
          
          <h3 className="text-2xl font-semibold text-foreground mb-4">On-Chain Metrics</h3>
          <p className="text-muted-foreground mb-6">
            These metrics give you insight into actual user behavior and protocol health:
          </p>

          <Card className="bg-card/50 border-border/50 p-6 mb-8">
            <CardContent className="p-0">
              <h4 className="font-semibold text-foreground mb-4">Core On-Chain Metrics:</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-foreground mb-2">🔄 Transaction Volume & Frequency</h5>
                  <p className="text-sm text-muted-foreground">
                    Track total transaction volume, average transaction size, and frequency of transactions. High-frequency, high-value users are often your most valuable customers.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-foreground mb-2">👥 Active User Metrics</h5>
                  <p className="text-sm text-muted-foreground">
                    Daily Active Users (DAU), Weekly Active Users (WAU), and Monthly Active Users (MAU) based on on-chain activity, not just website visits.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-foreground mb-2">🏦 Token Holder Distribution</h5>
                  <p className="text-sm text-muted-foreground">
                    Analyze token concentration, holder growth, and distribution patterns to understand your community's composition and health.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-foreground mb-2">🔗 Smart Contract Interactions</h5>
                  <p className="text-sm text-muted-foreground">
                    Monitor which functions are being called, how often, and by whom. This reveals user engagement patterns and feature adoption.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-2xl font-semibold text-foreground mb-4">Community Engagement Metrics</h3>
          <p className="text-muted-foreground mb-6">
            Community health is crucial for Web3 success. These metrics help you understand engagement quality:
          </p>

          <ul className="text-muted-foreground mb-8 space-y-3">
            <li>• <strong>Message Volume & Quality:</strong> Track not just how many messages are sent, but their quality and relevance</li>
            <li>• <strong>Active Participants:</strong> Measure how many unique users participate in discussions daily/weekly</li>
            <li>• <strong>Response Times:</strong> Monitor how quickly community questions are answered</li>
            <li>• <strong>Event Attendance:</strong> Track participation in AMAs, community calls, and events</li>
            <li>• <strong>User-Generated Content:</strong> Measure content creation by community members</li>
            <li>• <strong>Sentiment Analysis:</strong> Use tools to gauge overall community mood and satisfaction</li>
          </ul>

          <h3 className="text-2xl font-semibold text-foreground mb-4">Product & Business Metrics</h3>
          <p className="text-muted-foreground mb-6">
            These traditional metrics remain important but need Web3-specific interpretation:
          </p>

          <Card className="bg-card/50 border-border/50 p-6 mb-8">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Acquisition Metrics</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Customer Acquisition Cost (CAC)</li>
                    <li>• Conversion rates by channel</li>
                    <li>• Time to first transaction</li>
                    <li>• Referral rates and quality</li>
                    <li>• Community-driven acquisitions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Retention Metrics</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• User cohort retention</li>
                    <li>• Feature adoption rates</li>
                    <li>• Wallet connection frequency</li>
                    <li>• Long-term holder percentages</li>
                    <li>• Community participation retention</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">Essential Analytics Tools</h2>
          
          <h3 className="text-2xl font-semibold text-foreground mb-4">On-Chain Analytics Platforms</h3>
          <p className="text-muted-foreground mb-6">
            These tools help you analyze blockchain data and user behavior:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-card/50 border-border/50 p-6">
              <CardContent className="p-0">
                <h4 className="font-semibold text-foreground mb-3">🔍 Dune Analytics</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Create custom dashboards and queries to analyze on-chain data. Great for tracking protocol metrics and user behavior.
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>Best for:</strong> Custom queries, protocol analysis, token metrics
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 p-6">
              <CardContent className="p-0">
                <h4 className="font-semibold text-foreground mb-3">📊 Nansen</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Professional-grade analytics with wallet labeling and smart money tracking. Premium but powerful.
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>Best for:</strong> Wallet intelligence, smart money tracking, market analysis
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 p-6">
              <CardContent className="p-0">
                <h4 className="font-semibold text-foreground mb-3">❄️ Flipside Crypto</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Community-driven analytics platform with bounty programs and collaborative analysis.
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>Best for:</strong> Community analytics, bounty programs, collaborative research
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 p-6">
              <CardContent className="p-0">
                <h4 className="font-semibold text-foreground mb-3">🔒 Chainalysis</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Enterprise-grade compliance and investigation tools. Essential for risk management.
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>Best for:</strong> Compliance, risk assessment, institutional analysis
                </div>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-2xl font-semibold text-foreground mb-4">Community Analytics Tools</h3>
          <p className="text-muted-foreground mb-6">
            Monitor engagement across your community platforms:
          </p>

          <ul className="text-muted-foreground mb-8 space-y-3">
            <li>• <strong>Discord Analytics Bots:</strong> Carl-bot, Statbot, and MEE6 for detailed server metrics</li>
            <li>• <strong>Telegram Analytics:</strong> Built-in analytics for channels and groups</li>
            <li>• <strong>Twitter Analytics:</strong> Native Twitter analytics plus third-party tools like Hootsuite</li>
            <li>• <strong>Reddit Analytics:</strong> Native Reddit insights and third-party tracking tools</li>
            <li>• <strong>Cross-Platform Tools:</strong> Hootsuite, Sprout Social, and Buffer for multi-platform tracking</li>
          </ul>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">Setting Up Your Analytics Stack</h2>
          
          <h3 className="text-2xl font-semibold text-foreground mb-4">1. Define Your Objectives</h3>
          <p className="text-muted-foreground mb-6">
            Start by clearly defining what you want to achieve. Different objectives require different metrics and tools.
          </p>

          <Card className="bg-primary/5 border-primary/20 p-6 mb-8">
            <CardContent className="p-0">
              <h4 className="font-semibold text-primary mb-3">Common Web3 Marketing Objectives:</h4>
              <ul className="text-muted-foreground space-y-2">
                <li>• <strong>User Acquisition:</strong> Focus on conversion metrics and channel performance</li>
                <li>• <strong>Community Growth:</strong> Track engagement, retention, and advocacy metrics</li>
                <li>• <strong>Protocol Adoption:</strong> Monitor transaction volume, active users, and feature usage</li>
                <li>• <strong>Token Distribution:</strong> Analyze holder metrics and distribution patterns</li>
                <li>• <strong>Revenue Growth:</strong> Track transaction fees, subscription metrics, and LTV</li>
              </ul>
            </CardContent>
          </Card>

          <h3 className="text-2xl font-semibold text-foreground mb-4">2. Implement Tracking Infrastructure</h3>
          <p className="text-muted-foreground mb-6">
            Set up proper tracking before you need it. It's much harder to analyze historical data that wasn't properly captured.
          </p>

          <ul className="text-muted-foreground mb-8 space-y-3">
            <li>• <strong>On-Chain Tracking:</strong> Set up automated data collection from relevant smart contracts</li>
            <li>• <strong>Web Analytics:</strong> Implement Google Analytics or Mixpanel with Web3-specific events</li>
            <li>• <strong>Community Tracking:</strong> Use bots and APIs to collect community engagement data</li>
            <li>• <strong>Attribution Tracking:</strong> Implement UTM codes and referral tracking for campaign attribution</li>
            <li>• <strong>Custom Dashboards:</strong> Create centralized dashboards that combine all data sources</li>
          </ul>

          <h3 className="text-2xl font-semibold text-foreground mb-4">3. Create Automated Reports</h3>
          <p className="text-muted-foreground mb-6">
            Manual reporting is time-consuming and error-prone. Set up automated reports for key metrics.
          </p>

          <Card className="bg-card/50 border-border/50 p-6 mb-8">
            <CardContent className="p-0">
              <h4 className="font-semibold text-foreground mb-3">Report Types to Automate:</h4>
              <ul className="text-muted-foreground space-y-2">
                <li>• <strong>Daily:</strong> Active users, transaction volume, community engagement</li>
                <li>• <strong>Weekly:</strong> User growth, retention cohorts, campaign performance</li>
                <li>• <strong>Monthly:</strong> Business metrics, ROI analysis, strategic insights</li>
                <li>• <strong>Real-Time:</strong> Alerts for significant changes or anomalies</li>
              </ul>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">Advanced Analytics Techniques</h2>
          
          <h3 className="text-2xl font-semibold text-foreground mb-4">Cohort Analysis</h3>
          <p className="text-muted-foreground mb-6">
            Group users by when they first interacted with your protocol and track their behavior over time. This reveals retention patterns and helps identify factors that drive long-term engagement.
          </p>

          <h3 className="text-2xl font-semibold text-foreground mb-4">Predictive Analytics</h3>
          <p className="text-muted-foreground mb-6">
            Use machine learning to predict user behavior, identify high-value prospects, and optimize campaigns. Start with simple models and gradually increase complexity.
          </p>

          <h3 className="text-2xl font-semibold text-foreground mb-4">Attribution Modeling</h3>
          <p className="text-muted-foreground mb-6">
            Web3 users often interact with multiple touchpoints before converting. Track the complete customer journey across community channels, social media, and direct interactions.
          </p>

          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 p-8 mb-12">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-foreground mb-4">Privacy & Compliance Considerations</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Data Privacy</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Respect user privacy preferences and consent</li>
                    <li>• Implement proper data protection measures</li>
                    <li>• Use privacy-preserving analytics when possible</li>
                    <li>• Comply with GDPR, CCPA, and other regulations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Ethical Considerations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Be transparent about data usage and collection</li>
                    <li>• Avoid manipulative targeting practices</li>
                    <li>• Ensure fair distribution of incentives and rewards</li>
                    <li>• Build trust through openness and honesty</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">ROI Measurement in Web3</h2>
          
          <p className="text-muted-foreground mb-6">
            Measuring ROI in Web3 requires understanding both direct and indirect value creation:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-card/50 border-border/50 p-6">
              <CardContent className="p-0">
                <h4 className="font-semibold text-foreground mb-3">Direct ROI Metrics</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Revenue attribution by channel</li>
                  <li>• Customer lifetime value (CLV)</li>
                  <li>• Cost per acquisition (CPA)</li>
                  <li>• Transaction fee generation</li>
                  <li>• Subscription or premium feature revenue</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 p-6">
              <CardContent className="p-0">
                <h4 className="font-semibold text-foreground mb-3">Indirect Value Metrics</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Community health and engagement</li>
                  <li>• Brand awareness and sentiment</li>
                  <li>• Network effects and viral growth</li>
                  <li>• Ecosystem contributions and partnerships</li>
                  <li>• Long-term protocol value creation</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-lg text-muted-foreground">
            Data-driven Web3 marketing is about more than just tracking metrics—it's about understanding your community, optimizing for long-term value creation, and building sustainable growth. The companies that master Web3 analytics will have a significant competitive advantage in the decentralized economy.
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <h3 className="text-2xl font-bold text-foreground mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50">
              <CardContent className="p-6">
                <Badge variant="outline" className="mb-3">Lead Generation</Badge>
                <h4 className="font-semibold text-foreground mb-2">Web3 Lead Generation Strategies</h4>
                <p className="text-sm text-muted-foreground">Discover proven tactics for identifying and converting high-quality Web3 leads.</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50">
              <CardContent className="p-6">
                <Badge variant="outline" className="mb-3">Customer Acquisition</Badge>
                <h4 className="font-semibold text-foreground mb-2">Web3 Customer Acquisition Guide</h4>
                <p className="text-sm text-muted-foreground">Master the art of acquiring customers in the Web3 space with proven frameworks.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Web3Analytics;