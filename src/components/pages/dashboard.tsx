import React from "react";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import DashboardShell from "../dashboard/layout/DashboardShell";
import DashboardOverview from "../dashboard/DashboardOverview";

const Dashboard = () => {
  return (
    <DashboardLayout activeItem="Dashboard">
      <DashboardShell title="" description="">
        <DashboardOverview />
      </DashboardShell>
    </DashboardLayout>
  );
};

export default Dashboard;
