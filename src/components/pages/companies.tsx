import CompanyList from "../content/CompanyList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "../dashboard/layout/DashboardLayout";

export default function CompaniesPage() {
  return (
    <DashboardLayout activeItem="Compañías">
      <Tabs defaultValue="companies" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="companies">Compañías</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>
        <TabsContent value="companies">
          <CompanyList />
        </TabsContent>
        <TabsContent value="analytics">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Las analíticas de compañías estarán disponibles próximamente.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
