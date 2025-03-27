import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  PlusCircle,
  Search,
  ArrowLeft,
  LayoutGrid,
  List,
} from "lucide-react";
import CompanyCard from "./CompanyCard";
import CompanyEditor from "./CompanyEditor";
import CompanySpecifications from "./CompanySpecifications";
import CompanyView from "./CompanyView";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export interface CompanyItem {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  mediatorAccessUrl?: string;
  contactEmail?: string;
  classification: string;
  createdAt: Date;
  updatedAt: Date;
}

const CLASSIFICATIONS = [
  "Preferentes",
  "Especialistas",
  "Resto de compañías",
  "Agencias de Suscripción",
];

export default function CompanyList() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassification, setSelectedClassification] = useState(
    "Todas las clasificaciones",
  );
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingSpecifications, setIsViewingSpecifications] = useState(false);
  const [isViewingCompany, setIsViewingCompany] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Fetch companies
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedCompanies = data.map((item) => ({
          id: item.id,
          name: item.name,
          logo: item.logo || undefined,
          website: item.website || undefined,
          mediatorAccessUrl: item.mediator_access_url || undefined,
          contactEmail: item.contact_email || undefined,
          classification: item.classification,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        }));
        setCompanies(formattedCompanies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las compañías",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCompanies = companies.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesClassification =
      selectedClassification === "Todas las clasificaciones" ||
      item.classification === selectedClassification;

    return matchesSearch && matchesClassification;
  });

  const handleCreateCompany = () => {
    setSelectedCompany(null);
    setIsEditing(true);
  };

  const handleEditCompany = (id: string) => {
    const company = companies.find((item) => item.id === id);
    if (company) {
      setSelectedCompany(company);
      setIsEditing(true);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    try {
      const { error } = await supabase.from("companies").delete().eq("id", id);

      if (error) throw error;

      setCompanies(companies.filter((item) => item.id !== id));
      toast({
        title: "Compañía eliminada",
        description: "La compañía ha sido eliminada correctamente",
      });
    } catch (error) {
      console.error("Error deleting company:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la compañía",
        variant: "destructive",
      });
    }
  };

  const handleSaveCompany = async (companyData: {
    name: string;
    logo?: string;
    website?: string;
    mediatorAccessUrl?: string;
    contactEmail?: string;
    classification: string;
  }) => {
    try {
      if (selectedCompany) {
        // Update existing company
        const { data, error } = await supabase
          .from("companies")
          .update({
            name: companyData.name,
            logo: companyData.logo || null,
            website: companyData.website || null,
            mediator_access_url: companyData.mediatorAccessUrl || null,
            contact_email: companyData.contactEmail || null,
            classification: companyData.classification,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedCompany.id)
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Compañía actualizada",
          description: "La compañía ha sido actualizada correctamente",
        });
      } else {
        // Create new company
        const { data, error } = await supabase
          .from("companies")
          .insert({
            name: companyData.name,
            logo: companyData.logo || null,
            website: companyData.website || null,
            mediator_access_url: companyData.mediatorAccessUrl || null,
            contact_email: companyData.contactEmail || null,
            classification: companyData.classification,
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Compañía creada",
          description: "La compañía ha sido creada correctamente",
        });
      }

      // Refresh companies list
      fetchCompanies();
      setIsEditing(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error("Error saving company:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la compañía",
        variant: "destructive",
      });
    }
  };

  const handleViewSpecifications = (id: string) => {
    const company = companies.find((item) => item.id === id);
    if (company) {
      setSelectedCompany(company);
      setIsViewingSpecifications(true);
    }
  };

  const handleViewCompany = (id: string) => {
    const company = companies.find((item) => item.id === id);
    if (company) {
      setSelectedCompany(company);
      setIsViewingCompany(true);
    }
  };

  if (isViewingCompany && selectedCompany) {
    return (
      <CompanyView
        companyId={selectedCompany.id}
        onBack={() => {
          setIsViewingCompany(false);
          setSelectedCompany(null);
        }}
      />
    );
  }

  if (isViewingSpecifications && selectedCompany) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => {
              setIsViewingSpecifications(false);
              setSelectedCompany(null);
            }}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a compañías
          </Button>
        </div>
        <CompanySpecifications
          companyId={selectedCompany.id}
          companyName={selectedCompany.name}
        />
      </div>
    );
  }

  if (isEditing) {
    return (
      <CompanyEditor
        initialCompany={
          selectedCompany
            ? {
                name: selectedCompany.name,
                logo: selectedCompany.logo,
                website: selectedCompany.website,
                mediatorAccessUrl: selectedCompany.mediatorAccessUrl,
                contactEmail: selectedCompany.contactEmail,
                classification: selectedCompany.classification,
              }
            : undefined
        }
        onSave={handleSaveCompany}
        onCancel={() => {
          setIsEditing(false);
          setSelectedCompany(null);
        }}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Gestión de Compañías</h1>
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
          <Button onClick={handleCreateCompany}>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Compañía
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar compañías..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={selectedClassification}
          onValueChange={setSelectedClassification}
        >
          <SelectTrigger className="w-full md:w-[250px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Clasificación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas las clasificaciones">
              Todas las clasificaciones
            </SelectItem>
            {CLASSIFICATIONS.map((classification) => (
              <SelectItem key={classification} value={classification}>
                {classification}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando compañías...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No se encontraron compañías. Intente ajustar su búsqueda o filtros.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={() => handleEditCompany(company.id)}
              onDelete={() => handleDeleteCompany(company.id)}
              onViewSpecifications={() => handleViewSpecifications(company.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-2 text-left font-medium">Nombre</th>
                <th className="p-2 text-left font-medium">Clasificación</th>
                <th className="p-2 text-left font-medium">Sitio Web</th>
                <th className="p-2 text-left font-medium">Contacto</th>
                <th className="p-2 text-center font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="border-t hover:bg-muted/50">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      {company.logo && (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-8 w-8 rounded-md object-contain"
                        />
                      )}
                      <span className="font-medium">{company.name}</span>
                    </div>
                  </td>
                  <td className="p-2">{company.classification}</td>
                  <td className="p-2">
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {company.website}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-2">
                    {company.contactEmail ? (
                      <a
                        href={`mailto:${company.contactEmail}`}
                        className="text-blue-600 hover:underline"
                      >
                        {company.contactEmail}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-2">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewCompany(company.id)}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewSpecifications(company.id)}
                      >
                        Especificaciones
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCompany(company.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCompany(company.id)}
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
