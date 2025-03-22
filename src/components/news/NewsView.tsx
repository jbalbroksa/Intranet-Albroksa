import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit, Trash, Calendar, Building } from "lucide-react";
import { format } from "date-fns";
import { NewsItem } from "./NewsList";

interface NewsViewProps {
  news: NewsItem;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function NewsView({
  news,
  onBack,
  onEdit,
  onDelete,
}: NewsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a noticias
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash className="mr-2 h-4 w-4" /> Eliminar
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Header with metadata */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{news.category}</Badge>
            {news.isPinned && <Badge>Destacado</Badge>}
            {news.companyName && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Building className="h-3 w-3" /> {news.companyName}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold">{news.title}</h1>

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={news.author.avatar} alt={news.author.name} />
              <AvatarFallback>{news.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{news.author.name}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(news.publishedAt, "dd MMMM, yyyy")}
              </p>
            </div>
          </div>
        </div>

        {/* Featured image */}
        {news.imageUrl && (
          <div className="w-full h-[400px] rounded-lg overflow-hidden">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: news.content }} />
        </div>

        {/* Tags */}
        {news.tags.length > 0 && (
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Etiquetas:</h3>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Visibility info */}
        <div className="pt-4 border-t text-sm text-muted-foreground">
          <p>
            <strong>Visible para:</strong>{" "}
            {news.visibleTo.branches.includes("Todas")
              ? "Todas las sucursales"
              : news.visibleTo.branches.join(", ")}
          </p>
          <p>
            <strong>Tipos de usuario:</strong>{" "}
            {news.visibleTo.userTypes.includes("Todos")
              ? "Todos los usuarios"
              : news.visibleTo.userTypes.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}
