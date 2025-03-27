import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit, Trash, AlertTriangle, Building } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { ProductItem } from "./ProductList";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ProductEditor from "./ProductEditor";

export default function ProductView() {
  // Use the correct parameter name from the route
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [company, setCompany] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("descripcion");

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    setIsLoading(true);
    try {
      // Fetch from content table instead of products
      const { data, error } = await supabase
        .from("content")
        .select(
          `
          *,
          users:author_id(id, full_name, avatar_url),
          companies:company_id(id, name, logo),
          content_tags(id, tag)
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        // Format the product data
        const formattedProduct: ProductItem = {
          id: data.id,
          title: data.title,
          content: data.content || "",
          procesos: data.procesos || "",
          debilidades: data.debilidades || "",
          observaciones: data.observaciones || "",
          excerpt: data.excerpt || "",
          category: data.category,
          subcategory: data.subcategory,
          company_id: data.company_id,
          company_name: data.companies?.name,
          author: {
            name: data.users?.full_name || "Usuario",
            avatar:
              data.users?.avatar_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.author_id}`,
          },
          publishedAt: data.published_at ? new Date(data.published_at) : null,
          updatedAt: new Date(data.updated_at),
          status: data.status as "published" | "draft",
          tags: data.content_tags?.map((tag) => tag.tag) || [],
        };

        setProduct(formattedProduct);
        if (data.company_id) {
          setCompany(data.companies);
        }
      }
    } catch (error: any) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: `Error al cargar el producto: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (!productId) return;

    try {
      // Delete from content table instead of products
      const { error } = await supabase
        .from("content")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado correctamente",
      });

      navigate("/content");
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: `No se pudo eliminar el producto: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleSave = async (productData: any) => {
    try {
      const { error } = await supabase
        .from("content")
        .update({
          title: productData.title,
          content: productData.content,
          procesos: productData.procesos,
          debilidades: productData.debilidades,
          observaciones: productData.observaciones,
          category: productData.category,
          subcategory: productData.subcategory,
          company_id:
            productData.company_id === "none" ? null : productData.company_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente",
      });
      setIsEditing(false);
      fetchProduct(productId!);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al actualizar el producto: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (status: string) => {
    return status === "published"
      ? "bg-green-100 text-green-800"
      : "bg-amber-100 text-amber-800";
  };

  if (isLoading) {
    return (
      <DashboardLayout activeItem="Productos">
        <div className="space-y-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/content")}
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver a productos
            </Button>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isEditing && product) {
    return (
      <DashboardLayout activeItem="Productos">
        <div className="space-y-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => setIsEditing(false)}
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar edición
            </Button>
          </div>
          <ProductEditor
            product={{
              id: product.id,
              title: product.title,
              content: product.content,
              procesos: product.procesos,
              debilidades: product.debilidades,
              observaciones: product.observaciones,
              category: product.category,
              subcategory: product.subcategory,
              company_id: product.company_id,
            }}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout activeItem="Productos">
        <div className="space-y-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/content")}
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver a productos
            </Button>
          </div>
          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                <CardTitle>Producto no encontrado</CardTitle>
              </div>
              <CardDescription>
                El producto que estás buscando no existe o ha sido eliminado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Verifica que la URL sea correcta o regresa a la lista de
                productos.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate("/content")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a productos
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="Productos">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/content")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a la Base de Conocimientos
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" /> Eliminar
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card
            className="overflow-hidden border-t-4"
            style={{
              borderTopColor:
                product.status === "published" ? "#10b981" : "#f59e0b",
            }}
          >
            <CardHeader className="bg-muted/30">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      product.status === "published" ? "default" : "outline"
                    }
                    className={getSeverityColor(product.status)}
                  >
                    {product.status === "published" ? "Publicado" : "Borrador"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {product.category}
                    {product.subcategory &&
                      ` / ${product.subcategory.split("/")[1] || product.subcategory}`}
                  </span>
                  {company && (
                    <div className="flex items-center gap-1 bg-muted/20 p-1 px-2 rounded-md ml-auto">
                      <Building className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium">
                        {company.name}
                      </span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold">
                  {product.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={product.author.avatar}
                      alt={product.author.name}
                    />
                    <AvatarFallback>{product.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {product.author.name}
                    </span>
                    <div className="flex text-xs text-muted-foreground">
                      {product.publishedAt && (
                        <span className="mr-2">
                          Publicado: {format(product.publishedAt, "dd/MM/yyyy")}
                        </span>
                      )}
                      <span>
                        Actualizado: {format(product.updatedAt, "dd/MM/yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="px-6 pt-2">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                  <TabsTrigger value="procesos">Procesos</TabsTrigger>
                  <TabsTrigger value="debilidades">Debilidades</TabsTrigger>
                  <TabsTrigger value="observaciones">Observaciones</TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="pt-6">
                <TabsContent value="descripcion" className="mt-0">
                  {product.content ? (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: product.content }}
                    />
                  ) : (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      <span>No hay contenido disponible</span>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="procesos" className="mt-0">
                  {product.procesos ? (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: product.procesos }}
                    />
                  ) : (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      <span>No hay información de procesos disponible</span>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="debilidades" className="mt-0">
                  {product.debilidades ? (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: product.debilidades,
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      <span>No hay información de debilidades disponible</span>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="observaciones" className="mt-0">
                  {product.observaciones ? (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: product.observaciones,
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      <span>No hay observaciones disponibles</span>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>

            <CardFooter className="border-t bg-muted/20 py-4 flex flex-wrap gap-2">
              {product.tags && product.tags.length > 0 ? (
                product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  No hay etiquetas
                </span>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Está seguro de eliminar este producto?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto será eliminado
              permanentemente de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
