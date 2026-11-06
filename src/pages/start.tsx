import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { LEVELS, SPORTS, TIERS, type LevelId, type SportId, type TierId } from "@/lib/academy/sports";
import { saveAthlete } from "@/lib/academy/store";

const EXPERIENCE = ["Brand new", "Some experience", "Play regularly", "Competitive"];
const GOALS = ["Make a team", "Get faster and stronger", "Master fundamentals", "Compete and win", "Stay active and healthy", "Build confidence"];
const DAYS = [3, 4, 5, 6];

export default function Start() {
  const [, nav] = useLocation();
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<LevelId>();
  const [sport, setSport] = useState<SportId>();
  const [exp, setExp] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [days, setDays] = useState(4);
  const [name, setName] = useState("");
  const [building, setBuilding] = useState(false);
  const [pct, setPct] = useState(0);

  const total = 7;
  const tier: TierId = exp === "Brand new" ? "basic" : exp === "Some experience" ? "basic" : exp === "Play regularly" ? "varsity" : "pro";

  useEffect(() => {
    if (!building) return;
    const i = setInterval(() => setPct((p) => Math.min(100, p + 4)), 90);
    return () => clearInterval(i);
  }, [building]);
  useEffect(() => {
    if (pct >= 100 && level && sport) {
      saveAthlete({ name, level, sport, tier, experience: exp, goals, days, created: Date.now() });
      nav("/train");
    }
  }, [pct]); // eslint-disable-line

  const toggle = (g: string) => setGoals((a) => (a.includes(g) ? a.filter((x) => x !== g) : [...a, g]));
  const canNext = [!!level, !!sport, !!exp, goals.length > 0, true, name.trim().length > 1, true][step];

  if (building) {
    return (
      <div className="arena grid place-items-center px-6" style={{ minHeight: "100vh" }}>
        <div className="text-center max-w-sm w-full">
          <div className="ath text-6xl">Building your plan</div>
          <div className="bar mt-8"><i style={{ width: `${pct}%` }} /></div>
          <div className="muted mt-4 text-sm">{pct < 35 ? "Matching drills to your level" : pct < 70 ? "Setting your weekly schedule" : "Preparing your grading rubric"}</div>
        </div>
      </div>
    );
  }

  const Q = ({ t, s, children }: { t: string; s?: string; children: React.ReactNode }) => (
    <div><h1 className="ath text-5xl md:text-6xl">{t}</h1>{s && <p className="muted mt-3">{s}</p>}<div className="mt-8 space-y-3">{children}</div></div>
  );
  const Opt = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" className={`opt ${on ? "on" : ""}`} onClick={onClick}>{children}</button>
  );

  return (
    <div className="arena" style={{ minHeight: "100vh" }}>
      <div className="glow" />
      <div className="relative max-w-md mx-auto px-5 pt-6 pb-16">
        <div className="flex items-center gap-3">
          <button className="p-2 -ml-2 disabled:opacity-0" disabled={step === 0} onClick={() => setStep(step - 1)} aria-label="Back"><ArrowLeft size={20} /></button>
          <div className="bar flex-1"><i style={{ width: `${((step + 1) / total) * 100}%` }} /></div>
          <div className="text-xs muted font-bold">{step + 1}/{total}</div>
        </div>
        <div className="mt-10">
          {step === 0 && <Q t="Who's training?" s="We'll pick the right pace and drills.">{LEVELS.map((l) => <Opt key={l.id} on={level === l.id} onClick={() => setLevel(l.id)}>{l.name}<div className="muted text-sm font-medium mt-1">{l.blurb}</div></Opt>)}</Q>}
          {step === 1 && <Q t="Pick your sport">{SPORTS.map((s) => <Opt key={s.id} on={sport === s.id} onClick={() => setSport(s.id)}>{s.name}<div className="muted text-sm font-medium mt-1">{s.tagline}</div></Opt>)}</Q>}
          {step === 2 && <Q t="Your experience?" s="Be honest, you can move tiers any time.">{EXPERIENCE.map((e) => <Opt key={e} on={exp === e} onClick={() => setExp(e)}>{e}</Opt>)}</Q>}
          {step === 3 && <Q t="What are your goals?" s="Pick all that apply.">{GOALS.map((g) => <Opt key={g} on={goals.includes(g)} onClick={() => toggle(g)}>{g}</Opt>)}</Q>}
          {step === 4 && <Q t="Days per week?">{DAYS.map((d) => <Opt key={d} on={days === d} onClick={() => setDays(d)}>{d} days a week</Opt>)}</Q>}
          {step === 5 && <Q t="What should we call you?"><input autoFocus placeholder="First name" value={name} onChange={(e) => setName(e.target.value)} /></Q>}
          {step === 6 && (
            <Q t="Your plan is ready" s="Here's where you'll start.">
              <div className="panel p-6 space-y-3">
                <div className="flex justify-between"><span className="muted">Sport</span><b>{SPORTS.find((s) => s.id === sport)?.name}</b></div>
                <div className="flex justify-between"><span className="muted">Start tier</span><b>{TIERS.find((t) => t.id === tier)?.name}</b></div>
                <div className="flex justify-between"><span className="muted">Schedule</span><b>{days} days a week</b></div>
                <div className="flex justify-between"><span className="muted">Level</span><b>{LEVELS.find((l) => l.id === level)?.name}</b></div>
              </div>
            </Q>
          )}
        </div>
        <button className="btn btn-volt w-full mt-10 disabled:opacity-40" disabled={!canNext}
          onClick={() => (step === total - 1 ? setBuilding(true) : setStep(step + 1))}>
          {step === total - 1 ? "Start training" : "Continue"}
        </button>
      </div>
    </div>
  );
}
