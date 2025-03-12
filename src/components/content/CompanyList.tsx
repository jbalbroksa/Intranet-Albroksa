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
import { Filter, PlusCircle, Search, ArrowLeft } from "lucide-react";
import CompanyCard from "./CompanyCard";
import CompanyEditor from "./CompanyEditor";
import CompanySpecifications from "./CompanySpecifications";
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
  const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

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
        <Button onClick={handleCreateCompany}>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Compañía
        </Button>
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
      ) : (
        <div className="grid grid-cols-1 gap-4">
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
      )}
    </div>
  );
}
