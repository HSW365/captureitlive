import { useState } from "react";
import { Link } from "wouter";
import { supabase, Profile } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, X } from "lucide-react";

type Method = "cashapp" | "zelle" | "venmo" | "paypal";
const clean = (s: string) => s.trim().replace(/^[@$]/, "");

export function payMethods(p: Profile) {
  const out: { id: Method; label: string; handle: string; color: string }[] = [];
  if (p.pay_cashapp) out.push({ id: "cashapp", label: "Cash App", handle: "$" + clean(p.pay_cashapp), color: "#00C244" });
  if (p.pay_venmo) out.push({ id: "venmo", label: "Venmo", handle: "@" + clean(p.pay_venmo), color: "#008CFF" });
  if (p.pay_paypal) out.push({ id: "paypal", label: "PayPal", handle: clean(p.pay_paypal), color: "#003087" });
  if (p.pay_zelle) out.push({ id: "zelle", label: "Zelle", handle: p.pay_zelle.trim(), color: "#6D1ED4" });
  return out;
}

function payLink(m: Method, handle: string, dollars: number, note: string) {
  const h = clean(handle);
  if (m === "cashapp") return `https://cash.app/$${h}/${dollars}`;
  if (m === "venmo") return `https://venmo.com/${h}?txn=pay&amount=${dollars}&note=${encodeURIComponent(note)}`;
  if (m === "paypal") return `https://paypal.me/${h}/${dollars}`;
  return null;
}

export const money = (cents: number) => "$" + (cents / 100).toFixed(cents % 100 ? 2 : 0);

/**
 * Student pays the instructor directly (Cash App / Venmo / PayPal / Zelle) for a class or a tip.
 * The payment is logged so the instructor can confirm it; confirming a class payment books the seat.
 */
