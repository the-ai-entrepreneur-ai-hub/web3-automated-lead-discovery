import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, User, Share2, Users, MessageCircle, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const CommunityBuilding = () => {
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
            Community Building
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How to Build a Thriving Web3 Community from Scratch
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Learn the essential steps to create an engaged, loyal community around your Web3 project, from initial setup to long-term growth strategies.
          </p>
          
          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Web3Radar Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>May 10, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>12 min read</span>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Featured Image */}
          <div className="aspect-video rounded-lg overflow-hidden mb-12 bg-gradient-to-r from-primary/10 to-primary/5">
            <img 
              src="../lovable-uploads/4ab4d2bb-7213-4b49-8f09-cb1ae96595fe.png" 
              alt="Building Web3 Communities"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none text-foreground">
          <div className="text-lg text-muted-foreground mb-8">
            In the Web3 ecosystem, community isn't just nice to have—it's the foundation of success. Every major Web3 project, from Ethereum to Uniswap to Bored Ape Yacht Club, has built its success on the back of a strong, engaged community. But building a thriving Web3 community from scratch requires a fundamentally different approach than traditional marketing.
          </div>

          <div className="text-lg text-muted-foreground mb-12">
            After studying hundreds of successful Web3 communities and working with projects that have built engaged followings of thousands of users, we've identified the key principles and actionable strategies that separate thriving communities from ghost towns.
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">1. Setting the Foundation</h2>
          
          <h3 className="text-2xl font-semibold text-foreground mb-4">Define Your Mission and Values</h3>
          <p className="text-muted-foreground mb-6">
            Before you invite a single person to your community, you need crystal clarity on why your community exists. What problem are you solving? What value are you providing? What future are you building toward?
          </p>
          <p className="text-muted-foreground mb-6">
            Your mission should be bigger than your product. Uniswap's community isn't just about a DEX—it's about democratizing finance. Ethereum's community isn't just about a blockchain—it's about building a decentralized world computer. Your mission should inspire people to join something meaningful.
          </p>

          <Card className="bg-primary/5 border-primary/20 p-6 mb-8">
            <CardContent className="p-0">
              <h4 className="font-semibold text-primary mb-3">Mission Statement Framework:</h4>
              <ul className="text-muted-foreground space-y-2">
                <li>• <strong>Purpose:</strong> Why does your project exist?</li>
                <li>• <strong>Vision:</strong> What future are you building?</li>
                <li>• <strong>Values:</strong> What principles guide your decisions?</li>
                <li>• <strong>Impact:</strong> How will you change the world?</li>
              </ul>
            </CardContent>
          </Card>

          <h3 className="text-2xl font-semibold text-foreground mb-4">Choose the Right Platforms</h3>
          <p className="text-muted-foreground mb-6">
            Different platforms serve different purposes in Web3 communities. Don't try to be everywhere at once—focus on 2-3 platforms and do them well.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-card/50 border-border/50 p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <h4 className="font-semibold text-foreground">Discord</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Best for real-time conversations, community building, and governance discussions.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Rich text formatting and embeds</li>
                  <li>• Voice and video calls</li>
                  <li>• Role-based permissions</li>
                  <li>• Bot integrations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                  <h4 className="font-semibold text-foreground">Telegram</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Great for announcements, quick updates, and price discussions.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Fast, lightweight messaging</li>
                  <li>• Large group capacity</li>
                  <li>• Bot functionality</li>
                  <li>• Mobile-first experience</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-6 w-6 text-primary" />
                  <h4 className="font-semibold text-foreground">Twitter</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Essential for broader reach, news, and engaging with the wider Web3 community.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Public conversations</li>
                  <li>• Viral potential</li>
                  <li>• Influencer connections</li>
                  <li>• Real-time updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                  <h4 className="font-semibold text-foreground">Reddit</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Perfect for in-depth discussions, AMAs, and long-form content.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Threaded discussions</li>
                  <li>• Upvoting system</li>
                  <li>• Long-form content</li>
                  <li>• Searchable history</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">2. Content Strategy That Builds Community</h2>
          
          <h3 className="text-2xl font-semibold text-foreground mb-4">Educational Content</h3>
          <p className="text-muted-foreground mb-6">
            Web3 users are hungry for education. The space is complex, rapidly evolving, and often intimidating for newcomers. By providing genuinely helpful educational content, you position your community as a valuable resource.
          </p>
          <ul className="text-muted-foreground mb-8 space-y-2">
            <li>• <strong>Beginner Guides:</strong> Help newcomers understand complex concepts</li>
            <li>• <strong>Technical Deep-Dives:</strong> Satisfy the curiosity of advanced users</li>
            <li>• <strong>Market Analysis:</strong> Provide insights into trends and opportunities</li>
            <li>• <strong>Tutorial Content:</strong> Show users how to accomplish specific tasks</li>
            <li>• <strong>FAQ Resources:</strong> Address common questions and concerns</li>
          </ul>

          <h3 className="text-2xl font-semibold text-foreground mb-4">Behind-the-Scenes Content</h3>
          <p className="text-muted-foreground mb-6">
            Transparency builds trust. Share your journey, challenges, victories, and setbacks. Web3 users appreciate authenticity and are more likely to support projects that are open about their process.
          </p>
          <ul className="text-muted-foreground mb-8 space-y-2">
            <li>• Development updates and progress reports</li>
            <li>• Team introductions and personal stories</li>
            <li>• Decision-making processes and rationale</li>
            <li>• Challenges faced and how you're addressing them</li>
            <li>• Lessons learned and insights gained</li>
          </ul>

          <h3 className="text-2xl font-semibold text-foreground mb-4">User-Generated Content</h3>
          <p className="text-muted-foreground mb-6">
            The best communities are those where members create content for each other. This creates a sense of ownership and belonging that's impossible to achieve through company-generated content alone.
          </p>

          <Card className="bg-card/50 border-border/50 p-6 mb-8">
            <CardContent className="p-0">
              <h4 className="font-semibold text-foreground mb-3">UGC Strategies:</h4>
              <ul className="text-muted-foreground space-y-2">
                <li>• <strong>Community Challenges:</strong> Create contests and competitions</li>
                <li>• <strong>Spotlight Features:</strong> Highlight community members and their achievements</li>
                <li>• <strong>Collaborative Projects:</strong> Encourage members to work together</li>
                <li>• <strong>Feedback Loops:</strong> Actively solicit and implement user suggestions</li>
                <li>• <strong>Recognition Programs:</strong> Reward valuable contributions</li>
              </ul>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">3. Community Management Best Practices</h2>
          
          <h3 className="text-2xl font-semibold text-foreground mb-4">Establish Clear Guidelines</h3>
          <p className="text-muted-foreground mb-6">
            A well-moderated community feels safe and welcoming. Clear guidelines help members understand what's expected and give moderators consistent standards to enforce.
          </p>
          <ul className="text-muted-foreground mb-8 space-y-2">
            <li>• <strong>Code of Conduct:</strong> Define acceptable behavior and consequences</li>
            <li>• <strong>Content Guidelines:</strong> Specify what can and cannot be shared</li>
            <li>• <strong>Moderation Policies:</strong> Outline how violations are handled</li>
            <li>• <strong>Escalation Procedures:</strong> Provide clear paths for appeals</li>
            <li>• <strong>Role Definitions:</strong> Explain different member roles and privileges</li>
          </ul>

          <h3 className="text-2xl font-semibold text-foreground mb-4">Reward Active Members</h3>
          <p className="text-muted-foreground mb-6">
            Recognition is a powerful motivator. Acknowledge and reward your most engaged community members to encourage continued participation and set positive examples for others.
          </p>
          <ul className="text-muted-foreground mb-8 space-y-2">
            <li>• <strong>Special Roles:</strong> Give active members unique Discord roles or titles</li>
            <li>• <strong>Early Access:</strong> Provide beta access to new features or content</li>
            <li>• <strong>Direct Communication:</strong> Create channels for direct communication with the team</li>
            <li>• <strong>Event Invitations:</strong> Invite top contributors to special events</li>
            <li>• <strong>Token Rewards:</strong> If applicable, reward contributions with tokens</li>
          </ul>

          <h3 className="text-2xl font-semibold text-foreground mb-4">Regular Events and Activities</h3>
          <p className="text-muted-foreground mb-6">
            Consistent events give your community something to look forward to and create opportunities for deeper engagement. The key is finding the right frequency and format for your audience.
          </p>
          <ul className="text-muted-foreground mb-8 space-y-2">
            <li>• <strong>AMAs (Ask Me Anything):</strong> Regular Q&A sessions with team members</li>
            <li>• <strong>Community Calls:</strong> Monthly or weekly voice chats</li>
            <li>• <strong>Educational Workshops:</strong> Deep-dive sessions on specific topics</li>
            <li>• <strong>Social Events:</strong> Casual hangouts and networking opportunities</li>
            <li>• <strong>Competitions:</strong> Contests and challenges to boost engagement</li>
          </ul>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">4. Growth Tactics That Work</h2>
          
          <h3 className="text-2xl font-semibold text-foreground mb-4">Referral Programs</h3>
          <p className="text-muted-foreground mb-6">
            Word-of-mouth is the most powerful form of marketing in Web3. Create structured referral programs that incentivize existing members to invite friends and colleagues.
          </p>
          <ul className="text-muted-foreground mb-8 space-y-2">
            <li>• <strong>Invite Rewards:</strong> Reward both referrer and referee</li>
            <li>• <strong>Leaderboards:</strong> Create friendly competition around referrals</li>
            <li>• <strong>Quality Incentives:</strong> Reward quality referrals, not just quantity</li>
            <li>• <strong>Time-Limited Bonuses:</strong> Create urgency with limited-time rewards</li>
          </ul>

          <h3 className="text-2xl font-semibold text-foreground mb-4">Strategic Collaborations</h3>
          <p className="text-muted-foreground mb-6">
            Partner with complementary projects, influencers, and community leaders. The Web3 space is collaborative by nature, and cross-promotion can significantly expand your reach.
          </p>
          <ul className="text-muted-foreground mb-8 space-y-2">
            <li>• <strong>Project Partnerships:</strong> Collaborate with complementary projects</li>
            <li>• <strong>Influencer Relationships:</strong> Build authentic relationships with key voices</li>
            <li>• <strong>Cross-Community Events:</strong> Host joint events with other communities</li>
            <li>• <strong>Content Collaborations:</strong> Create content together with partners</li>
          </ul>

          <h3 className="text-2xl font-semibold text-foreground mb-4">Thought Leadership</h3>
          <p className="text-muted-foreground mb-6">
            Position key team members as thought leaders in your space. When your team members become recognized experts, it naturally draws people to your community.
          </p>
          <ul className="text-muted-foreground mb-8 space-y-2">
            <li>• <strong>Speaking Engagements:</strong> Present at conferences and events</li>
            <li>• <strong>Podcast Appearances:</strong> Share insights on relevant podcasts</li>
            <li>• <strong>Technical Writing:</strong> Publish research and analysis</li>
            <li>• <strong>Social Media Presence:</strong> Maintain active, helpful social media accounts</li>
          </ul>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">5. Measuring Community Health</h2>
          
          <p className="text-muted-foreground mb-6">
            Traditional metrics like follower count don't tell the full story of community health. Focus on engagement and meaningful participation.
          </p>

          <Card className="bg-card/50 border-border/50 p-6 mb-8">
            <CardContent className="p-0">
              <h4 className="font-semibold text-foreground mb-3">Key Community Metrics:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-foreground mb-2">Engagement Metrics</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Daily/Monthly active users</li>
                    <li>• Message volume and frequency</li>
                    <li>• Event attendance rates</li>
                    <li>• User-generated content volume</li>
                    <li>• Response times to questions</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-foreground mb-2">Quality Metrics</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Member retention rates</li>
                    <li>• Quality of discussions</li>
                    <li>• Member satisfaction surveys</li>
                    <li>• Referral rates</li>
                    <li>• Community sentiment analysis</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold text-foreground mb-6 mt-12">6. Long-term Sustainability</h2>
          
          <h3 className="text-2xl font-semibold text-foreground mb-4">Focus on Value Creation</h3>
          <p className="text-muted-foreground mb-6">
            Sustainable communities are built on lasting value, not hype. Focus on creating genuine value for your members rather than chasing quick growth metrics.
          </p>
          <ul className="text-muted-foreground mb-8 space-y-2">
            <li>• <strong>Educational Value:</strong> Continuously help members learn and grow</li>
            <li>• <strong>Networking Value:</strong> Facilitate valuable connections between members</li>
            <li>• <strong>Access Value:</strong> Provide exclusive opportunities and insights</li>
            <li>• <strong>Economic Value:</strong> Create opportunities for members to benefit financially</li>
          </ul>

          <h3 className="text-2xl font-semibold text-foreground mb-4">Evolve with Your Community</h3>
          <p className="text-muted-foreground mb-6">
            Communities change over time. What works for a 100-person community won't work for a 10,000-person community. Be prepared to evolve your approach as you grow.
          </p>
          <ul className="text-muted-foreground mb-8 space-y-2">
            <li>• <strong>Structure Evolution:</strong> Adapt your organization as you scale</li>
            <li>• <strong>Content Adaptation:</strong> Adjust content strategy for different growth stages</li>
            <li>• <strong>Moderation Scaling:</strong> Implement systems to handle larger communities</li>
            <li>• <strong>Feedback Integration:</strong> Continuously gather and act on community feedback</li>
          </ul>

          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 p-8 mb-12">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-foreground mb-4">Essential Community Building Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Communication Platforms</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Discord for real-time chat</li>
                    <li>• Telegram for announcements</li>
                    <li>• Twitter for public engagement</li>
                    <li>• Reddit for discussions</li>
                    <li>• YouTube for video content</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Management Tools</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Carl-bot for Discord automation</li>
                    <li>• Hootsuite for social media</li>
                    <li>• Typeform for surveys</li>
                    <li>• Calendly for event scheduling</li>
                    <li>• Notion for community wiki</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-lg text-muted-foreground">
            Building a thriving Web3 community is a marathon, not a sprint. It requires genuine commitment to providing value, fostering authentic relationships, and creating an environment where people want to spend their time. The communities that last are those that evolve beyond just supporting a product to become valuable networks in their own right.
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
                <Badge variant="outline" className="mb-3">Trust Building</Badge>
                <h4 className="font-semibold text-foreground mb-2">Building Trust in Web3</h4>
                <p className="text-sm text-muted-foreground">Learn how to build genuine trust through transparency and authenticity.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommunityBuilding;