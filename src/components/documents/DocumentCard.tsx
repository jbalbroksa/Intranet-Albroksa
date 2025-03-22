import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  Image,
  Building,
  BookOpen,
  FileBox,
} from "lucide-react";
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
  fileUrl?: string;
  // New properties for linking
  companyId?: string;
  companyName?: string;
  productId?: string;
  productTitle?: string;
  productCategory?: string;
  productSubcategory?: string;
}

interface DocumentCardProps extends DocumentProps {
  onView: (id: string) => void;
  onDownload: (id: string, fileUrl?: string) => void;
  onDelete: (id: string) => void;
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
  fileUrl,
  companyId,
  companyName,
  productId,
  productTitle,
  productCategory,
  productSubcategory,
  onView,
  onDownload,
  onDelete,
}: DocumentCardProps) {
  const getFileIcon = () => {
    switch (fileType.toLowerCase()) {
      case "jpg":
      case "jpeg":
      case "png":
        return <Image className="h-10 w-10 text-blue-500" />;
      case "pdf":
        return <FileText className="h-10 w-10 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-10 w-10 text-blue-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      // Direct download using the file URL
      onDownload(id, fileUrl);
    } else {
      // Fallback to the parent component's download handler
      onDownload(id);
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
                <Eye className="mr-2 h-4 w-4" /> Ver
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Descargar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(id)}
                className="text-red-600"
              >
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline">{category}</Badge>
          <Badge variant="outline">v{version}</Badge>
          <Badge variant="outline">{fileSize}</Badge>
          <Badge variant="outline" className="capitalize">
            {fileType}
          </Badge>
        </div>

        {/* Display linked entities */}
        {(companyName || productTitle || productCategory) && (
          <div className="mt-3 space-y-1 text-xs text-muted-foreground">
            {companyName && (
              <div className="flex items-center">
                <Building className="h-3 w-3 mr-1" />
                <span>Compañía: {companyName}</span>
              </div>
            )}
            {productCategory && (
              <div className="flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                <span>
                  Categoría: {productCategory}
                  {productSubcategory &&
                    ` / ${productSubcategory.split("/")[1] || productSubcategory}`}
                </span>
              </div>
            )}
            {productTitle && (
              <div className="flex items-center">
                <FileBox className="h-3 w-3 mr-1" />
                <span>Producto: {productTitle}</span>
              </div>
            )}
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-0 border-t mt-2">
        <div className="flex justify-between w-full pt-2">
          <span>Subido por {uploadedBy.name}</span>
          <span>{formatDistanceToNow(uploadedAt, { addSuffix: true })}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
