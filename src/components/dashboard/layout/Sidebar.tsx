import React from "react";
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

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
}

interface SidebarProps {
  items?: NavItem[];
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

const defaultNavItems: NavItem[] = [
  { icon: <Home size={20} />, label: "Home", href: "/" },
  {
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    href: "/dashboard",
  },
  { icon: <FileText size={20} />, label: "Documents", href: "/documents" },
  { icon: <BookOpen size={20} />, label: "Productos", href: "/content" },
  { icon: <Users size={20} />, label: "Compañías", href: "/companies" },
  { icon: <Users size={20} />, label: "Usuarios", href: "/user-management" },
  { icon: <Calendar size={20} />, label: "Calendar", href: "/calendar" },
];

const defaultBottomItems: NavItem[] = [
  { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
  { icon: <HelpCircle size={20} />, label: "Help" },
];

const Sidebar = ({
  items = defaultNavItems,
  activeItem = "Home",
  onItemClick = () => {},
}: SidebarProps) => {
  return (
    <div className="w-[280px] h-full bg-background border-r flex flex-col">
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-2">InsuranceConnect</h2>
        <p className="text-sm text-muted-foreground">
          Franchise Intranet Platform
        </p>
      </div>

      <ScrollArea className="flex-1 px-2 md:px-4">
        <div className="space-y-1">
          {items.map((item) => (
            <Link to={item.href || "#"} key={item.label}>
              <Button
                variant={item.label === activeItem ? "secondary" : "ghost"}
                className="w-full justify-start gap-2 text-sm"
                onClick={() => onItemClick(item.label)}
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <h3 className="text-xs font-medium px-4 py-2 text-muted-foreground">
            Quick Access
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm"
          >
            📄 Policy Documents
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm"
          >
            📊 Sales Reports
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm"
          >
            📝 Training Materials
          </Button>
        </div>
      </ScrollArea>

      <div className="p-3 mt-auto border-t">
        <div className="space-y-1">
          {defaultBottomItems.map((item) => (
            <Link to={item.href || "#"} key={item.label}>
              <Button
                variant={item.label === activeItem ? "secondary" : "ghost"}
                className="w-full justify-start gap-2 text-sm"
                onClick={() => onItemClick(item.label)}
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
