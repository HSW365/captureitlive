import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { MEMBERSHIP_PRICE, CASHAPP_URL, CASHAPP_TAG, ZELLE_TO } from "@/lib/config";

export default function SignUp() {
  const { signUp } = useAuth();
  const [, setLocation] = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [join, setJoin] = useState(true);
  const [method, setMethod] = useState<"cashapp" | "zelle">("cashapp");
  const [ref, setRef] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (join && ref.trim().length < 2) return setError(method === "cashapp" ? "Add your $cashtag so we can match your payment." : "Add the name on your Zelle account.");
    setLoading(true);
    const { error } = await signUp(email, password, fullName, role);
    if (error) { setLoading(false); return setError(error); }
    if (join) {
      const { error: payErr } = await supabase.rpc("yogo_pay_claim", { p_method: method, p_ref: ref.trim() });
      if (payErr && !/already/i.test(payErr.message)) { setLoading(false); setError("Account created. " + payErr.message); return; }
    }
    setLoading(false);
    setLocation("/onboarding");
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl font-medium mb-2">Join CaptureItLive</h1>
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
        <div className="rounded-xl border border-input p-4 space-y-3">
          <label className="flex items-center gap-3 text-sm font-medium">
            <input type="checkbox" checked={join} onChange={(e) => setJoin(e.target.checked)} className="h-4 w-4 accent-coral-500" />
            Start my membership now · ${MEMBERSHIP_PRICE}/month
          </label>
          {join && (
            <>
              <div className="grid grid-cols-2 gap-2">
                {(["cashapp", "zelle"] as const).map((m) => (
                  <button type="button" key={m} onClick={() => setMethod(m)}
                    className={`h-10 rounded-lg border text-sm font-medium ${method === m ? "border-coral-500 bg-coral-50 text-coral-700" : "border-input text-muted-foreground"}`}>
                    {m === "cashapp" ? "Cash App" : "Zelle"}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {method === "cashapp"
                  ? <>Send <b>${MEMBERSHIP_PRICE}</b> to <a className="text-coral-600 font-medium" href={CASHAPP_URL} target="_blank" rel="noopener">{CASHAPP_TAG}</a> with your email in the note.</>
                  : <>Send <b>${MEMBERSHIP_PRICE}</b> by Zelle to <b>{ZELLE_TO}</b> with your email in the memo.</>}
                {" "}Your membership opens right away.
              </p>
              <Input value={ref} onChange={(e) => setRef(e.target.value)} placeholder={method === "cashapp" ? "Your $cashtag" : "Name on your Zelle account"} />
            </>
          )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account…" : join ? "Create account & start membership" : "Create free account"}</Button>
      </form>
      <p className="text-sm text-muted-foreground mt-6 text-center">
        Already on CaptureItLive? <Link href="/login" className="text-coral-600 font-medium">Log in</Link>
      </p>
    </div>
  );
}
