import NewsList from "../news/NewsList";
import DashboardLayout from "../dashboard/layout/DashboardLayout";

export default function NewsPage() {
  return (
    <DashboardLayout activeItem="Noticias">
      <div className="w-full">
        <NewsList />
      </div>
    </DashboardLayout>
  );
}
