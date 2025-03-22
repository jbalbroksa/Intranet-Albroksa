import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, UserCheck, Building, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ModulePermission,
  updateRolePermissions,
  updateUserTypePermissions,
  fetchRolePermissions,
  fetchUserTypePermissions,
} from "@/lib/permissions";

export default function PermissionManager() {
  const [activeTab, setActiveTab] = useState("roles");
  const [userRole, setUserRole] = useState("admin");
  const [userType, setUserType] = useState("delegacion");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Define module permissions for roles
  const [rolePermissions, setRolePermissions] = useState<ModulePermission[]>([
    {
      id: "documents",
      name: "Documentos",
      description: "Acceso al repositorio de documentos",
      permissions: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },
    },
    {
      id: "content",
      name: "Contenido",
      description: "Acceso a la gestión de contenido",
      permissions: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },
    },
    {
      id: "users",
      name: "Usuarios",
      description: "Acceso a la gestión de usuarios",
      permissions: {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
    },
    {
      id: "news",
      name: "Noticias",
      description: "Acceso a la gestión de noticias",
      permissions: {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
    },
    {
      id: "calendar",
      name: "Calendario",
      description: "Acceso a la gestión del calendario",
      permissions: {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
    },
    {
      id: "companies",
      name: "Compañías",
      description: "Acceso a la gestión de compañías",
      permissions: {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
    },
  ]);

  // Define module permissions for user types (initially the same as roles)
  const [typePermissions, setTypePermissions] = useState<ModulePermission[]>([
    ...rolePermissions.map((p) => ({
      ...p,
      permissions: { ...p.permissions },
    })),
  ]);

  // Load permissions when role or user type changes
  useEffect(() => {
    const loadRolePermissions = async () => {
      try {
        setLoading(true);
        const data = await fetchRolePermissions(userRole);

        if (data && data.length > 0) {
          const updatedPermissions = rolePermissions.map((module) => {
            const permData = data.find((p) => p.module === module.id);
            if (permData) {
              return {
                ...module,
                permissions: {
                  view: permData.can_view,
                  create: permData.can_create,
                  edit: permData.can_edit,
                  delete: permData.can_delete,
                },
              };
            }
            return module;
          });
          setRolePermissions(updatedPermissions);
        }
      } catch (error) {
        console.error("Error loading role permissions:", error);
        setMessage({
          text: "Error al cargar los permisos del rol",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "roles") {
      loadRolePermissions();
    }
  }, [userRole, activeTab]);

  useEffect(() => {
    const loadUserTypePermissions = async () => {
      try {
        setLoading(true);
        const data = await fetchUserTypePermissions(userType);

        if (data && data.length > 0) {
          const updatedPermissions = typePermissions.map((module) => {
            const permData = data.find((p) => p.module === module.id);
            if (permData) {
              return {
                ...module,
                permissions: {
                  view: permData.can_view,
                  create: permData.can_create,
                  edit: permData.can_edit,
                  delete: permData.can_delete,
                },
              };
            }
            return module;
          });
          setTypePermissions(updatedPermissions);
        }
      } catch (error) {
        console.error("Error loading user type permissions:", error);
        setMessage({
          text: "Error al cargar los permisos del tipo de usuario",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "user-types") {
      loadUserTypePermissions();
    }
  }, [userType, activeTab]);

  const handleToggleRolePermission = (
    moduleId: string,
    permission: keyof ModulePermission["permissions"],
  ) => {
    setRolePermissions(
      rolePermissions.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              permissions: {
                ...module.permissions,
                [permission]: !module.permissions[permission],
              },
            }
          : module,
      ),
    );
  };

  const handleToggleTypePermission = (
    moduleId: string,
    permission: keyof ModulePermission["permissions"],
  ) => {
    setTypePermissions(
      typePermissions.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              permissions: {
                ...module.permissions,
                [permission]: !module.permissions[permission],
              },
            }
          : module,
      ),
    );
  };

  const handleSaveRoleSettings = async () => {
    try {
      setLoading(true);
      const result = await updateRolePermissions(userRole, rolePermissions);

      if (result.success) {
        setMessage({
          text: "Permisos de rol guardados correctamente",
          type: "success",
        });
      } else {
        throw new Error("Error al guardar los permisos");
      }
    } catch (error) {
      console.error("Error saving role permissions:", error);
      setMessage({
        text: "Error al guardar los permisos del rol",
        type: "error",
      });
    } finally {
      setLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const handleSaveTypeSettings = async () => {
    try {
      setLoading(true);
      const result = await updateUserTypePermissions(userType, typePermissions);

      if (result.success) {
        setMessage({
          text: "Permisos de tipo de usuario guardados correctamente",
          type: "success",
        });
      } else {
        throw new Error("Error al guardar los permisos");
      }
    } catch (error) {
      console.error("Error saving user type permissions:", error);
      setMessage({
        text: "Error al guardar los permisos del tipo de usuario",
        type: "error",
      });
    } finally {
      setLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="roles">
            <Shield className="h-4 w-4 mr-2" />
            Permisos por Rol
          </TabsTrigger>
          <TabsTrigger value="user-types">
            <User className="h-4 w-4 mr-2" />
            Permisos por Tipo de Usuario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Permisos por Rol</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={userRole}
                onValueChange={setUserRole}
                className="space-y-4 mb-6"
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="admin" id="role-admin" />
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor="role-admin"
                      className="flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4 text-primary" />
                      Administrador
                      <Badge className="ml-2">Acceso Total</Badge>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Acceso completo a todas las funciones y configuraciones
                      del sistema
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="user" id="role-user" />
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor="role-user"
                      className="flex items-center gap-2"
                    >
                      <Users className="h-4 w-4 text-primary" />
                      Usuario
                      <Badge variant="outline" className="ml-2">
                        Acceso Limitado
                      </Badge>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Acceso básico para ver contenido según su tipo de usuario
                    </p>
                  </div>
                </div>
              </RadioGroup>

              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Configurar permisos para el rol{" "}
                  {userRole === "admin" ? "Administrador" : "Usuario"}
                </p>

                <div className="border rounded-md">
                  <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                    <div>Módulo</div>
                    <div className="text-center">Ver</div>
                    <div className="text-center">Crear</div>
                    <div className="text-center">Editar</div>
                    <div className="text-center">Eliminar</div>
                  </div>

                  {rolePermissions.map((module) => (
                    <div
                      key={module.id}
                      className="grid grid-cols-5 gap-4 p-4 border-b last:border-0 items-center"
                    >
                      <div>
                        <p className="font-medium">{module.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {module.description}
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <Switch
                          checked={module.permissions.view}
                          onCheckedChange={() =>
                            handleToggleRolePermission(module.id, "view")
                          }
                          disabled={userRole === "admin" || loading}
                        />
                      </div>
                      <div className="flex justify-center">
                        <Switch
                          checked={module.permissions.create}
                          onCheckedChange={() =>
                            handleToggleRolePermission(module.id, "create")
                          }
                          disabled={userRole === "admin" || loading}
                        />
                      </div>
                      <div className="flex justify-center">
                        <Switch
                          checked={module.permissions.edit}
                          onCheckedChange={() =>
                            handleToggleRolePermission(module.id, "edit")
                          }
                          disabled={userRole === "admin" || loading}
                        />
                      </div>
                      <div className="flex justify-center">
                        <Switch
                          checked={module.permissions.delete}
                          onCheckedChange={() =>
                            handleToggleRolePermission(module.id, "delete")
                          }
                          disabled={userRole === "admin" || loading}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {userRole === "admin" && (
                  <p className="text-sm text-muted-foreground italic">
                    El rol de Administrador tiene acceso completo a todas las
                    funciones por defecto
                  </p>
                )}
              </div>

              <Separator className="my-6" />

              {message.text && (
                <div
                  className={`p-3 rounded-md mb-4 ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {message.text}
                </div>
              )}

              <Button
                onClick={handleSaveRoleSettings}
                disabled={userRole === "admin" || loading}
              >
                {loading ? "Guardando..." : "Guardar Permisos"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-types">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Permisos por Tipo de Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="user-type" className="mb-2 block">
                  Seleccionar Tipo de Usuario
                </Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger id="user-type" className="w-full max-w-xs">
                    <SelectValue placeholder="Seleccionar tipo de usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delegacion">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        Delegación
                      </div>
                    </SelectItem>
                    <SelectItem value="delegacion_expert">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        Delegación Expert
                      </div>
                    </SelectItem>
                    <SelectItem value="colaborador">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Colaborador
                      </div>
                    </SelectItem>
                    <SelectItem value="responsable_departamento">
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Responsable de departamento
                      </div>
                    </SelectItem>
                    <SelectItem value="administrador">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Administrador
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  Los permisos por tipo de usuario se combinan con los permisos
                  por rol
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Configurar permisos para el tipo de usuario{" "}
                  {userType === "delegacion"
                    ? "Delegación"
                    : userType === "delegacion_expert"
                      ? "Delegación Expert"
                      : userType === "colaborador"
                        ? "Colaborador"
                        : userType === "responsable_departamento"
                          ? "Responsable de departamento"
                          : "Administrador"}
                </p>

                <div className="border rounded-md">
                  <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                    <div>Módulo</div>
                    <div className="text-center">Ver</div>
                    <div className="text-center">Crear</div>
                    <div className="text-center">Editar</div>
                    <div className="text-center">Eliminar</div>
                  </div>

                  {typePermissions.map((module) => (
                    <div
                      key={module.id}
                      className="grid grid-cols-5 gap-4 p-4 border-b last:border-0 items-center"
                    >
                      <div>
                        <p className="font-medium">{module.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {module.description}
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <Switch
                          checked={module.permissions.view}
                          onCheckedChange={() =>
                            handleToggleTypePermission(module.id, "view")
                          }
                          disabled={loading}
                        />
                      </div>
                      <div className="flex justify-center">
                        <Switch
                          checked={module.permissions.create}
                          onCheckedChange={() =>
                            handleToggleTypePermission(module.id, "create")
                          }
                          disabled={loading}
                        />
                      </div>
                      <div className="flex justify-center">
                        <Switch
                          checked={module.permissions.edit}
                          onCheckedChange={() =>
                            handleToggleTypePermission(module.id, "edit")
                          }
                          disabled={loading}
                        />
                      </div>
                      <div className="flex justify-center">
                        <Switch
                          checked={module.permissions.delete}
                          onCheckedChange={() =>
                            handleToggleTypePermission(module.id, "delete")
                          }
                          disabled={loading}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {message.text && (
                <div
                  className={`p-3 rounded-md mb-4 ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {message.text}
                </div>
              )}

              <Button onClick={handleSaveTypeSettings} disabled={loading}>
                {loading ? "Guardando..." : "Guardar Permisos"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
