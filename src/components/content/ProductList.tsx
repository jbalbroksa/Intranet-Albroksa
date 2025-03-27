import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Search, Filter, ArrowLeft } from "lucide-react";
import ProductCard from "./ProductCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import ProductEditor from "./ProductEditor";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAIN_CATEGORIES = [
  "Seguro para particulares",
  "Seguros para empresas",
  "Seguros Agrarios",
  "Seguros Personales",
];

export interface ProductItem {
  id: string;
  title: string;
  content: string;
  procesos?: string;
  debilidades?: string;
  observaciones?: string;
  excerpt?: string;
  category: string;
  subcategory?: string;
  company_id?: string;
  company_name?: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: Date | null;
  updatedAt: Date;
  status: "published" | "draft";
  tags: string[];
}

function ProductList() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("content")
        .select(
          `
          id, title, content, procesos, debilidades, observaciones, excerpt, category, subcategory, company_id, author_id, status, created_at, updated_at, published_at,
          users:author_id(id, full_name, avatar_url),
          companies:company_id(id, name),
          content_tags(id, tag)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedProducts = data.map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content || "",
          procesos: item.procesos || "",
          debilidades: item.debilidades || "",
          observaciones: item.observaciones || "",
          excerpt: item.excerpt || "",
          category: item.category,
          subcategory: item.subcategory,
          company_id: item.company_id,
          company_name: item.companies?.name,
          author: {
            name: item.users?.full_name || "Usuario",
            avatar:
              item.users?.avatar_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.author_id}`,
          },
          publishedAt: item.published_at ? new Date(item.published_at) : null,
          updatedAt: new Date(item.updated_at),
          status: item.status as "published" | "draft",
          tags: item.content_tags?.map((tag) => tag.tag) || [],
        }));
        setProducts(formattedProducts);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al cargar productos: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: ProductItem) => {
    navigate(`/content/${product.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("content").delete().eq("id", id);

      if (error) throw error;

      setProducts(products.filter((product) => product.id !== id));
      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al eliminar producto: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleSave = async (productData: any) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;

      if (!userId) {
        toast({
          title: "Error",
          description: "Debe iniciar sesión para crear o editar productos",
          variant: "destructive",
        });
        return;
      }

      if (editingProduct) {
        // Update existing product
        const { data, error } = await supabase
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
          .eq("id", editingProduct.id)
          .select();

        if (error) throw error;

        toast({
          title: "Éxito",
          description: "Producto actualizado correctamente",
        });
      } else {
        // Create new product
        const { data, error } = await supabase
          .from("content")
          .insert([
            {
              title: productData.title,
              content: productData.content,
              procesos: productData.procesos,
              debilidades: productData.debilidades,
              observaciones: productData.observaciones,
              category: productData.category,
              subcategory: productData.subcategory,
              company_id:
                productData.company_id === "none"
                  ? null
                  : productData.company_id,
              author_id: userId,
              status: "published",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select();

        if (error) throw error;

        toast({
          title: "Éxito",
          description: "Producto creado correctamente",
        });
      }

      setIsEditorOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al guardar producto: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "Todas" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Function to get all subcategories for a category
  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from("content_subcategories")
        .select("*")
        .order("parent_category", { ascending: true })
        .order("level", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las subcategorías",
        variant: "destructive",
      });
      return [];
    }
  };

  // State for subcategories
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategory !== "Todas") {
      fetchSubcategories().then((data) => {
        const categorySubcats = data.filter(
          (s) => s.parent_category === selectedCategory,
        );
        setSubcategories(categorySubcats);
        setSelectedSubcategory(null); // Reset selected subcategory when category changes
      });
    }
  }, [selectedCategory]);

  // Function to get display name from full subcategory name
  const getSubcategoryDisplayName = (fullName: string) => {
    const parts = fullName.split("/");
    return parts.length > 1 ? parts[parts.length - 1] : fullName;
  };

  // Function to organize subcategories into a hierarchical structure
  const organizeSubcategories = (subcats: any[]) => {
    // First, get top-level subcategories (those without a parent_id)
    const topLevel = subcats.filter((s) => !s.parent_id);

    // Function to get child subcategories for a given parent
    const getChildren = (parentId: string) => {
      return subcats.filter((s) => s.parent_id === parentId);
    };

    // Function to build the tree recursively
    const buildTree = (subcategory: any) => {
      const children = getChildren(subcategory.id);
      return {
        ...subcategory,
        children: children.map(buildTree),
        displayName: getSubcategoryDisplayName(subcategory.name),
      };
    };

    // Build the tree for each top-level subcategory
    return topLevel.map(buildTree);
  };

  // Get products for the selected subcategory
  const getProductsForSubcategory = (subcategoryName: string) => {
    return filteredProducts.filter((p) => p.subcategory === subcategoryName);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Base de Conocimientos</h2>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsEditorOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[250px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas las categorías</SelectItem>
            {MAIN_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCategory !== "Todas" ? (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">{selectedCategory}</h3>

          {/* Display subcategories as cards */}
          {!selectedSubcategory && subcategories.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Subcategorías</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {organizeSubcategories(subcategories).map((subcat) => (
                  <Card
                    key={subcat.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedSubcategory(subcat.name)}
                  >
                    <CardContent className="p-4">
                      <h5 className="font-medium text-lg">
                        {subcat.displayName}
                      </h5>
                      {subcat.children.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {subcat.children.length} subcategorías
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Display products for selected subcategory */}
          {selectedSubcategory ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSubcategory(null)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Volver a subcategorías
                </Button>
                <h4 className="text-lg font-medium">
                  {getSubcategoryDisplayName(selectedSubcategory)}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getProductsForSubcategory(selectedSubcategory).map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        name: product.title,
                        description:
                          product.excerpt ||
                          product.content
                            .replace(/<[^>]*>/g, "")
                            .substring(0, 100) + "...",
                        company_id: product.company_id,
                        company_name: product.company_name,
                        created_at: product.updatedAt.toISOString(),
                      }}
                      onEdit={() => handleEdit(product)}
                      onDelete={() => handleDelete(product.id)}
                    />
                  ),
                )}
              </div>

              {getProductsForSubcategory(selectedSubcategory).length === 0 && (
                <div className="text-center py-12 border rounded-md">
                  <p className="text-muted-foreground">
                    No hay productos en esta subcategoría.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">
                Productos sin subcategoría
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts
                  .filter((p) => !p.subcategory)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        name: product.title,
                        description:
                          product.excerpt ||
                          product.content
                            .replace(/<[^>]*>/g, "")
                            .substring(0, 100) + "...",
                        company_id: product.company_id,
                        company_name: product.company_name,
                        created_at: product.updatedAt.toISOString(),
                      }}
                      onEdit={() => handleEdit(product)}
                      onDelete={() => handleDelete(product.id)}
                    />
                  ))}
              </div>

              {filteredProducts.filter((p) => !p.subcategory).length === 0 && (
                <div className="text-center py-12 border rounded-md">
                  <p className="text-muted-foreground">
                    No hay productos sin subcategoría.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4">Categorías</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {MAIN_CATEGORIES.map((category) => (
              <Card
                key={category}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedCategory(category)}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg">{category}</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    {
                      filteredProducts.filter((p) => p.category === category)
                        .length
                    }{" "}
                    productos
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-4">Todos los productos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.title,
                  description:
                    product.excerpt ||
                    product.content.replace(/<[^>]*>/g, "").substring(0, 100) +
                      "...",
                  company_id: product.company_id,
                  company_name: product.company_name,
                  created_at: product.updatedAt.toISOString(),
                }}
                onEdit={() => handleEdit(product)}
                onDelete={() => handleDelete(product.id)}
              />
            ))}
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 border rounded-md">
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== "Todas"
              ? "No se encontraron productos que coincidan con los criterios de búsqueda."
              : "No hay productos disponibles. Cree uno nuevo usando el botón de arriba."}
          </p>
        </div>
      )}

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Actualice la información del producto"
                : "Complete la información para crear un nuevo producto"}
            </DialogDescription>
          </DialogHeader>
          <ProductEditor
            product={editingProduct}
            onSave={handleSave}
            onCancel={() => setIsEditorOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductList;
