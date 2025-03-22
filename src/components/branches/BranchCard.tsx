import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit,
  MoreHorizontal,
  Trash,
  MapPin,
  Mail,
  Phone,
  Globe,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BranchItem } from "./BranchManagement";

interface BranchCardProps {
  branch: BranchItem;
  onEdit: () => void;
  onDelete: () => void;
}

export default function BranchCard({
  branch,
  onEdit,
  onDelete,
}: BranchCardProps) {
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
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{branch.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>
              {branch.city}, {branch.province}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm flex items-start">
            <MapPin className="h-3.5 w-3.5 mr-2 mt-0.5" />
            <div>
              <div>{branch.address}</div>
              <div>
                {branch.postalCode} {branch.city}
              </div>
              <div>{branch.province}</div>
            </div>
          </div>

          {branch.contactPerson && (
            <div className="text-sm flex items-center">
              <User className="h-3.5 w-3.5 mr-2" />
              <span>{branch.contactPerson}</span>
            </div>
          )}

          {branch.email && (
            <div className="text-sm flex items-center">
              <Mail className="h-3.5 w-3.5 mr-2" />
              <span>{branch.email}</span>
            </div>
          )}

          {branch.phone && (
            <div className="text-sm flex items-center">
              <Phone className="h-3.5 w-3.5 mr-2" />
              <span>{branch.phone}</span>
            </div>
          )}

          {branch.website && (
            <div className="text-sm flex items-center">
              <Globe className="h-3.5 w-3.5 mr-2" />
              <a
                href={branch.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {branch.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 text-xs text-muted-foreground">
        <div className="w-full flex justify-between items-center">
          <span>ID: {branch.id.substring(0, 8)}...</span>
          <span>Creado: {branch.createdAt.toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
