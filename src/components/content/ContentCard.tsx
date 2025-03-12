import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { format } from "date-fns";
import { ContentItem } from "./ContentList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContentCardProps {
  content: ContentItem;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ContentCard({
  content,
  onEdit,
  onDelete,
}: ContentCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-sm transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant={content.status === "published" ? "default" : "outline"}
                className="text-xs"
              >
                {content.status === "published" ? "Published" : "Draft"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {content.category}
              </span>
            </div>
            <CardTitle className="text-xl">{content.title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{content.excerpt}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {content.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={content.author.avatar}
              alt={content.author.name}
            />
            <AvatarFallback>{content.author.name[0]}</AvatarFallback>
          </Avatar>
          <span>{content.author.name}</span>
        </div>
        <div className="flex gap-4">
          <span>Published: {format(content.publishedAt, "MMM d, yyyy")}</span>
          <span>Updated: {format(content.updatedAt, "MMM d, yyyy")}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
