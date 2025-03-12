import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, PlusCircle, Search } from "lucide-react";
import UserCard from "./UserCard";
import UserEditor from "./UserEditor";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export interface UserItem {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  extension?: string;
  description?: string;
  telegramUsername?: string;
  branch?: string;
  role: string;
  userType: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const USER_TYPES = [
  "Delegación",
  "Delegación Expert",
  "Colaborador",
  "Empleado",
  "Responsable de departamento",
  "Administrador",
];

export default function UserManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("Todos los roles");
  const [selectedUserType, setSelectedUserType] = useState("Todos los tipos");
  const [selectedBranch, setSelectedBranch] = useState("Todas las sucursales");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users and branches
  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("full_name", { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedUsers = data.map((item) => ({
          id: item.id,
          fullName: item.full_name || "",
          email: item.email || "",
          avatarUrl: item.avatar_url || undefined,
          extension: item.extension || undefined,
          description: item.description || undefined,
          telegramUsername: item.telegram_username || undefined,
          branch: item.branch || undefined,
          role: item.role || "user",
          userType: item.user_type || "Empleado",
          isAdmin: item.is_admin || false,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase
        .from("branches")
        .select("name")
        .order("name", { ascending: true });

      if (error) throw error;

      if (data) {
        const branchNames = data.map((item) => item.name);
        setBranches(branchNames);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRole === "Todos los roles" ||
      (selectedRole === "Administrador" && user.isAdmin) ||
      (selectedRole === "Usuario" && !user.isAdmin);

    const matchesUserType =
      selectedUserType === "Todos los tipos" ||
      user.userType === selectedUserType;

    const matchesBranch =
      selectedBranch === "Todas las sucursales" ||
      user.branch === selectedBranch;

    return matchesSearch && matchesRole && matchesUserType && matchesBranch;
  });

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsEditing(true);
  };

  const handleEditUser = (id: string) => {
    const user = users.find((item) => item.id === id);
    if (user) {
      setSelectedUser(user);
      setIsEditing(true);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const { error } = await supabase.from("users").delete().eq("id", id);

      if (error) throw error;

      setUsers(users.filter((user) => user.id !== id));
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  const handleSaveUser = async (userData: {
    id?: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    extension?: string;
    description?: string;
    telegramUsername?: string;
    branch?: string;
    userType: string;
    isAdmin: boolean;
  }) => {
    try {
      // Convert branch value
      const branchValue =
        userData.branch === "ninguna" ? null : userData.branch;

      if (selectedUser) {
        // Update existing user
        const { data, error } = await supabase
          .from("users")
          .update({
            full_name: userData.fullName,
            email: userData.email,
            avatar_url: userData.avatarUrl || null,
            extension: userData.extension || null,
            description: userData.description || null,
            telegram_username: userData.telegramUsername || null,
            branch: branchValue,
            user_type: userData.userType,
            is_admin: userData.isAdmin,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedUser.id)
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Usuario actualizado",
          description: "El usuario ha sido actualizado correctamente",
        });
      } else {
        // Create new user
        const userId = userData.id || crypto.randomUUID();
        const { data, error } = await supabase
          .from("users")
          .insert({
            id: userId,
            full_name: userData.fullName,
            email: userData.email,
            avatar_url: userData.avatarUrl || null,
            extension: userData.extension || null,
            description: userData.description || null,
            telegram_username: userData.telegramUsername || null,
            branch: branchValue,
            user_type: userData.userType,
            is_admin: userData.isAdmin,
            role: userData.isAdmin ? "admin" : "user",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Usuario creado",
          description: "El usuario ha sido creado correctamente",
        });
      }

      // Refresh users list
      fetchUsers();
      setIsEditing(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el usuario",
        variant: "destructive",
      });
    }
  };

  if (isEditing) {
    return (
      <UserEditor
        initialUser={
          selectedUser
            ? {
                id: selectedUser.id,
                fullName: selectedUser.fullName,
                email: selectedUser.email,
                avatarUrl: selectedUser.avatarUrl,
                extension: selectedUser.extension,
                description: selectedUser.description,
                telegramUsername: selectedUser.telegramUsername,
                branch: selectedUser.branch,
                userType: selectedUser.userType,
                isAdmin: selectedUser.isAdmin,
              }
            : undefined
        }
        branches={branches}
        onSave={handleSaveUser}
        onCancel={() => {
          setIsEditing(false);
          setSelectedUser(null);
        }}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <Button onClick={handleCreateUser}>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Usuario
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos los roles">Todos los roles</SelectItem>
            <SelectItem value="Administrador">Administrador</SelectItem>
            <SelectItem value="Usuario">Usuario</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedUserType} onValueChange={setSelectedUserType}>
          <SelectTrigger className="w-full md:w-[220px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Tipo de Usuario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos los tipos">Todos los tipos</SelectItem>
            {USER_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
          <SelectTrigger className="w-full md:w-[220px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sucursal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas las sucursales">
              Todas las sucursales
            </SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch} value={branch}>
                {branch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando usuarios...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No se encontraron usuarios. Intente ajustar su búsqueda o filtros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={() => handleEditUser(user.id)}
              onDelete={() => handleDeleteUser(user.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
