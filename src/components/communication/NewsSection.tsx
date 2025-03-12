import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { PlusCircle } from "lucide-react";

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: Date;
  isPinned?: boolean;
  image?: string;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "New Insurance Products Launching Next Month",
    content:
      "We're excited to announce the launch of three new insurance products designed specifically for small business owners. These products will provide comprehensive coverage at competitive rates, helping our franchise owners better serve their communities.\n\nThe new products include:\n\n1. Small Business Protection Plan\n2. Cyber Security Insurance\n3. Professional Liability Plus\n\nTraining sessions on these new products will begin next week. Please check the training calendar for details.",
    excerpt:
      "Three new insurance products for small business owners launching next month with training sessions starting next week.",
    category: "Product Updates",
    author: {
      name: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    publishedAt: new Date(2024, 3, 10),
    isPinned: true,
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
  },
  {
    id: "2",
    title: "Quarterly Performance Results",
    content:
      "We're pleased to announce that our franchise network has exceeded performance targets for Q1 2024. Overall sales increased by 12% compared to the same period last year, with particularly strong growth in the western region.\n\nKey highlights:\n\n- 12% increase in overall sales\n- 15% growth in new policies\n- 8% reduction in policy cancellations\n- 95% customer satisfaction rating\n\nThank you to all franchise owners and their teams for their hard work and dedication.",
    excerpt:
      "Franchise network exceeded Q1 2024 targets with 12% sales increase and strong performance across all metrics.",
    category: "Company News",
    author: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    publishedAt: new Date(2024, 3, 5),
  },
  {
    id: "3",
    title: "System Maintenance Scheduled",
    content:
      "Our IT department will be performing scheduled maintenance on the policy management system this weekend. The system will be unavailable from Saturday, April 20th at 10:00 PM until Sunday, April 21st at 2:00 AM (Eastern Time).\n\nDuring this time, you will not be able to access the policy management system. Please plan your work accordingly.\n\nIf you have any questions or concerns, please contact the IT support desk.",
    excerpt:
      "Policy management system will be unavailable from Saturday 10:00 PM to Sunday 2:00 AM for scheduled maintenance.",
    category: "IT Updates",
    author: {
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    publishedAt: new Date(2024, 3, 15),
  },
  {
    id: "4",
    title: "Welcome Our Newest Franchise Owners",
    content:
      "We're excited to welcome five new franchise owners to our network this month. These entrepreneurs bring a wealth of experience and enthusiasm to our company.\n\nNew franchise locations:\n\n- Portland, OR - Emily Rodriguez\n- Atlanta, GA - James Wilson\n- Denver, CO - Michelle Park\n- Phoenix, AZ - David Thompson\n- Miami, FL - Sophia Martinez\n\nPlease join us in welcoming them to the team!",
    excerpt:
      "Five new franchise owners joined our network this month in Portland, Atlanta, Denver, Phoenix, and Miami.",
    category: "Company News",
    author: {
      name: "Jessica Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    },
    publishedAt: new Date(2024, 3, 8),
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
  },
];

export default function NewsSection() {
  const [newsItems] = useState(MOCK_NEWS);

  // Sort news: pinned first, then by publish date
  const sortedNews = [...newsItems].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.publishedAt.getTime() - a.publishedAt.getTime();
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Company News</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create News
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured News */}
        <Card className="lg:col-span-3 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{sortedNews[0].category}</Badge>
                  {sortedNews[0].isPinned && (
                    <Badge variant="outline">Pinned</Badge>
                  )}
                </div>
                <CardTitle className="text-2xl mb-4">
                  {sortedNews[0].title}
                </CardTitle>
                <p className="text-muted-foreground">{sortedNews[0].excerpt}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={sortedNews[0].author.avatar}
                      alt={sortedNews[0].author.name}
                    />
                    <AvatarFallback>
                      {sortedNews[0].author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {sortedNews[0].author.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(sortedNews[0].publishedAt, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <Button>Read More</Button>
              </div>
            </div>
            {sortedNews[0].image && (
              <div
                className="h-full min-h-[300px] bg-cover bg-center"
                style={{ backgroundImage: `url(${sortedNews[0].image})` }}
              />
            )}
          </div>
        </Card>

        {/* News Grid */}
        {sortedNews.slice(1).map((news) => (
          <Card key={news.id} className="overflow-hidden flex flex-col">
            {news.image && (
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${news.image})` }}
              />
            )}
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {news.category}
                </Badge>
                {news.isPinned && <Badge className="text-xs">Pinned</Badge>}
              </div>
              <CardTitle className="text-lg">{news.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2 flex-1">
              <p className="text-muted-foreground text-sm">{news.excerpt}</p>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={news.author.avatar}
                    alt={news.author.name}
                  />
                  <AvatarFallback>{news.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(news.publishedAt, { addSuffix: true })}
                </span>
              </div>
              <Button variant="ghost" size="sm">
                Read More
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
