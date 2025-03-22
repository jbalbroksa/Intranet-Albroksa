import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Save, X, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { USER_TYPES } from "./UserManagement";

interface UserEditorProps {
  initialUser?: {
    id?: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    extension?: string;
    description?: string;
    telegramUsername?: string;
    branch?: string;
    userType: string;
    isAdmin: boolean;
  };
  branches: string[];
  onSave: (user: {
    id?: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    extension?: string;
    description?: string;
    telegramUsername?: string;
    branch?: string;
    userType: string;
    isAdmin: boolean;
  }) => void;
  onCancel?: () => void;
}

function UserEditor({
  initialUser = {
    fullName: "",
    email: "",
    avatarUrl: "",
    extension: "",
    description: "",
    telegramUsername: "",
    branch: "",
    userType: "Empleado",
    isAdmin: false,
  },
  branches,
  onSave,
  onCancel = () => {},
}: UserEditorProps) {
  const [fullName, setFullName] = useState(initialUser.fullName);
  const [email, setEmail] = useState(initialUser.email);
  const [avatarUrl, setAvatarUrl] = useState(initialUser.avatarUrl || "");
  const [extension, setExtension] = useState(initialUser.extension || "");
  const [description, setDescription] = useState(initialUser.description || "");
  const [telegramUsername, setTelegramUsername] = useState(
    initialUser.telegramUsername || "",
  );
  const [branch, setBranch] = useState(initialUser.branch || "ninguna");
  const [userType, setUserType] = useState(initialUser.userType);
  const [isAdmin, setIsAdmin] = useState(initialUser.isAdmin);
  const [isUploading, setIsUploading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(
    initialUser.avatarUrl || "",
  );

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setPreviewAvatar(previewUrl);

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const filePath = `avatars/${Date.now()}.${fileExt}`;

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

      setAvatarUrl(publicUrlData.publicUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      // Revert preview on error
      setPreviewAvatar(initialUser.avatarUrl || "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (!fullName || !email) return;

    onSave({
      id: initialUser.id,
      fullName,
      email,
      avatarUrl,
      extension: extension || undefined,
      description: description || undefined,
      telegramUsername: telegramUsername || undefined,
      branch: branch || undefined,
      userType,
      isAdmin,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {initialUser.id ? "Editar Usuario" : "Crear Usuario"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre y Apellidos *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nombre completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="extension">Extensión</Label>
              <Input
                id="extension"
                value={extension}
                onChange={(e) => setExtension(e.target.value)}
                placeholder="Ej: 1234"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegramUsername">Usuario de Telegram</Label>
              <Input
                id="telegramUsername"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                placeholder="@usuario"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción del usuario..."
              rows={4}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Fotografía</Label>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="w-32 h-32 flex items-center justify-center bg-muted rounded-full mb-4 overflow-hidden">
                  {previewAvatar ? (
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={previewAvatar} alt="Avatar preview" />
                      <AvatarFallback>
                        {fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="text-muted-foreground text-center p-4">
                      Vista previa
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="avatar-upload"
                    className="cursor-pointer w-full flex items-center justify-center p-2 border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    <span>{isUploading ? "Subiendo..." : "Subir Foto"}</span>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">Sucursal</Label>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una sucursal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ninguna">Ninguna</SelectItem>
                {branches.map((branchName) => (
                  <SelectItem key={branchName} value={branchName}>
                    {branchName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">Tipo de Usuario *</Label>
            <Select value={userType} onValueChange={setUserType} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un tipo" />
              </SelectTrigger>
              <SelectContent>
                {USER_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isAdmin">Administrador</Label>
              <Switch
                id="isAdmin"
                checked={isAdmin}
                onCheckedChange={setIsAdmin}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Los administradores tienen acceso completo a todas las funciones
              del sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserEditor;
