import { useEffect, useRef, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Camera, Upload, Square, RotateCcw, Check } from "lucide-react";
import { lessonById, lessonsFor } from "@/lib/academy/curriculum";
import { sportById, tierById } from "@/lib/academy/sports";
import { addSubmission, computeScore, letter, saveVideo, useAcademy, bestFor } from "@/lib/academy/store";
import NotFound from "@/pages/not-found";
import { LessonDemo } from "@/components/lesson-demo";

export default function LessonPage() {
  const [, p] = useRoute("/lesson/:id");
  const lesson = lessonById(p?.id ?? "");
  const { subs } = useAcademy();
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [rec, setRec] = useState(false);
  const [err, setErr] = useState("");
  const [ratings, setRatings] = useState<number[]>([]);
  const [effort, setEffort] = useState(0);
  const [note, setNote] = useState("");
  const [result, setResult] = useState<{ score: number; grade: string } | null>(null);
  const live = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const t0 = useRef(0);
  const [secs, setSecs] = useState(0);

  useEffect(() => { setBlob(null); setUrl(null); setResult(null); setRatings(lesson ? lesson.rubric.map(() => 0) : []); setEffort(0); setNote(""); setErr(""); }, [lesson?.id]);
  useEffect(() => () => { stream.current?.getTracks().forEach((t) => t.stop()); }, []);
  useEffect(() => { if (!rec) return; const i = setInterval(() => setSecs(Math.round((Date.now() - t0.current) / 1000)), 250); return () => clearInterval(i); }, [rec]);

  if (!lesson) return <NotFound />;
  const sport = sportById(lesson.sport)!;
  const tier = tierById(lesson.tier)!;
  const best = bestFor(subs, lesson.id);
  const siblings = lessonsFor(lesson.sport, lesson.tier);
  const next = siblings[lesson.n] ?? null;

  async function start() {
    setErr("");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      stream.current = s;
      if (live.current) { live.current.srcObject = s; await live.current.play(); }
      const mr = new MediaRecorder(s);
      chunks.current = []; mr.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      mr.onstop = () => {
        const b = new Blob(chunks.current, { type: mr.mimeType || "video/webm" });
        setBlob(b); setUrl(URL.createObjectURL(b));
        s.getTracks().forEach((t) => t.stop());
      };
      recorder.current = mr; t0.current = Date.now(); setSecs(0); mr.start(); setRec(true);
    } catch { setErr("Camera access was blocked. Allow the camera, or upload a clip instead."); }
  }
  function stop() { recorder.current?.stop(); setRec(false); }
  function onFile(f?: File | null) { if (!f) return; setBlob(f); setUrl(URL.createObjectURL(f)); setSecs(0); }
  function reset() { setBlob(null); setUrl(null); setResult(null); setRatings(lesson!.rubric.map(() => 0)); setEffort(0); }

  const ready = !!blob && ratings.every((r) => r > 0) && effort > 0;
  async function submit() {
    if (!blob || !ready) return;
    const score = computeScore(ratings, effort);
    const id = `${lesson!.id}-${Date.now()}`;
    try { await saveVideo(id, blob); } catch { /* still record the grade */ }
    addSubmission({ id, lessonId: lesson!.id, at: Date.now(), ratings, effort, score, grade: letter(score), note, hasVideo: true, seconds: secs });
    setResult({ score, grade: letter(score) });
  }

  return (
    <div className="arena">
      <div className="glow" />
      <div className="relative max-w-3xl mx-auto px-5 md:px-6 pt-10 pb-24">
        <Link href={`/academy/${sport.id}`} className="inline-flex items-center gap-2 muted text-sm font-semibold"><ArrowLeft size={16} /> {sport.name}</Link>
        <div className="mt-6 text-xs font-extrabold tracking-[0.2em] uppercase" style={{ color: sport.accent }}>{sport.name} · {tier.name} · Lesson {lesson.n}</div>
        <h1 className="ath text-6xl md:text-8xl mt-3">{lesson.title}</h1>
        <p className="muted text-lg mt-4">{lesson.goal}</p>
        {best && <div className="mt-4 inline-block panel px-4 py-2 text-sm font-bold">Your best: <span className="volt">{best.grade}</span> ({best.score}%)</div>}

        <LessonDemo lesson={lesson} accent={sport.accent} />

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="panel p-6"><div className="ath text-2xl">Drills</div>
            <ol className="mt-4 space-y-3 list-decimal list-inside muted">{lesson.drills.map((d) => <li key={d} className="text-[#E6E6EA]">{d}</li>)}</ol></div>
          <div className="panel p-6"><div className="ath text-2xl">Avoid</div>
            <ul className="mt-4 space-y-3 list-disc list-inside">{lesson.mistakes.map((d) => <li key={d} className="text-[#E6E6EA]">{d}</li>)}</ul></div>
        </div>

        <div className="panel p-6 mt-4">
          <div className="flex items-center gap-3"><span className="grid place-items-center w-8 h-8 rounded-full text-sm font-black" style={{ background: sport.accent, color: "#0A0A0F" }}>2</span><div className="ath text-2xl">Record or upload your rep</div></div>
          <p className="muted mt-3">{lesson.film}</p>
          <div className="mt-5 rounded-2xl overflow-hidden bg-black aspect-video relative">
            {url ? <video src={url} controls playsInline className="w-full h-full object-contain" /> : <video ref={live} muted playsInline className="w-full h-full object-cover" />}
            {rec && <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-600 text-xs font-extrabold">REC {secs}s</div>}
            {!url && !rec && <div className="absolute inset-0 grid place-items-center muted text-sm">Camera preview appears here</div>}
          </div>
          {err && <p className="text-red-400 text-sm mt-3">{err}</p>}
          <div className="flex flex-wrap gap-3 mt-4">
            {!url && !rec && <button className="btn btn-volt" onClick={start}><Camera size={18} /> Record</button>}
            {rec && <button className="btn btn-volt" onClick={stop}><Square size={16} /> Stop</button>}
            {!url && !rec && (<label className="btn btn-ghost"><Upload size={18} /> Upload clip<input type="file" accept="video/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} /></label>)}
            {url && <button className="btn btn-ghost" onClick={reset}><RotateCcw size={16} /> Retake</button>}
          </div>
          <p className="muted text-xs mt-3">Your video is saved only on this device.</p>
        </div>

        {url && !result && (
          <div className="panel p-6 mt-4">
            <div className="flex items-center gap-3"><span className="grid place-items-center w-8 h-8 rounded-full text-sm font-black" style={{ background: sport.accent, color: "#0A0A0F" }}>3</span><div className="ath text-2xl">Grade your rep</div></div>
            <p className="muted mt-2 text-sm">Watch your clip and rate each point honestly. Be your own toughest coach.</p>
            <div className="mt-5 space-y-5">
              {lesson.rubric.map((r, i) => (
                <div key={r}><div className="font-bold">{r}</div>
                  <Scale value={ratings[i]} onChange={(v) => setRatings((a) => a.map((x, j) => (j === i ? v : x)))} /></div>
              ))}
              <div><div className="font-bold">Effort and focus</div><Scale value={effort} onChange={setEffort} /></div>
              <textarea rows={2} placeholder="Notes for yourself (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <button className="btn btn-volt mt-6 w-full disabled:opacity-40" disabled={!ready} onClick={submit}>Submit for my grade</button>
          </div>
        )}

        {result && (
          <div className="panel p-8 mt-4 text-center" style={{ borderColor: "#C6F135" }}>
            <div className="text-xs font-extrabold tracking-[0.2em] uppercase volt">Your grade</div>
            <div className="ath text-[120px] volt mt-2">{result.grade}</div>
            <div className="muted">{result.score}% · {result.score >= 70 ? "Lesson passed" : "Below 70. Review the drills and film another rep."}</div>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <button className="btn btn-ghost" onClick={reset}>Try again</button>
              {next && result.score >= 70 && <Link href={`/lesson/${next.id}`} className="btn btn-volt"><Check size={16} /> Next lesson</Link>}
              <Link href="/train" className="btn btn-ghost">My training</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Scale({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const labels = ["Needs work", "Getting there", "Solid", "Strong", "Elite"];
  return (
    <div className="mt-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} of 5`}
            className="flex-1 py-3 rounded-xl font-extrabold border transition-colors"
            style={{ borderColor: value === n ? "#C6F135" : "#25252F", background: value === n ? "rgba(198,241,53,.12)" : "#0F0F16", color: value === n ? "#C6F135" : "#E6E6EA" }}>{n}</button>
        ))}
      </div>
      <div className="text-xs muted mt-1 h-4">{value ? labels[value - 1] : ""}</div>
    </div>
  );
}
