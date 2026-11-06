import { Link } from "wouter";
import { ArrowRight, Video, ScanLine, GraduationCap, Flame } from "lucide-react";
import { SPORTS, TIERS } from "@/lib/academy/sports";
import { LESSONS } from "@/lib/academy/curriculum";
import { useAcademy, sportProgress, stats } from "@/lib/academy/store";

export default function Academy() {
  const { athlete, subs } = useAcademy();
  const st = stats(subs);
  return (
    <div className="arena">
      <div className="glow" /><div className="lines" />
      <section className="relative max-w-6xl mx-auto px-5 md:px-6 pt-14 md:pt-24">
        <div className="text-[13px] font-extrabold tracking-[0.2em] uppercase volt">CaptureItLive Academy</div>
        <h1 className="ath mt-4 text-[17vw] sm:text-8xl md:text-[140px] max-w-5xl">
          Film it.<br />Get graded.<br /><span style={{ WebkitTextStroke: "2px #F4F4F6", color: "transparent" }}>Level up.</span>
        </h1>
        <div className="mt-10 grid md:grid-cols-[1fr_auto] gap-8 items-end">
          <p className="text-lg md:text-xl muted leading-relaxed max-w-xl">
            Daily video lessons in nine disciplines for middle schoolers, high schoolers and amateurs. Film each rep, grade it against the rubric, and earn your way from Basic to Varsity to Pro.
          </p>
          <div className="flex flex-wrap gap-3">
            {athlete ? (
              <Link href="/train" className="btn btn-volt">Open my training <ArrowRight size={18} /></Link>
            ) : (
              <Link href="/start" className="btn btn-volt">Build my plan <ArrowRight size={18} /></Link>
            )}
            <a href="#sports" className="btn btn-ghost">Browse sports</a>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-3 max-w-xl">
          {[["9", "Disciplines"], ["3", "Tiers"], [String(LESSONS.length), "Graded lessons"]].map(([n, l]) => (
            <div key={l} className="panel px-4 py-4"><div className="ath text-4xl volt">{n}</div><div className="text-xs muted mt-2 font-semibold">{l}</div></div>
          ))}
        </div>
        {athlete && (
          <div className="mt-6 panel px-5 py-4 flex flex-wrap items-center gap-5 max-w-xl">
            <Flame className="volt" size={20} /><span className="font-bold">{st.streak} day streak</span>
            <span className="muted">GPA {st.gpa.toFixed(2)}</span><span className="muted">{st.total} submissions</span>
          </div>
        )}
      </section>

      <section id="sports" className="relative max-w-6xl mx-auto px-5 md:px-6 mt-20">
        <h2 className="ath text-5xl md:text-7xl">Pick your sport</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPORTS.map((s) => {
            const p = sportProgress(subs, s.id);
            return (
              <Link key={s.id} href={`/academy/${s.id}`} className="panel p-6 block hover:-translate-y-1 transition-transform" style={{ borderColor: "#25252F" }}>
                <div className="h-1.5 w-14 rounded-full" style={{ background: s.accent }} />
                <div className="ath text-4xl mt-5">{s.name}</div>
                <p className="muted mt-3 text-[15px]">{s.tagline}</p>
                <div className="bar mt-5"><i style={{ width: `${(p.done / p.total) * 100}%`, background: s.accent }} /></div>
                <div className="text-xs muted mt-2 font-semibold">{p.done} of {p.total} lessons passed</div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-5 md:px-6 mt-20 pb-24">
        <h2 className="ath text-5xl md:text-7xl">How it works</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            [GraduationCap, "Learn the rep", "Every lesson has drills, common mistakes and a clear rubric."],
            [Video, "Film your rep", "Record in the app or upload a clip. It stays on your device."],
            [ScanLine, "Get graded", "Score yourself against the rubric. Your grade, streak and GPA update instantly."],
          ].map(([Icon, t, d], i) => { const I = Icon as typeof Video; return (
            <div key={i} className="panel p-6"><I className="volt" size={26} /><div className="ath text-3xl mt-5">{t as string}</div><p className="muted mt-3">{d as string}</p></div>
          ); })}
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {TIERS.map((t) => (
            <div key={t.id} className="panel p-6"><div className="ath text-3xl volt">{t.name}</div><p className="muted mt-3">{t.blurb}</p></div>
          ))}
        </div>
      </section>
    </div>
  );
}
