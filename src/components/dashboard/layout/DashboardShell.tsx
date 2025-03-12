import { ReactNode } from "react";
import DashboardHeader from "./DashboardHeader";

interface DashboardShellProps {
  children: ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
  header?: ReactNode;
}

export default function DashboardShell({
  children,
  title,
  description,
  breadcrumbs,
  actions,
  header,
}: DashboardShellProps) {
  return (
    <div className="flex flex-col h-full">
      {header ||
        (title && (
          <DashboardHeader
            title={title}
            description={description}
            breadcrumbs={breadcrumbs}
            actions={actions}
          />
        ))}
      <div className="flex-1">{children}</div>
    </div>
  );
}
