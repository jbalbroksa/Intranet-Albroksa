import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface DocumentProps {
  id: string;
  title: string;
  description?: string;
  fileType: string;
  category: string;
  uploadedBy: {
    name: string;
    avatar: string;
  };
  uploadedAt: Date;
  fileSize: string;
  version: string;
  tags?: string[];
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function DocumentCard({
  id,
  title,
  description,
  fileType,
  category,
  uploadedBy,
  uploadedAt,
  fileSize,
  version,
  tags = [],
  onView = () => {},
  onDownload = () => {},
  onDelete = () => {},
}: DocumentProps) {
  const getFileIcon = () => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="h-10 w-10 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-10 w-10 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-10 w-10 text-green-500" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-10 w-10 text-orange-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/5 p-2 rounded-md">{getFileIcon()}</div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(id)}>
                <Eye className="mr-2 h-4 w-4" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(id)}>
                <Download className="mr-2 h-4 w-4" /> Download
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">{category}</Badge>
          <Badge variant="outline">v{version}</Badge>
          <Badge variant="outline">{fileSize}</Badge>
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-0">
        <div className="flex justify-between w-full">
          <span>Uploaded by {uploadedBy.name}</span>
          <span>{formatDistanceToNow(uploadedAt, { addSuffix: true })}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
