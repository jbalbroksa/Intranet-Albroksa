import DashboardLayout from "../dashboard/layout/DashboardLayout";
import DashboardShell from "../dashboard/layout/DashboardShell";
import UserManagement from "../dashboard/UserManagement";

export default function UsersPage() {
  return (
    <DashboardLayout activeItem="Settings">
      <DashboardShell
        title="User Management"
        description="Manage user accounts and permissions"
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "User Management" },
        ]}
      >
        <UserManagement />
      </DashboardShell>
    </DashboardLayout>
  );
}
