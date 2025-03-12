import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { FileText, Users, BookOpen, Calendar, Activity } from "lucide-react";

export default function DashboardOverview() {
  const { profile } = useUserProfile();

  const stats = [
    {
      title: "Documents",
      value: "24",
      description: "Total documents",
      icon: <FileText className="h-5 w-5 text-muted-foreground" />,
      change: "+4 this week",
      trend: "up",
    },
    {
      title: "Users",
      value: "12",
      description: "Active users",
      icon: <Users className="h-5 w-5 text-muted-foreground" />,
      change: "+2 this month",
      trend: "up",
    },
    {
      title: "Companies",
      value: "15",
      description: "Insurance companies",
      icon: <BookOpen className="h-5 w-5 text-muted-foreground" />,
      change: "2 new companies",
      trend: "up",
    },
    {
      title: "Events",
      value: "5",
      description: "Upcoming events",
      icon: <Calendar className="h-5 w-5 text-muted-foreground" />,
      change: "Next: July 15",
      trend: "neutral",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {profile?.full_name || "User"}
        </h2>
        <p className="text-muted-foreground">
          Here's an overview of your insurance franchise intranet platform
        </p>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Recent actions across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    New policy document uploaded
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sarah Johnson • 2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    New user account created
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Admin • 5 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    New company specifications added
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Michael Chen • Yesterday
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Frequently accessed resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Policy Documents
                </Button>
                <Button variant="outline" className="justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Company Specifications
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Company Calendar
                </Button>
                <Button variant="outline" className="justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Directory
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
