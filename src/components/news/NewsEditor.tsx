import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, X, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Import React Quill WYSIWYG editor
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface NewsEditorProps {
  initialNews?: {
    id?: string;
    title: string;
    content: string;
    excerpt?: string;
    category: string;
    companyId?: string;
    imageUrl?: string;
    isPinned?: boolean;
    visibleTo?: {
      branches: string[];
      userTypes: string[];
    };
    tags: string[];
  };
  onSave: (news: {
    id?: string;
    title: string;
    content: string;
    excerpt?: string;
    category: string;
    companyId?: string;
    imageUrl?: string;
    isPinned?: boolean;
    visibleTo?: {
      branches: string[];
      userTypes: string[];
    };
    tags: string[];
  }) => void;
  onCancel?: () => void;
}

const NEWS_CATEGORIES = [
  "Anuncios",
  "Actualizaciones",
  "Eventos",
  "Formación",
  "Productos",
  "Tecnología",
  "General",
];

const USER_TYPES = [
  "Todos",
  "Delegación",
  "Delegación Expert",
  "Colaborador",
  "Empleado",
  "Responsable de departamento",
  "Administrador",
];

// Quill editor modules and formats
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "image",
  "color",
  "background",
];

export default function NewsEditor({
  initialNews = {
    title: "",
    content: "",
    excerpt: "",
    category: "General",
    companyId: "",
    imageUrl: "",
    isPinned: false,
    visibleTo: {
      branches: ["Todas"],
      userTypes: ["Todos"],
    },
    tags: [],
  },
  onSave,
  onCancel = () => {},
}: NewsEditorProps) {
  const [title, setTitle] = useState(initialNews.title);
  const [content, setContent] = useState(initialNews.content);
  const [excerpt, setExcerpt] = useState(initialNews.excerpt || "");
  const [category, setCategory] = useState(initialNews.category);
  const [companyId, setCompanyId] = useState(initialNews.companyId || "");
  const [imageUrl, setImageUrl] = useState(initialNews.imageUrl || "");
  const [isPinned, setIsPinned] = useState(initialNews.isPinned || false);
  const [visibleToBranches, setVisibleToBranches] = useState<string[]>(
    initialNews.visibleTo?.branches || ["Todas"],
  );
  const [visibleToUserTypes, setVisibleToUserTypes] = useState<string[]>(
    initialNews.visibleTo?.userTypes || ["Todos"],
  );
  const [tags, setTags] = useState<string[]>(initialNews.tags);
  const [currentTag, setCurrentTag] = useState("");
  const [activeTab, setActiveTab] = useState("edit");
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(initialNews.imageUrl || "");

  // State for companies and branches
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [branches, setBranches] = useState<string[]>(["Todas"]);

  // Fetch companies and branches
  useEffect(() => {
    fetchCompanies();
    fetchBranches();
  }, []);

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

  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase
        .from("branches")
        .select("name")
        .order("name", { ascending: true });

      if (error) throw error;
      setBranches(["Todas", ...(data?.map((b) => b.name) || [])]);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const filePath = `news-images/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("assets")
        .upload(filePath, file, {
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("assets")
        .getPublicUrl(filePath);

      setImageUrl(publicUrlData.publicUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      // Revert preview on error
      setPreviewImage(initialNews.imageUrl || "");
    } finally {
      setIsUploading(false);
    }
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

  const handleToggleBranchVisibility = (branch: string) => {
    if (branch === "Todas") {
      setVisibleToBranches(["Todas"]);
      return;
    }

    // If "Todas" is selected and we're adding a specific branch, remove "Todas"
    if (visibleToBranches.includes("Todas")) {
      setVisibleToBranches([branch]);
      return;
    }

    // Toggle the branch
    if (visibleToBranches.includes(branch)) {
      setVisibleToBranches(visibleToBranches.filter((b) => b !== branch));
      // If no branches left, set to "Todas"
      if (visibleToBranches.length <= 1) {
        setVisibleToBranches(["Todas"]);
      }
    } else {
      setVisibleToBranches([...visibleToBranches, branch]);
    }
  };

  const handleToggleUserTypeVisibility = (userType: string) => {
    if (userType === "Todos") {
      setVisibleToUserTypes(["Todos"]);
      return;
    }

    // If "Todos" is selected and we're adding a specific type, remove "Todos"
    if (visibleToUserTypes.includes("Todos")) {
      setVisibleToUserTypes([userType]);
      return;
    }

    // Toggle the user type
    if (visibleToUserTypes.includes(userType)) {
      setVisibleToUserTypes(visibleToUserTypes.filter((t) => t !== userType));
      // If no user types left, set to "Todos"
      if (visibleToUserTypes.length <= 1) {
        setVisibleToUserTypes(["Todos"]);
      }
    } else {
      setVisibleToUserTypes([...visibleToUserTypes, userType]);
    }
  };

  const handleSave = () => {
    if (!title || !content || !category) return;

    // Generate excerpt if not provided
    const finalExcerpt =
      excerpt || content.replace(/<[^>]*>/g, "").substring(0, 150) + "...";

    // Handle company ID correctly
    const finalCompanyId =
      companyId === "ninguna" ? null : companyId || undefined;

    console.log("Saving with company ID:", finalCompanyId);

    onSave({
      id: initialNews.id,
      title,
      content,
      excerpt: finalExcerpt,
      category,
      companyId: finalCompanyId,
      imageUrl: imageUrl || undefined,
      isPinned,
      visibleTo: {
        branches: visibleToBranches,
        userTypes: visibleToUserTypes,
      },
      tags,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {initialNews.id ? "Editar Noticia" : "Crear Noticia"}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Guardar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la noticia"
              required
            />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Editar</TabsTrigger>
              <TabsTrigger value="preview">Vista Previa</TabsTrigger>
            </TabsList>
            <TabsContent value="edit" className="space-y-2">
              <Label htmlFor="content">Contenido *</Label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                className="min-h-[300px]"
              />
            </TabsContent>
            <TabsContent value="preview">
              <Card>
                <CardContent className="p-4">
                  {content ? (
                    <div className="prose max-w-none">
                      <h1>{title || "Noticia sin título"}</h1>
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No hay contenido para previsualizar
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Extracto (opcional)</Label>
            <Input
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Breve resumen de la noticia (se generará automáticamente si se deja vacío)"
            />
            <p className="text-xs text-muted-foreground">
              Si se deja vacío, se generará automáticamente a partir del
              contenido.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Imagen de Portada</Label>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="w-full h-40 flex items-center justify-center bg-muted rounded-md mb-4 overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-muted-foreground text-center p-4">
                      Vista previa de la imagen
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer w-full flex items-center justify-center p-2 border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    <span>{isUploading ? "Subiendo..." : "Subir Imagen"}</span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una categoría" />
              </SelectTrigger>
              <SelectContent>
                {NEWS_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Compañía Relacionada (opcional)</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una compañía" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ninguna">Ninguna</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
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
            <Label>Opciones de Publicación</Label>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Destacar noticia</span>
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Label>Visibilidad - Sucursales</Label>
            <Card>
              <CardContent className="p-4 space-y-2 max-h-40 overflow-y-auto">
                {branches.map((branch) => (
                  <div key={branch} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`branch-${branch}`}
                      checked={visibleToBranches.includes(branch)}
                      onChange={() => handleToggleBranchVisibility(branch)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`branch-${branch}`}
                      className="ml-2 text-sm cursor-pointer"
                    >
                      {branch}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Label>Visibilidad - Tipos de Usuario</Label>
            <Card>
              <CardContent className="p-4 space-y-2 max-h-40 overflow-y-auto">
                {USER_TYPES.map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`userType-${type}`}
                      checked={visibleToUserTypes.includes(type)}
                      onChange={() => handleToggleUserTypeVisibility(type)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`userType-${type}`}
                      className="ml-2 text-sm cursor-pointer"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
