import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, MoreHorizontal, Trash, Calendar, Building } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NewsItem } from "./NewsList";

interface NewsCardProps {
  news: NewsItem;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export default function NewsCard({
  news,
  onEdit,
  onDelete,
  onView,
}: NewsCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-sm transition-shadow h-full flex flex-col">
      {news.imageUrl && (
        <div
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${news.imageUrl})` }}
          onClick={onView}
        />
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {news.category}
              </Badge>
              {news.isPinned && <Badge className="text-xs">Destacado</Badge>}
              {news.companyName && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  <Building className="h-3 w-3" /> {news.companyName}
                </Badge>
              )}
            </div>
            <CardTitle
              className="text-xl hover:text-primary cursor-pointer"
              onClick={onView}
            >
              {news.title}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>Ver Noticia</DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <p className="text-muted-foreground line-clamp-3">{news.excerpt}</p>

        {news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {news.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={news.author.avatar} alt={news.author.name} />
            <AvatarFallback>{news.author.name[0]}</AvatarFallback>
          </Avatar>
          <span>{news.author.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{format(news.publishedAt, "dd/MM/yyyy")}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
