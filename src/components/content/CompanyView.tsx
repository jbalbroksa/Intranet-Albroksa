import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Mail, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { CompanyItem } from "./CompanyList";
import CompanySpecifications from "./CompanySpecifications";

interface CompanyViewProps {
  companyId: string;
  onBack: () => void;
}

export default function CompanyView({ companyId, onBack }: CompanyViewProps) {
  const { toast } = useToast();
  const [company, setCompany] = useState<CompanyItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "specifications">(
    "details",
  );

  useEffect(() => {
    fetchCompany();
  }, [companyId]);

  const fetchCompany = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId)
        .single();

      if (error) throw error;

      if (data) {
        setCompany({
          id: data.id,
          name: data.name,
          logo: data.logo || undefined,
          website: data.website || undefined,
          mediatorAccessUrl: data.mediator_access_url || undefined,
          contactEmail: data.contact_email || undefined,
          classification: data.classification,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        });
      }
    } catch (error) {
      console.error("Error fetching company:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información de la compañía",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  function getClassificationVariant(classification: string) {
    switch (classification) {
      case "Preferentes":
        return "default";
      case "Especialistas":
        return "secondary";
      case "Resto de compañías":
        return "outline";
      case "Agencias de Suscripción":
        return "destructive";
      default:
        return "outline";
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a compañías
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Cargando información de la compañía...
          </p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a compañías
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontró la compañía</p>
        </div>
      </div>
    );
  }

  if (activeTab === "specifications") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("details")}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a detalles
          </Button>
          <Button variant="outline" onClick={onBack}>
            Volver a lista de compañías
          </Button>
        </div>
        <CompanySpecifications
          companyId={company.id}
          companyName={company.name}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a compañías
        </Button>
        <Button onClick={() => setActiveTab("specifications")}>
          <FileText className="mr-2 h-4 w-4" /> Ver Especificaciones
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 flex items-center justify-center bg-muted rounded-md overflow-hidden">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-4xl font-bold text-muted-foreground">
                  {company.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-2xl">{company.name}</CardTitle>
              <div className="mt-2">
                <Badge
                  variant={getClassificationVariant(company.classification)}
                  className="text-sm"
                >
                  {company.classification}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información General</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Sitio Web
                  </h4>
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center"
                    >
                      {company.website
                        .replace(/^https?:\/\//, "")
                        .replace(/\/$/, "")}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No disponible</span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Email del responsable
                  </h4>
                  {company.contactEmail ? (
                    <a
                      href={`mailto:${company.contactEmail}`}
                      className="text-primary hover:underline inline-flex items-center"
                    >
                      {company.contactEmail}
                      <Mail className="ml-1 h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No disponible</span>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Acceso y Recursos</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Acceso para mediadores
                  </h4>
                  {company.mediatorAccessUrl ? (
                    <a
                      href={company.mediatorAccessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center"
                    >
                      Acceder al portal
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No disponible</span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Identificador
                  </h4>
                  <span>{company.id}</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Última actualización
                  </h4>
                  <span>
                    {new Date(company.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
