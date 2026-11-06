import { useEffect, useState } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { SPORTS } from "@/lib/academy/sports";
import { signed, type NilAthlete, type NilClip, type NilOrg } from "@/lib/nil";

export default function NilScout() {
  const { user, loading, isOwner } = useAuth();
  const [org, setOrg] = useState<NilOrg | null | undefined>(undefined);
  const [form, setForm] = useState({ kind: "brand", org_name: "", website: "", contact_email: "" });
  const [list, setList] = useState<NilAthlete[]>([]);
  const [sport, setSport] = useState(""); const [level, setLevel] = useState("");
  const [open, setOpen] = useState<NilAthlete | null>(null);
  const [clips, setClips] = useState<(NilClip & { url?: string })[]>([]);
  const [o, setO] = useState({ kind: "brand_deal", message: "", amount_text: "" }); const [msg, setMsg] = useState("");

  useEffect(() => { if (user && isOwner) { setOrg({ user_id: user.id, kind: "brand", org_name: "HSW365 Media", website: null, contact_email: "hsw365media@gmail.com", approved: true }); return; } if (user) supabase.from("nil_orgs").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => setOrg(data as NilOrg | null)); }, [user?.id, isOwner]); // eslint-disable-line
  useEffect(() => { if (org?.approved) { let q = supabase.from("nil_athletes").select("*").eq("listed", true); if (sport) q = q.eq("sport", sport); if (level) q = q.eq("level", level); q.then(({ data }) => setList((data as NilAthlete[]) ?? [])); } }, [org?.approved, sport, level]);
  useEffect(() => { if (!open) return; setMsg(""); supabase.from("nil_clips").select("*").eq("user_id", open.user_id).order("created_at", { ascending: false }).then(async ({ data }) => setClips(await Promise.all(((data as NilClip[]) ?? []).map(async (c) => ({ ...c, url: await signed(c.path) }))))); }, [open?.user_id]); // eslint-disable-line

  if (loading || (user && org === undefined)) return <div className="arena" />;
  if (!user) return (<div className="arena"><div className="max-w-md mx-auto px-6 pt-28 text-center"><h1 className="ath text-5xl">Sign in first</h1><div className="flex gap-3 justify-center mt-8"><Link href="/signup" className="btn btn-volt">Sign up</Link><Link href="/login" className="btn btn-ghost">Log in</Link></div></div></div>);

  if (!org) return (
    <div className="arena"><div className="glow" /><div className="relative max-w-lg mx-auto px-5 pt-16 pb-24">
      <h1 className="ath text-6xl">Apply for access</h1><p className="muted mt-4">We review every college and brand before they can view athletes.</p>
      <div className="panel p-6 mt-8 space-y-3">
        <select className="panel px-3 py-3 bg-[#0F0F16] w-full" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}><option value="brand">Brand or business</option><option value="college">College or program</option></select>
        <input placeholder="Organization name" value={form.org_name} onChange={(e) => setForm({ ...form, org_name: e.target.value })} />
        <input placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        <input placeholder="Official contact email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
        <button className="btn btn-volt w-full" onClick={async () => { if (form.org_name.length < 2 || !form.contact_email.includes("@")) return setMsg("Add an organization name and email."); const { error } = await supabase.from("nil_orgs").insert({ user_id: user.id, ...form }); if (error) setMsg(error.message); else setOrg({ user_id: user.id, approved: false, ...form } as NilOrg); }}>Submit application</button>
        {msg && <p className="text-sm volt">{msg}</p>}</div></div></div>);

  if (!org.approved) return (<div className="arena"><div className="max-w-md mx-auto px-6 pt-28 text-center"><h1 className="ath text-5xl">Application received</h1><p className="muted mt-4">{org.org_name} is under review. You'll get access once approved.</p></div></div>);

  async function send() {
    if (!open) return; if (o.message.trim().length < 5) return setMsg("Write a short message.");
    const { error } = await supabase.from("nil_offers").insert({ org_id: user!.id, athlete_id: open.user_id, kind: o.kind, message: o.message, amount_text: o.amount_text || null });
    setMsg(error ? error.message : "Offer sent."); if (!error) setO({ ...o, message: "", amount_text: "" });
  }
  return (
    <div className="arena"><div className="glow" /><div className="relative max-w-5xl mx-auto px-5 md:px-6 pt-12 pb-24">
      <div className="text-xs font-extrabold tracking-[0.2em] uppercase volt">{org.org_name}</div>
      <h1 className="ath text-6xl md:text-8xl mt-2">Find athletes</h1>
      <div className="flex gap-3 mt-6 flex-wrap">
        <select className="panel px-3 py-3 bg-[#0F0F16]" value={sport} onChange={(e) => setSport(e.target.value)}><option value="">All sports</option>{SPORTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        <select className="panel px-3 py-3 bg-[#0F0F16]" value={level} onChange={(e) => setLevel(e.target.value)}><option value="">All levels</option><option value="middle">Middle school</option><option value="high">High school</option><option value="amateur">Amateur</option></select>
      </div>
      <div className="grid md:grid-cols-[1fr_1.3fr] gap-4 mt-6">
        <div className="space-y-3">{list.map((a) => (<button key={a.user_id} onClick={() => setOpen(a)} className={`opt ${open?.user_id === a.user_id ? "on" : ""}`}>{a.display_name}<div className="muted text-sm font-medium mt-1">{SPORTS.find((s) => s.id === a.sport)?.name} · {a.level === "middle" ? "Middle school" : a.level === "high" ? "High school" : "Amateur"}{a.grad_year ? ` · Class of ${a.grad_year}` : ""}</div></button>))}
          {!list.length && <div className="muted">No listed athletes match yet.</div>}</div>
        {open && (<div className="panel p-5 h-fit"><div className="ath text-3xl">{open.display_name}</div>
          <div className="muted text-sm mt-1">{[open.school, open.city_state].filter(Boolean).join(" · ")}</div>{open.bio && <p className="mt-3">{open.bio}</p>}
          {open.instagram && <p className="muted text-sm mt-2">Instagram: @{open.instagram.replace("@", "")}</p>}
          <div className="grid gap-3 mt-4">{clips.map((c) => (<div key={c.id}><video src={c.url} controls playsInline className="w-full rounded-xl bg-black aspect-video" /><div className="text-sm font-bold mt-1">{c.title}</div></div>))}{!clips.length && <div className="muted text-sm">No clips yet.</div>}</div>
          <div className="border-t border-[#25252F] mt-5 pt-5 space-y-3"><div className="font-bold">Send an offer</div>
            <select className="panel px-3 py-3 bg-[#0F0F16] w-full" value={o.kind} onChange={(e) => setO({ ...o, kind: e.target.value })}><option value="brand_deal">Brand deal</option><option value="recruiting">Recruiting interest</option></select>
            <textarea rows={3} placeholder="Your message" value={o.message} onChange={(e) => setO({ ...o, message: e.target.value })} />
            <input placeholder="Compensation or terms (optional)" value={o.amount_text} onChange={(e) => setO({ ...o, amount_text: e.target.value })} />
            <button className="btn btn-volt w-full" onClick={send}>Send offer</button>{msg && <p className="text-sm volt">{msg}</p>}</div></div>)}
      </div></div></div>
  );
}
