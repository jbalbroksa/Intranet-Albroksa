import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
  const location = useLocation();

  // Generate breadcrumbs from current path if no items provided
  const generatedItems =
    items.length > 0 ? items : generateBreadcrumbsFromPath(location.pathname);

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {generatedItems.map((item, index) => {
          const isLast = index === generatedItems.length - 1;

          return (
            <BreadcrumbItem key={item.label}>
              {isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.href || "#"}>{item.label}</Link>
                </BreadcrumbLink>
              )}
              {!isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function generateBreadcrumbsFromPath(path: string): BreadcrumbItem[] {
  // Remove leading and trailing slashes
  const cleanPath = path.replace(/^\/|\/$/, "");

  // If path is empty, return empty array
  if (!cleanPath) return [];

  // Split path into segments
  const segments = cleanPath.split("/");

  // Generate breadcrumb items
  return segments.map((segment, index) => {
    // Format segment for display (capitalize, replace hyphens with spaces)
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Generate href for all but the last segment
    const href =
      index < segments.length - 1
        ? `/${segments.slice(0, index + 1).join("/")}`
        : undefined;

    return { label, href };
  });
}
