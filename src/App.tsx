import React, { Suspense } from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import Dashboard from "./components/pages/dashboard";
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import Documents from "./components/pages/documents";
import Content from "./components/pages/content";
import Companies from "./components/pages/companies";
import UserManagement from "./components/pages/user-management";
import Settings from "./components/pages/settings";
import Calendar from "./components/pages/calendar";
import Users from "./components/pages/users";
import News from "./components/pages/news";
import { AuthProvider, useAuth } from "../supabase/auth";
import { Toaster } from "./components/ui/toaster";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  // For Tempo routes
  // Use { useMatch: () => false } to prevent route matching errors with hash URLs
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true"
      ? useRoutes(routes, {
          useMatch: (path) => (path.includes("#") ? false : undefined),
        })
      : null;

  return (
    <>
      {/* For the tempo routes */}
      {import.meta.env.VITE_TEMPO === "true" && tempoRoutes}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/documents/*"
          element={
            <PrivateRoute>
              <Documents />
            </PrivateRoute>
          }
        />
        <Route
          path="/content"
          element={
            <PrivateRoute>
              <Content />
            </PrivateRoute>
          }
        />
        <Route
          path="/content/:productId"
          element={
            <PrivateRoute>
              <Suspense fallback={<div>Loading...</div>}>
                {React.createElement(
                  React.lazy(() => import("./components/content/ProductView")),
                )}
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/companies/*"
          element={
            <PrivateRoute>
              <Companies />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/*"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar/*"
          element={
            <PrivateRoute>
              <Calendar />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/*"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-management/*"
          element={
            <PrivateRoute>
              <UserManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/news/*"
          element={
            <PrivateRoute>
              <News />
            </PrivateRoute>
          }
        />
        <Route path="/success" element={<Success />} />

        {/* Add this before the catchall route to allow Tempo routes */}
        {import.meta.env.VITE_TEMPO === "true" && (
          <Route path="/tempobook/*" element={<></>} />
        )}

        {/* Redirect to login for any other routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <AppRoutes />
      </Suspense>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
