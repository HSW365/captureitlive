import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { INSTRUCTOR_PRICE, INSTRUCTOR_CASHAPP_URL, CASHAPP_TAG, ZELLE_TO, SUPPORT_EMAIL } from "@/lib/config";

const fmt = (d?: string | null) => (d ? new Date(d).toLocaleDateString(undefined, { month: "long", day: "numeric" }) : "");

/** Pay the $99/mo instructor plan to HSW365 (Cash App or Zelle). Opens instantly with a 3-day grace while it's confirmed. */
export function InstructorPayPanel() {
  const { user, profile, membership, refreshMembership, refreshProfile } = useAuth();
  const [method, setMethod] = useState<"cashapp" | "zelle">("cashapp");
  const [ref, setRef] = useState("");
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!user) return <Link href="/signup/instructor" className="flex items-center justify-center min-h-[56px] rounded-2xl bg-coral-600 hover:bg-coral-700 text-white font-semibold">Start teaching · ${INSTRUCTOR_PRICE}/mo</Link>;

  if (membership?.instructor_pending) {
    return (
      <div className="rounded-2xl bg-moss-50 border border-moss-300 p-5 text-sm">
        <p className="font-semibold">Payment received. Confirming now.</p>
        <p className="text-muted-foreground mt-1">You can host classes right away{membership.instructor_until ? ` through ${fmt(membership.instructor_until)}` : ""} while we confirm. Questions: {SUPPORT_EMAIL}</p>
      </div>
    );
  }
  if (membership?.instructor) {
    return (
      <div className="rounded-2xl bg-teal-50 border border-teal-300 p-5 text-sm">
        <p className="font-semibold">Instructor plan active{membership.instructor_until ? ` through ${fmt(membership.instructor_until)}` : ""}.</p>
        <Link href="/dashboard" className="text-coral-600 font-medium">Go to your dashboard</Link>
      </div>
    );
  }

  async function claim() {
    setErr(null);
    if (ref.trim().length < 2) return setErr(method === "cashapp" ? "Add your $cashtag so we can match it." : "Add the name on your Zelle account.");
    setBusy(true);
    const { error } = await supabase.rpc("yogo_instructor_claim", { p_method: method, p_ref: ref.trim() });
    setBusy(false);
    if (error && !/already/i.test(error.message)) return setErr(error.message);
    await refreshProfile(); await refreshMembership();
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {(["cashapp", "zelle"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMethod(m)}
            className={`h-11 rounded-xl border text-sm font-semibold ${method === m ? "border-coral-500 bg-coral-50 text-coral-700" : "border-input text-muted-foreground"}`}>
            {m === "cashapp" ? "Cash App" : "Zelle"}
          </button>
        ))}
      </div>
      {method === "cashapp" ? (
        <a href={INSTRUCTOR_CASHAPP_URL} target="_blank" rel="noreferrer"
          className="flex flex-col items-center justify-center min-h-[60px] rounded-2xl bg-[#00C244] hover:bg-[#00A83B] text-white font-semibold text-lg">
          Pay ${INSTRUCTOR_PRICE} with Cash App<span className="text-sm font-normal opacity-85">{CASHAPP_TAG}</span>
        </a>
      ) : (
        <button type="button" onClick={() => { try { navigator.clipboard.writeText(ZELLE_TO.replace(/\D/g, "")); } catch { /* ignore */ } setCopied(true); }}
          className="w-full flex flex-col items-center justify-center min-h-[60px] rounded-2xl bg-[#6D1ED4] hover:bg-[#5A17B2] text-white font-semibold text-lg">
          Pay ${INSTRUCTOR_PRICE} with Zelle<span className="text-sm font-normal opacity-85">{copied ? `Copied. Send $${INSTRUCTOR_PRICE} to ${ZELLE_TO}` : `${ZELLE_TO} · tap to copy`}</span>
        </button>
      )}
      <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder={method === "cashapp" ? "Your $cashtag" : "Name on your Zelle account"}
        className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm" />
      {err && <p className="text-sm text-destructive">{err}</p>}
      <button type="button" onClick={claim} disabled={busy}
        className="w-full min-h-[48px] rounded-full bg-foreground text-background font-semibold disabled:opacity-50">
        {busy ? "Activating" : "I've paid, activate my instructor plan"}
      </button>
      <p className="text-xs text-muted-foreground text-center">Opens right away while we confirm, usually the same day. {profile?.role !== "instructor" && "Your account switches to instructor."}</p>
    </div>
  );
}
