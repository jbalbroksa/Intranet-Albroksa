import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  published_at: string;
  is_pinned: boolean;
  image_url: string | null;
}

export default function RecentNews() {
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentNews();
  }, []);

  const fetchRecentNews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select(
          "id, title, excerpt, category, published_at, is_pinned, image_url",
        )
        .order("published_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      setNews(data || []);
    } catch (error) {
      console.error("Error fetching recent news:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las noticias recientes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">
          Noticias Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Cargando noticias...
            </p>
          </div>
        ) : news.length > 0 ? (
          <div className="space-y-3">
            {news.map((item) => (
              <div key={item.id} className="group">
                <Link to={`/news/${item.id}`} className="block">
                  <div className="flex items-center space-x-3">
                    <div className="bg-muted p-2 rounded-md">
                      <Newspaper className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <ExternalLink className="h-3.5 w-3.5 ml-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
                          {item.category}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {new Date(item.published_at).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "short",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            <div className="pt-2">
              <Link to="/news">
                <Button variant="outline" size="sm" className="w-full">
                  Ver todas las noticias
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Newspaper className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground mt-2">
              No hay noticias recientes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
