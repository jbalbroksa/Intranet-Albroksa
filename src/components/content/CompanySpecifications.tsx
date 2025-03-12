import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Save, X } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  // Get the specification for the current active category
  const currentSpecification = specifications.find(
    (spec) => spec.category === activeCategory,
  );

  const handleEditClick = () => {
    setEditContent(currentSpecification?.content || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Especificaciones Particulares: {companyName}
        </h2>
        {!isEditing && (
          <Button onClick={handleEditClick}>
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Button>
        )}
      </div>

      <Tabs
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="w-full"
      >
        <TabsList className="flex flex-wrap h-auto py-1">
          {SPECIFICATION_CATEGORIES.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="my-1 whitespace-nowrap"
              disabled={isEditing}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {SPECIFICATION_CATEGORIES.map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            {isEditing && activeCategory === category ? (
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
            ) : specifications.some((spec) => spec.category === category) ? (
              <Card>
                <CardContent className="p-6">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html:
                        specifications.find(
                          (spec) => spec.category === category,
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
