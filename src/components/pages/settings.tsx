import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "../settings/ProfileSettings";
import SecuritySettings from "../settings/SecuritySettings";
import NotificationSettings from "../settings/NotificationSettings";
import AppearanceSettings from "../settings/AppearanceSettings";
import AccessControlSettings from "../settings/AccessControlSettings";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  PermissionGuard,
  useHasPermission,
} from "@/components/ui/PermissionGuard";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { profile, loading } = useUserProfile();
  const canEditUsers = useHasPermission("users", "edit");

  // Reset to profile tab if user doesn't have access to the current tab
  useEffect(() => {
    if (!loading && activeTab === "access-control" && !canEditUsers) {
      setActiveTab("profile");
    }
  }, [loading, activeTab, canEditUsers]);

  return (
    <DashboardLayout activeItem="Configuración">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configuración</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="appearance">Apariencia</TabsTrigger>

            {/* Only show access control tab for users with edit permissions */}
            <PermissionGuard module="users" action="edit">
              <TabsTrigger value="access-control">
                Control de Acceso
              </TabsTrigger>
            </PermissionGuard>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>

          <TabsContent value="access-control">
            <PermissionGuard module="users" action="edit">
              <AccessControlSettings />
            </PermissionGuard>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
