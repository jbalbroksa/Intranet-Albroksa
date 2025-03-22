import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface Document {
  id: string;
  title: string;
  description: string | null;
  file_type: string;
  category: string;
  uploaded_at: string;
  uploaded_by: string;
}

export default function RecentDocuments() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentDocuments();
  }, []);

  const fetchRecentDocuments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("documents")
        .select(
          "id, title, description, file_type, category, uploaded_at, uploaded_by",
        )
        .order("uploaded_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching recent documents:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los documentos recientes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    return <FileText className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">
          Documentos Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Cargando documentos...
            </p>
          </div>
        ) : documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-start space-x-3">
                <div className="bg-muted p-2 rounded-md">
                  {getFileIcon(doc.file_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">
                      {doc.title}
                    </h4>
                    <Link
                      to={`/documents/${doc.id}`}
                      className="ml-2 flex-shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(doc.uploaded_at).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <FileText className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground mt-2">
              No hay documentos recientes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
