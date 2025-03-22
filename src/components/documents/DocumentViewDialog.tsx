import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Image,
  ExternalLink,
  Building,
  BookOpen,
  FileBox,
} from "lucide-react";
import { DocumentProps } from "./DocumentCard";
import { format } from "date-fns";

interface DocumentViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentProps;
  onDownload: (id: string, fileUrl?: string) => void;
}

export default function DocumentViewDialog({
  isOpen,
  onClose,
  document,
  onDownload,
}: DocumentViewDialogProps) {
  const getFileIcon = () => {
    switch (document.fileType.toLowerCase()) {
      case "jpg":
      case "jpeg":
      case "png":
        return <Image className="h-12 w-12 text-blue-500" />;
      case "pdf":
        return <FileText className="h-12 w-12 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-12 w-12 text-blue-500" />;
      default:
        return <FileText className="h-12 w-12 text-gray-500" />;
    }
  };

  const isPreviewable = () => {
    const type = document.fileType.toLowerCase();
    return (
      type === "jpg" || type === "jpeg" || type === "png" || type === "pdf"
    );
  };

  const handleDownload = () => {
    if (document.fileUrl) {
      onDownload(document.id, document.fileUrl);
    } else {
      onDownload(document.id);
    }
  };

  const renderPreview = () => {
    if (!document.fileUrl) {
      return (
        <div className="aspect-video bg-background flex items-center justify-center border rounded-md">
          <p className="text-muted-foreground text-center p-4">
            Vista previa no disponible. Haga clic en descargar para ver el
            documento.
          </p>
        </div>
      );
    }

    const fileType = document.fileType.toLowerCase();

    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png") {
      return (
        <div className="flex items-center justify-center border rounded-md overflow-hidden bg-background">
          <img
            src={document.fileUrl}
            alt={document.title}
            className="max-w-full max-h-[400px] object-contain"
          />
        </div>
      );
    } else if (fileType === "pdf") {
      return (
        <div className="border rounded-md overflow-hidden">
          <iframe
            src={`${document.fileUrl}#toolbar=0&navpanes=0`}
            width="100%"
            height="400px"
            title={document.title}
            className="bg-white"
          />
          <div className="bg-muted p-2 text-center">
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center"
            >
              Abrir PDF en nueva pestaña{" "}
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      );
    } else if (fileType === "docx") {
      return (
        <div className="aspect-video bg-background flex flex-col items-center justify-center border rounded-md p-6 text-center">
          <FileText className="h-16 w-16 text-blue-500 mb-4" />
          <p className="text-muted-foreground">
            Vista previa no disponible para archivos DOCX.
          </p>
          <p className="text-muted-foreground mt-2">
            Haga clic en descargar para ver el documento.
          </p>
        </div>
      );
    } else {
      return (
        <div className="aspect-video bg-background flex items-center justify-center border rounded-md">
          <p className="text-muted-foreground text-center p-4">
            Vista previa no disponible. Haga clic en descargar para ver el
            documento.
          </p>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Detalles del Documento</DialogTitle>
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
                Detalles del Archivo
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-sm">Tipo:</span>
                  <span className="text-sm font-medium">
                    .{document.fileType}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm">Tamaño:</span>
                  <span className="text-sm font-medium">
                    {document.fileSize}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm">Versión:</span>
                  <span className="text-sm font-medium">
                    {document.version}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm">Categoría:</span>
                  <span className="text-sm font-medium">
                    {document.category}
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Información de Carga
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-sm">Subido por:</span>
                  <span className="text-sm font-medium">
                    {document.uploadedBy.name}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm">Fecha de carga:</span>
                  <span className="text-sm font-medium">
                    {format(document.uploadedAt, "d MMM, yyyy")}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Display linked entities */}
          {(document.companyName ||
            document.productTitle ||
            document.productCategory) && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Relaciones
              </h3>
              <div className="bg-muted/30 p-3 rounded-md space-y-2">
                {document.companyName && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Compañía:{" "}
                      <span className="font-medium">
                        {document.companyName}
                      </span>
                    </span>
                  </div>
                )}
                {document.productCategory && (
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Categoría:{" "}
                      <span className="font-medium">
                        {document.productCategory}
                      </span>
                      {document.productSubcategory &&
                        ` / ${document.productSubcategory.split("/")[1] || document.productSubcategory}`}
                    </span>
                  </div>
                )}
                {document.productTitle && (
                  <div className="flex items-center">
                    <FileBox className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Producto:{" "}
                      <span className="font-medium">
                        {document.productTitle}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {document.tags && document.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Etiquetas
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
            <h3 className="text-sm font-medium mb-2">
              Vista Previa del Documento
            </h3>
            {renderPreview()}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Descargar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
