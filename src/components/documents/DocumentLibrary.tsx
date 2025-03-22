import { useState } from "react";
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
import { FileUp, Filter, Search } from "lucide-react";
import DocumentCard, { DocumentProps } from "./DocumentCard";
import DocumentUploadDialog from "./DocumentUploadDialog";
import DocumentViewDialog from "./DocumentViewDialog";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentProps | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "All Categories" ||
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
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const handleUploadDocument = (newDocument: DocumentProps) => {
    setDocuments([newDocument, ...documents]);
    setIsUploadDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Repositorio de Documentos</h1>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <FileUp className="mr-2 h-4 w-4" /> Subir Documento
        </Button>
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
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No se encontraron documentos. Intente ajustar su búsqueda o
                filtros.
              </p>
            </div>
          ) : (
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
          )}
        </TabsContent>

        <TabsContent value="recent">
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
        </TabsContent>
      </Tabs>

      <DocumentUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleUploadDocument}
        categories={CATEGORIES.filter((cat) => cat !== "All Categories")}
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
