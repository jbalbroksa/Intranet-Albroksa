import React from "react";
import { useUserPermissions } from "@/lib/permissions";

interface PermissionGuardProps {
  module: string;
  action: "view" | "create" | "edit" | "delete";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A component that conditionally renders its children based on user permissions
 *
 * @example
 * <PermissionGuard module="documents" action="create">
 *   <Button>Create Document</Button>
 * </PermissionGuard>
 */
export function PermissionGuard({
  module,
  action,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission, loading } = useUserPermissions();

  // While permissions are loading, render a placeholder to prevent layout shifts
  if (loading) {
    // Return an empty div with the same structure to prevent layout shifts
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  // If user has permission, render children
  if (hasPermission(module, action)) {
    return <>{children}</>;
  }

  // Otherwise render fallback or null
  return <>{fallback}</>;
}

/**
 * A hook that checks if the current user has permission for a specific action on a module
 *
 * @example
 * const canCreateDocument = useHasPermission("documents", "create");
 *
 * if (canCreateDocument) {
 *   // Show create document button
 * }
 */
export function useHasPermission(
  module: string,
  action: "view" | "create" | "edit" | "delete",
) {
  const { hasPermission, loading } = useUserPermissions();
  return !loading && hasPermission(module, action);
}
