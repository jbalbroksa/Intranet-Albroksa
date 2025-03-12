import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthLayout from "../auth/AuthLayout";
import { CheckCircle } from "lucide-react";

export default function Success() {
  return (
    <AuthLayout>
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Registration Successful</CardTitle>
          <CardDescription>
            Your account has been created successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            Please check your email to confirm your account. Once confirmed,
            you'll be able to sign in to the platform.
          </p>
          <p className="text-sm text-muted-foreground">
            If you don't see the email, please check your spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link to="/login">Return to Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
