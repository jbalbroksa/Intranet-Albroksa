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
import ProductCard from "./ProductCard";
import ProductEditor from "./ProductEditor";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export interface ProductItem {
  id: string;
  title: string;
  content: string;
  procesos: string;
  debilidades: string;
  observaciones: string;
  excerpt: string;
  category: string;
  subcategory: string | null;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: Date | null;
  updatedAt: Date;
  status: "published" | "draft";
  tags: string[];
}

const MAIN_CATEGORIES = [
  "Seguro para particulares",
  "Seguros para empresas",
  "Seguros Agrarios",
  "Seguros Personales",
];

export default function ProductList() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    "Todas las Categorías",
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    "Todas las Subcategorías",
  );
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products and subcategories
  useEffect(() => {
    fetchProducts();
    fetchSubcategories();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("content")
        .select(
          `
          *,
          users:author_id(id, full_name, avatar_url),
          content_tags(id, tag)
        `,
        )
        .order("updated_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedProducts = data.map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          procesos: item.procesos || "",
          debilidades: item.debilidades || "",
          observaciones: item.observaciones || "",
          excerpt: item.excerpt || "",
          category: item.category,
          subcategory: item.subcategory,
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
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from("content_subcategories")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      if (data) {
        const subcategoryNames = data.map((item) => item.name);
        setSubcategories(subcategoryNames);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "Todas las Categorías" ||
      item.category === selectedCategory;

    const matchesSubcategory =
      selectedSubcategory === "Todas las Subcategorías" ||
      item.subcategory === selectedSubcategory;

    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsEditing(true);
  };

  const handleEditProduct = (id: string) => {
    const product = products.find((item) => item.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsEditing(true);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("content").delete().eq("id", id);

      if (error) throw error;

      setProducts(products.filter((item) => item.id !== id));
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado correctamente",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      });
    }
  };

  const handleSaveProduct = async (productData: {
    title: string;
    content: string;
    procesos: string;
    debilidades: string;
    observaciones: string;
    category: string;
    subcategory?: string;
    tags: string[];
    status: "published" | "draft";
  }) => {
    try {
      const excerpt = productData.content.substring(0, 150) + "...";
      const isPublished = productData.status === "published";

      if (selectedProduct) {
        // Update existing product
        const { data, error } = await supabase
          .from("content")
          .update({
            title: productData.title,
            content: productData.content,
            procesos: productData.procesos,
            debilidades: productData.debilidades,
            observaciones: productData.observaciones,
            excerpt,
            category: productData.category,
            subcategory: productData.subcategory || null,
            status: productData.status,
            published_at: isPublished ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedProduct.id)
          .select()
          .single();

        if (error) throw error;

        // Delete existing tags and add new ones
        await supabase
          .from("content_tags")
          .delete()
          .eq("content_id", selectedProduct.id);

        if (productData.tags.length > 0) {
          const tagInserts = productData.tags.map((tag) => ({
            content_id: selectedProduct.id,
            tag,
          }));

          const { error: tagError } = await supabase
            .from("content_tags")
            .insert(tagInserts);

          if (tagError) throw tagError;
        }

        toast({
          title: "Producto actualizado",
          description: "El producto ha sido actualizado correctamente",
        });
      } else {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuario no autenticado");

        // Create new product
        const { data, error } = await supabase
          .from("content")
          .insert({
            title: productData.title,
            content: productData.content,
            procesos: productData.procesos,
            debilidades: productData.debilidades,
            observaciones: productData.observaciones,
            excerpt,
            category: productData.category,
            subcategory: productData.subcategory || null,
            status: productData.status,
            author_id: user.id,
            published_at: isPublished ? new Date().toISOString() : null,
          })
          .select()
          .single();

        if (error) throw error;

        // Add tags if provided
        if (productData.tags.length > 0) {
          const tagInserts = productData.tags.map((tag) => ({
            content_id: data.id,
            tag,
          }));

          const { error: tagError } = await supabase
            .from("content_tags")
            .insert(tagInserts);

          if (tagError) throw tagError;
        }

        toast({
          title: "Producto creado",
          description: "El producto ha sido creado correctamente",
        });
      }

      // Refresh products list
      fetchProducts();
      setIsEditing(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el producto",
        variant: "destructive",
      });
    }
  };

  if (isEditing) {
    return (
      <ProductEditor
        initialProduct={
          selectedProduct
            ? {
                title: selectedProduct.title,
                content: selectedProduct.content,
                procesos: selectedProduct.procesos,
                debilidades: selectedProduct.debilidades,
                observaciones: selectedProduct.observaciones,
                category: selectedProduct.category,
                subcategory: selectedProduct.subcategory || undefined,
                tags: selectedProduct.tags,
                status: selectedProduct.status,
              }
            : undefined
        }
        mainCategories={MAIN_CATEGORIES}
        subcategories={subcategories}
        onSave={handleSaveProduct}
        onCancel={() => {
          setIsEditing(false);
          setSelectedProduct(null);
        }}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <Button onClick={handleCreateProduct}>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Producto
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
          <SelectTrigger className="w-full md:w-[220px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas las Categorías">
              Todas las Categorías
            </SelectItem>
            {MAIN_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCategory !== "Todas las Categorías" && (
          <Select
            value={selectedSubcategory}
            onValueChange={setSelectedSubcategory}
          >
            <SelectTrigger className="w-full md:w-[220px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Subcategoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas las Subcategorías">
                Todas las Subcategorías
              </SelectItem>
              {subcategories
                .filter((subcat) => {
                  // Only show subcategories related to the selected main category
                  const subcatParts = subcat.split("/");
                  return (
                    subcatParts.length > 1 &&
                    subcatParts[0] === selectedCategory
                  );
                })
                .map((subcategory) => (
                  <SelectItem key={subcategory} value={subcategory}>
                    {subcategory.split("/")[1]}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Tabs defaultValue="all" className="flex-1">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos los Productos</TabsTrigger>
          <TabsTrigger value="published">Publicados</TabsTrigger>
          <TabsTrigger value="drafts">Borradores</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="flex-1">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando productos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No se encontraron productos. Intente ajustar su búsqueda o
                filtros.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={() => handleEditProduct(product.id)}
                  onDelete={() => handleDeleteProduct(product.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="published">
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts
              .filter((product) => product.status === "published")
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={() => handleEditProduct(product.id)}
                  onDelete={() => handleDeleteProduct(product.id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="drafts">
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts
              .filter((product) => product.status === "draft")
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={() => handleEditProduct(product.id)}
                  onDelete={() => handleDeleteProduct(product.id)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
