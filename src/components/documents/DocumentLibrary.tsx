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

const MOCK_DOCUMENTS: DocumentProps[] = [
  {
    id: "1",
    title: "Insurance Policy Guidelines 2024",
    description: "Official guidelines for policy creation and management",
    fileType: "pdf",
    category: "Policies",
    uploadedBy: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    uploadedAt: new Date(2024, 2, 15),
    fileSize: "2.4 MB",
    version: "1.2",
    tags: ["guidelines", "policies", "official"],
  },
  {
    id: "2",
    title: "Franchise Onboarding Checklist",
    description: "Step-by-step guide for new franchise onboarding",
    fileType: "docx",
    category: "Onboarding",
    uploadedBy: {
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    uploadedAt: new Date(2024, 3, 5),
    fileSize: "1.8 MB",
    version: "2.0",
    tags: ["onboarding", "checklist", "franchisee"],
  },
  {
    id: "3",
    title: "Q1 2024 Sales Report",
    description: "Quarterly sales performance across all franchises",
    fileType: "xlsx",
    category: "Reports",
    uploadedBy: {
      name: "Jessica Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    },
    uploadedAt: new Date(2024, 3, 10),
    fileSize: "3.2 MB",
    version: "1.0",
    tags: ["sales", "quarterly", "reports"],
  },
  {
    id: "4",
    title: "Marketing Strategy Presentation",
    description: "2024 marketing strategy for franchise network",
    fileType: "pptx",
    category: "Marketing",
    uploadedBy: {
      name: "David Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    uploadedAt: new Date(2024, 2, 28),
    fileSize: "5.7 MB",
    version: "1.1",
    tags: ["marketing", "strategy", "presentation"],
  },
  {
    id: "5",
    title: "Compliance Training Manual",
    description: "Regulatory compliance training for all staff",
    fileType: "pdf",
    category: "Training",
    uploadedBy: {
      name: "Amanda Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda",
    },
    uploadedAt: new Date(2024, 1, 20),
    fileSize: "4.1 MB",
    version: "2.3",
    tags: ["compliance", "training", "regulatory"],
  },
  {
    id: "6",
    title: "Customer Service Best Practices",
    description: "Guide for delivering exceptional customer service",
    fileType: "docx",
    category: "Training",
    uploadedBy: {
      name: "Robert Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    },
    uploadedAt: new Date(2024, 3, 2),
    fileSize: "1.5 MB",
    version: "1.4",
    tags: ["customer service", "best practices", "training"],
  },
];

const CATEGORIES = [
  "All Categories",
  "Policies",
  "Onboarding",
  "Reports",
  "Marketing",
  "Training",
  "Legal",
  "HR",
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

  const handleDownloadDocument = (id: string) => {
    // In a real application, this would trigger a download
    console.log(`Downloading document with ID: ${id}`);
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
        <h1 className="text-2xl font-bold">Document Repository</h1>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <FileUp className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
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
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">Recently Added</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="flex-1">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No documents found. Try adjusting your search or filters.
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

        <TabsContent value="favorites">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Favorite documents will appear here.
            </p>
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
        />
      )}
    </div>
  );
}
