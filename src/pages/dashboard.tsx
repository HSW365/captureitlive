import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { supabase, YogaClass, Profile, YOGA_STYLES } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { InstructorPayPanel } from "@/components/instructor-plan";
import { money, payMethods } from "@/components/pay-instructor";
import { INSTRUCTOR_MIN_CLASS } from "@/lib/config";
import { Copy, Check, Gift } from "lucide-react";
import { loadWallet, CASHOUT_MIN_CENTS, giftById, type GiftRow } from "@/lib/gifts";

function GiftEarnings({ profile }: { profile: Profile }) {
  const qc = useQueryClient();
  const methods = payMethods(profile);
  const [method, setMethod] = useState(methods[0]?.id ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { data: w } = useQuery({ queryKey: ["wallet", profile.id], queryFn: loadWallet });
  const { data: gifts } = useQuery({
    queryKey: ["my-gifts", profile.id],
    queryFn: async () => {
      const { data } = await supabase.from("yogo_gifts").select("*, sender:yogo_profiles!yogo_gifts_sender_id_fkey(full_name)").eq("instructor_id", profile.id).order("created_at", { ascending: false }).limit(15);
      return (data ?? []) as GiftRow[];
    },
  });
  const { data: payouts } = useQuery({
    queryKey: ["my-payouts", profile.id],
    queryFn: async () => (await supabase.from("yogo_payouts").select("*").eq("instructor_id", profile.id).order("created_at", { ascending: false }).limit(10)).data ?? [],
  });
  async function cashOut() {
    setMsg(null); setBusy(true);
    const { error } = await supabase.rpc("yogo_payout_request", { p_method: method });
    setBusy(false);
    if (error) return setMsg(error.message);
    setMsg("Cash out requested. It's sent to you within 2 business days.");
    qc.invalidateQueries({ queryKey: ["wallet", profile.id] }); qc.invalidateQueries({ queryKey: ["my-payouts", profile.id] });
  }
  const bal = w?.earned_cents ?? 0;
  return (
    <section className="mb-12">
      <h2 className="font-display text-xl font-medium mb-4 flex items-center gap-2"><Gift size={20} className="text-coral-600" /> Live gift earnings</h2>
      <div className="rounded-3xl bg-moss-900 text-white p-6">
        <p className="text-xs uppercase tracking-widest opacity-60">Ready to cash out</p>
        <p className="font-display text-5xl font-medium mt-2">{money(bal)}</p>
        <p className="text-sm opacity-60 mt-1">{money(w?.lifetime_earned_cents ?? 0)} earned from gifts all time · you keep 70% of every gift</p>
        {methods.length === 0 ? (
          <Link href="/profile/edit" className="inline-block mt-5 underline font-semibold">Add a payout method to cash out</Link>
        ) : w?.payout_pending ? (
          <p className="mt-5 text-sm">Your cash out is on the way.</p>
        ) : (
          <div className="mt-5 flex flex-wrap gap-2 items-center">
            <select value={method} onChange={(e) => setMethod(e.target.value as typeof method)} className="h-11 rounded-full bg-white/10 border border-white/20 px-4 text-sm">
              {methods.map((m) => <option key={m.id} value={m.id} className="text-black">{m.label} {m.handle}</option>)}
            </select>
            <button disabled={busy || bal < CASHOUT_MIN_CENTS} onClick={cashOut} className="h-11 px-6 rounded-full bg-white text-moss-900 font-semibold disabled:opacity-40">
              {bal < CASHOUT_MIN_CENTS ? `Cash out at ${money(CASHOUT_MIN_CENTS)}` : `Cash out ${money(bal)}`}
            </button>
          </div>
        )}
        {msg && <p className="mt-3 text-sm opacity-90">{msg}</p>}
      </div>
      {(gifts?.length ?? 0) > 0 && (
        <div className="mt-4 space-y-1">
          {gifts!.map((g) => { const G = giftById(g.gift); return (
            <div key={g.id} className="flex justify-between items-center text-sm py-2 border-b border-border">
              <span className="flex items-center gap-2">{G && <G.icon size={16} style={{ color: G.color }} />}{g.sender?.full_name ?? "Someone"} sent {G?.name ?? g.gift}</span>
              <span className="font-mono">+{money(g.instructor_cents)}</span>
            </div>
          ); })}
        </div>
      )}
      {(payouts?.length ?? 0) > 0 && (
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          {payouts!.map((p: { id: string; amount_cents: number; status: string; method: string; created_at: string }) => (
            <p key={p.id}>{format(new Date(p.created_at), "MMM d")} · {money(p.amount_cents)} to {p.method} · {p.status === "pending" ? "on the way" : p.status}</p>
          ))}
        </div>
      )}
    </section>
  );
}

interface ClassPayment { id: string; class_id: string | null; student_id: string; kind: "class" | "tip"; amount_cents: number; method: string; reference: string | null; status: "reported" | "confirmed" | "rejected"; created_at: string; student?: { full_name: string } | null; cls?: { title: string } | null }

function InviteLink({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}${window.location.pathname}#/i/${id}`;
  return (
    <div className="rounded-2xl border border-border p-5">
      <p className="font-display text-lg font-medium">Bring your students</p>
      <p className="text-sm text-muted-foreground mt-1">Share your invite link in your bio, texts and group chats. Students land on your page, sign up and book your classes.</p>
      <div className="flex gap-2 mt-4">
        <input readOnly value={url} className="flex-1 min-w-0 h-11 rounded-xl border border-input bg-muted px-3 text-xs font-mono" onFocus={(e) => e.target.select()} />
        <Button type="button" onClick={() => { try { navigator.clipboard.writeText(url); } catch { /* ignore */ } setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
          {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}

function Earnings({ instructorId }: { instructorId: string }) {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["earnings", instructorId],
    queryFn: async () => {
      const { data } = await supabase.from("yogo_class_payments")
        .select("*, student:yogo_profiles!yogo_class_payments_student_id_fkey(full_name), cls:yogo_classes(title)")
        .eq("instructor_id", instructorId).order("created_at", { ascending: false }).limit(100);
      return (data ?? []) as ClassPayment[];
    },
  });
  async function decide(id: string, confirm: boolean) {
    await supabase.rpc("yogo_class_pay_decide", { p_id: id, p_confirm: confirm });
    qc.invalidateQueries({ queryKey: ["earnings", instructorId] });
    qc.invalidateQueries({ queryKey: ["my-classes"] });
  }
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const confirmed = (data ?? []).filter((p) => p.status === "confirmed");
  const month = confirmed.filter((p) => new Date(p.created_at) >= monthStart);
  const sum = (a: ClassPayment[]) => a.reduce((t, p) => t + p.amount_cents, 0);
  const pending = (data ?? []).filter((p) => p.status === "reported");
  return (
    <section className="mb-12">
      <h2 className="font-display text-xl font-medium mb-4">Earnings</h2>
      <div className="grid grid-cols-3 gap-3">
        {[["This month", money(sum(month))], ["Tips this month", money(sum(month.filter((p) => p.kind === "tip")))], ["All time", money(sum(confirmed))]].map(([l, v]) => (
          <div key={l} className="rounded-2xl border border-border p-4"><p className="font-display text-2xl font-medium">{v}</p><p className="text-xs text-muted-foreground mt-1">{l}</p></div>
        ))}
      </div>
      <h3 className="text-sm font-semibold mt-6 mb-3">To confirm {pending.length > 0 && <span className="ml-1 text-coral-600">{pending.length}</span>}</h3>
      {pending.length === 0 && <p className="text-sm text-muted-foreground">No payments waiting. When a student pays you, check your app and confirm it here. Confirming a class payment books their seat.</p>}
      <div className="space-y-2">
        {pending.map((p) => (
          <div key={p.id} className="rounded-xl border border-border p-4 flex flex-wrap items-center gap-3 justify-between">
            <div className="text-sm">
              <p className="font-medium">{money(p.amount_cents)} {p.kind === "tip" ? "tip" : "class"} from {p.student?.full_name ?? "a student"}</p>
              <p className="text-xs text-muted-foreground">{p.method}{p.reference ? ` · ${p.reference}` : ""}{p.cls?.title ? ` · ${p.cls.title}` : ""} · {format(new Date(p.created_at), "MMM d, h:mm a")}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => decide(p.id, false)}>Not received</Button>
              <Button size="sm" onClick={() => decide(p.id, true)}>Confirm</Button>
            </div>
          </div>
        ))}
      </div>
      {confirmed.length > 0 && (
        <>
          <h3 className="text-sm font-semibold mt-6 mb-3">Recent</h3>
          <div className="space-y-1">
            {confirmed.slice(0, 10).map((p) => (
              <div key={p.id} className="flex justify-between text-sm py-2 border-b border-border">
                <span>{p.student?.full_name ?? "Student"} · {p.kind === "tip" ? "Tip" : p.cls?.title ?? "Class"}</span>
                <span className="font-mono">{money(p.amount_cents)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function NewClassDialog({ instructorId, onCreated }: { instructorId: string; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", style: YOGA_STYLES[0] as string, level: "all-levels",
    session_type: "virtual", location: "", meeting_link: "",
    start_time: "", duration_minutes: 60, capacity: 20, price: "",
  });
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (form.capacity < INSTRUCTOR_MIN_CLASS) return setErr(`Classes hold ${INSTRUCTOR_MIN_CLASS} students or more.`);
    setSaving(true);
    const { price, ...rest } = form;
    const { error } = await supabase.from("yogo_classes").insert({
      ...rest,
      price_cents: Math.round(Number(price || 0) * 100),
      instructor_id: instructorId,
      start_time: new Date(form.start_time).toISOString(),
    });
    setSaving(false);
    if (error) return setErr(/row-level|policy/i.test(error.message) ? "Activate your instructor plan to host classes." : error.message);
    setOpen(false);
    onCreated();
  }

  if (!open) return <Button onClick={() => setOpen(true)}>Create a class</Button>;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setOpen(false)}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-card rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto space-y-4">
        <h2 className="font-display text-xl font-medium">New class</h2>
        <div><Label>Title</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Style</Label>
            <Select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })}>
              {YOGA_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          <div><Label>Level</Label>
            <Select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              {["all-levels", "beginner", "intermediate", "advanced"].map((l) => <option key={l} value={l}>{l}</option>)}
            </Select>
          </div>
        </div>
        <div><Label>Format</Label>
          <Select value={form.session_type} onChange={(e) => setForm({ ...form, session_type: e.target.value })}>
            <option value="virtual">Virtual</option>
            <option value="in-person">In person</option>
          </Select>
        </div>
        {form.session_type === "in-person" ? (
          <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
        ) : (
          <div><Label>Meeting link</Label><Input value={form.meeting_link} onChange={(e) => setForm({ ...form, meeting_link: e.target.value })} /></div>
        )}
        <div><Label>Starts at</Label><Input type="datetime-local" required value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Duration (min)</Label><Input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })} /></div>
          <div><Label>Capacity ({INSTRUCTOR_MIN_CLASS}+)</Label><Input type="number" min={INSTRUCTOR_MIN_CLASS} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></div>
        </div>
        <div><Label>Price per student ($)</Label><Input inputMode="decimal" placeholder="0 for free" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value.replace(/[^\d.]/g, "").slice(0, 7) })} />
          <p className="text-xs text-muted-foreground mt-1">Students pay you directly. You keep 100%.</p></div>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={saving}>{saving ? "Creating…" : "Create"}</Button>
        </div>
      </form>
    </div>
  );
}

