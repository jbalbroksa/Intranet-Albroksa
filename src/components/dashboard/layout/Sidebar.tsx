import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  HelpCircle,
  FolderKanban,
  FileText,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PermissionGuard } from "@/components/ui/PermissionGuard";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
  requiresPermission?: {
    module: string;
    action: "view" | "create" | "edit" | "delete";
  };
}

interface SidebarProps {
  items?: NavItem[];
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

// Memoize the NavItem to prevent unnecessary re-renders
const NavItemComponent = memo(
  ({
    item,
    isActive,
    onClick,
  }: {
    item: NavItem;
    isActive: boolean;
    onClick: () => void;
  }) => {
    if (item.requiresPermission) {
      return (
        <PermissionGuard
          module={item.requiresPermission.module}
          action={item.requiresPermission.action}
        >
          <Link to={item.href || "#"}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start gap-2 text-sm"
              onClick={onClick}
            >
              {item.icon}
              {item.label}
            </Button>
          </Link>
        </PermissionGuard>
      );
    }

    return (
      <Link to={item.href || "#"}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className="w-full justify-start gap-2 text-sm"
          onClick={onClick}
        >
          {item.icon}
          {item.label}
        </Button>
      </Link>
    );
  },
);

const defaultNavItems: NavItem[] = [
  { icon: <Home size={20} />, label: "Inicio", href: "/" },
  {
    icon: <LayoutDashboard size={20} />,
    label: "Panel",
    href: "/dashboard",
  },
  { icon: <FileText size={20} />, label: "Documentos", href: "/documents" },
  { icon: <BookOpen size={20} />, label: "Productos", href: "/content" },
  { icon: <Users size={20} />, label: "Compañías", href: "/companies" },
  {
    icon: <Users size={20} />,
    label: "Usuarios",
    href: "/user-management",
    requiresPermission: { module: "users", action: "view" },
  },
  { icon: <Calendar size={20} />, label: "Calendario", href: "/calendar" },
  { icon: <MessageSquare size={20} />, label: "Noticias", href: "/news" },
];

const defaultBottomItems: NavItem[] = [
  { icon: <Settings size={20} />, label: "Configuración", href: "/settings" },
  { icon: <HelpCircle size={20} />, label: "Ayuda" },
];

const Sidebar = ({
  items = defaultNavItems,
  activeItem = "Home",
  onItemClick = () => {},
}: SidebarProps) => {
  return (
    <div className="w-[280px] h-full bg-background border-r flex flex-col">
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-2">Intranet Albroksa</h2>
        <p className="text-sm text-muted-foreground">
          Todo lo que necesitas, a tu alcance
        </p>
      </div>

      <ScrollArea className="flex-1 px-2 md:px-4">
        <div className="space-y-1">
          {items.map((item) => (
            <NavItemComponent
              key={item.label}
              item={item}
              isActive={item.label === activeItem}
              onClick={() => onItemClick(item.label)}
            />
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <h3 className="text-xs font-medium px-4 py-2 text-muted-foreground">
            Acceso Rápido
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm"
            onClick={() => window.open("#", "_blank")}
          >
            💼 Portal de Gestión
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm"
            onClick={() => window.open("#", "_blank")}
          >
            🔍 Buscador de Productos
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm"
            onClick={() => window.open("#", "_blank")}
          >
            🛠️ Centro de Soporte
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm"
            onClick={() => window.open("#", "_blank")}
          >
            📊 Informes y Estadísticas
          </Button>
        </div>
      </ScrollArea>

      <div className="p-3 mt-auto border-t">
        <div className="space-y-1">
          {defaultBottomItems.map((item) => (
            <NavItemComponent
              key={item.label}
              item={item}
              isActive={item.label === activeItem}
              onClick={() => onItemClick(item.label)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Sidebar);
