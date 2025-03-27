import UserManagement from "../users/UserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import BranchManagement from "../branches/BranchManagement";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function UserManagementPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  // Handle direct navigation to /user-management by setting default tab
  useEffect(() => {
    // Set active tab based on hash
    if (location.hash) {
      const hash = location.hash.replace("#", "");
      if (["users", "branches"].includes(hash)) {
        setActiveTab(hash);
      }
    } else if (location.pathname === "/user-management") {
      // Default to users tab if no hash
      setActiveTab("users");
      // Update URL hash without triggering a navigation
      window.history.replaceState(null, "", `/user-management#users`);
    }
  }, [location]); // Removed navigate from dependencies to avoid redirect loops

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL hash without triggering a navigation
    window.history.replaceState(null, "", `/user-management#${value}`);
  };

  return (
    <DashboardLayout activeItem="Usuarios">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="branches">Sucursales</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="branches">
          <BranchManagement />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
