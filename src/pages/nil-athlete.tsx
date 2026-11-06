import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Upload, Trash2, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { SPORTS } from "@/lib/academy/sports";
import { signed, type NilAthlete, type NilClip, type NilOffer } from "@/lib/nil";

const blank = { display_name: "", sport: "basketball", level: "high", school: "", grad_year: "", city_state: "", bio: "", instagram: "", guardian_ok: false, listed: false };

export default function NilAthletePage() {
  const { user, loading } = useAuth();
  const [f, setF] = useState<any>(blank);
  const [g, setG] = useState({ guardian_name: "", guardian_email: "" });
  const [exists, setExists] = useState(false);
  const [clips, setClips] = useState<(NilClip & { url?: string })[]>([]);
  const [offers, setOffers] = useState<(NilOffer & { org?: string })[]>([]);
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false); const [title, setTitle] = useState("");
  const minor = f.level !== "amateur";

  async function load() {
    if (!user) return;
    const { data: a } = await supabase.from("nil_athletes").select("*").eq("user_id", user.id).maybeSingle();
    if (a) { setExists(true); setF({ ...blank, ...a, grad_year: a.grad_year ?? "", school: a.school ?? "", city_state: a.city_state ?? "", bio: a.bio ?? "", instagram: a.instagram ?? "" }); }
    const { data: gd } = await supabase.from("nil_guardians").select("*").eq("user_id", user.id).maybeSingle();
    if (gd) setG({ guardian_name: gd.guardian_name ?? "", guardian_email: gd.guardian_email ?? "" });
    const { data: c } = await supabase.from("nil_clips").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setClips(await Promise.all((c ?? []).map(async (x: NilClip) => ({ ...x, url: await signed(x.path) }))));
    const { data: o } = await supabase.from("nil_offers").select("*").eq("athlete_id", user.id).order("created_at", { ascending: false });
    setOffers(o ?? []);
  }
  useEffect(() => { load(); }, [user?.id]); // eslint-disable-line

  if (loading) return <div className="arena" />;
  if (!user) return (<div className="arena"><div className="relative max-w-md mx-auto px-6 pt-28 text-center"><h1 className="ath text-5xl">Sign in first</h1><p className="muted mt-4">Create a free account to build your NIL365 profile.</p>
    <div className="flex gap-3 justify-center mt-8"><Link href="/signup" className="btn btn-volt">Sign up</Link><Link href="/login" className="btn btn-ghost">Log in</Link></div></div></div>);

  async function save() {
    setMsg("");
    if (f.display_name.trim().length < 2) return setMsg("Add your name.");
    if (minor && f.listed && !(f.guardian_ok && g.guardian_name && g.guardian_email)) return setMsg("A parent or guardian name, email and consent are required to list an athlete under 18.");
    setBusy(true);
    const row = { user_id: user!.id, display_name: f.display_name.trim(), sport: f.sport, level: f.level, school: f.school || null, grad_year: f.grad_year ? Number(f.grad_year) : null, city_state: f.city_state || null, bio: f.bio || null, instagram: f.instagram || null, guardian_ok: !!f.guardian_ok, listed: !!f.listed };
    const { error } = await supabase.from("nil_athletes").upsert(row);
    if (!error && minor) await supabase.from("nil_guardians").upsert({ user_id: user!.id, ...g });
    setBusy(false); setMsg(error ? error.message : "Saved."); if (!error) { setExists(true); load(); }
  }
  async function upload(file?: File | null) {
    if (!file || !exists) return;
    if (file.size > 100 * 1024 * 1024) return setMsg("Clips must be under 100 MB.");
    setBusy(true); setMsg("");
    const path = `${user!.id}/${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, "_")}`;
    const up = await supabase.storage.from("nil-clips").upload(path, file, { contentType: file.type });
    if (up.error) { setBusy(false); return setMsg(up.error.message); }
    await supabase.from("nil_clips").insert({ user_id: user!.id, title: title || file.name, path });
    setTitle(""); setBusy(false); load();
  }
  async function del(c: NilClip) { await supabase.storage.from("nil-clips").remove([c.path]); await supabase.from("nil_clips").delete().eq("id", c.id); load(); }
  async function answer(o: NilOffer, status: "accepted" | "declined") { await supabase.from("nil_offers").update({ status }).eq("id", o.id); load(); }
  const set = (k: string, v: any) => setF((x: any) => ({ ...x, [k]: v }));

  return (
    <div className="arena"><div className="glow" />
      <div className="relative max-w-3xl mx-auto px-5 md:px-6 pt-12 pb-24">
        <h1 className="ath text-6xl md:text-8xl">My NIL profile</h1>
        <div className="panel p-6 mt-8 space-y-4">
          <input placeholder={minor ? "First name and last initial" : "Full name"} value={f.display_name} onChange={(e) => set("display_name", e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <select className="panel px-3 py-3 bg-[#0F0F16]" value={f.sport} onChange={(e) => set("sport", e.target.value)}>{SPORTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
            <select className="panel px-3 py-3 bg-[#0F0F16]" value={f.level} onChange={(e) => set("level", e.target.value)}><option value="middle">Middle school</option><option value="high">High school</option><option value="amateur">Amateur adult</option></select>
          </div>
          <div className="grid grid-cols-2 gap-3"><input placeholder="School or team" value={f.school} onChange={(e) => set("school", e.target.value)} /><input placeholder="Graduation year" inputMode="numeric" value={f.grad_year} onChange={(e) => set("grad_year", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3"><input placeholder="City, State" value={f.city_state} onChange={(e) => set("city_state", e.target.value)} /><input placeholder="Instagram handle" value={f.instagram} onChange={(e) => set("instagram", e.target.value)} /></div>
          <textarea rows={3} placeholder="Your story, stats and goals" value={f.bio} onChange={(e) => set("bio", e.target.value)} />
          {minor && (<div className="panel p-4 space-y-3"><div className="font-bold">Parent or guardian</div>
            <div className="grid grid-cols-2 gap-3"><input placeholder="Guardian name" value={g.guardian_name} onChange={(e) => setG({ ...g, guardian_name: e.target.value })} /><input placeholder="Guardian email" value={g.guardian_email} onChange={(e) => setG({ ...g, guardian_email: e.target.value })} /></div>
            <label className="flex gap-3 text-sm muted"><input type="checkbox" className="!w-auto mt-1" checked={f.guardian_ok} onChange={(e) => set("guardian_ok", e.target.checked)} />My parent or guardian has agreed to this profile and clips being shown to approved colleges and brands.</label></div>)}
          <label className="flex gap-3 items-center font-bold"><input type="checkbox" className="!w-auto" checked={f.listed} onChange={(e) => set("listed", e.target.checked)} />List me so approved colleges and brands can find me</label>
          <button className="btn btn-volt w-full disabled:opacity-40" disabled={busy} onClick={save}>Save profile</button>
          {msg && <p className="text-sm volt">{msg}</p>}
        </div>

        {exists && (<>
          <h2 className="ath text-4xl mt-12">My clips</h2>
          <div className="panel p-5 mt-4 flex flex-wrap gap-3 items-center">
            <input className="flex-1 min-w-[160px]" placeholder="Clip title (e.g. Game highlights)" value={title} onChange={(e) => setTitle(e.target.value)} />
            <label className="btn btn-volt"><Upload size={18} /> Upload video<input type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ""; }} /></label>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">{clips.map((c) => (
            <div key={c.id} className="panel p-3"><video src={c.url} controls playsInline className="w-full rounded-xl bg-black aspect-video" />
              <div className="flex justify-between items-center mt-3 px-1"><span className="font-bold text-sm">{c.title}</span><button onClick={() => del(c)} aria-label="Delete clip"><Trash2 size={16} className="muted" /></button></div></div>))}
            {!clips.length && <div className="muted text-sm">No clips yet. Max 100 MB, MP4, WebM or MOV.</div>}</div>

          <h2 className="ath text-4xl mt-12">Offers</h2>
          <div className="space-y-3 mt-4">{offers.map((o) => (
            <div key={o.id} className="panel p-5"><div className="text-xs font-extrabold uppercase tracking-widest volt">{o.kind === "brand_deal" ? "Brand deal" : "Recruiting"} · {o.status}</div>
              <p className="mt-2">{o.message}</p>{o.amount_text && <p className="muted text-sm mt-1">Offer: {o.amount_text}</p>}
              {o.status === "sent" && <div className="flex gap-2 mt-4"><button className="btn btn-volt !py-2" onClick={() => answer(o, "accepted")}><Check size={16} /> Accept</button><button className="btn btn-ghost !py-2" onClick={() => answer(o, "declined")}><X size={16} /> Decline</button></div>}
              {minor && o.status === "sent" && <p className="muted text-xs mt-3">Talk to your parent or guardian before accepting.</p>}</div>))}
            {!offers.length && <div className="muted text-sm">No offers yet. Keep posting clips.</div>}</div>
        </>)}
      </div>
    </div>
  );
}
