import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  PlusCircle,
  Search,
  Edit,
  Trash,
  ChevronRight,
  ChevronDown,
  BookOpen,
} from "lucide-react";
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
  const navigate = useNavigate();
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

  // State for expanded categories and subcategories
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>(
    [],
  );

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

  // Function to view a product
  const handleViewProduct = (id: string) => {
    navigate(`/content/${id}`);
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  // Toggle subcategory expansion
  const toggleSubcategory = (subcategory: string) => {
    setExpandedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory],
    );
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
        <h1 className="text-2xl font-bold">Base de Conocimientos</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCategory !== "Todas las Categorías" ? (
                // Show products for selected category
                <Card className="col-span-full">
                  <CardHeader className="pb-3">
                    <CardTitle>{selectedCategory}</CardTitle>
                    <CardDescription>
                      {selectedSubcategory !== "Todas las Subcategorías"
                        ? `Subcategoría: ${selectedSubcategory.split("/")[1] || selectedSubcategory}`
                        : "Todas las subcategorías"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedSubcategory !== "Todas las Subcategorías" ? (
                      // Show products for selected subcategory
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={() => handleEditProduct(product.id)}
                            onDelete={() => handleDeleteProduct(product.id)}
                            onView={() => handleViewProduct(product.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      // Group by subcategory
                      <div className="space-y-6">
                        {Array.from(
                          new Set(filteredProducts.map((p) => p.subcategory)),
                        ).map((subcategory) => {
                          const subcategoryProducts = filteredProducts.filter(
                            (p) => p.subcategory === subcategory,
                          );
                          if (subcategoryProducts.length === 0) return null;

                          const isExpanded = expandedSubcategories.includes(
                            subcategory || "none",
                          );

                          return (
                            <div key={subcategory || "none"}>
                              <Button
                                variant="ghost"
                                className="w-full justify-between mb-2 font-medium text-left"
                                onClick={() =>
                                  toggleSubcategory(subcategory || "none")
                                }
                              >
                                <span>
                                  {subcategory
                                    ? subcategory.split("/")[1] || subcategory
                                    : "Sin subcategoría"}
                                </span>
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>

                              {isExpanded && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                                  {subcategoryProducts.map((product) => (
                                    <ProductCard
                                      key={product.id}
                                      product={product}
                                      onEdit={() =>
                                        handleEditProduct(product.id)
                                      }
                                      onDelete={() =>
                                        handleDeleteProduct(product.id)
                                      }
                                      onView={() =>
                                        handleViewProduct(product.id)
                                      }
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                // Show all categories as cards
                MAIN_CATEGORIES.map((category) => {
                  const categoryProducts = filteredProducts.filter(
                    (p) => p.category === category,
                  );
                  if (categoryProducts.length === 0) return null;

                  const isExpanded = expandedCategories.includes(category);

                  return (
                    <Card key={category} className="col-span-1">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                          <span>{category}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCategory(category)}
                            className="ml-2"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </CardTitle>
                        <CardDescription>
                          {categoryProducts.length} producto
                          {categoryProducts.length !== 1 ? "s" : ""}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {!isExpanded ? (
                          <div className="flex justify-center items-center py-6">
                            <BookOpen className="h-12 w-12 text-muted-foreground opacity-50" />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {Array.from(
                              new Set(
                                categoryProducts.map((p) => p.subcategory),
                              ),
                            ).map((subcategory) => {
                              const subcategoryProducts =
                                categoryProducts.filter(
                                  (p) => p.subcategory === subcategory,
                                );
                              if (subcategoryProducts.length === 0) return null;

                              const isSubExpanded =
                                expandedSubcategories.includes(
                                  `${category}-${subcategory || "none"}`,
                                );

                              return (
                                <div key={subcategory || "none"}>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-between mb-2 font-medium text-left"
                                    onClick={() =>
                                      toggleSubcategory(
                                        `${category}-${subcategory || "none"}`,
                                      )
                                    }
                                  >
                                    <span>
                                      {subcategory
                                        ? subcategory.split("/")[1] ||
                                          subcategory
                                        : "Sin subcategoría"}
                                    </span>
                                    {isSubExpanded ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </Button>

                                  {isSubExpanded && (
                                    <div className="space-y-2">
                                      {subcategoryProducts.map((product) => (
                                        <div
                                          key={product.id}
                                          className="p-2 hover:bg-muted rounded-md cursor-pointer flex justify-between items-center"
                                          onClick={() =>
                                            handleViewProduct(product.id)
                                          }
                                        >
                                          <span className="line-clamp-1">
                                            {product.title}
                                          </span>
                                          <div className="flex gap-2">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditProduct(product.id);
                                              }}
                                            >
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteProduct(product.id);
                                              }}
                                            >
                                              <Trash className="h-4 w-4 text-red-500" />
                                            </Button>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-2 border-t">
                        <Button
                          variant="ghost"
                          className="w-full justify-center"
                          onClick={() => toggleCategory(category)}
                        >
                          {isExpanded ? "Colapsar" : "Expandir"}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="published">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCategory !== "Todas las Categorías" ? (
              // Show published products for selected category
              <Card className="col-span-full">
                <CardHeader className="pb-3">
                  <CardTitle>{selectedCategory} - Publicados</CardTitle>
                  <CardDescription>
                    {selectedSubcategory !== "Todas las Subcategorías"
                      ? `Subcategoría: ${selectedSubcategory.split("/")[1] || selectedSubcategory}`
                      : "Todas las subcategorías"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedSubcategory !== "Todas las Subcategorías" ? (
                    // Show published products for selected subcategory
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProducts
                        .filter((product) => product.status === "published")
                        .map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={() => handleEditProduct(product.id)}
                            onDelete={() => handleDeleteProduct(product.id)}
                            onView={() => handleViewProduct(product.id)}
                          />
                        ))}
                    </div>
                  ) : (
                    // Group published products by subcategory
                    <div className="space-y-6">
                      {Array.from(
                        new Set(
                          filteredProducts
                            .filter((p) => p.status === "published")
                            .map((p) => p.subcategory),
                        ),
                      ).map((subcategory) => {
                        const subcategoryProducts = filteredProducts.filter(
                          (p) =>
                            p.status === "published" &&
                            p.subcategory === subcategory,
                        );
                        if (subcategoryProducts.length === 0) return null;

                        const isExpanded = expandedSubcategories.includes(
                          `published-${subcategory || "none"}`,
                        );

                        return (
                          <div key={subcategory || "none"}>
                            <Button
                              variant="ghost"
                              className="w-full justify-between mb-2 font-medium text-left"
                              onClick={() =>
                                toggleSubcategory(
                                  `published-${subcategory || "none"}`,
                                )
                              }
                            >
                              <span>
                                {subcategory
                                  ? subcategory.split("/")[1] || subcategory
                                  : "Sin subcategoría"}
                              </span>
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>

                            {isExpanded && (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                                {subcategoryProducts.map((product) => (
                                  <ProductCard
                                    key={product.id}
                                    product={product}
                                    onEdit={() => handleEditProduct(product.id)}
                                    onDelete={() =>
                                      handleDeleteProduct(product.id)
                                    }
                                    onView={() => handleViewProduct(product.id)}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              // Show all published products by category
              MAIN_CATEGORIES.map((category) => {
                const categoryProducts = filteredProducts.filter(
                  (p) => p.status === "published" && p.category === category,
                );
                if (categoryProducts.length === 0) return null;

                const isExpanded = expandedCategories.includes(
                  `published-${category}`,
                );

                return (
                  <Card key={category} className="col-span-1">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span>{category}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toggleCategory(`published-${category}`)
                          }
                          className="ml-2"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        {categoryProducts.length} producto
                        {categoryProducts.length !== 1 ? "s" : ""} publicado
                        {categoryProducts.length !== 1 ? "s" : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!isExpanded ? (
                        <div className="flex justify-center items-center py-6">
                          <BookOpen className="h-12 w-12 text-muted-foreground opacity-50" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {Array.from(
                            new Set(categoryProducts.map((p) => p.subcategory)),
                          ).map((subcategory) => {
                            const subcategoryProducts = categoryProducts.filter(
                              (p) => p.subcategory === subcategory,
                            );
                            if (subcategoryProducts.length === 0) return null;

                            const isSubExpanded =
                              expandedSubcategories.includes(
                                `published-${category}-${subcategory || "none"}`,
                              );

                            return (
                              <div key={subcategory || "none"}>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-between mb-2 font-medium text-left"
                                  onClick={() =>
                                    toggleSubcategory(
                                      `published-${category}-${subcategory || "none"}`,
                                    )
                                  }
                                >
                                  <span>
                                    {subcategory
                                      ? subcategory.split("/")[1] || subcategory
                                      : "Sin subcategoría"}
                                  </span>
                                  {isSubExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>

                                {isSubExpanded && (
                                  <div className="space-y-2">
                                    {subcategoryProducts.map((product) => (
                                      <div
                                        key={product.id}
                                        className="p-2 hover:bg-muted rounded-md cursor-pointer flex justify-between items-center"
                                        onClick={() =>
                                          handleViewProduct(product.id)
                                        }
                                      >
                                        <span className="line-clamp-1">
                                          {product.title}
                                        </span>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEditProduct(product.id);
                                            }}
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteProduct(product.id);
                                            }}
                                          >
                                            <Trash className="h-4 w-4 text-red-500" />
                                          </Button>
                                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-2 border-t">
                      <Button
                        variant="ghost"
                        className="w-full justify-center"
                        onClick={() => toggleCategory(`published-${category}`)}
                      >
                        {isExpanded ? "Colapsar" : "Expandir"}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="drafts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCategory !== "Todas las Categorías" ? (
              // Show draft products for selected category
              <Card className="col-span-full">
                <CardHeader className="pb-3">
                  <CardTitle>{selectedCategory} - Borradores</CardTitle>
                  <CardDescription>
                    {selectedSubcategory !== "Todas las Subcategorías"
                      ? `Subcategoría: ${selectedSubcategory.split("/")[1] || selectedSubcategory}`
                      : "Todas las subcategorías"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedSubcategory !== "Todas las Subcategorías" ? (
                    // Show draft products for selected subcategory
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProducts
                        .filter((product) => product.status === "draft")
                        .map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={() => handleEditProduct(product.id)}
                            onDelete={() => handleDeleteProduct(product.id)}
                            onView={() => handleViewProduct(product.id)}
                          />
                        ))}
                    </div>
                  ) : (
                    // Group draft products by subcategory
                    <div className="space-y-6">
                      {Array.from(
                        new Set(
                          filteredProducts
                            .filter((p) => p.status === "draft")
                            .map((p) => p.subcategory),
                        ),
                      ).map((subcategory) => {
                        const subcategoryProducts = filteredProducts.filter(
                          (p) =>
                            p.status === "draft" &&
                            p.subcategory === subcategory,
                        );
                        if (subcategoryProducts.length === 0) return null;

                        const isExpanded = expandedSubcategories.includes(
                          `draft-${subcategory || "none"}`,
                        );

                        return (
                          <div key={subcategory || "none"}>
                            <Button
                              variant="ghost"
                              className="w-full justify-between mb-2 font-medium text-left"
                              onClick={() =>
                                toggleSubcategory(
                                  `draft-${subcategory || "none"}`,
                                )
                              }
                            >
                              <span>
                                {subcategory
                                  ? subcategory.split("/")[1] || subcategory
                                  : "Sin subcategoría"}
                              </span>
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>

                            {isExpanded && (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                                {subcategoryProducts.map((product) => (
                                  <ProductCard
                                    key={product.id}
                                    product={product}
                                    onEdit={() => handleEditProduct(product.id)}
                                    onDelete={() =>
                                      handleDeleteProduct(product.id)
                                    }
                                    onView={() => handleViewProduct(product.id)}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              // Show all draft products by category
              MAIN_CATEGORIES.map((category) => {
                const categoryProducts = filteredProducts.filter(
                  (p) => p.status === "draft" && p.category === category,
                );
                if (categoryProducts.length === 0) return null;

                const isExpanded = expandedCategories.includes(
                  `draft-${category}`,
                );

                return (
                  <Card key={category} className="col-span-1">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span>{category}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategory(`draft-${category}`)}
                          className="ml-2"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        {categoryProducts.length} borrador
                        {categoryProducts.length !== 1 ? "es" : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!isExpanded ? (
                        <div className="flex justify-center items-center py-6">
                          <BookOpen className="h-12 w-12 text-muted-foreground opacity-50" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {Array.from(
                            new Set(categoryProducts.map((p) => p.subcategory)),
                          ).map((subcategory) => {
                            const subcategoryProducts = categoryProducts.filter(
                              (p) => p.subcategory === subcategory,
                            );
                            if (subcategoryProducts.length === 0) return null;

                            const isSubExpanded =
                              expandedSubcategories.includes(
                                `draft-${category}-${subcategory || "none"}`,
                              );

                            return (
                              <div key={subcategory || "none"}>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-between mb-2 font-medium text-left"
                                  onClick={() =>
                                    toggleSubcategory(
                                      `draft-${category}-${subcategory || "none"}`,
                                    )
                                  }
                                >
                                  <span>
                                    {subcategory
                                      ? subcategory.split("/")[1] || subcategory
                                      : "Sin subcategoría"}
                                  </span>
                                  {isSubExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>

                                {isSubExpanded && (
                                  <div className="space-y-2">
                                    {subcategoryProducts.map((product) => (
                                      <div
                                        key={product.id}
                                        className="p-2 hover:bg-muted rounded-md cursor-pointer flex justify-between items-center"
                                        onClick={() =>
                                          handleViewProduct(product.id)
                                        }
                                      >
                                        <span className="line-clamp-1">
                                          {product.title}
                                        </span>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEditProduct(product.id);
                                            }}
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteProduct(product.id);
                                            }}
                                          >
                                            <Trash className="h-4 w-4 text-red-500" />
                                          </Button>
                                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-2 border-t">
                      <Button
                        variant="ghost"
                        className="w-full justify-center"
                        onClick={() => toggleCategory(`draft-${category}`)}
                      >
                        {isExpanded ? "Colapsar" : "Expandir"}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
