import { ReactNode } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/lib/auth-context";

const Loading = () => <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading…</div>;

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Redirect to="/login" />;
  return <>{children}</>;
}

// Signed in AND an active paid member. Everyone else goes to checkout.
export function MemberRoute({ children }: { children: ReactNode }) {
  const { user, loading, membership, isMember } = useAuth();
  if (loading || (user && !membership)) return <Loading />;
  if (!user) return <Redirect to="/login" />;
  if (!isMember) return <Redirect to="/pricing" />;
  return <>{children}</>;
}
