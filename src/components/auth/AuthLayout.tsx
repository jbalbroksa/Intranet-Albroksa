import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-md w-full px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">InsuranceConnect</h1>
          <p className="text-muted-foreground mt-2">
            Insurance Franchise Intranet Platform
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
