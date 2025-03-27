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
import { supabase } from "@/lib/supabase";
import ReactQuill from "react-quill";
// Note: The findDOMNode deprecation warning from ReactQuill is a known issue
// with the library and will be fixed in future versions.
import "react-quill/dist/quill.snow.css";

interface Company {
  id: string;
  name: string;
}

interface ProductEditorProps {
  product: {
    id?: string;
    title: string;
    content: string;
    procesos?: string;
    debilidades?: string;
    observaciones?: string;
    category: string;
    subcategory?: string;
    company_id?: string;
  } | null;
  onSave: (productData: any) => void;
  onCancel: () => void;
}

const MAIN_CATEGORIES = [
  "Seguro para particulares",
  "Seguros para empresas",
  "Seguros Agrarios",
  "Seguros Personales",
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

function ProductEditor({ product, onSave, onCancel }: ProductEditorProps) {
  const [title, setTitle] = useState(product?.title || "");
  const [content, setContent] = useState(product?.content || "");
  const [procesos, setProcesos] = useState(product?.procesos || "");
  const [debilidades, setDebilidades] = useState(product?.debilidades || "");
  const [observaciones, setObservaciones] = useState(
    product?.observaciones || "",
  );
  const [category, setCategory] = useState(
    product?.category || MAIN_CATEGORIES[0],
  );
  const [subcategory, setSubcategory] = useState(product?.subcategory || "");
  const [companyId, setCompanyId] = useState(product?.company_id || "none");

  const [subcategories, setSubcategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch subcategories and companies when component mounts or category changes
  useEffect(() => {
    fetchSubcategories();
    fetchCompanies();
  }, [category]);

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from("content_subcategories")
        .select("id, name")
        .eq("parent_category", category)
        .order("name", { ascending: true });

      if (error) throw error;
      setSubcategories(data || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      content,
      procesos,
      debilidades,
      observaciones,
      category,
      subcategory,
      company_id: companyId === "none" ? null : companyId,
    });
  };

  const getSubcategoryDisplayName = (fullName: string) => {
    const parts = fullName.split("/");
    return parts.length > 1 ? parts[1] : fullName;
  };

  return (
    <div className="p-6 bg-card rounded-lg border">
      <h2 className="text-2xl font-bold mb-6">
        {product ? "Editar Producto" : "Nuevo Producto"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {MAIN_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategoría</Label>
              <Select
                value={subcategory}
                onValueChange={setSubcategory}
                disabled={isLoading || subcategories.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subcat) => (
                    <SelectItem
                      key={subcat.id}
                      value={subcat.name || `subcat-${subcat.id}`}
                    >
                      {getSubcategoryDisplayName(
                        subcat.name || `Subcategoría ${subcat.id}`,
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Compañía (opcional)</Label>
            <Select
              value={companyId}
              onValueChange={setCompanyId}
              disabled={companies.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una compañía (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ninguna</SelectItem>
                {/* Map through companies */}
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="content">Descripción</Label>
            <div className="min-h-[200px] border rounded-md">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Descripción detallada del producto..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="procesos">Procesos</Label>
            <div className="min-h-[200px] border rounded-md">
              <ReactQuill
                theme="snow"
                value={procesos}
                onChange={setProcesos}
                modules={modules}
                formats={formats}
                placeholder="Información sobre los procesos..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="debilidades">Debilidades</Label>
            <div className="min-h-[200px] border rounded-md">
              <ReactQuill
                theme="snow"
                value={debilidades}
                onChange={setDebilidades}
                modules={modules}
                formats={formats}
                placeholder="Debilidades del producto..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <div className="min-h-[200px] border rounded-md">
              <ReactQuill
                theme="snow"
                value={observaciones}
                onChange={setObservaciones}
                modules={modules}
                formats={formats}
                placeholder="Observaciones adicionales..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{product ? "Actualizar" : "Crear"}</Button>
        </div>
      </form>
    </div>
  );
}

export default ProductEditor;