export function PayInstructor({ instructor, classId, classTitle, priceCents, kind, onDone, onClose }: {
  instructor: Profile; classId?: string; classTitle?: string; priceCents?: number; kind: "class" | "tip"; onDone?: () => void; onClose: () => void;
}) {
  const { user } = useAuth();
  const methods = payMethods(instructor);
  const [tip, setTip] = useState(kind === "tip" ? 10 : 0);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<Method | null>(methods[0]?.id ?? null);
  const [ref, setRef] = useState("");
  const [step, setStep] = useState<"pick" | "sent" | "done">("pick");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const first = instructor.full_name.split(" ")[0];

  const tipDollars = custom ? Math.max(0, Math.round(Number(custom))) : tip;
  const classDollars = kind === "class" ? (priceCents ?? 0) / 100 : 0;
  const total = classDollars + tipDollars;
  const m = methods.find((x) => x.id === method);
  const note = kind === "class" ? `CaptureItLive: ${classTitle ?? "class"}` : "CaptureItLive tip";

  function openPay() {
    if (!m || total < 1) return;
    const link = payLink(m.id, m.handle, total, note);
    if (link) window.open(link, "_blank", "noopener");
    else { try { navigator.clipboard.writeText(m.handle); } catch { /* ignore */ } }
    setStep("sent");
  }

  async function report() {
    if (!m) return;
    setErr(null); setBusy(true);
    const calls: PromiseLike<{ error: { message: string } | null }>[] = [];
    if (kind === "class" && classDollars > 0)
      calls.push(supabase.rpc("yogo_class_pay_report", { p_instructor: instructor.id, p_class: classId, p_kind: "class", p_amount_cents: Math.round(classDollars * 100), p_method: m.id, p_ref: ref }));
    if (tipDollars > 0)
      calls.push(supabase.rpc("yogo_class_pay_report", { p_instructor: instructor.id, p_class: classId ?? null, p_kind: "tip", p_amount_cents: tipDollars * 100, p_method: m.id, p_ref: ref }));
    const res = await Promise.all(calls);
    setBusy(false);
    const e = res.find((r) => r.error)?.error;
    if (e) return setErr(e.message);
    setStep("done");
    onDone?.();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-coral-600">{kind === "class" ? "Book your spot" : "Send a tip"}</p>
            <h2 className="font-display text-2xl font-medium mt-1">{kind === "class" ? classTitle : `Tip ${first}`}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 text-muted-foreground"><X size={20} /></button>
        </div>

        {!user ? (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">Create a free account so {first} can match your payment to you.</p>
            <div className="flex gap-3 mt-5"><Link href="/signup" className="flex-1"><Button className="w-full">Sign up</Button></Link><Link href="/login" className="flex-1"><Button variant="outline" className="w-full">Log in</Button></Link></div>
          </div>
        ) : methods.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">{first} hasn't added a payout method yet. Send them a message to pay directly.</p>
        ) : step === "done" ? (
          <div className="mt-6 rounded-2xl bg-moss-50 border border-moss-300 p-5 text-sm">
            <p className="font-semibold">Sent. Thank you.</p>
            <p className="text-muted-foreground mt-1">{kind === "class" ? `${first} confirms your payment and your spot is booked automatically. You'll see it on your dashboard.` : `${first} gets 100% of your tip.`}</p>
            <Button className="w-full mt-4" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            {kind === "class" && (
              <div className="mt-5 flex justify-between text-sm"><span className="text-muted-foreground">Class</span><b>{money(priceCents ?? 0)}</b></div>
            )}
            <div className="mt-5">
              <p className="text-sm font-medium flex items-center gap-2"><Heart size={15} className="text-coral-600" /> {kind === "class" ? "Add a tip" : "Amount"}</p>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {(kind === "class" ? [0, 3, 5, 10] : [5, 10, 20, 50]).map((t) => (
                  <button key={t} type="button" onClick={() => { setTip(t); setCustom(""); }}
                    className={`h-11 rounded-xl border text-sm font-semibold ${!custom && tip === t ? "border-coral-500 bg-coral-50 text-coral-700" : "border-input text-muted-foreground"}`}>
                    {t === 0 ? "None" : `$${t}`}
                  </button>
                ))}
                <Input inputMode="numeric" placeholder="$" value={custom} onChange={(e) => setCustom(e.target.value.replace(/\D/g, "").slice(0, 4))} className="h-11 text-center px-1" />
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium">Pay {first} with</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {methods.map((x) => (
                  <button key={x.id} type="button" onClick={() => { setMethod(x.id); setStep("pick"); }}
                    className={`rounded-xl border px-3 py-2.5 text-left ${method === x.id ? "border-coral-500 bg-coral-50" : "border-input"}`}>
                    <span className="block text-sm font-semibold">{x.label}</span>
                    <span className="block text-xs text-muted-foreground truncate">{x.handle}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="button" disabled={total < 1 || !m} onClick={openPay}
              className="mt-6 w-full min-h-[56px] rounded-2xl text-white font-semibold text-lg disabled:opacity-40" style={{ background: m?.color ?? "#999" }}>
              {m?.id === "zelle" ? `Copy Zelle and send ${money(total * 100)}` : `Pay ${money(total * 100)} with ${m?.label ?? ""}`}
            </button>
            {m?.id === "zelle" && step === "sent" && <p className="text-xs text-muted-foreground text-center mt-2">Copied. Send {money(total * 100)} to {m.handle} in your bank's Zelle.</p>}

            {step === "sent" && (
              <div className="mt-5 space-y-3">
                <Input value={ref} onChange={(e) => setRef(e.target.value)} placeholder={m?.id === "zelle" ? "Name on your Zelle account" : "Your handle so they can match it"} />
                {err && <p className="text-sm text-destructive">{err}</p>}
                <Button className="w-full" disabled={busy || ref.trim().length < 2} onClick={report}>{busy ? "Sending" : "I've paid"}</Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center mt-4">Payment goes straight to {first}. CaptureItLive takes no cut.</p>
          </>
        )}
      </div>
    </div>
  );
}
