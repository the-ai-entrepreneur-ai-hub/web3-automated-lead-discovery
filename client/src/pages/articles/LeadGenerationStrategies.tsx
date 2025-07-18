import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, User, Share2, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const LeadGenerationStrategies = () => {
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
            Lead Generation
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            10 Web3 Lead Generation Strategies That Actually Work
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover proven tactics for identifying and converting high-quality Web3 leads, from community engagement to data-driven targeting.
          </p>
          
          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Web3Radar Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>May 15, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>8 min read</span>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Featured Image */}
          <div className="aspect-video rounded-lg overflow-hidden mb-12 bg-gradient-to-r from-primary/10 to-primary/5">
            <img 
              src="../lovable-uploads/e32f88c6-95cd-477e-a3c7-135bd8195930.png" 
              alt="Web3 Lead Generation Strategies"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none text-foreground">
          <div className="text-lg text-muted-foreground mb-8">
            The Web3 space moves fast, and traditional lead generation methods often fall short. The decentralized nature of blockchain technology, combined with a highly technical and security-conscious audience, requires a completely different approach to building your customer base.
          </div>

          <div className="text-lg text-muted-foreground mb-12">
            After analyzing successful Web3 companies and their growth strategies, we've identified 10 proven tactics that consistently deliver high-quality leads. These aren't theoretical concepts—they're battle-tested strategies that companies like Uniswap, Aave, and OpenSea have used to build massive user bases.
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">1. Community-First Approach</h2>
          <p className="text-muted-foreground mb-6">
            In Web3, community isn't just important—it's everything. Unlike traditional B2B sales where you can rely on cold outreach, Web3 users are highly skeptical of unsolicited contact. They value authentic relationships and trust above all else.
          </p>
          <p className="text-muted-foreground mb-6">
            Start by identifying where your target audience congregates. This might be Discord servers for DeFi protocols, Telegram groups for specific blockchain ecosystems, or Reddit communities focused on NFTs or gaming. Don't go in with a sales pitch—go in to provide value.
          </p>
          <Card className="bg-primary/5 border-primary/20 p-6 mb-8">
            <CardContent className="p-0">
              <h4 className="font-semibold text-primary mb-3">Pro Tip:</h4>
              <p className="text-muted-foreground">
                Spend at least 30 days in each community before making any promotional moves. Answer questions, share insights, and become a recognized helpful member. Only then should you subtly introduce your solution when relevant.
              </p>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">2. Data-Driven Targeting</h2>
          <p className="text-muted-foreground mb-6">
            One of Web3's biggest advantages is the transparency of on-chain data. Unlike traditional marketing where you guess at user behavior, you can analyze actual transaction patterns, token holdings, and protocol interactions to identify your ideal customers.
          </p>
          <p className="text-muted-foreground mb-6">
            Tools like Dune Analytics, Nansen, and Flipside Crypto allow you to segment users based on their on-chain behavior. For example, if you're building a DeFi yield farming platform, you can identify users who frequently interact with lending protocols, hold significant stablecoin balances, and demonstrate sophisticated DeFi knowledge through their transaction patterns.
          </p>
          <ul className="text-muted-foreground mb-8 space-y-2">
            <li>• <strong>Transaction Volume:</strong> Identify high-value users who regularly move significant amounts</li>
            <li>• <strong>Protocol Interactions:</strong> Find users already using similar or complementary services</li>
            <li>• <strong>Token Holdings:</strong> Target users with specific token portfolios relevant to your solution</li>
            <li>• <strong>Network Activity:</strong> Focus on users active on your target blockchain networks</li>
          </ul>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">3. Educational Content Marketing</h2>
          <p className="text-muted-foreground mb-6">
            Web3 users are hungry for education. The space is complex, rapidly evolving, and often confusing even for experienced users. By creating genuinely helpful educational content, you position yourself as a trusted authority while attracting potential customers.
          </p>
          <p className="text-muted-foreground mb-6">
            Focus on solving real problems your audience faces. This might be explaining complex DeFi concepts, breaking down the latest protocol updates, or providing step-by-step guides for common tasks. The key is to be genuinely helpful without being promotional.
          </p>
          <Card className="bg-card/50 border-border/50 p-6 mb-8">
            <CardContent className="p-0">
              <h4 className="font-semibold text-foreground mb-3">Content That Converts:</h4>
              <ul className="text-muted-foreground space-y-2">
                <li>• "How to" guides for complex Web3 tasks</li>
                <li>• Market analysis and trend predictions</li>
                <li>• Protocol comparisons and reviews</li>
                <li>• Security best practices and risk management</li>
                <li>• Technical deep-dives for developer audiences</li>
              </ul>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">4. Strategic Partnership Networks</h2>
          <p className="text-muted-foreground mb-6">
            Web3 is built on the concept of composability—different protocols and applications working together. This creates natural partnership opportunities that can dramatically expand your reach without the high costs of traditional advertising.
          </p>
          <p className="text-muted-foreground mb-6">
            Look for complementary services, infrastructure providers, and ecosystem participants who serve your target audience. The key is finding true win-win scenarios where both parties benefit from the collaboration.
          </p>
          <ul className="text-muted-foreground mb-8 space-y-2">
            <li>• <strong>Technical Integrations:</strong> Build APIs and SDKs that make it easy for other projects to integrate your solution</li>
            <li>• <strong>Cross-Promotion:</strong> Partner with non-competing projects to promote each other's services</li>
            <li>• <strong>Ecosystem Participation:</strong> Become an active participant in your blockchain ecosystem's governance and development</li>
            <li>• <strong>Influencer Collaborations:</strong> Work with respected voices in the Web3 space who align with your values</li>
          </ul>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">5. Event-Based Marketing</h2>
          <p className="text-muted-foreground mb-6">
            Web3 communities thrive on live interaction. Unlike traditional industries where webinars might feel formal and sales-y, Web3 events are often casual, educational, and community-focused. This presents unique opportunities to connect with potential customers in a natural way.
          </p>
          <p className="text-muted-foreground mb-6">
            Consider hosting or participating in AMAs (Ask Me Anything sessions), Twitter Spaces, Discord community calls, and virtual conferences. The key is to focus on providing value and building relationships rather than direct selling.
          </p>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">6. Incentive Programs</h2>
          <p className="text-muted-foreground mb-6">
            Web3 users are accustomed to being rewarded for their participation. Whether through token airdrops, governance rights, or exclusive access, incentives are a powerful tool for driving engagement and encouraging referrals.
          </p>
          <p className="text-muted-foreground mb-6">
            Design programs that reward not just usage, but valuable behaviors like referring quality users, providing feedback, or contributing to your community. Make sure your incentives align with your long-term goals and don't attract users who are only interested in quick rewards.
          </p>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">7. Developer-First Approach</h2>
          <p className="text-muted-foreground mb-6">
            Many Web3 decisions are made by developers or heavily influenced by technical teams. Even if your end users aren't developers, the technical evaluation process is often critical to adoption.
          </p>
          <p className="text-muted-foreground mb-6">
            Invest in excellent documentation, provide comprehensive SDKs, and make integration as simple as possible. Developer advocacy through technical content, open-source contributions, and community support can be incredibly effective for lead generation.
          </p>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">8. Social Proof Strategy</h2>
          <p className="text-muted-foreground mb-6">
            Web3 users are highly influenced by social proof, but they're also sophisticated enough to spot fake testimonials and paid endorsements. Authentic social proof from respected community members and successful projects carries enormous weight.
          </p>
          <p className="text-muted-foreground mb-6">
            Focus on building genuine relationships with influential users, documenting real success stories, and showcasing meaningful partnerships. Quality trumps quantity—one endorsement from a respected figure is worth more than dozens of generic testimonials.
          </p>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">9. Multi-Chain Strategy</h2>
          <p className="text-muted-foreground mb-6">
            The Web3 ecosystem is increasingly multi-chain, with users active across Ethereum, Polygon, Binance Smart Chain, Solana, and many other networks. Limiting yourself to one chain can significantly restrict your potential user base.
          </p>
          <p className="text-muted-foreground mb-6">
            Consider where your target users are most active and plan your expansion accordingly. Each chain has its own culture, preferences, and communication channels, so tailor your approach to each ecosystem.
          </p>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">10. Continuous Community Engagement</h2>
          <p className="text-muted-foreground mb-6">
            Web3 lead generation isn't a "set it and forget it" process. It requires ongoing engagement, relationship building, and value creation. The companies that succeed long-term are those that maintain consistent communication with their community.
          </p>
          <p className="text-muted-foreground mb-6">
            Develop a content calendar, maintain regular communication channels, and always be looking for ways to provide value to your community. This might include sharing industry insights, highlighting community achievements, or providing early access to new features.
          </p>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">Measuring Success</h2>
          <p className="text-muted-foreground mb-6">
            Traditional lead generation metrics like cost per lead (CPL) and conversion rates are still important, but Web3 requires additional metrics:
          </p>
          <ul className="text-muted-foreground mb-8 space-y-2">
            <li>• <strong>Community Engagement:</strong> Active participation in your Discord, Telegram, or other community channels</li>
            <li>• <strong>On-Chain Activity:</strong> Actual usage of your protocol or product, not just signups</li>
            <li>• <strong>Token Holder Retention:</strong> If you have a token, how long do users hold it?</li>
            <li>• <strong>Referral Quality:</strong> Are your users referring other high-value users?</li>
            <li>• <strong>Developer Adoption:</strong> Are developers building on or integrating with your platform?</li>
          </ul>

          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 p-8 mb-12">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-foreground mb-4">Key Takeaways</h3>
              <ul className="text-muted-foreground space-y-3">
                <li>• Focus on building genuine relationships before selling</li>
                <li>• Use on-chain data to identify and target your ideal customers</li>
                <li>• Provide educational value to establish trust and authority</li>
                <li>• Leverage partnerships and ecosystem participation for growth</li>
                <li>• Maintain consistent community engagement for long-term success</li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-lg text-muted-foreground">
            Web3 lead generation is fundamentally different from traditional marketing. It requires patience, authenticity, and a genuine commitment to providing value to your community. The companies that succeed are those that view their users as partners in building the decentralized future, not just customers to be acquired.
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <h3 className="text-2xl font-bold text-foreground mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50">
              <CardContent className="p-6">
                <Badge variant="outline" className="mb-3">Community Building</Badge>
                <h4 className="font-semibold text-foreground mb-2">How to Build a Thriving Web3 Community</h4>
                <p className="text-sm text-muted-foreground">Learn the essential steps to create an engaged, loyal community around your Web3 project.</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50">
              <CardContent className="p-6">
                <Badge variant="outline" className="mb-3">Analytics</Badge>
                <h4 className="font-semibold text-foreground mb-2">Data-Driven Web3 Marketing</h4>
                <p className="text-sm text-muted-foreground">Use on-chain data and Web3-specific analytics to optimize your marketing strategies.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeadGenerationStrategies;