import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Settings,
  User,
  LogOut,
  Bell,
  Sun,
  Moon,
  AlertTriangle,
  X,
} from "lucide-react";
import { useAuth } from "../../../../supabase/auth";
import { useTheme } from "@/components/ui/theme-provider";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export default function TopNavigation() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    fetchAlerts();

    // Set up real-time subscription for alerts
    const alertsSubscription = supabase
      .channel("alerts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alerts" },
        () => {
          fetchAlerts();
        },
      )
      .subscribe();

    return () => {
      alertsSubscription.unsubscribe();
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAlerts(data || []);
      setUnreadCount(data?.length || 0);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las notificaciones",
        variant: "destructive",
      });
    }
  };

  const handleDismissAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;

      setAlerts(alerts.filter((alert) => alert.id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast({
        title: "Notificación descartada",
        description: "La notificación ha sido descartada correctamente",
      });
    } catch (error) {
      console.error("Error dismissing alert:", error);
      toast({
        title: "Error",
        description: "No se pudo descartar la notificación",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "low":
        return "Baja";
      case "medium":
        return "Media";
      case "high":
        return "Alta";
      case "critical":
        return "Crítica";
      default:
        return severity;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background text-foreground z-50 flex items-center px-4 md:px-6">
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center">
            <img
              src="https://albroksa.com/wp-content/uploads/2022/11/logo_albrok_blanco_transp.png"
              alt="Albrok"
              width="150"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="text-foreground hover:text-foreground/80"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Popover
            open={isNotificationsOpen}
            onOpenChange={setIsNotificationsOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="text-foreground hover:text-foreground/80 relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs"
                    variant="destructive"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 max-h-96 overflow-y-auto">
              <div className="p-4 border-b">
                <h4 className="font-medium">Notificaciones</h4>
              </div>
              {alerts.length > 0 ? (
                <div className="divide-y">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-3 hover:bg-muted/50">
                      <div className="flex items-start">
                        <AlertTriangle
                          className={`h-5 w-5 mr-2 flex-shrink-0 mt-0.5 ${alert.severity === "critical" ? "text-red-500" : alert.severity === "high" ? "text-orange-500" : alert.severity === "medium" ? "text-yellow-500" : "text-blue-500"}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">
                              {alert.title}
                            </h4>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(alert.severity)}`}
                            >
                              {getSeverityLabel(alert.severity)}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{alert.message}</p>
                          <p className="text-xs mt-2 text-muted-foreground">
                            {new Date(alert.created_at).toLocaleDateString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                          onClick={() => handleDismissAlert(alert.id)}
                        >
                          <span className="sr-only">Descartar</span>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    No hay notificaciones
                  </p>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full text-foreground hover:text-foreground/80"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt="User avatar"
                    />
                    <AvatarFallback>
                      {user.email?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/user-management">
                    <User className="mr-2 h-4 w-4" />
                    <span>User Management</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
