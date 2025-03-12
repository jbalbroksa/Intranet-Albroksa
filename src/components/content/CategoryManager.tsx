import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash, Edit } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const MAIN_CATEGORIES = [
  "Seguro para particulares",
  "Seguros para empresas",
  "Seguros Agrarios",
  "Seguros Personales",
];

interface Subcategory {
  id: string;
  name: string;
  parent_category: string;
  created_at: string;
}

export default function CategoryManager() {
  const { toast } = useToast();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState(
    MAIN_CATEGORIES[0],
  );
  const [editingSubcategory, setEditingSubcategory] =
    useState<Subcategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("content_subcategories")
        .select("*")
        .order("parent_category", { ascending: true })
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim()) return;

    try {
      // Format the subcategory name as "parent/name"
      const fullName = `${selectedParentCategory}/${newSubcategoryName.trim()}`;

      const { data, error } = await supabase
        .from("content_subcategories")
        .insert({
          name: fullName,
          parent_category: selectedParentCategory,
        })
        .select()
        .single();

      if (error) throw error;

      setSubcategories([...subcategories, data]);
      setNewSubcategoryName("");
      setIsAddDialogOpen(false);

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

  const handleEditSubcategory = async () => {
    if (!editingSubcategory || !newSubcategoryName.trim()) return;

    try {
      // Format the subcategory name as "parent/name"
      const fullName = `${selectedParentCategory}/${newSubcategoryName.trim()}`;

      const { data, error } = await supabase
        .from("content_subcategories")
        .update({
          name: fullName,
          parent_category: selectedParentCategory,
        })
        .eq("id", editingSubcategory.id)
        .select()
        .single();

      if (error) throw error;

      setSubcategories(
        subcategories.map((subcat) =>
          subcat.id === editingSubcategory.id ? data : subcat,
        ),
      );
      setNewSubcategoryName("");
      setEditingSubcategory(null);
      setIsEditDialogOpen(false);

      toast({
        title: "Subcategoría actualizada",
        description: "La subcategoría ha sido actualizada correctamente",
      });
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la subcategoría",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from("content_subcategories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSubcategories(subcategories.filter((subcat) => subcat.id !== id));

      toast({
        title: "Subcategoría eliminada",
        description: "La subcategoría ha sido eliminada correctamente",
      });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la subcategoría",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSelectedParentCategory(subcategory.parent_category);
    // Extract just the name part from the full name (parent/name)
    const nameParts = subcategory.name.split("/");
    setNewSubcategoryName(
      nameParts.length > 1 ? nameParts[1] : subcategory.name,
    );
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Categorías</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Subcategoría
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Categorías Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MAIN_CATEGORIES.map((category) => (
              <div key={category} className="p-4 border rounded-md bg-muted/20">
                <h4 className="font-medium">{category}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Categoría principal (no editable)
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Subcategorías</h3>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando subcategorías...</p>
            </div>
          ) : subcategories.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">
                No hay subcategorías. Añada una nueva subcategoría usando el
                botón de arriba.
              </p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría Principal</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subcategories.map((subcategory) => {
                    const nameParts = subcategory.name.split("/");
                    const displayName =
                      nameParts.length > 1 ? nameParts[1] : subcategory.name;

                    return (
                      <TableRow key={subcategory.id}>
                        <TableCell>{displayName}</TableCell>
                        <TableCell>{subcategory.parent_category}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(subcategory)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteSubcategory(subcategory.id)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Add Subcategory Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Subcategoría</DialogTitle>
            <DialogDescription>
              Cree una nueva subcategoría para organizar los productos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="parentCategory">Categoría Principal</Label>
              <Select
                value={selectedParentCategory}
                onValueChange={setSelectedParentCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una categoría principal" />
                </SelectTrigger>
                <SelectContent>
                  {MAIN_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddSubcategory}>Añadir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Subcategoría</DialogTitle>
            <DialogDescription>
              Modifique la información de la subcategoría.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editParentCategory">Categoría Principal</Label>
              <Select
                value={selectedParentCategory}
                onValueChange={setSelectedParentCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una categoría principal" />
                </SelectTrigger>
                <SelectContent>
                  {MAIN_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editSubcategoryName">
                Nombre de la Subcategoría
              </Label>
              <Input
                id="editSubcategoryName"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder="Nombre de la subcategoría"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleEditSubcategory}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
