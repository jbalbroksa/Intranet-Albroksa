import ProductList from "../content/ProductList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import CategoryManager from "../content/CategoryManager";

export default function ProductosPage() {
  return (
    <DashboardLayout activeItem="Productos">
      <Tabs defaultValue="productos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
        </TabsList>
        <TabsContent value="productos">
          <ProductList />
        </TabsContent>
        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
