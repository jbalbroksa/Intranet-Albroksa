import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import AuthLayout from "../auth/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <AuthLayout>
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Welcome to InsuranceConnect
          </CardTitle>
          <CardDescription>
            Insurance Franchise Intranet Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Please sign in to access the platform or create a new account.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </Button>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
