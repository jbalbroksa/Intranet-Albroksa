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
  parent_subcategory?: string;
  created_at: string;
  level: number;
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
  const [isAddingSubSubcategory, setIsAddingSubSubcategory] = useState(false);
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
        .order("level", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;

      // Ensure all subcategories have a level property
      const processedData =
        data?.map((item) => ({
          ...item,
          level: item.level || 1, // Default to level 1 if not set
        })) || [];

      setSubcategories(processedData);
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
      // Determine if we're adding to a main category or a subcategory
      const isAddingToSubcategory =
        editingSubcategory && isAddingSubSubcategory;

      // Format the subcategory name appropriately
      let fullName = "";
      let parentSubcategoryId = null;
      let level = 1; // Default level for direct subcategories of main categories

      if (isAddingToSubcategory && editingSubcategory) {
        // Adding a sub-subcategory
        fullName = `${editingSubcategory.name}/${newSubcategoryName.trim()}`;
        parentSubcategoryId = editingSubcategory.id;
        level = editingSubcategory.level + 1;
      } else {
        // Adding a regular subcategory to a main category
        fullName = `${selectedParentCategory}/${newSubcategoryName.trim()}`;
      }

      const { data, error } = await supabase
        .from("content_subcategories")
        .insert({
          name: fullName,
          parent_category: selectedParentCategory,
          parent_subcategory: parentSubcategoryId,
          level: level,
        })
        .select()
        .single();

      if (error) throw error;

      setSubcategories([...subcategories, data]);
      setNewSubcategoryName("");
      setIsAddDialogOpen(false);
      setIsAddingSubSubcategory(false);
      setEditingSubcategory(null);

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
                    const displayName = nameParts[nameParts.length - 1];
                    const indentClass =
                      subcategory.level > 1
                        ? `pl-${Math.min(subcategory.level * 4, 12)}`
                        : "";
                    const parentSubcategory = subcategory.parent_subcategory
                      ? subcategories.find(
                          (s) => s.id === subcategory.parent_subcategory,
                        )
                      : null;
                    const parentName = parentSubcategory
                      ? parentSubcategory.name.split("/").pop()
                      : null;

                    return (
                      <TableRow key={subcategory.id}>
                        <TableCell>
                          <div className={`flex items-center ${indentClass}`}>
                            {subcategory.level > 1 && (
                              <span className="text-muted-foreground text-xs mr-2">
                                ↳
                              </span>
                            )}
                            {displayName}
                          </div>
                        </TableCell>
                        <TableCell>
                          {subcategory.level > 1 && parentName ? (
                            <div className="flex items-center">
                              <span>{subcategory.parent_category}</span>
                              <span className="mx-1 text-muted-foreground">
                                →
                              </span>
                              <span className="text-muted-foreground">
                                {parentName}
                              </span>
                            </div>
                          ) : (
                            subcategory.parent_category
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setIsAddDialogOpen(true);
                                setEditingSubcategory(subcategory);
                                setIsAddingSubSubcategory(true);
                                setSelectedParentCategory(
                                  subcategory.parent_category,
                                );
                                setNewSubcategoryName("");
                              }}
                              title="Añadir subcategoría"
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(subcategory)}
                              title="Editar"
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
                              title="Eliminar"
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
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setIsAddingSubSubcategory(false);
            setEditingSubcategory(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isAddingSubSubcategory
                ? "Añadir Subcategoría Anidada"
                : "Añadir Subcategoría"}
            </DialogTitle>
            <DialogDescription>
              {isAddingSubSubcategory
                ? `Cree una nueva subcategoría dentro de "${editingSubcategory?.name.split("/").pop()}"`
                : "Cree una nueva subcategoría para organizar los productos."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!isAddingSubSubcategory && (
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
            )}
            {isAddingSubSubcategory && editingSubcategory && (
              <div className="space-y-2">
                <Label>Categoría Principal</Label>
                <div className="p-2 border rounded-md bg-muted/20">
                  {editingSubcategory.parent_category}
                </div>
              </div>
            )}
            {isAddingSubSubcategory && editingSubcategory && (
              <div className="space-y-2">
                <Label>Subcategoría Padre</Label>
                <div className="p-2 border rounded-md bg-muted/20">
                  {editingSubcategory.name.split("/").pop()}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="subcategoryName">
                {isAddingSubSubcategory
                  ? "Nombre de la Subcategoría Anidada"
                  : "Nombre de la Subcategoría"}
              </Label>
              <Input
                id="subcategoryName"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder={
                  isAddingSubSubcategory
                    ? "Nombre de la subcategoría anidada"
                    : "Nombre de la subcategoría"
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsAddingSubSubcategory(false);
                setEditingSubcategory(null);
              }}
            >
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
