import DocumentLibrary from "../documents/DocumentLibrary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "../dashboard/layout/DashboardLayout";

export default function DocumentsPage() {
  return (
    <DashboardLayout activeItem="Documents">
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
        </TabsList>
        <TabsContent value="documents">
          <DocumentLibrary />
        </TabsContent>
        <TabsContent value="templates">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Las plantillas estarán disponibles próximamente.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
