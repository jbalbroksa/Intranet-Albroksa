import CompanyList from "../content/CompanyList";
import DashboardLayout from "../dashboard/layout/DashboardLayout";

export default function CompaniesPage() {
  return (
    <DashboardLayout activeItem="Compañías">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4">Compañías</h1>
        <CompanyList />
      </div>
    </DashboardLayout>
  );
}
