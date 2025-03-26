import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserProfile } from "@/hooks/useUserProfile";
import { FileText, Users, BookOpen, Calendar, Activity } from "lucide-react";
import AlertsSection from "./AlertsSection";
import RecentDocuments from "./RecentDocuments";
import FeaturedNews from "../news/FeaturedNews";
import RecentNews from "../news/RecentNews";

export default function DashboardOverview() {
  const { profile } = useUserProfile();

  const stats = [
    {
      title: "Documentos",
      value: "0",
      description: "Total documentos",
      icon: <FileText className="h-5 w-5 text-corporate-primary" />,
      change: "Sin cambios",
      trend: "neutral",
    },
    {
      title: "Usuarios",
      value: "0",
      description: "Usuarios activos",
      icon: <Users className="h-5 w-5 text-corporate-primary" />,
      change: "Sin cambios",
      trend: "neutral",
    },
    {
      title: "Compañías",
      value: "0",
      description: "Compañías de seguros",
      icon: <BookOpen className="h-5 w-5 text-corporate-primary" />,
      change: "Sin cambios",
      trend: "neutral",
    },
    {
      title: "Eventos",
      value: "0",
      description: "Próximos eventos",
      icon: <Calendar className="h-5 w-5 text-corporate-primary" />,
      change: "Sin eventos",
      trend: "neutral",
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
