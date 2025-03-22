import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export interface ModulePermission {
  id: string;
  name: string;
  description: string;
  permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

// Function to fetch role permissions
export async function fetchRolePermissions(role: string) {
  try {
    const { data, error } = await supabase
      .from("role_permissions")
      .select("*")
      .eq("role", role);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    throw error;
  }
}

// Function to fetch user type permissions
export async function fetchUserTypePermissions(userType: string) {
  try {
    const { data, error } = await supabase
      .from("user_type_permissions")
      .select("*")
      .eq("user_type", userType);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user type permissions:", error);
    throw error;
  }
}

// Function to update role permissions
export async function updateRolePermissions(
  role: string,
  modulePermissions: ModulePermission[],
) {
  try {
    const updates = modulePermissions.map((module) => ({
      role,
      module: module.id,
      can_view: module.permissions.view,
      can_create: module.permissions.create,
      can_edit: module.permissions.edit,
      can_delete: module.permissions.delete,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("role_permissions")
      .upsert(updates, { onConflict: "role,module" });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error updating role permissions:", error);
    return { success: false, error };
  }
}

// Function to update user type permissions
export async function updateUserTypePermissions(
  userType: string,
  modulePermissions: ModulePermission[],
) {
  try {
    const updates = modulePermissions.map((module) => ({
      user_type: userType,
      module: module.id,
      can_view: module.permissions.view,
      can_create: module.permissions.create,
      can_edit: module.permissions.edit,
      can_delete: module.permissions.delete,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("user_type_permissions")
      .upsert(updates, { onConflict: "user_type,module" });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error updating user type permissions:", error);
    return { success: false, error };
  }
}

// Hook to get user permissions
export function useUserPermissions() {
  const [permissions, setPermissions] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserPermissions() {
      try {
        setLoading(true);

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        // For testing purposes, set all permissions to true
        // In a real implementation, you would fetch the user's role and permissions
        const mockPermissions: Record<string, Record<string, boolean>> = {
          documents: { view: true, create: true, edit: true, delete: true },
          content: { view: true, create: true, edit: true, delete: true },
          users: { view: true, create: true, edit: true, delete: true },
          news: { view: true, create: true, edit: true, delete: true },
          calendar: { view: true, create: true, edit: true, delete: true },
          companies: { view: true, create: true, edit: true, delete: true },
        };

        setPermissions(mockPermissions);
      } catch (error) {
        console.error("Error loading user permissions:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserPermissions();
  }, []);

  const hasPermission = (
    module: string,
    action: "view" | "create" | "edit" | "delete",
  ) => {
    // If permissions are still loading, return false
    if (loading) return false;

    // Check if the module exists in permissions
    if (!permissions[module]) return false;

    // Return the permission value for the specified action
    return permissions[module][action] || false;
  };

  return { permissions, loading, hasPermission };
}
