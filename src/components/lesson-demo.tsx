import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Play, Upload, Link2, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import type { Lesson } from "@/lib/academy/curriculum";

interface Demo { lesson_id: string; kind: "youtube" | "file"; ref: string; title: string | null }

const SPORT_WORD: Record<string, string> = { kungfu: "kung fu", track: "sprinting", stretching: "stretching", meditation: "meditation" };
const ytId = (s: string) => s.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)?.[1] ?? (/^[\w-]{11}$/.test(s.trim()) ? s.trim() : null);
const fileUrl = (path: string) => supabase.storage.from("academy-demos").getPublicUrl(path).data.publicUrl;

/** Step 1: watch the move. Plays the lesson's demo video; the owner can set or replace it with a YouTube link or an uploaded HSW365 clip. */
export function LessonDemo({ lesson, accent }: { lesson: Lesson; accent: string }) {
  const { isOwner } = useAuth();
  const qc = useQueryClient();
  const [edit, setEdit] = useState(false);
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const { data: demo, isLoading } = useQuery({
    queryKey: ["demo", lesson.id],
    queryFn: async () => (await supabase.from("academy_videos").select("*").eq("lesson_id", lesson.id).maybeSingle()).data as Demo | null,
  });

  const search = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${SPORT_WORD[lesson.sport] ?? lesson.sport} ${lesson.title} drill tutorial`)}`;

  async function saveLink() {
    setErr(null);
    const id = ytId(link);
    if (!id) return setErr("Paste a YouTube link.");
    setBusy(true);
    const { error } = await supabase.from("academy_videos").upsert({ lesson_id: lesson.id, kind: "youtube", ref: id, title: lesson.title, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) return setErr(error.message);
    setLink(""); setEdit(false); qc.invalidateQueries({ queryKey: ["demo", lesson.id] });
  }
  async function upload(f?: File) {
    if (!f) return;
    setErr(null); setBusy(true); setPct("Uploading");
    const path = `${lesson.id}/${Date.now()}.${(f.name.split(".").pop() || "mp4").toLowerCase()}`;
    const { error } = await supabase.storage.from("academy-demos").upload(path, f, { contentType: f.type || "video/mp4", upsert: true });
    if (error) { setBusy(false); setPct(null); return setErr(error.message); }
    const { error: e2 } = await supabase.from("academy_videos").upsert({ lesson_id: lesson.id, kind: "file", ref: path, title: lesson.title, updated_at: new Date().toISOString() });
    setBusy(false); setPct(null);
    if (e2) return setErr(e2.message);
    setEdit(false); qc.invalidateQueries({ queryKey: ["demo", lesson.id] });
  }
  async function remove() {
    if (!demo) return;
    if (demo.kind === "file") await supabase.storage.from("academy-demos").remove([demo.ref]);
    await supabase.from("academy_videos").delete().eq("lesson_id", lesson.id);
    qc.invalidateQueries({ queryKey: ["demo", lesson.id] });
  }

  return (
    <div className="panel p-6 mt-10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-8 h-8 rounded-full text-sm font-black" style={{ background: accent, color: "#0A0A0F" }}>1</span>
          <div className="ath text-2xl">Watch the move</div>
        </div>
        {isOwner && <button className="text-xs font-bold volt" onClick={() => setEdit(!edit)}>{demo ? "Replace demo" : "Set demo"}</button>}
      </div>

      <div className="mt-5 rounded-2xl overflow-hidden bg-black aspect-video relative">
        {isLoading ? null : demo?.kind === "youtube" ? (
          <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube-nocookie.com/embed/${demo.ref}?rel=0&modestbranding=1&playsinline=1`}
            title={demo.title ?? lesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : demo?.kind === "file" ? (
          <video src={fileUrl(demo.ref)} controls playsInline preload="metadata" className="absolute inset-0 w-full h-full object-contain" />
        ) : (
          <a href={search} target="_blank" rel="noreferrer" className="absolute inset-0 grid place-items-center text-center px-6 group"
            style={{ background: `radial-gradient(420px 220px at 50% 40%, ${accent}33, transparent 70%)` }}>
            <span>
              <span className="mx-auto grid place-items-center w-16 h-16 rounded-full transition-transform group-hover:scale-110" style={{ background: accent, color: "#0A0A0F" }}><Play size={28} fill="currentColor" /></span>
              <span className="block ath text-2xl mt-4">Watch {lesson.title} demos</span>
              <span className="block muted text-sm mt-1">Opens coach videos of this exact move</span>
            </span>
          </a>
        )}
      </div>
      {demo?.kind === "youtube" && (
        <a href={`https://www.youtube.com/watch?v=${demo.ref}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs muted mt-3 hover:text-white"><ExternalLink size={12} /> Open on YouTube</a>
      )}
      <p className="muted text-sm mt-3">Watch it all the way through, then match the drills below on camera.</p>

      {isOwner && edit && (
        <div className="mt-5 rounded-2xl border p-4 space-y-3" style={{ borderColor: "#25252F" }}>
          <div className="flex gap-2">
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Paste a YouTube link" />
            <button className="btn btn-volt !px-5 shrink-0" disabled={busy} onClick={saveLink}><Link2 size={16} /> Use</button>
          </div>
          <label className="btn btn-ghost w-full"><Upload size={16} /> {pct ?? "Upload your own demo video"}<input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" disabled={busy} onChange={(e) => upload(e.target.files?.[0])} /></label>
          {demo && <button className="text-xs muted inline-flex items-center gap-1.5 hover:text-white" onClick={remove}><Trash2 size={12} /> Remove current demo</button>}
          {err && <p className="text-sm text-red-400">{err}</p>}
        </div>
      )}
    </div>
  );
}
