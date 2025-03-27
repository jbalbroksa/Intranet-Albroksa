import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserProfile } from "@/hooks/useUserProfile";
import { FileText, Users, BookOpen, Calendar, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AlertsSection from "./AlertsSection";
import RecentDocuments from "./RecentDocuments";
import FeaturedNews from "../news/FeaturedNews";
import RecentNews from "../news/RecentNews";

export default function DashboardOverview() {
  const { profile } = useUserProfile();
  const [userCount, setUserCount] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    // Fetch initial counts
    fetchCounts();

    // Set up real-time subscriptions
    const usersSubscription = supabase
      .channel("users-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        () => {
          fetchUserCount();
        },
      )
      .subscribe();

    const documentsSubscription = supabase
      .channel("documents-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents" },
        () => {
          fetchDocumentCount();
        },
      )
      .subscribe();

    const companiesSubscription = supabase
      .channel("companies-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "companies" },
        () => {
          fetchCompanyCount();
        },
      )
      .subscribe();

    const eventsSubscription = supabase
      .channel("events-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "calendar_events" },
        () => {
          fetchEventCount();
        },
      )
      .subscribe();

    return () => {
      usersSubscription.unsubscribe();
      documentsSubscription.unsubscribe();
      companiesSubscription.unsubscribe();
      eventsSubscription.unsubscribe();
    };
  }, []);

  const fetchCounts = async () => {
    fetchUserCount();
    fetchDocumentCount();
    fetchCompanyCount();
    fetchEventCount();
  };

  const fetchUserCount = async () => {
    try {
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      setUserCount(count || 0);
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  const fetchDocumentCount = async () => {
    try {
      const { count, error } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      setDocumentCount(count || 0);
    } catch (error) {
      console.error("Error fetching document count:", error);
    }
  };

  const fetchCompanyCount = async () => {
    try {
      const { count, error } = await supabase
        .from("companies")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      setCompanyCount(count || 0);
    } catch (error) {
      console.error("Error fetching company count:", error);
    }
  };

  const fetchEventCount = async () => {
    try {
      const { count, error } = await supabase
        .from("calendar_events")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      setEventCount(count || 0);
    } catch (error) {
      console.error("Error fetching event count:", error);
    }
  };

  const stats = [
    {
      title: "Documentos",
      value: documentCount.toString(),
      description: "Total documentos",
      icon: <FileText className="h-5 w-5 text-corporate-primary" />,
      change:
        documentCount > 0 ? `${documentCount} documentos` : "Sin documentos",
      trend: documentCount > 0 ? "up" : "neutral",
    },
    {
      title: "Usuarios",
      value: userCount.toString(),
      description: "Usuarios activos",
      icon: <Users className="h-5 w-5 text-corporate-primary" />,
      change: userCount > 0 ? `${userCount} usuarios` : "Sin usuarios",
      trend: userCount > 0 ? "up" : "neutral",
    },
    {
      title: "Compañías",
      value: companyCount.toString(),
      description: "Compañías de seguros",
      icon: <BookOpen className="h-5 w-5 text-corporate-primary" />,
      change: companyCount > 0 ? `${companyCount} compañías` : "Sin compañías",
      trend: companyCount > 0 ? "up" : "neutral",
    },
    {
      title: "Eventos",
      value: eventCount.toString(),
      description: "Próximos eventos",
      icon: <Calendar className="h-5 w-5 text-corporate-primary" />,
      change: eventCount > 0 ? `${eventCount} eventos` : "Sin eventos",
      trend: eventCount > 0 ? "up" : "neutral",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-corporate-secondary">
          Bienvenido, {profile?.full_name || "Usuario"}
        </h2>
        <p className="text-muted-foreground">
          Aquí tienes un resumen de tu plataforma intranet de correduría de
          seguros
        </p>
      </div>

      {/* Alertas en la parte superior, en una sola columna */}
      <div className="w-full">
        <AlertsSection />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="mt-2 flex items-center text-xs">
                <Activity
                  className={`mr-1 h-3 w-3 ${stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : "text-gray-500"}`}
                />
                <span
                  className={
                    stat.trend === "up"
                      ? "text-green-500"
                      : stat.trend === "down"
                        ? "text-red-500"
                        : "text-gray-500"
                  }
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-4">
          <FeaturedNews />
        </div>

        <div className="col-span-3 space-y-4">
          <RecentNews />
          <RecentDocuments />
        </div>
      </div>
    </div>
  );
}
