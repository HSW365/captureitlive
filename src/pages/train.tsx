import { Link } from "wouter";
import { Flame, Trophy, Target, Play } from "lucide-react";
import { SPORTS, sportById, tierById, LEVELS } from "@/lib/academy/sports";
import { lessonsFor, lessonById } from "@/lib/academy/curriculum";
import { useAcademy, stats, sportProgress, bestFor } from "@/lib/academy/store";

export default function Train() {
  const { athlete, subs } = useAcademy();
  const st = stats(subs);
  if (!athlete) {
    return (
      <div className="arena"><div className="glow" />
        <div className="relative max-w-xl mx-auto px-6 pt-28 pb-32 text-center">
          <h1 className="ath text-6xl">Build your plan</h1>
          <p className="muted mt-5">Answer a few questions and we'll set up your training.</p>
          <Link href="/start" className="btn btn-volt mt-8">Start</Link>
        </div>
      </div>
    );
  }
  const sport = sportById(athlete.sport)!;
  const tier = tierById(athlete.tier)!;
  const level = LEVELS.find((l) => l.id === athlete.level)!;
  const list = lessonsFor(athlete.sport, athlete.tier);
  const nextLesson = list.find((l) => !(bestFor(subs, l.id)?.score >= 70)) ?? list[list.length - 1];
  const recent = subs.slice(0, 8);
  const trend = [...subs].slice(0, 12).reverse();

  return (
    <div className="arena"><div className="glow" />
      <div className="relative max-w-5xl mx-auto px-5 md:px-6 pt-12 pb-24">
        <div className="text-xs font-extrabold tracking-[0.2em] uppercase volt">{level.name} · {sport.name} · {tier.name}</div>
        <h1 className="ath text-6xl md:text-8xl mt-3">Welcome back, {athlete.name.split(" ")[0]}</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
          {[[Flame, "Streak", `${st.streak}d`], [Trophy, "GPA", st.gpa.toFixed(2)], [Target, "Avg score", `${st.avg}%`], [Play, "Submitted", String(st.total)]].map(([I, l, v], i) => {
            const Icon = I as typeof Flame; return (
              <div key={i} className="panel p-5"><Icon className="volt" size={20} /><div className="ath text-4xl mt-3">{v as string}</div><div className="muted text-xs font-semibold mt-1">{l as string}</div></div>
            ); })}
        </div>

        <div className="panel p-6 mt-4 flex flex-wrap items-center gap-5 justify-between" style={{ borderColor: sport.accent }}>
          <div><div className="text-xs font-extrabold tracking-[0.2em] uppercase muted">Today's lesson</div>
            <div className="ath text-4xl mt-2">{nextLesson.title}</div><div className="muted mt-1">{nextLesson.goal}</div></div>
          <Link href={`/lesson/${nextLesson.id}`} className="btn btn-volt">Start lesson</Link>
        </div>

        {trend.length > 1 && (
          <div className="panel p-6 mt-4">
            <div className="ath text-2xl">Score trend</div>
            <div className="flex items-end gap-2 h-32 mt-5">
              {trend.map((s) => (<div key={s.id} className="flex-1 rounded-t-lg" title={`${s.grade} ${s.score}%`} style={{ height: `${Math.max(6, s.score)}%`, background: s.score >= 70 ? "#C6F135" : "#FF5A3C" }} />))}
            </div>
          </div>
        )}

        <h2 className="ath text-4xl mt-12">Progress by sport</h2>
        <div className="grid sm:grid-cols-2 gap-3 mt-5">
          {SPORTS.map((s) => { const p = sportProgress(subs, s.id); return (
            <Link key={s.id} href={`/academy/${s.id}`} className="panel p-5 block">
              <div className="flex justify-between font-extrabold"><span>{s.name}</span><span className="muted text-sm">{p.done}/{p.total}</span></div>
              <div className="bar mt-3"><i style={{ width: `${(p.done / p.total) * 100}%`, background: s.accent }} /></div>
            </Link>); })}
        </div>

        <h2 className="ath text-4xl mt-12">Report card</h2>
        <div className="panel mt-5 divide-y divide-[#25252F]">
          {recent.length === 0 && <div className="p-6 muted">No submissions yet. Film your first rep.</div>}
          {recent.map((s) => { const l = lessonById(s.lessonId); return (
            <div key={s.id} className="p-4 flex items-center gap-4">
              <div className="ath text-3xl w-14 volt">{s.grade}</div>
              <div className="flex-1"><div className="font-bold">{l?.title}</div><div className="muted text-xs">{new Date(s.at).toLocaleDateString()} · {s.score}%</div></div>
              <Link href={`/lesson/${s.lessonId}`} className="muted text-sm font-bold">Retry</Link>
            </div>); })}
        </div>
      </div>
    </div>
  );
}
