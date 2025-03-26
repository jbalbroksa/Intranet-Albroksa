import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Save, X, PlusCircle, Trash } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

// Import React Quill WYSIWYG editor
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface CompanySpecificationsProps {
  companyId: string;
  companyName: string;
}

interface SpecificationItem {
  id: string;
  category: string;
  subcategory?: string;
  content: string;
  updatedAt: Date;
}

interface SubcategoryItem {
  id: string;
  name: string;
  parent_category: string;
}

const SPECIFICATION_CATEGORIES = [
  "Siniestros",
  "Gestión de Pólizas",
  "Gestión de Recibos",
  "Contacto Compañía",
  "Tesis Broker Manager",
  "Envío y Montaje de Pólizas",
  "Defensa de Cartera",
  "Información General",
  "Restauración de Contraseñas",
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

export default function CompanySpecifications({
  companyId,
  companyName,
}: CompanySpecificationsProps) {
  const { toast } = useToast();
  const [specifications, setSpecifications] = useState<SpecificationItem[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState(
    SPECIFICATION_CATEGORIES[0],
  );
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch specifications for this company
  useEffect(() => {
    fetchSpecifications();
    fetchSubcategories();
  }, [companyId]);

  const fetchSpecifications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("company_specifications")
        .select("*")
        .eq("company_id", companyId)
        .order("category", { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedSpecs = data.map((item) => ({
          id: item.id,
          category: item.category,
          subcategory: item.subcategory || undefined,
          content: item.content,
          updatedAt: new Date(item.updated_at),
        }));
        setSpecifications(formattedSpecs);
      }
    } catch (error) {
      console.error("Error fetching specifications:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las especificaciones",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch subcategories for specifications
  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from("specification_subcategories")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setSubcategories(data || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las subcategorías",
        variant: "destructive",
      });
    }
  };

  // Get the specification for the current active category and subcategory
  const currentSpecification = specifications.find((spec) => {
    if (activeSubcategory) {
      return (
        spec.category === activeCategory &&
        spec.subcategory === activeSubcategory
      );
    }
    return spec.category === activeCategory && !spec.subcategory;
  });

  // Get filtered subcategories for the current active category
  const filteredSubcategories = subcategories.filter(
    (subcat) => subcat.parent_category === activeCategory,
  );

  const handleEditClick = () => {
    setEditContent(currentSpecification?.content || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim()) return;

    try {
      const { data, error } = await supabase
        .from("specification_subcategories")
        .insert({
          name: newSubcategoryName.trim(),
          parent_category: activeCategory,
        })
        .select()
        .single();

      if (error) throw error;

      setSubcategories([...subcategories, data]);
      setNewSubcategoryName("");
      setIsAddingSubcategory(false);

      toast({
        title: "Subcategoría añadida",
        description: "La subcategoría ha sido añadida correctamente",
      });
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast({
        title: "Error",
        description: "No se pudo añadir la subcategoría",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSpecification = async () => {
    if (!currentSpecification) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("company_specifications")
        .delete()
        .eq("id", currentSpecification.id);

      if (error) throw error;

      // Update local state
      setSpecifications(
        specifications.filter((spec) => spec.id !== currentSpecification.id),
      );

      toast({
        title: "Especificación eliminada",
        description: "La especificación ha sido eliminada correctamente",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error deleting specification:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la especificación",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveSpecification = async () => {
    setIsSaving(true);
    try {
      if (currentSpecification) {
        // Update existing specification
        const { error } = await supabase
          .from("company_specifications")
          .update({
            content: editContent,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentSpecification.id);

        if (error) throw error;

        // Update local state
        setSpecifications(
          specifications.map((spec) =>
            spec.id === currentSpecification.id
              ? {
                  ...spec,
                  content: editContent,
                  updatedAt: new Date(),
                }
              : spec,
          ),
        );

        toast({
          title: "Especificación actualizada",
          description: "La especificación ha sido actualizada correctamente",
        });
      } else {
        // Create new specification
        const { data, error } = await supabase
          .from("company_specifications")
          .insert({
            company_id: companyId,
            category: activeCategory,
            subcategory: activeSubcategory || undefined,
            content: editContent,
          })
          .select()
          .single();

        if (error) throw error;

        // Add to local state
        setSpecifications([
          ...specifications,
          {
            id: data.id,
            category: data.category,
            subcategory: data.subcategory || undefined,
            content: data.content,
            updatedAt: new Date(data.updated_at),
          },
        ]);

        toast({
          title: "Especificación creada",
          description: "La especificación ha sido creada correctamente",
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving specification:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la especificación",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Subcategory Dialog */}
      <Dialog open={isAddingSubcategory} onOpenChange={setIsAddingSubcategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Subcategoría</DialogTitle>
            <DialogDescription>
              Cree una nueva subcategoría para {activeCategory}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subcategoryName">Nombre de la Subcategoría</Label>
              <Input
                id="subcategoryName"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder="Nombre de la subcategoría"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddingSubcategory(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddSubcategory}>Añadir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Especificaciones Particulares: {companyName}
        </h2>
        <div className="flex gap-2">
          {!isEditing && (
            <Button onClick={() => setIsAddingSubcategory(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Subcategoría
            </Button>
          )}
          {!isEditing && (
            <Button onClick={handleEditClick}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Button>
          )}
          {!isEditing && currentSpecification && (
            <Button
              variant="destructive"
              onClick={handleDeleteSpecification}
              disabled={isDeleting}
            >
              <Trash className="mr-2 h-4 w-4" />
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Lateral Categories Menu */}
        <div className="w-64 shrink-0 space-y-4">
          <div className="bg-muted/20 rounded-md p-2">
            <h3 className="font-medium mb-2 px-2">Categorías</h3>
            <div className="space-y-1">
              {SPECIFICATION_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    if (!isEditing) {
                      setActiveCategory(category);
                      setActiveSubcategory(null);
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeCategory === category && !activeSubcategory
                      ? "bg-primary text-primary-foreground"
                      : activeCategory === category
                        ? "bg-primary/20 text-primary"
                        : "hover:bg-muted"
                  } ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isEditing}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredSubcategories.length > 0 && (
            <div className="bg-muted/20 rounded-md p-2">
              <h3 className="font-medium mb-2 px-2">
                Subcategorías de {activeCategory}
              </h3>
              <div className="space-y-1">
                {filteredSubcategories.map((subcat) => (
                  <button
                    key={subcat.id}
                    onClick={() => {
                      if (!isEditing) {
                        setActiveSubcategory(subcat.id);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeSubcategory === subcat.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    } ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isEditing}
                  >
                    {subcat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <ReactQuill
                    theme="snow"
                    value={editContent}
                    onChange={setEditContent}
                    modules={modules}
                    formats={formats}
                    className="min-h-[300px]"
                  />
                </CardContent>
              </Card>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  <X className="mr-2 h-4 w-4" /> Cancelar
                </Button>
                <Button onClick={handleSaveSpecification} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Cargando especificaciones...
              </p>
            </div>
          ) : specifications.some(
              (spec) => spec.category === activeCategory,
            ) ? (
            <Card>
              <CardContent className="p-6">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      specifications.find(
                        (spec) => spec.category === activeCategory,
                      )?.content || "",
                  }}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No hay especificaciones para esta categoría. Haga clic en
                "Editar" para añadir contenido.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
