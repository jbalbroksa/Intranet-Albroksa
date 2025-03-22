import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PermissionGuard,
  useHasPermission,
} from "@/components/ui/PermissionGuard";
import { PlusCircle, Edit, Trash, Eye, AlertCircle } from "lucide-react";

export default function PermissionExample() {
  // Example using the hook directly
  const canCreateDocuments = useHasPermission("documents", "create");
  const canEditDocuments = useHasPermission("documents", "edit");
  const canDeleteDocuments = useHasPermission("documents", "delete");

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Ejemplo de Permisos - Documentos</CardTitle>
          <CardDescription>
            Este componente muestra cómo los permisos controlan la interfaz de
            usuario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {/* Using the PermissionGuard component */}
            <PermissionGuard module="documents" action="view">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Ver Documentos
              </Button>
            </PermissionGuard>

            <PermissionGuard module="documents" action="create">
              <Button variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Crear Documento
              </Button>
            </PermissionGuard>

            <PermissionGuard module="documents" action="edit">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar Documento
              </Button>
            </PermissionGuard>

            <PermissionGuard module="documents" action="delete">
              <Button variant="outline" size="sm">
                <Trash className="h-4 w-4 mr-2" />
                Eliminar Documento
              </Button>
            </PermissionGuard>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-md">
            <h3 className="text-sm font-medium mb-2">
              Estado de permisos (usando hook):
            </h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center">
                <span
                  className={`w-4 h-4 rounded-full mr-2 ${canCreateDocuments ? "bg-green-500" : "bg-red-500"}`}
                ></span>
                Crear documentos:{" "}
                {canCreateDocuments ? "Permitido" : "No permitido"}
              </li>
              <li className="flex items-center">
                <span
                  className={`w-4 h-4 rounded-full mr-2 ${canEditDocuments ? "bg-green-500" : "bg-red-500"}`}
                ></span>
                Editar documentos:{" "}
                {canEditDocuments ? "Permitido" : "No permitido"}
              </li>
              <li className="flex items-center">
                <span
                  className={`w-4 h-4 rounded-full mr-2 ${canDeleteDocuments ? "bg-green-500" : "bg-red-500"}`}
                ></span>
                Eliminar documentos:{" "}
                {canDeleteDocuments ? "Permitido" : "No permitido"}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ejemplo de Permisos - Usuarios</CardTitle>
          <CardDescription>
            Control de acceso para la gestión de usuarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <PermissionGuard
              module="users"
              action="view"
              fallback={
                <Button variant="outline" size="sm" disabled>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Sin acceso a usuarios
                </Button>
              }
            >
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Ver Usuarios
              </Button>
            </PermissionGuard>

            <PermissionGuard module="users" action="create">
              <Button variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Crear Usuario
              </Button>
            </PermissionGuard>

            <PermissionGuard module="users" action="edit">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar Usuario
              </Button>
            </PermissionGuard>

            <PermissionGuard module="users" action="delete">
              <Button variant="outline" size="sm">
                <Trash className="h-4 w-4 mr-2" />
                Eliminar Usuario
              </Button>
            </PermissionGuard>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
