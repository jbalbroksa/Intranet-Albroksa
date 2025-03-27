import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Trash2, Building } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  company_id?: string;
  company_name?: string;
  created_at: string;
}

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}

function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{product.name}</span>
          {product.company_name && (
            <div className="flex items-center gap-1 bg-muted/20 p-1 px-2 rounded-md text-xs">
              <Building className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">{product.company_name}</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {product.description || "Sin descripción"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-1" />
          Ver Producto
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