export default function Dashboard() {
  const { profile, isInstructor } = useAuth();
  const qc = useQueryClient();

  const { data: myClasses, refetch: refetchClasses } = useQuery({
    queryKey: ["my-classes", profile?.id],
    queryFn: async () => {
      const { data } = await supabase.from("yogo_classes").select("*").eq("instructor_id", profile!.id).order("start_time");
      return (data ?? []) as YogaClass[];
    },
    enabled: profile?.role === "instructor",
  });

  const { data: myRsvps } = useQuery({
    queryKey: ["my-rsvps", profile?.id],
    queryFn: async () => {
      const { data } = await supabase.from("yogo_class_rsvps").select("class_id, yogo_classes(*, instructor:yogo_profiles(*))").eq("student_id", profile!.id);
      return (data ?? []).map((r: any) => r.yogo_classes) as YogaClass[];
    },
    enabled: profile?.role === "student",
  });

  const { data: following } = useQuery({
    queryKey: ["my-following", profile?.id],
    queryFn: async () => {
      const { data } = await supabase.from("yogo_follows").select("following_id, yogo_profiles!yogo_follows_following_id_fkey(*)").eq("follower_id", profile!.id);
      return (data ?? []).map((f: any) => f.yogo_profiles) as Profile[];
    },
    enabled: !!profile,
  });

  if (!profile) return <div className="max-w-3xl mx-auto px-6 py-20 text-muted-foreground">Loading dashboard…</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-3xl font-medium">Hi, {profile.full_name.split(" ")[0]}</h1>
        <Link href="/profile/edit"><Button variant="outline" size="sm">Edit profile</Button></Link>
      </div>
      <p className="text-muted-foreground mb-10">
        <Badge tone="violet" className="mr-2">{profile.role}</Badge>
        {profile.energy_points} energy points
      </p>

      {profile.role === "instructor" && !isInstructor && (
        <section className="mb-12 rounded-3xl border border-coral-300 p-6">
          <h2 className="font-display text-2xl font-medium">Activate your instructor plan</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-5">$99/month. Host classes of {INSTRUCTOR_MIN_CLASS}+, set your prices, students pay you directly and you keep every tip.</p>
          <InstructorPayPanel />
        </section>
      )}

      {profile.role === "instructor" && isInstructor && (
        <div className="mb-12 grid gap-4">
          <InviteLink id={profile.id} />
          {payMethods(profile).length === 0 && (
            <Link href="/profile/edit" className="rounded-2xl border border-coral-300 bg-coral-50 p-5 block">
              <p className="font-semibold text-sm">Add how students pay you</p>
              <p className="text-xs text-muted-foreground mt-1">Add your Cash App, Venmo, PayPal or Zelle so students can pay for classes and tip you.</p>
            </Link>
          )}
        </div>
      )}

      {profile.role === "instructor" && isInstructor && <GiftEarnings profile={profile} />}
      {profile.role === "instructor" && isInstructor && <Earnings instructorId={profile.id} />}

      {profile.role === "instructor" && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-medium">Your classes</h2>
            {isInstructor && <NewClassDialog instructorId={profile.id} onCreated={() => { refetchClasses(); qc.invalidateQueries({ queryKey: ["classes"] }); }} />}
          </div>
          {myClasses?.length === 0 && <p className="text-sm text-muted-foreground">You haven't created any classes yet.</p>}
          <div className="space-y-3">
            {myClasses?.map((c) => (
              <Link key={c.id} href={`/classes/${c.id}`} className="flex items-center justify-between rounded-xl border border-border p-4 hover:border-coral-300">
                <div>
                  <p className="font-medium text-sm">{c.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">{format(new Date(c.start_time), "EEE, MMM d · h:mm a")}</p>
                </div>
                <Badge tone="violet">{c.price_cents > 0 ? money(c.price_cents) : "Free"}</Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {profile.role === "student" && (
        <section className="mb-12">
          <h2 className="font-display text-xl font-medium mb-4">Your RSVPs</h2>
          {myRsvps?.length === 0 && <p className="text-sm text-muted-foreground">No upcoming classes yet — <Link href="/classes" className="text-coral-600">browse classes</Link>.</p>}
          <div className="space-y-3">
            {myRsvps?.map((c) => (
              <Link key={c.id} href={`/classes/${c.id}`} className="flex items-center justify-between rounded-xl border border-border p-4 hover:border-coral-300">
                <div>
                  <p className="font-medium text-sm">{c.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">{format(new Date(c.start_time), "EEE, MMM d · h:mm a")} with {c.instructor?.full_name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-xl font-medium mb-4">Following</h2>
        {following?.length === 0 && <p className="text-sm text-muted-foreground">You're not following anyone yet — <Link href="/instructors" className="text-coral-600">meet instructors</Link>.</p>}
        <div className="grid sm:grid-cols-2 gap-3">
          {following?.map((f) => (
            <Link key={f.id} href={`/instructors/${f.id}`} className="rounded-xl border border-border p-4 hover:border-coral-300 text-sm font-medium">
              {f.full_name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
