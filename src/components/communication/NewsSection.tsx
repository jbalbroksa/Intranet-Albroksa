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

const MOCK_NEWS: NewsItem[] = [];

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
