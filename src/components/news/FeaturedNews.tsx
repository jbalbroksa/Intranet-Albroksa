import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  published_at: string;
  is_pinned: boolean;
  image_url: string | null;
}

export default function FeaturedNews() {
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedNews();
  }, []);

  const fetchFeaturedNews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select(
          "id, title, excerpt, category, published_at, is_pinned, image_url",
        )
        .eq("is_pinned", true)
        .order("published_at", { ascending: false })
        .limit(3);

      if (error) throw error;

      setNews(data || []);
    } catch (error) {
      console.error("Error fetching featured news:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las noticias destacadas",
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
          Noticias Destacadas
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
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.id} className="group">
                <Link to={`/news/${item.id}`} className="block">
                  <div className="flex items-start space-x-3">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                        <Newspaper className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <ExternalLink className="h-3.5 w-3.5 ml-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {item.excerpt && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {item.excerpt}
                        </p>
                      )}
                      <div className="flex items-center mt-1.5">
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
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
          </div>
        ) : (
          <div className="text-center py-6">
            <Newspaper className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground mt-2">
              No hay noticias destacadas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
