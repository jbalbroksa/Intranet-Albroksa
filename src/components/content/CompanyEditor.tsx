import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Save, X, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CompanyEditorProps {
  initialCompany?: {
    name: string;
    logo?: string;
    website?: string;
    mediatorAccessUrl?: string;
    contactEmail?: string;
    classification: string;
  };
  onSave: (company: {
    name: string;
    logo?: string;
    website?: string;
    mediatorAccessUrl?: string;
    contactEmail?: string;
    classification: string;
  }) => void;
  onCancel?: () => void;
}

const CLASSIFICATIONS = [
  "Preferentes",
  "Especialistas",
  "Resto de compañías",
  "Agencias de Suscripción",
];

export default function CompanyEditor({
  initialCompany = {
    name: "",
    logo: "",
    website: "",
    mediatorAccessUrl: "",
    contactEmail: "",
    classification: "Resto de compañías",
  },
  onSave,
  onCancel = () => {},
}: CompanyEditorProps) {
  const [name, setName] = useState(initialCompany.name);
  const [logo, setLogo] = useState(initialCompany.logo || "");
  const [website, setWebsite] = useState(initialCompany.website || "");
  const [mediatorAccessUrl, setMediatorAccessUrl] = useState(
    initialCompany.mediatorAccessUrl || "",
  );
  const [contactEmail, setContactEmail] = useState(
    initialCompany.contactEmail || "",
  );
  const [classification, setClassification] = useState(
    initialCompany.classification,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(initialCompany.logo || "");

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setPreviewLogo(previewUrl);

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const filePath = `company-logos/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("assets")
        .upload(filePath, file, {
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("assets")
        .getPublicUrl(filePath);

      setLogo(publicUrlData.publicUrl);
    } catch (error) {
      console.error("Error uploading logo:", error);
      // Revert preview on error
      setPreviewLogo(initialCompany.logo || "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (!name) return;

    onSave({
      name,
      logo,
      website,
      mediatorAccessUrl,
      contactEmail,
      classification,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {initialCompany.name ? "Editar Compañía" : "Crear Compañía"}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Guardar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Compañía *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la compañía"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Sitio Web</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mediatorAccessUrl">
                URL de Acceso para Mediadores
              </Label>
              <Input
                id="mediatorAccessUrl"
                type="url"
                value={mediatorAccessUrl}
                onChange={(e) => setMediatorAccessUrl(e.target.value)}
                placeholder="https://mediadores.ejemplo.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email del Responsable</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contacto@ejemplo.com"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Logo de la Compañía</Label>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="w-full h-40 flex items-center justify-center bg-muted rounded-md mb-4 overflow-hidden">
                  {previewLogo ? (
                    <img
                      src={previewLogo}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-muted-foreground text-center p-4">
                      Vista previa del logo
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="logo-upload"
                    className="cursor-pointer w-full flex items-center justify-center p-2 border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    <span>{isUploading ? "Subiendo..." : "Subir Logo"}</span>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                      disabled={isUploading}
                    />
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Label htmlFor="classification">Clasificación *</Label>
            <Select
              value={classification}
              onValueChange={setClassification}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una clasificación" />
              </SelectTrigger>
              <SelectContent>
                {CLASSIFICATIONS.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
