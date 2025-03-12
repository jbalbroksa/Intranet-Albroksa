import CalendarView from "../calendar/CalendarView";
import DashboardLayout from "../dashboard/layout/DashboardLayout";

export default function CalendarPage() {
  return (
    <DashboardLayout activeItem="Calendar">
      <CalendarView />
    </DashboardLayout>
  );
}
