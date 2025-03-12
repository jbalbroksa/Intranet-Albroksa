import UserManagement from "../users/UserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "../dashboard/layout/DashboardLayout";

export default function UserManagementPage() {
  return (
    <DashboardLayout activeItem="Usuarios">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="branches">Sucursales</TabsTrigger>
          <TabsTrigger value="permissions">Permisos</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="branches">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              La gestión de sucursales estará disponible próximamente.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="permissions">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              La gestión de permisos estará disponible próximamente.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
