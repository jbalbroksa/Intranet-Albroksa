import React, { ReactNode, useState } from "react";
import TopNavigation from "./TopNavigation";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  activeItem?: string;
}

export default function DashboardLayout({
  children,
  activeItem = "Dashboard",
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar - hidden on mobile unless toggled */}
        <div
          className={`${sidebarOpen ? "block" : "hidden"} lg:block fixed inset-y-16 left-0 z-40 lg:relative lg:inset-y-0 lg:z-0 bg-background`}
        >
          <Sidebar activeItem={activeItem} />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 w-full">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
