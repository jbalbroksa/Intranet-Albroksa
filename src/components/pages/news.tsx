import NewsList from "../news/NewsList";
import DashboardLayout from "../dashboard/layout/DashboardLayout";

export default function NewsPage() {
  return (
    <DashboardLayout activeItem="Noticias">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-6">Noticias</h1>
        <NewsList />
      </div>
    </DashboardLayout>
  );
}
