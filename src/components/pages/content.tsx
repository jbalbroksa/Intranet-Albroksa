import ProductList from "../content/ProductList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import CategoryManager from "../content/CategoryManager";
import DashboardShell from "../dashboard/layout/DashboardShell";

export default function Content() {
  return (
    <DashboardLayout activeItem="Productos">
      <DashboardShell
        title="Base de Conocimientos"
        description="Gestión de productos y servicios de seguros"
      >
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
      </DashboardShell>
    </DashboardLayout>
  );
}
