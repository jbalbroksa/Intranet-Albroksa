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

const MOCK_CONTENT: ContentItem[] = [];

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
