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
  title?: string;
  content: string;
  updatedAt: Date;
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
  const [activeCategory, setActiveCategory] = useState(
    SPECIFICATION_CATEGORIES[0],
  );
  const [activeSpecification, setActiveSpecification] = useState<string | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingSpecification, setIsAddingSpecification] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch specifications for this company
  useEffect(() => {
    fetchSpecifications();
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
          title: item.title || undefined,
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

  // Get specifications for the current active category
  const categorySpecifications = specifications.filter(
    (spec) => spec.category === activeCategory,
  );

  // Get the currently selected specification
  const currentSpecification = activeSpecification
    ? specifications.find((spec) => spec.id === activeSpecification)
    : null;

  const handleEditClick = () => {
    setEditTitle(currentSpecification?.title || "");
    setEditContent(currentSpecification?.content || "");
    setIsEditing(true);
  };

  const handleAddSpecification = () => {
    setEditTitle("");
    setEditContent("");
    setIsAddingSpecification(true);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsAddingSpecification(false);
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
      setActiveSpecification(null);

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
      if (!isAddingSpecification && currentSpecification) {
        // Update existing specification
        const { error } = await supabase
          .from("company_specifications")
          .update({
            title: editTitle,
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
                  title: editTitle,
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
            title: editTitle,
            content: editContent,
          })
          .select()
          .single();

        if (error) throw error;

        // Add to local state
        const newSpec = {
          id: data.id,
          category: data.category,
          title: data.title || undefined,
          content: data.content,
          updatedAt: new Date(data.updated_at),
        };

        setSpecifications([...specifications, newSpec]);
        setActiveSpecification(data.id);

        toast({
          title: "Especificación creada",
          description: "La especificación ha sido creada correctamente",
        });
      }

      setIsEditing(false);
      setIsAddingSpecification(false);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Especificaciones Particulares: {companyName}
        </h2>
        <div className="flex gap-2">
          {!isEditing && (
            <Button onClick={handleAddSpecification}>
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Especificación
            </Button>
          )}
          {!isEditing && currentSpecification && (
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
        {/* Left sidebar with categories and specifications */}
        <div className="w-64 shrink-0 space-y-4">
          <div className="bg-muted/20 rounded-md p-2">
            <h3 className="font-medium mb-2 px-2">ESPECIFICACIONES</h3>
            <div className="space-y-1">
              {SPECIFICATION_CATEGORIES.map((category) => {
                // Get specifications for this category
                const categorySpecs = specifications.filter(
                  (spec) => spec.category === category,
                );

                return (
                  <div key={category} className="mb-2">
                    <button
                      onClick={() => {
                        if (!isEditing) {
                          setActiveCategory(category);
                          setActiveSpecification(null);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                        activeCategory === category
                          ? "bg-primary/20 text-primary"
                          : "hover:bg-muted"
                      } ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isEditing}
                    >
                      {category.charAt(0).toUpperCase() +
                        category.slice(1).toLowerCase()}
                    </button>

                    {/* Nested specifications under this category */}
                    {activeCategory === category &&
                      categorySpecs.length > 0 && (
                        <div className="ml-3 mt-1 space-y-1 border-l-2 border-muted pl-2">
                          {categorySpecs.map((spec) => (
                            <button
                              key={spec.id}
                              onClick={() => {
                                if (!isEditing) {
                                  setActiveSpecification(spec.id);
                                }
                              }}
                              className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                                activeSpecification === spec.id
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              } ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                              disabled={isEditing}
                            >
                              {spec.title || "Sin título"}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-muted/10 p-2 mb-4 rounded-md">
            <h3 className="font-medium">CONTENIDO DE LA ESPECIFICACIÓN</h3>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="specificationTitle">
                  Título de la Especificación
                </Label>
                <Input
                  id="specificationTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Título de la especificación"
                  className="w-full"
                />
              </div>
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
          ) : currentSpecification ? (
            <Card>
              <CardContent className="p-6">
                {currentSpecification.title && (
                  <h3 className="text-xl font-bold mb-4">
                    {currentSpecification.title}
                  </h3>
                )}
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: currentSpecification.content || "",
                  }}
                />
              </CardContent>
            </Card>
          ) : activeCategory && categorySpecifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No hay especificaciones para {activeCategory}. Haga clic en
                "Añadir Especificación" para crear una nueva.
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Seleccione una especificación para ver su contenido.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
