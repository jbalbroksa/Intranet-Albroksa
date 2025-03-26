import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUp, Filter, Search, LayoutGrid, List } from "lucide-react";
import DocumentCard, { DocumentProps } from "./DocumentCard";
import DocumentUploadDialog from "./DocumentUploadDialog";
import DocumentViewDialog from "./DocumentViewDialog";
import { getDocuments } from "@/lib/db/documents";
import { useToast } from "@/components/ui/use-toast";

const MOCK_DOCUMENTS: DocumentProps[] = [];

const CATEGORIES = [
  "Todas las Categorías",
  "Pólizas",
  "Onboarding",
  "Informes",
  "Marketing",
  "Formación",
  "Legal",
  "RRHH",
];

export default function DocumentLibrary() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    "Todas las Categorías",
  );
  const [documents, setDocuments] = useState<DocumentProps[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentProps | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Fetch documents from Supabase on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description:
          "No se pudieron cargar los documentos. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "Todas las Categorías" ||
      doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleViewDocument = (id: string) => {
    const document = documents.find((doc) => doc.id === id);
    if (document) {
      setSelectedDocument(document);
      setIsViewDialogOpen(true);
    }
  };

  const handleDownloadDocument = (id: string, fileUrl?: string) => {
    if (fileUrl) {
      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_blank";
      link.download = `document-${id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(`Downloading document with URL: ${fileUrl}`);
    } else {
      // Fallback if no URL is provided
      console.log(`Downloading document with ID: ${id}`);
      toast({
        title: "Error",
        description: "No se pudo descargar el documento. URL no disponible.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      // Import dynamically to avoid circular dependencies
      const { deleteDocument } = await import("@/lib/db/documents");
      await deleteDocument(id);
      setDocuments(documents.filter((doc) => doc.id !== id));
      toast({
        title: "Documento eliminado",
        description: "El documento ha sido eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description:
          "No se pudo eliminar el documento. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleUploadDocument = (newDocument: DocumentProps) => {
    setDocuments([newDocument, ...documents]);
    setIsUploadDialogOpen(false);
    toast({
      title: "Documento subido",
      description: "El documento ha sido subido correctamente.",
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Repositorio de Documentos</h1>
        <div className="flex items-center gap-2">
          <div className="bg-muted rounded-md flex items-center p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("grid")}
              aria-label="Vista de cuadrícula"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("table")}
              aria-label="Vista de tabla"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" /> Subir Documento
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Categoría" />
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
          <TabsTrigger value="all">Todos los Documentos</TabsTrigger>
          <TabsTrigger value="recent">Añadidos Recientemente</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="flex-1">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando documentos...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No se encontraron documentos. Intente ajustar su búsqueda o
                filtros.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  {...document}
                  onView={handleViewDocument}
                  onDownload={handleDownloadDocument}
                  onDelete={handleDeleteDocument}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-2 text-left font-medium">Documento</th>
                    <th className="p-2 text-left font-medium">Categoría</th>
                    <th className="p-2 text-left font-medium">Subido por</th>
                    <th className="p-2 text-left font-medium">Fecha</th>
                    <th className="p-2 text-left font-medium">Tamaño</th>
                    <th className="p-2 text-center font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((document) => (
                    <tr
                      key={document.id}
                      className="border-t hover:bg-muted/50"
                    >
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <span className="text-xs font-bold">
                              {document.fileType?.toUpperCase() || "DOC"}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{document.title}</div>
                            {document.description && (
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {document.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">{document.category}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={document.uploadedBy.avatar}
                            alt={document.uploadedBy.name}
                            className="h-6 w-6 rounded-full"
                          />
                          <span>{document.uploadedBy.name}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        {document.uploadedAt.toLocaleDateString()}
                      </td>
                      <td className="p-2">{document.fileSize}</td>
                      <td className="p-2">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDocument(document.id)}
                          >
                            Ver
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDownloadDocument(
                                document.id,
                                document.fileUrl,
                              )
                            }
                          >
                            Descargar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDocument(document.id)}
                            className="text-red-500"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando documentos...</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments
                .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
                .slice(0, 6)
                .map((document) => (
                  <DocumentCard
                    key={document.id}
                    {...document}
                    onView={handleViewDocument}
                    onDownload={handleDownloadDocument}
                    onDelete={handleDeleteDocument}
                  />
                ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-2 text-left font-medium">Documento</th>
                    <th className="p-2 text-left font-medium">Categoría</th>
                    <th className="p-2 text-left font-medium">Subido por</th>
                    <th className="p-2 text-left font-medium">Fecha</th>
                    <th className="p-2 text-left font-medium">Tamaño</th>
                    <th className="p-2 text-center font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments
                    .sort(
                      (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime(),
                    )
                    .slice(0, 6)
                    .map((document) => (
                      <tr
                        key={document.id}
                        className="border-t hover:bg-muted/50"
                      >
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                              <span className="text-xs font-bold">
                                {document.fileType?.toUpperCase() || "DOC"}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">
                                {document.title}
                              </div>
                              {document.description && (
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {document.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-2">{document.category}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={document.uploadedBy.avatar}
                              alt={document.uploadedBy.name}
                              className="h-6 w-6 rounded-full"
                            />
                            <span>{document.uploadedBy.name}</span>
                          </div>
                        </td>
                        <td className="p-2">
                          {document.uploadedAt.toLocaleDateString()}
                        </td>
                        <td className="p-2">{document.fileSize}</td>
                        <td className="p-2">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDocument(document.id)}
                            >
                              Ver
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDownloadDocument(
                                  document.id,
                                  document.fileUrl,
                                )
                              }
                            >
                              Descargar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDocument(document.id)}
                              className="text-red-500"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <DocumentUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleUploadDocument}
        categories={CATEGORIES.filter((cat) => cat !== "Todas las Categorías")}
      />

      {selectedDocument && (
        <DocumentViewDialog
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
          document={selectedDocument}
          onDownload={handleDownloadDocument}
        />
      )}
    </div>
  );
}
