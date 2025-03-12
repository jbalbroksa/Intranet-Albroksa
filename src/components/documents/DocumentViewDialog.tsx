import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import { DocumentProps } from "./DocumentCard";
import { format } from "date-fns";

interface DocumentViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentProps;
}

export default function DocumentViewDialog({
  isOpen,
  onClose,
  document,
}: DocumentViewDialogProps) {
  const getFileIcon = () => {
    switch (document.fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="h-12 w-12 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-12 w-12 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-12 w-12 text-green-500" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-12 w-12 text-orange-500" />;
      default:
        return <FileText className="h-12 w-12 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Document Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/5 p-3 rounded-md">{getFileIcon()}</div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{document.title}</h2>
              {document.description && (
                <p className="text-muted-foreground mt-1">
                  {document.description}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                File Details
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-sm">Type:</span>
                  <span className="text-sm font-medium">
                    .{document.fileType}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm">Size:</span>
                  <span className="text-sm font-medium">
                    {document.fileSize}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm">Version:</span>
                  <span className="text-sm font-medium">
                    {document.version}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm">Category:</span>
                  <span className="text-sm font-medium">
                    {document.category}
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Upload Information
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-sm">Uploaded by:</span>
                  <span className="text-sm font-medium">
                    {document.uploadedBy.name}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm">Upload date:</span>
                  <span className="text-sm font-medium">
                    {format(document.uploadedAt, "MMM d, yyyy")}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {document.tags && document.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Document Preview</h3>
            <div className="aspect-video bg-background flex items-center justify-center border rounded-md">
              <p className="text-muted-foreground text-center p-4">
                Preview not available. Click download to view the document.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
