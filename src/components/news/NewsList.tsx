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
import NewsCard from "./NewsCard";
import NewsEditor from "./NewsEditor";
import NewsView from "./NewsView";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../../supabase/auth";
import { useUserProfile } from "@/hooks/useUserProfile";

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  companyId?: string;
  companyName?: string;
  imageUrl?: string;
  isPinned: boolean;
  visibleTo: {
    branches: string[];
    userTypes: string[];
  };
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
}

const NEWS_CATEGORIES = [
  "Todas las categorías",
  "Anuncios",
  "Actualizaciones",
  "Eventos",
  "Formación",
  "Productos",
  "Tecnología",
  "General",
];

export default function NewsList() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useUserProfile();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    "Todas las categorías",
  );
  const [selectedCompany, setSelectedCompany] = useState("Todas las compañías");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch news and companies
  useEffect(() => {
    fetchNews();
    fetchCompanies();
  }, []);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("published_at", { ascending: false });

      // Fetch related data separately
      if (data && data.length > 0) {
        // Get company info
        const companyIds = data
          .filter((item) => item.company_id)
          .map((item) => item.company_id);
        if (companyIds.length > 0) {
          const { data: companiesData } = await supabase
            .from("companies")
            .select("id, name")
            .in("id", companyIds);

          if (companiesData) {
            // Create a map for quick lookup
            const companyMap = {};
            companiesData.forEach((company) => {
              companyMap[company.id] = company;
            });

            // Add company data to news items
            data.forEach((item) => {
              if (item.company_id && companyMap[item.company_id]) {
                item.companies = companyMap[item.company_id];
              }
            });
          }
        }

        // Get user info
        const userIds = data.map((item) => item.author_id);
        const { data: usersData } = await supabase
          .from("users")
          .select("id, full_name, avatar_url")
          .in("id", userIds);

        if (usersData) {
          // Create a map for quick lookup
          const userMap = {};
          usersData.forEach((user) => {
            userMap[user.id] = user;
          });

          // Add user data to news items
          data.forEach((item) => {
            if (userMap[item.author_id]) {
              item.users = userMap[item.author_id];
            }
          });
        }
      }

      // Fetch tags separately
      const tagsPromises =
        data?.map(async (item) => {
          const { data: tagData } = await supabase
            .from("news_tags")
            .select("id, tag")
            .eq("news_id", item.id);
          return { newsId: item.id, tags: tagData || [] };
        }) || [];

      // Fetch visibility settings separately
      const visibilityPromises =
        data?.map(async (item) => {
          const { data: visibilityData } = await supabase
            .from("news_visibility")
            .select("branch, user_type")
            .eq("news_id", item.id);
          return { newsId: item.id, visibility: visibilityData || [] };
        }) || [];

      // Wait for all promises to resolve
      const tagsResults = await Promise.all(tagsPromises);
      const visibilityResults = await Promise.all(visibilityPromises);

      if (error) throw error;

      if (data) {
        const formattedNews = data.map((item) => {
          // Find tags for this news item
          const tagsResult = tagsResults.find((tr) => tr.newsId === item.id);
          const tags = tagsResult?.tags.map((t) => t.tag) || [];

          // Find visibility settings for this news item
          const visibilityResult = visibilityResults.find(
            (vr) => vr.newsId === item.id,
          );
          const visibilityData = visibilityResult?.visibility || [];

          // Extract visibility settings
          const branches =
            visibilityData.length > 0
              ? [...new Set(visibilityData.map((v) => v.branch))]
              : ["Todas"];

          const userTypes =
            visibilityData.length > 0
              ? [...new Set(visibilityData.map((v) => v.user_type))]
              : ["Todos"];

          return {
            id: item.id,
            title: item.title,
            content: item.content,
            excerpt: item.excerpt || "",
            category: item.category,
            companyId: item.company_id,
            companyName: item.companies?.name,
            imageUrl: item.image_url,
            isPinned: item.is_pinned,
            visibleTo: {
              branches,
              userTypes,
            },
            author: {
              id: item.author_id,
              name: item.users?.full_name || "Usuario",
              avatar:
                item.users?.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.author_id}`,
            },
            publishedAt: new Date(item.published_at),
            updatedAt: new Date(item.updated_at),
            tags: tags,
          };
        });
        setNews(formattedNews);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las noticias",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // Filter news based on search, category, and company
  const filteredNews = news.filter((item) => {
    // Check if news is visible to current user
    const userBranch = profile?.branch || "";
    const userType = profile?.user_type || "";

    const isVisibleToBranch =
      item.visibleTo.branches.includes("Todas") ||
      item.visibleTo.branches.includes(userBranch) ||
      !userBranch; // If user has no branch, show all

    const isVisibleToUserType =
      item.visibleTo.userTypes.includes("Todos") ||
      item.visibleTo.userTypes.includes(userType) ||
      !userType; // If user has no type, show all

    // For admins, show all news
    const isAdmin = profile?.is_admin || false;

    if (!isAdmin && (!isVisibleToBranch || !isVisibleToUserType)) {
      return false;
    }

    // Apply search filter
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    // Apply category filter
    const matchesCategory =
      selectedCategory === "Todas las categorías" ||
      item.category === selectedCategory;

    // Apply company filter
    const matchesCompany =
      selectedCompany === "Todas las compañías" ||
      (selectedCompany === "Sin compañía" && !item.companyId) ||
      item.companyId === selectedCompany;

    return matchesSearch && matchesCategory && matchesCompany;
  });

  const handleCreateNews = () => {
    setSelectedNews(null);
    setIsEditing(true);
  };

  const handleEditNews = (id: string) => {
    const newsItem = news.find((item) => item.id === id);
    if (newsItem) {
      setSelectedNews(newsItem);
      setIsEditing(true);
    }
  };

  const handleViewNews = (id: string) => {
    const newsItem = news.find((item) => item.id === id);
    if (newsItem) {
      setSelectedNews(newsItem);
      setIsViewing(true);
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      // Delete news tags
      await supabase.from("news_tags").delete().eq("news_id", id);

      // Delete news visibility settings
      await supabase.from("news_visibility").delete().eq("news_id", id);

      // Delete the news item
      const { error } = await supabase.from("news").delete().eq("id", id);

      if (error) throw error;

      setNews(news.filter((item) => item.id !== id));
      toast({
        title: "Noticia eliminada",
        description: "La noticia ha sido eliminada correctamente",
      });
    } catch (error) {
      console.error("Error deleting news:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la noticia",
        variant: "destructive",
      });
    }
  };

  const handleSaveNews = async (newsData: {
    id?: string;
    title: string;
    content: string;
    excerpt?: string;
    category: string;
    companyId?: string;
    imageUrl?: string;
    isPinned?: boolean;
    visibleTo?: {
      branches: string[];
      userTypes: string[];
    };
    tags: string[];
  }) => {
    console.log("Saving news with data:", newsData);
    try {
      // Get current user
      if (!user) throw new Error("Usuario no autenticado");

      // Debug info
      console.log("Current user ID:", user.id);
      console.log("Company ID:", newsData.companyId);

      if (newsData.id) {
        // Update existing news
        const { data, error } = await supabase
          .from("news")
          .update({
            title: newsData.title,
            content: newsData.content,
            excerpt: newsData.excerpt,
            category: newsData.category,
            company_id: newsData.companyId || null,
            image_url: newsData.imageUrl || null,
            is_pinned: newsData.isPinned || false,
            updated_at: new Date().toISOString(),
          })
          .eq("id", newsData.id)
          .select()
          .single();

        if (error) throw error;

        // Delete existing tags and add new ones
        await supabase.from("news_tags").delete().eq("news_id", newsData.id);

        if (newsData.tags.length > 0) {
          const tagInserts = newsData.tags.map((tag) => ({
            news_id: newsData.id,
            tag,
          }));

          const { error: tagError } = await supabase
            .from("news_tags")
            .insert(tagInserts);

          if (tagError) throw tagError;
        }

        // Update visibility settings
        await supabase
          .from("news_visibility")
          .delete()
          .eq("news_id", newsData.id);

        if (newsData.visibleTo) {
          const visibilityInserts = [];

          // If "Todas" is selected for branches, just add one record
          if (newsData.visibleTo.branches.includes("Todas")) {
            // If "Todos" is selected for user types, just add one record
            if (newsData.visibleTo.userTypes.includes("Todos")) {
              visibilityInserts.push({
                news_id: newsData.id,
                branch: "Todas",
                user_type: "Todos",
              });
            } else {
              // Add records for each user type with "Todas" branches
              for (const userType of newsData.visibleTo.userTypes) {
                visibilityInserts.push({
                  news_id: newsData.id,
                  branch: "Todas",
                  user_type: userType,
                });
              }
            }
          } else {
            // Add records for specific branches
            for (const branch of newsData.visibleTo.branches) {
              // If "Todos" is selected for user types
              if (newsData.visibleTo.userTypes.includes("Todos")) {
                visibilityInserts.push({
                  news_id: newsData.id,
                  branch,
                  user_type: "Todos",
                });
              } else {
                // Add records for each branch and user type combination
                for (const userType of newsData.visibleTo.userTypes) {
                  visibilityInserts.push({
                    news_id: newsData.id,
                    branch,
                    user_type: userType,
                  });
                }
              }
            }
          }

          if (visibilityInserts.length > 0) {
            const { error: visibilityError } = await supabase
              .from("news_visibility")
              .insert(visibilityInserts);

            if (visibilityError) throw visibilityError;
          }
        }

        toast({
          title: "Noticia actualizada",
          description: "La noticia ha sido actualizada correctamente",
        });
      } else {
        // Create new news
        const newsObject = {
          title: newsData.title,
          content: newsData.content,
          excerpt: newsData.excerpt,
          category: newsData.category,
          company_id: newsData.companyId || null,
          image_url: newsData.imageUrl || null,
          is_pinned: newsData.isPinned || false,
          author_id: user.id,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log("Inserting news with:", newsObject);

        const { data, error } = await supabase
          .from("news")
          .insert(newsObject)
          .select()
          .single();

        if (error) {
          console.error("Error inserting news:", error);
          throw error;
        }

        console.log("Successfully created news with ID:", data.id);

        // Add tags if provided
        if (newsData.tags && newsData.tags.length > 0) {
          const tagInserts = newsData.tags.map((tag) => ({
            news_id: data.id,
            tag,
          }));

          console.log("Inserting tags:", tagInserts);
          const { error: tagError } = await supabase
            .from("news_tags")
            .insert(tagInserts);

          if (tagError) {
            console.error("Error inserting tags:", tagError);
            throw tagError;
          }
        }

        // Add visibility settings
        if (newsData.visibleTo) {
          const visibilityInserts = [];

          // If "Todas" is selected for branches, just add one record
          if (newsData.visibleTo.branches.includes("Todas")) {
            // If "Todos" is selected for user types, just add one record
            if (newsData.visibleTo.userTypes.includes("Todos")) {
              visibilityInserts.push({
                news_id: data.id,
                branch: "Todas",
                user_type: "Todos",
              });
            } else {
              // Add records for each user type with "Todas" branches
              for (const userType of newsData.visibleTo.userTypes) {
                visibilityInserts.push({
                  news_id: data.id,
                  branch: "Todas",
                  user_type: userType,
                });
              }
            }
          } else {
            // Add records for specific branches
            for (const branch of newsData.visibleTo.branches) {
              // If "Todos" is selected for user types
              if (newsData.visibleTo.userTypes.includes("Todos")) {
                visibilityInserts.push({
                  news_id: data.id,
                  branch,
                  user_type: "Todos",
                });
              } else {
                // Add records for each branch and user type combination
                for (const userType of newsData.visibleTo.userTypes) {
                  visibilityInserts.push({
                    news_id: data.id,
                    branch,
                    user_type: userType,
                  });
                }
              }
            }
          }

          if (visibilityInserts.length > 0) {
            console.log("Inserting visibility settings:", visibilityInserts);
            const { error: visibilityError } = await supabase
              .from("news_visibility")
              .insert(visibilityInserts);

            if (visibilityError) {
              console.error(
                "Error inserting visibility settings:",
                visibilityError,
              );
              throw visibilityError;
            }
          }
        }

        toast({
          title: "Noticia creada",
          description: "La noticia ha sido creada correctamente",
        });
      }

      // Refresh news list
      fetchNews();
      setIsEditing(false);
      setSelectedNews(null);
    } catch (error) {
      console.error("Error saving news:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la noticia",
        variant: "destructive",
      });
    }
  };

  if (isViewing && selectedNews) {
    return (
      <NewsView
        news={selectedNews}
        onBack={() => {
          setIsViewing(false);
          setSelectedNews(null);
        }}
        onEdit={() => {
          setIsViewing(false);
          setIsEditing(true);
        }}
        onDelete={() => {
          handleDeleteNews(selectedNews.id);
          setIsViewing(false);
          setSelectedNews(null);
        }}
      />
    );
  }

  if (isEditing) {
    return (
      <NewsEditor
        initialNews={
          selectedNews
            ? {
                id: selectedNews.id,
                title: selectedNews.title,
                content: selectedNews.content,
                excerpt: selectedNews.excerpt,
                category: selectedNews.category,
                companyId: selectedNews.companyId,
                imageUrl: selectedNews.imageUrl,
                isPinned: selectedNews.isPinned,
                visibleTo: selectedNews.visibleTo,
                tags: selectedNews.tags,
              }
            : undefined
        }
        onSave={handleSaveNews}
        onCancel={() => {
          setIsEditing(false);
          setSelectedNews(null);
        }}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Noticias</h1>
        <Button onClick={handleCreateNews}>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Noticia
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar noticias..."
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
            {NEWS_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
          <SelectTrigger className="w-full md:w-[220px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Compañía" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas las compañías">
              Todas las compañías
            </SelectItem>
            <SelectItem value="Sin compañía">Sin compañía</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="flex-1">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todas las Noticias</TabsTrigger>
          <TabsTrigger value="pinned">Destacadas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="flex-1">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando noticias...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No se encontraron noticias. Intente ajustar su búsqueda o
                filtros.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((newsItem) => (
                <NewsCard
                  key={newsItem.id}
                  news={newsItem}
                  onEdit={() => handleEditNews(newsItem.id)}
                  onDelete={() => handleDeleteNews(newsItem.id)}
                  onView={() => handleViewNews(newsItem.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pinned">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews
              .filter((newsItem) => newsItem.isPinned)
              .map((newsItem) => (
                <NewsCard
                  key={newsItem.id}
                  news={newsItem}
                  onEdit={() => handleEditNews(newsItem.id)}
                  onDelete={() => handleDeleteNews(newsItem.id)}
                  onView={() => handleViewNews(newsItem.id)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
