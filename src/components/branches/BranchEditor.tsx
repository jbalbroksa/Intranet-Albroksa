import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";

interface BranchEditorProps {
  initialBranch?: {
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
  };
  onSave: (branch: {
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
  }) => void;
  onCancel?: () => void;
}

export default function BranchEditor({
  initialBranch = {
    name: "",
    address: "",
    postalCode: "",
    city: "",
    province: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
  },
  onSave,
  onCancel = () => {},
}: BranchEditorProps) {
  const [name, setName] = useState(initialBranch.name);
  const [address, setAddress] = useState(initialBranch.address);
  const [postalCode, setPostalCode] = useState(initialBranch.postalCode);
  const [city, setCity] = useState(initialBranch.city);
  const [province, setProvince] = useState(initialBranch.province);
  const [contactPerson, setContactPerson] = useState(
    initialBranch.contactPerson || "",
  );
  const [email, setEmail] = useState(initialBranch.email || "");
  const [phone, setPhone] = useState(initialBranch.phone || "");
  const [website, setWebsite] = useState(initialBranch.website || "");

  const handleSave = () => {
    if (!name || !address || !postalCode || !city || !province) return;

    onSave({
      id: initialBranch.id,
      name,
      address,
      postalCode,
      city,
      province,
      contactPerson: contactPerson || undefined,
      email: email || undefined,
      phone: phone || undefined,
      website: website || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {initialBranch.id ? "Editar Sucursal" : "Crear Sucursal"}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la sucursal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Calle, número, piso..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Código Postal *</Label>
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Ej: 28001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Localidad *</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej: Madrid"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="province">Provincia *</Label>
            <Input
              id="province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Ej: Madrid"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Persona de Contacto</Label>
            <Input
              id="contactPerson"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Nombre y apellidos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: 912345678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Página Web</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://www.ejemplo.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
