import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Smartphone, Landmark, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { MEMBERSHIP_PRICE, CASHAPP_URL, CASHAPP_TAG, ZELLE_TO, SUPPORT_EMAIL } from "@/lib/config";

const features = [
  "Full community feed — post, comment, connect",
  "Follow every instructor on CaptureItLive",
  "Unlimited class RSVPs, including paid sessions",
  "Direct message instructors",
  "List & sell your own classes if you teach",
  "Priority booking on limited-capacity classes",
  "Ad-free, always",
];

type Method = "cashapp" | "zelle";

function fmt(d: string | null | undefined) {
  return d ? new Date(d).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) : "";
}

function PayPanel() {
  const { profile, membership, refreshMembership } = useAuth();
  const [method, setMethod] = useState<Method>("cashapp");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function claim(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (reference.trim().length < 2) {
      setError("Add your $cashtag or Zelle name so we can match your payment.");
      return;
    }
    setSending(true);
    const { error } = await supabase.rpc("yogo_pay_claim", { p_method: method, p_ref: reference.trim() });
    setSending(false);
    if (error) { setError(error.message); return; }
    await refreshMembership();
    window.location.hash = "#/community";
  }

  if (membership?.pending) {
    return (
      <div className="rounded-2xl bg-teal-50 border border-teal-300 p-5 text-sm text-foreground">
        <p className="font-medium mb-1">Payment received — confirming now.</p>
        <p className="text-muted-foreground">
          Your membership is open while we confirm it{membership.member_until ? `, through ${fmt(membership.member_until)}` : ""}.
          Questions: {SUPPORT_EMAIL}
        </p>
      </div>
    );
  }

  const name = profile?.full_name || "your name";
  const options: { key: Method; icon: JSX.Element; title: string; note: string; href?: string }[] = [
    { key: "cashapp", icon: <Smartphone className="w-5 h-5" />, title: "Cash App", note: `${CASHAPP_TAG} · put ${name} in the note`, href: CASHAPP_URL },
    { key: "zelle", icon: <Landmark className="w-5 h-5" />, title: "Zelle", note: `${ZELLE_TO} · put ${name} in the memo` },
  ];

  return (
    <div className="text-left">
      <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-3">1 · Pay ${MEMBERSHIP_PRICE}</p>
      <div className="space-y-2 mb-6">
        {options.map((o) => {
          const body = (
            <>
              <span className="text-coral-600">{o.icon}</span>
              <span className="flex-1 min-w-0">
                <span className="block font-medium text-foreground">{o.title}</span>
                <span className="block text-xs text-muted-foreground truncate">{o.note}</span>
              </span>
              {o.href && <ArrowUpRight className="w-4 h-4 text-muted-foreground" />}
            </>
          );
          const cls = `flex items-center gap-3 rounded-2xl border p-4 transition ${method === o.key ? "border-coral-500 bg-coral-50" : "border-border hover:border-coral-300"}`;
          return o.href ? (
            <a key={o.key} href={o.href} target="_blank" rel="noreferrer" onClick={() => setMethod(o.key)} className={cls}>{body}</a>
          ) : (
            <button key={o.key} type="button" onClick={() => setMethod(o.key)} className={cls + " w-full text-left"}>{body}</button>
          );
        })}
      </div>
      <form onSubmit={claim}>
        <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-3">2 · Tell us you paid</p>
        <div className="flex gap-2 mb-3">
          {(["cashapp", "zelle"] as Method[]).map((m) => (
            <button key={m} type="button" onClick={() => setMethod(m)}
              className={`flex-1 h-9 rounded-full text-xs font-medium border transition ${method === m ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"}`}>
              {m === "cashapp" ? "Cash App" : "Zelle"}
            </button>
          ))}
        </div>
        <Input value={reference} onChange={(e) => setReference(e.target.value)} maxLength={120}
          placeholder={method === "cashapp" ? "Your $cashtag" : "Name on your Zelle"} />
        {error && <p className="text-sm text-coral-600 mt-2">{error}</p>}
        <Button size="lg" className="w-full mt-4" disabled={sending}>{sending ? "Sending…" : "I've paid — activate my membership"}</Button>
        <p className="text-xs text-muted-foreground mt-3">You get full access right away while we confirm, usually the same day.</p>
      </form>
    </div>
  );
}

export default function Pricing() {
  const { user, membership, isMember } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
      <span className="inline-block text-xs font-mono tracking-widest uppercase text-coral-600 bg-coral-50 px-3 py-1 rounded-full mb-6">
        Pricing
      </span>
      <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground mb-4">
        One membership. Everything included.
      </h1>
      <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">
        CaptureItLive runs on one simple subscription — students and instructors, same price,
        full access. No free tier, no locked features.
      </p>

      <Card className="gradient-border p-10 max-w-md mx-auto text-left shadow-lifted">
        <h2 className="font-display text-2xl font-medium mb-1">CaptureItLive Membership</h2>
        <p className="text-sm text-muted-foreground mb-6">For every student and instructor</p>
        <div className="mb-8">
          <span className="font-display text-5xl font-medium">${MEMBERSHIP_PRICE}</span>
          <span className="text-muted-foreground text-base">/mo</span>
        </div>

        {!user && (
          <Link href="/signup"><Button size="lg" className="w-full mb-8">Join CaptureItLive</Button></Link>
        )}
        {user && isMember && (
          <div className="rounded-2xl bg-teal-50 border border-teal-300 p-5 text-sm mb-8">
            <p className="font-medium">Your membership is active{membership?.member_until ? ` through ${fmt(membership.member_until)}` : ""}.</p>
            <Link href="/community" className="text-coral-600 font-medium">Go to the community →</Link>
          </div>
        )}
        {user && !isMember && <div className="mb-8"><PayPanel /></div>}

        <ul className="space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
              <span className="text-foreground/90">{f}</span>
            </li>
          ))}
        </ul>
      </Card>

      <p className="text-sm text-muted-foreground mt-10">
        Renew monthly. Instructors keep 100% of class payments collected outside CaptureItLive —
        the $8/mo covers your account, not a commission.
      </p>
    </div>
  );
}
