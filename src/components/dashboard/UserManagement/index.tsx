import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import UserTable, { User } from "./UserTable";
import UserFilters from "./UserFilters";
import AddUserDialog from "./AddUserDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

// Initial mock data for development
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
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("full_name", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Map database users to the User interface
        const mappedUsers: User[] = data.map((user) => ({
          id: user.id,
          name: user.full_name || "",
          email: user.email || "",
          role: user.role || "employee",
          status: user.status || "active",
          lastActive: user.last_login_at
            ? new Date(user.last_login_at)
            : new Date(),
          avatar:
            user.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`,
        }));
        setUsers(mappedUsers);
      } else {
        // If no users in database, use mock data for development
        setUsers(MOCK_USERS);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description:
          "No se pudieron cargar los usuarios. Usando datos de ejemplo.",
        variant: "destructive",
      });
      // Fallback to mock data
      setUsers(MOCK_USERS);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = async (
    userData: Omit<User, "id" | "lastActive" | "avatar" | "status">,
  ) => {
    try {
      if (editingUser) {
        // Update existing user in Supabase
        const { error } = await supabase
          .from("users")
          .update({
            full_name: userData.name,
            email: userData.email,
            role: userData.role,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingUser.id);

        if (error) throw error;

        // Update local state
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
          title: "Usuario actualizado",
          description: `La información de ${userData.name} ha sido actualizada.`,
        });
        setEditingUser(undefined);
      } else {
        // Create new user in Supabase Auth
        // Using auth.signUp instead of admin.createUser as it doesn't require admin privileges
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: userData.email,
            password: generateRandomPassword(), // Generate a random password
            options: {
              data: {
                full_name: userData.name,
                role: userData.role,
              },
            },
          },
        );

        if (authError) throw authError;

        // Create user profile in the users table
        const newUserId = authData.user?.id;
        if (!newUserId) throw new Error("No se pudo crear el usuario en Auth");

        const { error: profileError } = await supabase.from("users").insert({
          id: newUserId,
          full_name: userData.name,
          email: userData.email,
          role: userData.role,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
        });

        if (profileError) throw profileError;

        // Add new user to local state
        const newUser: User = {
          id: newUserId,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          status: "pending",
          lastActive: new Date(),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
        };

        setUsers([newUser, ...users]);
        toast({
          title: "Usuario añadido",
          description: `${userData.name} ha sido añadido correctamente.`,
        });
      }
    } catch (error) {
      console.error("Error managing user:", error);
      toast({
        title: "Error",
        description: `No se pudo ${editingUser ? "actualizar" : "crear"} el usuario. ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsAddUserDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const userToDelete = users.find((user) => user.id === userId);
      if (!userToDelete) return;

      // We can't delete users from auth without admin privileges
      // Instead, we'll just mark them as deleted in our users table
      // and disable their account

      // Delete user from users table
      const { error: dbError } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (dbError) throw dbError;

      // Update local state
      setUsers(users.filter((user) => user.id !== userId));
      toast({
        title: "Usuario eliminado",
        description: `${userToDelete.name} ha sido eliminado del sistema.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: `No se pudo eliminar el usuario. ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ status: "active", updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (error) throw error;

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: "active" } : user,
        ),
      );

      const activatedUser = users.find((user) => user.id === userId);
      toast({
        title: "Usuario activado",
        description: `La cuenta de ${activatedUser?.name} está ahora activa.`,
      });
    } catch (error) {
      console.error("Error activating user:", error);
      toast({
        title: "Error",
        description: `No se pudo activar el usuario. ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ status: "inactive", updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (error) throw error;

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: "inactive" } : user,
        ),
      );

      const deactivatedUser = users.find((user) => user.id === userId);
      toast({
        title: "Usuario desactivado",
        description: `La cuenta de ${deactivatedUser?.name} ha sido desactivada.`,
      });
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast({
        title: "Error",
        description: `No se pudo desactivar el usuario. ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      const user = users.find((user) => user.id === userId);
      if (!user) return;

      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Correo de restablecimiento enviado",
        description: `Se ha enviado un enlace de restablecimiento de contraseña a ${user.email}.`,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error",
        description: `No se pudo enviar el correo de restablecimiento. ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  // Helper function to generate a random password
  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
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

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando usuarios...</p>
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onActivateUser={handleActivateUser}
          onDeactivateUser={handleDeactivateUser}
          onResetPassword={handleResetPassword}
        />
      )}

      <AddUserDialog
        isOpen={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        onAddUser={handleAddUser}
        editingUser={editingUser}
      />
    </div>
  );
}
