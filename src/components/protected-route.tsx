import { ReactNode } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/lib/auth-context";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (!user) return <Redirect to="/login" />;
  return <>{children}</>;
}
