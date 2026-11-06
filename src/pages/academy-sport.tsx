import { Link, useRoute } from "wouter";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { sportById, TIERS } from "@/lib/academy/sports";
import { lessonsFor } from "@/lib/academy/curriculum";
import { useAcademy, bestFor } from "@/lib/academy/store";
import NotFound from "@/pages/not-found";

export default function AcademySport() {
  const [, p] = useRoute("/academy/:sport");
  const sport = sportById(p?.sport ?? "");
  const { subs } = useAcademy();
  if (!sport) return <NotFound />;
  return (
    <div className="arena">
      <div className="glow" />
      <div className="relative max-w-4xl mx-auto px-5 md:px-6 pt-12 pb-24">
        <Link href="/academy" className="inline-flex items-center gap-2 muted text-sm font-semibold"><ArrowLeft size={16} /> All sports</Link>
        <div className="h-1.5 w-16 rounded-full mt-8" style={{ background: sport.accent }} />
        <h1 className="ath text-7xl md:text-9xl mt-4">{sport.name}</h1>
        <p className="muted text-lg mt-4">{sport.tagline} You need: {sport.gear}.</p>
        {TIERS.map((t) => (
          <div key={t.id} className="mt-12">
            <div className="flex items-end justify-between"><h2 className="ath text-4xl">{t.name}</h2><span className="muted text-sm">{t.blurb}</span></div>
            <div className="mt-4 space-y-3">
              {lessonsFor(sport.id, t.id).map((l) => {
                const best = bestFor(subs, l.id);
                return (
                  <Link key={l.id} href={`/lesson/${l.id}`} className="panel p-5 flex items-center gap-4 hover:border-[#4a4a5a] transition-colors">
                    <div className="w-10 h-10 rounded-full grid place-items-center font-extrabold" style={{ background: best && best.score >= 70 ? sport.accent : "#1d1d27", color: best && best.score >= 70 ? "#0A0A0F" : "#9A9AA6" }}>
                      {best && best.score >= 70 ? <Check size={18} /> : l.n}
                    </div>
                    <div className="flex-1"><div className="font-extrabold text-lg">{l.title}</div><div className="muted text-sm">{l.goal}</div></div>
                    {best && <div className="font-extrabold volt">{best.grade}</div>}
                    <ChevronRight className="muted" size={18} />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
