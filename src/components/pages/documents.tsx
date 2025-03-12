import DocumentLibrary from "../documents/DocumentLibrary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "../dashboard/layout/DashboardLayout";

export default function DocumentsPage() {
  return (
    <DashboardLayout activeItem="Documents">
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="shared">Shared with Me</TabsTrigger>
        </TabsList>
        <TabsContent value="documents">
          <DocumentLibrary />
        </TabsContent>
        <TabsContent value="templates">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Templates will be available soon.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="shared">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Shared documents will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
