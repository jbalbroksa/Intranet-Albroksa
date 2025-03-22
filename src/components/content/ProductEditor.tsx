import { useState } from "react";
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
import { Save, X } from "lucide-react";

// Import React Quill WYSIWYG editor
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface ProductEditorProps {
  initialProduct?: {
    title: string;
    content: string;
    procesos: string;
    debilidades: string;
    observaciones: string;
    category: string;
    subcategory?: string;
    tags: string[];
    status: "published" | "draft";
  };
  mainCategories: string[];
  subcategories: string[];
  onSave: (product: {
    title: string;
    content: string;
    procesos: string;
    debilidades: string;
    observaciones: string;
    category: string;
    subcategory?: string;
    tags: string[];
    status: "published" | "draft";
  }) => void;
  onCancel?: () => void;
}

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

export default function ProductEditor({
  initialProduct = {
    title: "",
    content: "",
    procesos: "",
    debilidades: "",
    observaciones: "",
    category: "",
    subcategory: "",
    tags: [],
    status: "draft" as "published" | "draft",
  },
  mainCategories,
  subcategories,
  onSave,
  onCancel = () => {},
}: ProductEditorProps) {
  const [title, setTitle] = useState(initialProduct.title);
  const [content, setContent] = useState(initialProduct.content);
  const [procesos, setProcesos] = useState(initialProduct.procesos);
  const [debilidades, setDebilidades] = useState(initialProduct.debilidades);
  const [observaciones, setObservaciones] = useState(
    initialProduct.observaciones,
  );
  const [category, setCategory] = useState(initialProduct.category);
  const [subcategory, setSubcategory] = useState(
    initialProduct.subcategory || "",
  );
  const [tags, setTags] = useState<string[]>(initialProduct.tags);
  const [currentTag, setCurrentTag] = useState("");
  const [status, setStatus] = useState<"published" | "draft">(
    initialProduct.status,
  );
  const [activeTab, setActiveTab] = useState("edit");

  const filteredSubcategories = subcategories.filter((subcat) => {
    const subcatParts = subcat.split("/");
    return subcatParts.length > 1 && subcatParts[0] === category;
  });

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!title || !content || !category) return;

    onSave({
      title,
      content,
      procesos,
      debilidades,
      observaciones,
      category,
      subcategory: subcategory || undefined,
      tags,
      status,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {initialProduct.title ? "Editar Producto" : "Crear Producto"}
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
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del producto"
              required
            />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="edit">Descripción</TabsTrigger>
              <TabsTrigger value="procesos">Procesos</TabsTrigger>
              <TabsTrigger value="debilidades">Debilidades</TabsTrigger>
              <TabsTrigger value="observaciones">Observaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-2">
              <Label htmlFor="content">Descripción General</Label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                className="min-h-[200px]"
              />
            </TabsContent>

            <TabsContent value="procesos" className="space-y-2">
              <Label htmlFor="procesos">Procesos</Label>
              <ReactQuill
                theme="snow"
                value={procesos}
                onChange={setProcesos}
                modules={modules}
                formats={formats}
                className="min-h-[200px]"
              />
            </TabsContent>

            <TabsContent value="debilidades" className="space-y-2">
              <Label htmlFor="debilidades">Debilidades</Label>
              <ReactQuill
                theme="snow"
                value={debilidades}
                onChange={setDebilidades}
                modules={modules}
                formats={formats}
                className="min-h-[200px]"
              />
            </TabsContent>

            <TabsContent value="observaciones" className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <ReactQuill
                theme="snow"
                value={observaciones}
                onChange={setObservaciones}
                modules={modules}
                formats={formats}
                className="min-h-[200px]"
              />
            </TabsContent>
          </Tabs>

          <Tabs className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="preview">Vista Previa</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <Card>
                <CardContent className="p-4">
                  {content ? (
                    <div className="prose max-w-none">
                      <h1>{title || "Producto sin título"}</h1>
                      <div dangerouslySetInnerHTML={{ __html: content }} />

                      {procesos && (
                        <>
                          <h2>Procesos</h2>
                          <div dangerouslySetInnerHTML={{ __html: procesos }} />
                        </>
                      )}

                      {debilidades && (
                        <>
                          <h2>Debilidades</h2>
                          <div
                            dangerouslySetInnerHTML={{ __html: debilidades }}
                          />
                        </>
                      )}

                      {observaciones && (
                        <>
                          <h2>Observaciones</h2>
                          <div
                            dangerouslySetInnerHTML={{ __html: observaciones }}
                          />
                        </>
                      )}
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
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Categoría Principal *</Label>
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value);
                setSubcategory(""); // Reset subcategory when category changes
              }}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una categoría" />
              </SelectTrigger>
              <SelectContent>
                {mainCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {category && (
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategoría</Label>
              <Select value={subcategory} onValueChange={setSubcategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ninguna">Ninguna</SelectItem>
                  {filteredSubcategories.map((subcat) => (
                    <SelectItem key={subcat} value={subcat}>
                      {subcat.split("/")[1]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
                  <span className="text-sm">Estado</span>
                  <Select
                    value={status}
                    onValueChange={(value: "published" | "draft") =>
                      setStatus(value)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
