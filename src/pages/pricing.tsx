import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
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
  const [zelleCopied, setZelleCopied] = useState(false);
  const [claimed, setClaimed] = useState(false);

  async function claim(method: Method) {
    if (claimed) return;
    setClaimed(true);
    await supabase.rpc("yogo_pay_claim", { p_method: method, p_ref: profile?.full_name || profile?.id || "member" });
    await refreshMembership();
  }

  if (membership?.pending) {
    return (
      <div className="rounded-2xl bg-moss-50 border border-moss-300 p-5 text-sm text-foreground">
        <p className="font-semibold mb-1">Payment received. Confirming now.</p>
        <p className="text-muted-foreground">
          Your membership is open while we confirm it{membership.member_until ? `, through ${fmt(membership.member_until)}` : ""}.
          Questions: {SUPPORT_EMAIL}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <a
        href={CASHAPP_URL}
        target="_blank"
        rel="noreferrer"
        onClick={() => claim("cashapp")}
        className="flex flex-col items-center justify-center min-h-[64px] rounded-2xl bg-[#00C244] hover:bg-[#00A83B] text-white font-semibold text-lg transition-colors"
      >
        Pay ${MEMBERSHIP_PRICE} with Cash App
        <span className="text-sm font-normal opacity-85">{CASHAPP_TAG}</span>
      </a>
      <button
        type="button"
        onClick={() => { try { navigator.clipboard.writeText(ZELLE_TO.replace(/\D/g, "")); } catch {} setZelleCopied(true); claim("zelle"); }}
        className="flex flex-col items-center justify-center min-h-[64px] rounded-2xl bg-[#6D1ED4] hover:bg-[#5A17B2] text-white font-semibold text-lg transition-colors"
      >
        Pay ${MEMBERSHIP_PRICE} with Zelle
        <span className="text-sm font-normal opacity-85">
          {zelleCopied ? `Number copied. Send $${MEMBERSHIP_PRICE} to ${ZELLE_TO} in your bank's Zelle.` : `${ZELLE_TO} · tap to copy the number`}
        </span>
      </button>
      <p className="text-xs text-muted-foreground text-center mt-1">Your membership opens right away while we confirm, usually the same day.</p>
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
