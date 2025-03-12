import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Mail,
  MoreHorizontal,
  Edit,
  Trash,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CompanyItem } from "./CompanyList";

interface CompanyCardProps {
  company: CompanyItem;
  onEdit: () => void;
  onDelete: () => void;
  onViewSpecifications: () => void;
}

export default function CompanyCard({
  company,
  onEdit,
  onDelete,
  onViewSpecifications,
}: CompanyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-sm transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md overflow-hidden">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-2xl font-bold text-muted-foreground">
                  {company.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-xl">{company.name}</CardTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant={getClassificationVariant(company.classification)}
                  className="text-xs"
                >
                  {company.classification}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewSpecifications();
                  }}
                >
                  <FileText className="mr-1 h-3 w-3" /> Especificaciones
                </Button>
              </div>
            </div>
          </div>
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
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Web:</span>{" "}
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  {company.website
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              ) : (
                <span className="text-muted-foreground">No disponible</span>
              )}
            </div>
            <div className="text-sm">
              <span className="font-medium">Email del responsable:</span>{" "}
              {company.contactEmail ? (
                <a
                  href={`mailto:${company.contactEmail}`}
                  className="text-primary hover:underline inline-flex items-center"
                >
                  {company.contactEmail}
                  <Mail className="ml-1 h-3 w-3" />
                </a>
              ) : (
                <span className="text-muted-foreground">No disponible</span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Acceso para mediadores:</span>{" "}
              {company.mediatorAccessUrl ? (
                <a
                  href={company.mediatorAccessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Acceder
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              ) : (
                <span className="text-muted-foreground">No disponible</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
        <div className="w-full flex justify-between items-center">
          <span>ID: {company.id.substring(0, 8)}...</span>
          <span>
            Última actualización:{" "}
            {new Date(company.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

function getClassificationVariant(classification: string) {
  switch (classification) {
    case "Preferentes":
      return "default";
    case "Especialistas":
      return "secondary";
    case "Resto de compañías":
      return "outline";
    case "Agencias de Suscripción":
      return "destructive";
    default:
      return "outline";
  }
}
