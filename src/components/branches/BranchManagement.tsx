import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, PlusCircle, Search, LayoutGrid, List } from "lucide-react";
import BranchCard from "./BranchCard";
import BranchEditor from "./BranchEditor";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export interface BranchItem {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function BranchManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState(
    "Todas las provincias",
  );
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Fetch branches
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("branches")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedBranches = data.map((item) => ({
          id: item.id,
          name: item.name || "",
          address: item.address || "",
          postalCode: item.postal_code || "",
          city: item.city || "",
          province: item.province || "",
          contactPerson: item.contact_person || undefined,
          email: item.email || undefined,
          phone: item.phone || undefined,
          website: item.website || undefined,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        }));
        setBranches(formattedBranches);

        // Extract unique provinces for filter
        const uniqueProvinces = [
          ...new Set(formattedBranches.map((branch) => branch.province)),
        ].filter(Boolean);
        setProvinces(uniqueProvinces.sort());
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las sucursales",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch =
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProvince =
      selectedProvince === "Todas las provincias" ||
      branch.province === selectedProvince;

    return matchesSearch && matchesProvince;
  });

  const handleCreateBranch = () => {
    setSelectedBranch(null);
    setIsEditing(true);
  };

  const handleEditBranch = (id: string) => {
    const branch = branches.find((item) => item.id === id);
    if (branch) {
      setSelectedBranch(branch);
      setIsEditing(true);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    try {
      const { error } = await supabase.from("branches").delete().eq("id", id);

      if (error) throw error;

      setBranches(branches.filter((branch) => branch.id !== id));
      toast({
        title: "Sucursal eliminada",
        description: "La sucursal ha sido eliminada correctamente",
      });
    } catch (error) {
      console.error("Error deleting branch:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la sucursal",
        variant: "destructive",
      });
    }
  };

  const handleSaveBranch = async (branchData: {
    id?: string;
    name: string;
    address: string;
    postalCode: string;
    city: string;
    province: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    website?: string;
  }) => {
    try {
      if (selectedBranch) {
        // Update existing branch
        const { data, error } = await supabase
          .from("branches")
          .update({
            name: branchData.name,
            address: branchData.address,
            postal_code: branchData.postalCode,
            city: branchData.city,
            province: branchData.province,
            contact_person: branchData.contactPerson || null,
            email: branchData.email || null,
            phone: branchData.phone || null,
            website: branchData.website || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedBranch.id)
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Sucursal actualizada",
          description: "La sucursal ha sido actualizada correctamente",
        });
      } else {
        // Create new branch
        const branchId = branchData.id || crypto.randomUUID();
        const { data, error } = await supabase
          .from("branches")
          .insert({
            id: branchId,
            name: branchData.name,
            address: branchData.address,
            postal_code: branchData.postalCode,
            city: branchData.city,
            province: branchData.province,
            contact_person: branchData.contactPerson || null,
            email: branchData.email || null,
            phone: branchData.phone || null,
            website: branchData.website || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Sucursal creada",
          description: "La sucursal ha sido creada correctamente",
        });
      }

      // Refresh branches list
      fetchBranches();
      setIsEditing(false);
      setSelectedBranch(null);
    } catch (error) {
      console.error("Error saving branch:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la sucursal",
        variant: "destructive",
      });
    }
  };

  if (isEditing) {
    return (
      <BranchEditor
        initialBranch={
          selectedBranch
            ? {
                id: selectedBranch.id,
                name: selectedBranch.name,
                address: selectedBranch.address,
                postalCode: selectedBranch.postalCode,
                city: selectedBranch.city,
                province: selectedBranch.province,
                contactPerson: selectedBranch.contactPerson,
                email: selectedBranch.email,
                phone: selectedBranch.phone,
                website: selectedBranch.website,
              }
            : undefined
        }
        onSave={handleSaveBranch}
        onCancel={() => {
          setIsEditing(false);
          setSelectedBranch(null);
        }}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Gestión de Sucursales</h1>
        <div className="flex items-center gap-2">
          <div className="bg-muted rounded-md flex items-center p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("grid")}
              aria-label="Vista de cuadrícula"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("table")}
              aria-label="Vista de tabla"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleCreateBranch}>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Sucursal
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar sucursales..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
          <SelectTrigger className="w-full md:w-[220px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Provincia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas las provincias">
              Todas las provincias
            </SelectItem>
            {provinces.map((province) => (
              <SelectItem key={province} value={province}>
                {province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando sucursales...</p>
        </div>
      ) : filteredBranches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No se encontraron sucursales. Intente ajustar su búsqueda o filtros.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBranches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              onEdit={() => handleEditBranch(branch.id)}
              onDelete={() => handleDeleteBranch(branch.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-2 text-left font-medium">Nombre</th>
                <th className="p-2 text-left font-medium">Dirección</th>
                <th className="p-2 text-left font-medium">Ciudad</th>
                <th className="p-2 text-left font-medium">Provincia</th>
                <th className="p-2 text-left font-medium">Contacto</th>
                <th className="p-2 text-center font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map((branch) => (
                <tr key={branch.id} className="border-t hover:bg-muted/50">
                  <td className="p-2 font-medium">{branch.name}</td>
                  <td className="p-2">{branch.address}</td>
                  <td className="p-2">{branch.city}</td>
                  <td className="p-2">{branch.province}</td>
                  <td className="p-2">
                    {branch.contactPerson ? (
                      <div>
                        <div>{branch.contactPerson}</div>
                        {branch.email && (
                          <a
                            href={`mailto:${branch.email}`}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {branch.email}
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-2">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditBranch(branch.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBranch(branch.id)}
                        className="text-red-500"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
