import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import UserTable, { User } from "./UserTable";
import UserFilters from "./UserFilters";
import AddUserDialog from "./AddUserDialog";
import { useToast } from "@/components/ui/use-toast";

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "admin",
    status: "active",
    lastActive: new Date(2024, 6, 15),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "franchise_manager",
    status: "active",
    lastActive: new Date(2024, 6, 14),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "employee",
    status: "active",
    lastActive: new Date(2024, 6, 10),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    id: "4",
    name: "Jessica Williams",
    email: "jessica.williams@example.com",
    role: "employee",
    status: "inactive",
    lastActive: new Date(2024, 5, 25),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
  },
  {
    id: "5",
    name: "David Rodriguez",
    email: "david.rodriguez@example.com",
    role: "franchise_manager",
    status: "active",
    lastActive: new Date(2024, 6, 12),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    id: "6",
    name: "Amanda Lee",
    email: "amanda.lee@example.com",
    role: "employee",
    status: "pending",
    lastActive: new Date(2024, 6, 16),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda",
  },
];

export default function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = (
    userData: Omit<User, "id" | "lastActive" | "avatar" | "status">,
  ) => {
    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                name: userData.name,
                email: userData.email,
                role: userData.role,
              }
            : user,
        ),
      );
      toast({
        title: "User updated",
        description: `${userData.name}'s information has been updated.`,
      });
      setEditingUser(undefined);
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: "pending",
        lastActive: new Date(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
      };

      setUsers([newUser, ...users]);
      toast({
        title: "User added",
        description: `${userData.name} has been added successfully.`,
      });
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsAddUserDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((user) => user.id === userId);
    setUsers(users.filter((user) => user.id !== userId));
    toast({
      title: "User deleted",
      description: `${userToDelete?.name} has been removed from the system.`,
      variant: "destructive",
    });
  };

  const handleActivateUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: "active" } : user,
      ),
    );
    const activatedUser = users.find((user) => user.id === userId);
    toast({
      title: "User activated",
      description: `${activatedUser?.name}'s account is now active.`,
    });
  };

  const handleDeactivateUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: "inactive" } : user,
      ),
    );
    const deactivatedUser = users.find((user) => user.id === userId);
    toast({
      title: "User deactivated",
      description: `${deactivatedUser?.name}'s account has been deactivated.`,
    });
  };

  const handleResetPassword = (userId: string) => {
    const user = users.find((user) => user.id === userId);
    toast({
      title: "Password reset email sent",
      description: `A password reset link has been sent to ${user?.email}.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <UserFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <Button
          onClick={() => {
            setEditingUser(undefined);
            setIsAddUserDialogOpen(true);
          }}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <UserTable
        users={filteredUsers}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onActivateUser={handleActivateUser}
        onDeactivateUser={handleDeactivateUser}
        onResetPassword={handleResetPassword}
      />

      <AddUserDialog
        isOpen={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        onAddUser={handleAddUser}
        editingUser={editingUser}
      />
    </div>
  );
}
