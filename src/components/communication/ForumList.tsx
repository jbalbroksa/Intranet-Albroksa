import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, PlusCircle, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface ForumThread {
  id: string;
  title: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: Date;
  lastActivity: Date;
  replies: number;
  views: number;
  isSticky?: boolean;
  isLocked?: boolean;
}

const MOCK_THREADS: ForumThread[] = [
  {
    id: "1",
    title: "Welcome to the Insurance Connect Forum",
    category: "Announcements",
    author: {
      name: "Admin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    },
    createdAt: new Date(2024, 3, 1),
    lastActivity: new Date(2024, 3, 5),
    replies: 12,
    views: 156,
    isSticky: true,
  },
  {
    id: "2",
    title: "Tips for explaining policy changes to clients",
    category: "Best Practices",
    author: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    createdAt: new Date(2024, 3, 3),
    lastActivity: new Date(2024, 3, 10),
    replies: 8,
    views: 94,
  },
  {
    id: "3",
    title: "Question about the new claims processing system",
    category: "Technical Support",
    author: {
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    createdAt: new Date(2024, 3, 5),
    lastActivity: new Date(2024, 3, 8),
    replies: 5,
    views: 42,
  },
  {
    id: "4",
    title: "Marketing materials for the summer campaign",
    category: "Marketing",
    author: {
      name: "Jessica Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    },
    createdAt: new Date(2024, 3, 7),
    lastActivity: new Date(2024, 3, 9),
    replies: 3,
    views: 38,
  },
  {
    id: "5",
    title: "Annual conference registration is now open",
    category: "Events",
    author: {
      name: "Robert Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    },
    createdAt: new Date(2024, 3, 8),
    lastActivity: new Date(2024, 3, 11),
    replies: 15,
    views: 127,
    isSticky: true,
  },
  {
    id: "6",
    title: "New regulatory requirements for 2024",
    category: "Compliance",
    author: {
      name: "Amanda Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda",
    },
    createdAt: new Date(2024, 2, 20),
    lastActivity: new Date(2024, 3, 2),
    replies: 22,
    views: 215,
    isLocked: true,
  },
];

const CATEGORIES = [
  "All Categories",
  "Announcements",
  "Best Practices",
  "Technical Support",
  "Marketing",
  "Events",
  "Compliance",
  "General Discussion",
];

export default function ForumList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredThreads = MOCK_THREADS.filter((thread) => {
    const matchesSearch = thread.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      thread.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort threads: sticky first, then by last activity
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (a.isSticky && !b.isSticky) return -1;
    if (!a.isSticky && b.isSticky) return 1;
    return b.lastActivity.getTime() - a.lastActivity.getTime();
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Discussion Forums</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> New Thread
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search threads..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="w-full md:w-[200px] h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4 flex-1">
        {sortedThreads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No threads found. Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          sortedThreads.map((thread) => (
            <Card
              key={thread.id}
              className={`hover:shadow-sm transition-shadow ${thread.isSticky ? "border-primary/20 bg-primary/5" : ""}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {thread.category}
                      </Badge>
                      {thread.isSticky && (
                        <Badge className="text-xs">Sticky</Badge>
                      )}
                      {thread.isLocked && (
                        <Badge variant="destructive" className="text-xs">
                          Locked
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg hover:text-primary cursor-pointer">
                      {thread.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={thread.author.avatar}
                      alt={thread.author.name}
                    />
                    <AvatarFallback>{thread.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{thread.author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(thread.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{thread.replies} replies</span>
                  </div>
                  <span>{thread.views} views</span>
                </div>
                <div>
                  <span>
                    Last activity:{" "}
                    {formatDistanceToNow(thread.lastActivity, {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
