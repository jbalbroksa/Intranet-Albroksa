import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import BranchManagement from "../branches/BranchManagement";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UserManagementComponent from "../dashboard/UserManagement";

export default function UserManagementPage() {
  const location = useLocation();
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
  }, [location.hash, location.pathname]); // Only depend on hash and pathname

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
          <UserManagementComponent />
        </TabsContent>
        <TabsContent value="branches">
          <BranchManagement />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
