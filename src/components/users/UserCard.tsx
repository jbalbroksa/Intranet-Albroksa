import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  MoreHorizontal,
  Trash,
  Phone,
  MessageCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserItem } from "./UserManagement";

interface UserCardProps {
  user: UserItem;
  onEdit: () => void;
  onDelete: () => void;
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-sm transition-shadow">
      <CardHeader className="pb-2 relative">
        <div className="absolute right-4 top-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-2">
            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
            <AvatarFallback className="text-lg">
              {user.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg">{user.fullName}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant={user.isAdmin ? "default" : "outline"}>
              {user.isAdmin ? "Administrador" : "Usuario"}
            </Badge>
            <Badge variant="secondary">{user.userType}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {user.branch && (
            <div className="text-sm">
              <span className="font-medium">Sucursal:</span> {user.branch}
            </div>
          )}
          {user.extension && (
            <div className="text-sm flex items-center">
              <span className="font-medium mr-1">Extensión:</span>
              <span className="flex items-center">
                <Phone className="h-3 w-3 mr-1" /> {user.extension}
              </span>
            </div>
          )}
          {user.telegramUsername && (
            <div className="text-sm flex items-center">
              <span className="font-medium mr-1">Telegram:</span>
              <span className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" />{" "}
                {user.telegramUsername}
              </span>
            </div>
          )}
          {user.description && (
            <div className="text-sm mt-2">
              <span className="font-medium">Descripción:</span>
              <p className="text-muted-foreground mt-1">{user.description}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 text-xs text-muted-foreground">
        <div className="w-full flex justify-between items-center">
          <span>ID: {user.id.substring(0, 8)}...</span>
          <span>Creado: {user.createdAt.toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
