import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, PlusCircle, Search } from "lucide-react";
import ContentCard from "./ContentCard";
import ContentEditor from "./ContentEditor";

export interface ContentItem {
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
  updatedAt: Date;
  status: "published" | "draft";
  tags: string[];
}

const MOCK_CONTENT: ContentItem[] = [
  {
    id: "1",
    title: "Welcome to InsuranceConnect",
    content:
      "Welcome to our new intranet platform! This platform is designed to help you access all the resources you need to succeed in your franchise. Here you'll find training materials, policy documents, and communication tools to connect with other franchise owners and the corporate team.\n\nPlease take some time to explore the platform and familiarize yourself with its features. If you have any questions, don't hesitate to reach out to the support team.",
    excerpt:
      "Welcome to our new intranet platform designed to help you succeed in your franchise...",
    category: "Announcements",
    author: {
      name: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    publishedAt: new Date(2024, 3, 1),
    updatedAt: new Date(2024, 3, 1),
    status: "published",
    tags: ["welcome", "introduction", "getting started"],
  },
  {
    id: "2",
    title: "2024 Policy Updates: What You Need to Know",
    content:
      "We've updated our policies for 2024 to better serve our clients and comply with new regulations. Key changes include:\n\n1. Updated privacy policy language\n2. New claims processing procedures\n3. Revised commission structure\n4. Enhanced customer service protocols\n\nPlease review these changes carefully and update your materials accordingly. Training sessions on these changes will be scheduled throughout the month.",
    excerpt:
      "Important policy updates for 2024 including privacy policy changes, claims processing, and more...",
    category: "Policies",
    author: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    publishedAt: new Date(2024, 2, 15),
    updatedAt: new Date(2024, 2, 20),
    status: "published",
    tags: ["policy", "updates", "2024", "compliance"],
  },
  {
    id: "3",
    title: "Customer Service Excellence Training",
    content:
      "We're excited to announce our new Customer Service Excellence training program. This comprehensive program covers:\n\n- Building rapport with clients\n- Effective communication techniques\n- Handling difficult conversations\n- Going above and beyond expectations\n\nThe training will be available both in-person and online. Sign up through the training portal by April 15th.",
    excerpt:
      "New training program on customer service excellence covering rapport building, communication, and more...",
    category: "Training",
    author: {
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    publishedAt: new Date(2024, 3, 5),
    updatedAt: new Date(2024, 3, 5),
    status: "published",
    tags: ["training", "customer service", "professional development"],
  },
  {
    id: "4",
    title: "Q2 Marketing Campaign Guidelines",
    content:
      "Our Q2 marketing campaign will focus on family insurance packages. The campaign theme is 'Protecting What Matters Most.' This document outlines the marketing materials, messaging guidelines, and promotional schedule for the upcoming quarter.\n\nKey dates:\n- Campaign launch: April 15\n- Social media push: April 20-30\n- Email campaign: May 5-15\n- Follow-up promotions: June 1-15",
    excerpt:
      "Q2 marketing campaign focusing on family insurance packages with the theme 'Protecting What Matters Most'...",
    category: "Marketing",
    author: {
      name: "Jessica Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    },
    publishedAt: new Date(2024, 3, 10),
    updatedAt: new Date(2024, 3, 12),
    status: "published",
    tags: ["marketing", "campaign", "Q2", "guidelines"],
  },
  {
    id: "5",
    title: "Annual Franchise Conference Announcement",
    content:
      "Mark your calendars! Our annual franchise conference will be held September 15-17 at the Grand Hotel in Chicago. This year's theme is 'Innovation and Growth in Changing Times.'\n\nThe conference will feature keynote speakers, workshops, networking events, and the annual awards ceremony. Registration opens May 1st. Early bird pricing is available until June 30th.",
    excerpt:
      "Annual franchise conference scheduled for September 15-17 in Chicago with the theme 'Innovation and Growth'...",
    category: "Announcements",
    author: {
      name: "Robert Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    },
    publishedAt: new Date(2024, 3, 8),
    updatedAt: new Date(2024, 3, 8),
    status: "published",
    tags: ["conference", "event", "networking", "annual"],
  },
];

const CATEGORIES = [
  "All Categories",
  "Announcements",
  "Policies",
  "Procedures",
  "Training",
  "Marketing",
  "News",
];

export default function ContentList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [contentItems, setContentItems] = useState(MOCK_CONTENT);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null,
  );

  const filteredContent = contentItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "All Categories" ||
      item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCreateContent = () => {
    setSelectedContent(null);
    setIsEditing(true);
  };

  const handleEditContent = (id: string) => {
    const content = contentItems.find((item) => item.id === id);
    if (content) {
      setSelectedContent(content);
      setIsEditing(true);
    }
  };

  const handleDeleteContent = (id: string) => {
    setContentItems(contentItems.filter((item) => item.id !== id));
  };

  const handleSaveContent = (contentData: {
    title: string;
    content: string;
    category: string;
    tags: string[];
  }) => {
    if (selectedContent) {
      // Update existing content
      setContentItems(
        contentItems.map((item) =>
          item.id === selectedContent.id
            ? {
                ...item,
                title: contentData.title,
                content: contentData.content,
                excerpt: contentData.content.substring(0, 100) + "...",
                category: contentData.category,
                tags: contentData.tags,
                updatedAt: new Date(),
              }
            : item,
        ),
      );
    } else {
      // Create new content
      const newContent: ContentItem = {
        id: Date.now().toString(),
        title: contentData.title,
        content: contentData.content,
        excerpt: contentData.content.substring(0, 100) + "...",
        category: contentData.category,
        author: {
          name: "Current User", // In a real app, this would be the current user
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser",
        },
        publishedAt: new Date(),
        updatedAt: new Date(),
        status: "draft",
        tags: contentData.tags,
      };

      setContentItems([newContent, ...contentItems]);
    }

    setIsEditing(false);
    setSelectedContent(null);
  };

  if (isEditing) {
    return (
      <ContentEditor
        initialContent={
          selectedContent
            ? {
                title: selectedContent.title,
                content: selectedContent.content,
                category: selectedContent.category,
                tags: selectedContent.tags,
              }
            : undefined
        }
        onSave={handleSaveContent}
        onCancel={() => {
          setIsEditing(false);
          setSelectedContent(null);
        }}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <Button onClick={handleCreateContent}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Content
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="flex-1">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="flex-1">
          {filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No content found. Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredContent.map((content) => (
                <ContentCard
                  key={content.id}
                  content={content}
                  onEdit={() => handleEditContent(content.id)}
                  onDelete={() => handleDeleteContent(content.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="published">
          <div className="grid grid-cols-1 gap-4">
            {filteredContent
              .filter((content) => content.status === "published")
              .map((content) => (
                <ContentCard
                  key={content.id}
                  content={content}
                  onEdit={() => handleEditContent(content.id)}
                  onDelete={() => handleDeleteContent(content.id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="drafts">
          <div className="grid grid-cols-1 gap-4">
            {filteredContent
              .filter((content) => content.status === "draft")
              .map((content) => (
                <ContentCard
                  key={content.id}
                  content={content}
                  onEdit={() => handleEditContent(content.id)}
                  onDelete={() => handleDeleteContent(content.id)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
