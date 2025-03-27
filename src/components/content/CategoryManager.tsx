import React, { useState, useEffect } from "react";
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
import {
  PlusCircle,
  Trash,
  Edit,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  parent_id?: string | null;
  parent_subcategory?: string | null;
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
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [editingSubcategory, setEditingSubcategory] =
    useState<Subcategory | null>(null);
  const [isAddingSubSubcategory, setIsAddingSubSubcategory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<string | null>(
    null,
  );

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

      // Calculate level based on parent
      let level = 1; // Default level for top-level subcategories
      let parentId = null;

      if (isAddingToSubcategory && editingSubcategory) {
        // Adding a sub-subcategory
        level = editingSubcategory.level + 1;
        parentId = editingSubcategory.id;
      } else if (selectedParentId) {
        // Adding to a selected parent
        const parentSubcat = subcategories.find(
          (s) => s.id === selectedParentId,
        );
        if (parentSubcat) {
          level = parentSubcat.level + 1;
          parentId = parentSubcat.id;
        }
      }

      // Get sibling subcategories (no display order needed)
      const siblingSubcats = subcategories.filter(
        (s) =>
          s.parent_category === selectedParentCategory &&
          s.parent_id === parentId,
      );

      // Format the subcategory name appropriately
      let fullName = "";

      if (isAddingToSubcategory && editingSubcategory) {
        // Adding a sub-subcategory
        fullName = `${editingSubcategory.name}/${newSubcategoryName.trim()}`;
      } else if (selectedParentId) {
        // Adding to a selected parent
        const parentSubcat = subcategories.find(
          (s) => s.id === selectedParentId,
        );
        if (parentSubcat) {
          fullName = `${parentSubcat.name}/${newSubcategoryName.trim()}`;
        } else {
          fullName = `${selectedParentCategory}/${newSubcategoryName.trim()}`;
        }
      } else {
        // Adding a regular subcategory to a main category
        fullName = `${selectedParentCategory}/${newSubcategoryName.trim()}`;
      }

      const { data, error } = await supabase
        .from("content_subcategories")
        .insert({
          name: fullName,
          parent_category: selectedParentCategory,
          parent_id: parentId,
          parent_subcategory: parentId || null, // For backward compatibility, ensure null if parentId is null
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
      setSelectedParentId(null);

      // Expand the parent category if adding a subcategory
      if (parentId) {
        setExpandedCategories({
          ...expandedCategories,
          [parentId]: true,
        });
      }

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
      // Calculate level based on parent
      let level = 1; // Default level for top-level subcategories
      let parentId = selectedParentId;

      if (parentId) {
        const parentSubcat = subcategories.find((s) => s.id === parentId);
        if (parentSubcat) {
          level = parentSubcat.level + 1;
        }
      }

      // Format the subcategory name appropriately
      let fullName = "";

      if (parentId) {
        const parentSubcat = subcategories.find((s) => s.id === parentId);
        if (parentSubcat) {
          fullName = `${parentSubcat.name}/${newSubcategoryName.trim()}`;
        } else {
          fullName = `${selectedParentCategory}/${newSubcategoryName.trim()}`;
        }
      } else {
        fullName = `${selectedParentCategory}/${newSubcategoryName.trim()}`;
      }

      const { data, error } = await supabase
        .from("content_subcategories")
        .update({
          name: fullName,
          parent_category: selectedParentCategory,
          parent_id: parentId,
          parent_subcategory: parentId, // For backward compatibility
          level: level,
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
      setSelectedParentId(null);
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

  const handleDeleteSubcategory = (id: string) => {
    setSubcategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSubcategory = async () => {
    if (!subcategoryToDelete) return;

    try {
      // First check if this subcategory has children
      const { data: childrenData, error: childrenError } = await supabase
        .from("content_subcategories")
        .select("id")
        .eq("parent_id", subcategoryToDelete);

      if (childrenError) throw childrenError;

      if (childrenData && childrenData.length > 0) {
        toast({
          title: "Error",
          description:
            "No se puede eliminar una subcategoría que tiene subcategorías hijas. Elimine primero las subcategorías hijas.",
          variant: "destructive",
        });
        setIsDeleteDialogOpen(false);
        setSubcategoryToDelete(null);
        return;
      }

      const { error } = await supabase
        .from("content_subcategories")
        .delete()
        .eq("id", subcategoryToDelete);

      if (error) throw error;

      // Refresh subcategories instead of just filtering state
      await fetchSubcategories();

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
    } finally {
      setIsDeleteDialogOpen(false);
      setSubcategoryToDelete(null);
    }
  };

  const openEditDialog = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSelectedParentCategory(subcategory.parent_category);
    setSelectedParentId(subcategory.parent_id || null);

    // Extract just the name part from the full name (parent/name)
    const nameParts = subcategory.name.split("/");
    setNewSubcategoryName(
      nameParts.length > 0 ? nameParts[nameParts.length - 1] : subcategory.name,
    );

    setIsEditDialogOpen(true);
  };

  const toggleExpand = (id: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [id]: !expandedCategories[id],
    });
  };

  // Organize subcategories into a hierarchical structure
  const organizeSubcategories = () => {
    // First, group by parent category
    const categorized: Record<string, Subcategory[]> = {};

    MAIN_CATEGORIES.forEach((category) => {
      // Get only top-level subcategories for this category (those without a parent_id)
      categorized[category] = subcategories.filter(
        (subcat) => subcat.parent_category === category && !subcat.parent_id,
      );

      // Sort by name for consistent display
      categorized[category].sort((a, b) => {
        const aName = a.name.split("/").pop() || a.name;
        const bName = b.name.split("/").pop() || b.name;
        return aName.localeCompare(bName);
      });
    });

    return categorized;
  };

  // Get child subcategories for a given parent
  const getChildSubcategories = (parentId: string) => {
    const children = subcategories.filter(
      (subcat) => subcat.parent_id === parentId,
    );

    // Sort children by name for consistent display
    return children.sort((a, b) => {
      const aName = a.name.split("/").pop() || a.name;
      const bName = b.name.split("/").pop() || b.name;
      return aName.localeCompare(bName);
    });
  };

  const renderSubcategory = (subcategory: Subcategory, depth: number = 0) => {
    const children = getChildSubcategories(subcategory.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedCategories[subcategory.id];
    const nameParts = subcategory.name.split("/");
    const displayName = nameParts[nameParts.length - 1];

    return (
      <React.Fragment key={subcategory.id}>
        <TableRow>
          <TableCell>
            <div
              className="flex items-center"
              style={{ paddingLeft: `${depth * 20}px` }}
            >
              {hasChildren ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 mr-1"
                  onClick={() => toggleExpand(subcategory.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              ) : (
                <div className="w-7"></div>
              )}
              {displayName}
            </div>
          </TableCell>
          <TableCell>{subcategory.parent_category}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsAddDialogOpen(true);
                  setEditingSubcategory(subcategory);
                  setIsAddingSubSubcategory(true);
                  setSelectedParentCategory(subcategory.parent_category);
                  setSelectedParentId(subcategory.id);
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
                onClick={() => handleDeleteSubcategory(subcategory.id)}
                className="text-red-500 hover:text-red-700"
                title="Eliminar"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>

        {/* Render children if expanded */}
        {isExpanded &&
          hasChildren &&
          children.map((child) => renderSubcategory(child, depth + 1))}
      </React.Fragment>
    );
  };

  const categorizedSubcategories = organizeSubcategories();

  // Get available parent subcategories for the selected category
  const getAvailableParentSubcategories = () => {
    return subcategories.filter(
      (s) =>
        s.parent_category === selectedParentCategory &&
        (!editingSubcategory || s.id !== editingSubcategory.id), // Can't select self as parent
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Categorías</h2>
        <Button
          onClick={() => {
            setIsAddDialogOpen(true);
            setIsAddingSubSubcategory(false);
            setEditingSubcategory(null);
            setSelectedParentId(null);
            setNewSubcategoryName("");
          }}
        >
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
                  {MAIN_CATEGORIES.map((category) => (
                    <React.Fragment key={category}>
                      {categorizedSubcategories[category]?.map((subcategory) =>
                        renderSubcategory(subcategory),
                      )}
                    </React.Fragment>
                  ))}
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
            setSelectedParentId(null);
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
            {!isAddingSubSubcategory && (
              <div className="space-y-2">
                <Label htmlFor="parentSubcategory">
                  Subcategoría Padre (opcional)
                </Label>
                <Select
                  value={selectedParentId || ""}
                  onValueChange={(value) => setSelectedParentId(value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una subcategoría padre (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Ninguna (nivel superior)</SelectItem>
                    {getAvailableParentSubcategories().map((subcat) => {
                      const nameParts = subcat.name.split("/");
                      const displayName = nameParts[nameParts.length - 1];
                      return (
                        <SelectItem key={subcat.id} value={subcat.id}>
                          {displayName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
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
                setSelectedParentId(null);
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
              <Label htmlFor="parentSubcategory">
                Subcategoría Padre (opcional)
              </Label>
              <Select
                value={selectedParentId || ""}
                onValueChange={(value) => setSelectedParentId(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una subcategoría padre (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Ninguna (nivel superior)</SelectItem>
                  {getAvailableParentSubcategories().map((subcat) => {
                    const nameParts = subcat.name.split("/");
                    const displayName = nameParts[nameParts.length - 1];
                    return (
                      <SelectItem key={subcat.id} value={subcat.id}>
                        {displayName}
                      </SelectItem>
                    );
                  })}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La subcategoría será eliminada
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSubcategory}
              className="bg-destructive text-destructive-foreground"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
