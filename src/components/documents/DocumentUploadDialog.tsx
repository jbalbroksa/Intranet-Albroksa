import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentProps } from "./DocumentCard";
import { FileUp, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (document: DocumentProps) => void;
  categories: string[];
}

// Allowed file types
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// File extensions for display
const FILE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

interface Company {
  id: string;
  name: string;
}

interface ProductCategory {
  name: string;
}

interface Product {
  id: string;
  title: string;
  category: string;
  subcategory: string | null;
}

export default function DocumentUploadDialog({
  isOpen,
  onClose,
  onUpload,
  categories,
}: DocumentUploadDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // New state for linking
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("none");

  const [productCategories, setProductCategories] = useState<string[]>([]);
  const [selectedProductCategory, setSelectedProductCategory] =
    useState<string>("none");

  const [productSubcategories, setProductSubcategories] = useState<string[]>(
    [],
  );
  const [selectedProductSubcategory, setSelectedProductSubcategory] =
    useState<string>("none");

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("none");

  // Fetch companies, categories, and products on mount
  useEffect(() => {
    fetchCompanies();
    fetchProductCategories();
    fetchProducts();
  }, []);

  // Filter products when category or subcategory changes
  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products];

      if (selectedProductCategory && selectedProductCategory !== "none") {
        filtered = filtered.filter(
          (p) => p.category === selectedProductCategory,
        );
      }

      if (selectedProductSubcategory && selectedProductSubcategory !== "none") {
        filtered = filtered.filter(
          (p) => p.subcategory === selectedProductSubcategory,
        );
      }

      setFilteredProducts(filtered);
    }
  }, [products, selectedProductCategory, selectedProductSubcategory]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedProductCategory && selectedProductCategory !== "none") {
      fetchProductSubcategories(selectedProductCategory);
    } else {
      setProductSubcategories([]);
      setSelectedProductSubcategory("none");
    }
  }, [selectedProductCategory]);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchProductCategories = async () => {
    try {
      // Get unique categories from content table
      const { data, error } = await supabase
        .from("content")
        .select("category")
        .order("category", { ascending: true });

      if (error) throw error;

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data?.map((item) => item.category) || []),
      );
      setProductCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching product categories:", error);
    }
  };

  const fetchProductSubcategories = async (category: string) => {
    try {
      const { data, error } = await supabase
        .from("content")
        .select("subcategory")
        .eq("category", category)
        .not("subcategory", "is", null);

      if (error) throw error;

      // Extract unique subcategories
      const uniqueSubcategories = Array.from(
        new Set(data?.map((item) => item.subcategory) || []),
      );
      setProductSubcategories(uniqueSubcategories.filter(Boolean) as string[]);
    } catch (error) {
      console.error("Error fetching product subcategories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("content")
        .select("id, title, category, subcategory")
        .order("title", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !file) return;

    setIsUploading(true);
    setFileError(null);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop() || "";
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `documents/${user.id}/${fileName}`;
      const fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";

      const { data: fileData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      const fileUrl = publicUrlData.publicUrl;

      // Create document record in database
      const { data: documentData, error: documentError } = await supabase
        .from("documents")
        .insert({
          title,
          description: description || null,
          file_type: fileExt.toLowerCase(),
          category: category,
          file_size: fileSize,
          version: "1.0",
          file_path: filePath,
          uploaded_by: user.id,
          // Add linking fields
          company_id: selectedCompany !== "none" ? selectedCompany : null,
          content_id: selectedProduct !== "none" ? selectedProduct : null,
          category:
            selectedProductCategory !== "none" ? selectedProductCategory : null,
          subcategory:
            selectedProductSubcategory !== "none"
              ? selectedProductSubcategory
              : null,
        })
        .select()
        .single();

      if (documentError) throw documentError;

      // Add tags if provided
      if (tags.length > 0) {
        const tagInserts = tags.map((tag) => ({
          document_id: documentData.id,
          tag,
        }));

        const { error: tagError } = await supabase
          .from("document_tags")
          .insert(tagInserts);

        if (tagError) throw tagError;
      }

      // Create document object for UI update
      const newDocument: DocumentProps = {
        id: documentData.id,
        title,
        description,
        fileType: fileExt.toLowerCase(),
        category,
        uploadedBy: {
          name: "Current User", // In a real app, this would be the current user
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser",
        },
        uploadedAt: new Date(),
        fileSize: fileSize,
        version: "1.0",
        tags,
        fileUrl,
        // Add linked entity information
        companyId: selectedCompany !== "none" ? selectedCompany : undefined,
        companyName:
          selectedCompany !== "none"
            ? companies.find((c) => c.id === selectedCompany)?.name
            : undefined,
        productId: selectedProduct !== "none" ? selectedProduct : undefined,
        productTitle:
          selectedProduct !== "none"
            ? products.find((p) => p.id === selectedProduct)?.title
            : undefined,
        productCategory:
          selectedProductCategory !== "none"
            ? selectedProductCategory
            : undefined,
        productSubcategory:
          selectedProductSubcategory !== "none"
            ? selectedProductSubcategory
            : undefined,
      };

      onUpload(newDocument);
      resetForm();
    } catch (error) {
      console.error("Error uploading document:", error);
      setFileError("Error uploading document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setTags([]);
    setCurrentTag("");
    setFile(null);
    setFileError(null);
    setSelectedCompany("none");
    setSelectedProductCategory("none");
    setSelectedProductSubcategory("none");
    setSelectedProduct("none");
  };

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check if file type is allowed
      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        setFileError(
          "Tipo de archivo no permitido. Solo se permiten archivos JPG, PNG, PDF y DOCX.",
        );
        e.target.value = "";
        return;
      }

      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setFileError(
          "El archivo es demasiado grande. El tamaño máximo es 10MB.",
        );
        e.target.value = "";
        return;
      }

      setFile(selectedFile);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Subir Documento</DialogTitle>
          <DialogDescription>
            Sube un nuevo documento al repositorio. Los campos marcados con *
            son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Introduce el título del documento"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Introduce la descripción del documento"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría de Documento *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Compañía Relacionada</Label>
              <Select
                value={selectedCompany}
                onValueChange={setSelectedCompany}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una compañía" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguna</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productCategory">Categoría de Producto</Label>
              <Select
                value={selectedProductCategory}
                onValueChange={setSelectedProductCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría de producto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguna</SelectItem>
                  {productCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productSubcategory">
                Subcategoría de Producto
              </Label>
              <Select
                value={selectedProductSubcategory}
                onValueChange={setSelectedProductSubcategory}
                disabled={
                  !selectedProductCategory || productSubcategories.length === 0
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguna</SelectItem>
                  {productSubcategories.map((subcat) => (
                    <SelectItem key={subcat} value={subcat}>
                      {subcat.split("/")[1] || subcat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Producto Relacionado</Label>
            <Select
              value={selectedProduct}
              onValueChange={setSelectedProduct}
              disabled={filteredProducts.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un producto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ninguno</SelectItem>
                {filteredProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Etiquetas</Label>
            <div className="flex">
              <Input
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Añadir etiquetas"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                className="ml-2"
              >
                Añadir
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-secondary-foreground/70 hover:text-secondary-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Archivo *</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              required
              accept=".jpg,.jpeg,.png,.pdf,.docx"
            />
            {fileError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}
            {file && !fileError && (
              <p className="text-sm text-muted-foreground">
                Archivo seleccionado: {file.name} (
                {(file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Formatos permitidos: JPG, PNG, PDF, DOCX. Tamaño máximo: 10MB.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isUploading || !!fileError}>
              {isUploading ? (
                <>
                  <span className="animate-pulse">Subiendo...</span>
                </>
              ) : (
                <>
                  <FileUp className="mr-2 h-4 w-4" /> Subir
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
