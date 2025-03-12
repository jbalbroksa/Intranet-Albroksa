import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { format } from "date-fns";
import { ProductItem } from "./ProductList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductCardProps {
  product: ProductItem;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-sm transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant={product.status === "published" ? "default" : "outline"}
                className="text-xs"
              >
                {product.status === "published" ? "Publicado" : "Borrador"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {product.category}
              </span>
              {product.subcategory && (
                <span className="text-xs text-muted-foreground">
                  / {product.subcategory.split("/")[1] || product.subcategory}
                </span>
              )}
            </div>
            <CardTitle className="text-xl">{product.title}</CardTitle>
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
        <p className="text-muted-foreground mb-4">{product.excerpt}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {product.procesos && (
            <div className="border rounded-md p-3">
              <h4 className="font-medium text-sm mb-1">Procesos</h4>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {product.procesos}
              </p>
            </div>
          )}

          {product.debilidades && (
            <div className="border rounded-md p-3">
              <h4 className="font-medium text-sm mb-1">Debilidades</h4>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {product.debilidades}
              </p>
            </div>
          )}

          {product.observaciones && (
            <div className="border rounded-md p-3">
              <h4 className="font-medium text-sm mb-1">Observaciones</h4>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {product.observaciones}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={product.author.avatar}
              alt={product.author.name}
            />
            <AvatarFallback>{product.author.name[0]}</AvatarFallback>
          </Avatar>
          <span>{product.author.name}</span>
        </div>
        <div className="flex gap-4">
          {product.publishedAt && (
            <span>Publicado: {format(product.publishedAt, "dd/MM/yyyy")}</span>
          )}
          <span>Actualizado: {format(product.updatedAt, "dd/MM/yyyy")}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
