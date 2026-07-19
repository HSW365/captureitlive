import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUp() {
  const { signUp } = useAuth();
  const [, setLocation] = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signUp(email, password, fullName, role);
    setLoading(false);
    if (error) return setError(error);
    setLocation("/onboarding");
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl font-medium mb-2">Join Yogo</h1>
      <p className="text-muted-foreground mb-8">Bring your practice, and your people, together.</p>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <Label>I'm joining as a</Label>
          <div className="grid grid-cols-2 gap-3">
            {(["student", "instructor"] as const).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`h-12 rounded-xl border text-sm font-medium capitalize transition-colors ${
                  role === r ? "border-coral-500 bg-coral-50 text-coral-700" : "border-input text-muted-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jordan Rivers" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account…" : "Create account"}</Button>
      </form>
      <p className="text-sm text-muted-foreground mt-6 text-center">
        Already on Yogo? <Link href="/login" className="text-coral-600 font-medium">Log in</Link>
      </p>
    </div>
  );
}
