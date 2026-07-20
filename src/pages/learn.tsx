import { useState } from "react";
import { Wind, Sparkles, Salad, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = "breathing" | "stretching" | "diet" | "meditation";

const categories: { id: Category; label: string; icon: typeof Wind; tint: string }[] = [
  { id: "breathing", label: "Breathing", icon: Wind, tint: "text-teal-600 bg-teal-50" },
  { id: "stretching", label: "Stretching", icon: Sparkles, tint: "text-coral-600 bg-coral-50" },
  { id: "diet", label: "Diet", icon: Salad, tint: "text-amber-600 bg-amber-50" },
  { id: "meditation", label: "Meditation", icon: Brain, tint: "text-violet-600 bg-violet-50" },
];

interface Technique {
  title: string;
  level: string;
  duration: string;
  body: string;
  steps: string[];
}

const content: Record<Category, Technique[]> = {
  breathing: [
    {
      title: "Box breathing",
      level: "All levels",
      duration: "3–5 min",
      body: "A steadying rhythm used to calm the nervous system before practice, a class, or a stressful moment.",
      steps: [
        "Inhale slowly through the nose for a count of 4.",
        "Hold the breath gently for a count of 4.",
        "Exhale through the nose for a count of 4.",
        "Hold empty for a count of 4, then repeat for 4–8 rounds.",
      ],
    },
    {
      title: "Diaphragmatic (belly) breathing",
      level: "Beginner",
      duration: "5 min",
      body: "Rebuilds the habit of breathing from the diaphragm instead of the chest, the foundation under every other technique here.",
      steps: [
        "Lie down or sit tall, one hand on the belly, one on the chest.",
        "Inhale through the nose, letting the belly rise while the chest stays quiet.",
        "Exhale slowly through pursed lips, feeling the belly fall.",
        "Continue for 8–10 breaths, keeping the pace unhurried.",
      ],
    },
    {
      title: "Ujjayi (ocean) breath",
      level: "Intermediate",
      duration: "Throughout practice",
      body: "A soft throat constriction that creates an audible, wave-like sound — commonly used to anchor attention during a vinyasa flow.",
      steps: [
        "Inhale through the nose while slightly constricting the back of the throat.",
        "Exhale through the nose with the same gentle constriction, like fogging a mirror with the mouth closed.",
        "Aim for an even, audible sound on both the inhale and exhale.",
        "Match one breath to one movement as you flow.",
      ],
    },
    {
      title: "4-7-8 calming breath",
      level: "All levels",
      duration: "2–3 min",
      body: "A longer exhale ratio that shifts the body toward rest — useful before sleep or after an intense session.",
      steps: [
        "Exhale completely through the mouth.",
        "Inhale quietly through the nose for a count of 4.",
        "Hold the breath for a count of 7.",
        "Exhale fully through the mouth for a count of 8. Repeat 4 rounds.",
      ],
    },
  ],
  stretching: [
    {
      title: "Cat–Cow flow",
      level: "Beginner",
      duration: "1–2 min",
      body: "Warms up the entire spine and syncs movement with breath — a staple opener for almost every practice.",
      steps: [
        "Start on hands and knees, wrists under shoulders, knees under hips.",
        "Inhale, drop the belly, lift the chest and tailbone (Cow).",
        "Exhale, round the spine, tuck the chin and tailbone (Cat).",
        "Continue flowing with the breath for 8–10 rounds.",
      ],
    },
    {
      title: "Standing forward fold",
      level: "All levels",
      duration: "1–3 min",
      body: "Releases tension through the hamstrings, calves, and lower back while calming the mind.",
      steps: [
        "Stand with feet hip-width apart, soft bend in the knees.",
        "Hinge from the hips and fold forward, letting the head and arms hang.",
        "Hold opposite elbows, or let arms hang loose, and sway gently side to side.",
        "Bend the knees generously if the hamstrings feel tight. Hold for 5–10 breaths.",
      ],
    },
    {
      title: "Hip-opener sequence (Pigeon variation)",
      level: "Intermediate",
      duration: "3–5 min per side",
      body: "Targets the hips and glutes, where many people carry stress and tightness from sitting.",
      steps: [
        "From all fours, bring the right knee toward the right wrist, shin angled forward.",
        "Extend the left leg straight back, hips squared to the front of the mat.",
        "Fold forward over the front leg, or stay upright with tall posture.",
        "Breathe for 8–10 rounds, then switch sides.",
      ],
    },
    {
      title: "Shoulder & neck release",
      level: "All levels",
      duration: "2–3 min",
      body: "A quick reset for screen-time tension — works well as a desk break, not just on the mat.",
      steps: [
        "Roll the shoulders back and down 5 times, then reverse direction.",
        "Drop the right ear toward the right shoulder, holding 20–30 seconds.",
        "Repeat on the left side.",
        "Interlace the hands behind the back and gently lift to open the chest.",
      ],
    },
  ],
  diet: [
    {
      title: "Eating around your practice",
      level: "General guidance",
      duration: "—",
      body: "How you fuel before and after moving changes how your body responds to practice.",
      steps: [
        "Eat a light, easily-digested snack 60–90 minutes before an active class (fruit, oats, a small smoothie).",
        "Avoid large or heavy meals within 2–3 hours of practicing.",
        "Rehydrate with water or an electrolyte drink after sweating, especially after hot or vigorous sessions.",
        "Within an hour after practice, include some protein and complex carbohydrates to support recovery.",
      ],
    },
    {
      title: "Anti-inflammatory staples",
      level: "General guidance",
      duration: "—",
      body: "Foods commonly associated with reduced inflammation and steadier energy — useful building blocks, not a strict plan.",
      steps: [
        "Leafy greens, berries, and colorful vegetables for antioxidants.",
        "Fatty fish, walnuts, or flaxseed for omega-3s.",
        "Whole grains over refined grains for steadier blood sugar.",
        "Turmeric, ginger, and green tea as easy daily additions.",
      ],
    },
    {
      title: "Hydration rhythm",
      level: "General guidance",
      duration: "—",
      body: "Consistent hydration supports flexibility, focus, and energy — three things every practice depends on.",
      steps: [
        "Start the day with a full glass of water before coffee or tea.",
        "Sip steadily through the day rather than large amounts at once.",
        "Add a pinch of salt or an electrolyte mix on hot-practice or high-sweat days.",
        "Notice thirst and fatigue as early hydration signals, not just dry mouth.",
      ],
    },
    {
      title: "Mindful eating basics",
      level: "General guidance",
      duration: "—",
      body: "Bringing the same presence from the mat to the table — a simple practice with outsized effects on digestion and satisfaction.",
      steps: [
        "Take three slow breaths before starting a meal.",
        "Put utensils down between bites.",
        "Notice color, texture, and aroma instead of eating on autopilot.",
        "Stop at comfortably satisfied, not stuffed.",
      ],
    },
  ],
  meditation: [
    {
      title: "Body scan",
      level: "Beginner",
      duration: "8–10 min",
      body: "A grounding practice that builds present-moment awareness by moving attention slowly through the body.",
      steps: [
        "Lie down or sit comfortably and close the eyes.",
        "Bring attention to the feet, noticing any sensation without judgment.",
        "Slowly move attention upward — legs, torso, arms, shoulders, head.",
        "If the mind wanders, gently return to the last place you noticed.",
      ],
    },
    {
      title: "Loving-kindness (Metta)",
      level: "All levels",
      duration: "10 min",
      body: "Cultivates warmth toward yourself and others — a good complement to a community-focused practice.",
      steps: [
        "Sit comfortably and bring to mind a feeling of ease.",
        "Silently repeat: 'May I be happy. May I be healthy. May I be at ease.'",
        "Bring to mind someone you care about and repeat the phrases for them.",
        "Expand outward to neutral people, then to all beings.",
      ],
    },
    {
      title: "Breath-anchored mindfulness",
      level: "Beginner",
      duration: "5–15 min",
      body: "The simplest entry point into meditation — using the breath as a steady point of return.",
      steps: [
        "Sit tall, hands resting on the knees or lap.",
        "Bring attention to the natural rhythm of the breath, without changing it.",
        "When thoughts arise, notice them without following, and return to the breath.",
        "Start with 5 minutes and extend gradually as it feels natural.",
      ],
    },
    {
      title: "Walking meditation",
      level: "All levels",
      duration: "10–20 min",
      body: "Moves meditation off the cushion — useful for restless minds or as a bridge between practice and daily life.",
      steps: [
        "Choose a quiet path, indoors or outdoors, roughly 10–20 steps long.",
        "Walk slowly, feeling the sensation of each foot lifting, moving, and landing.",
        "Pause at the end of the path, breathe, then turn and continue.",
        "Keep attention on the physical sensation of walking rather than the destination.",
      ],
    },
  ],
};

export default function Learn() {
  const [active, setActive] = useState<Category>("breathing");
  const activeCategory = categories.find((c) => c.id === active)!;

  return (
    <div className="mesh-glow max-w-5xl mx-auto px-6 py-16 md:py-20">
      <span className="inline-block text-xs font-mono tracking-widest uppercase text-coral-600 bg-coral-50 px-3 py-1 rounded-full mb-6 shadow-soft">
        Learn
      </span>
      <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground mb-4">
        Practice, off the mat too.
      </h1>
      <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
        A living library of breathing techniques, stretches, everyday nutrition guidance, and meditation
        practices — written to complement classes on CaptureItLive, not replace individual instruction.
      </p>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map(({ id, label, icon: Icon, tint }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium border transition-all",
              active === id
                ? "border-transparent shadow-soft " + tint
                : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {content[active].map((t) => (
          <div
            key={t.title}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft card-interactive"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-xl font-medium">{t.title}</h3>
              <activeCategory.icon className={cn("w-5 h-5 shrink-0", activeCategory.tint.split(" ")[0])} />
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground mb-3">
              <span>{t.level}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{t.duration}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.body}</p>
            <ol className="space-y-2">
              {t.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground/90">
                  <span className="font-mono text-xs text-muted-foreground shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-border bg-muted/60 p-6 text-sm text-muted-foreground max-w-3xl">
        <strong className="text-foreground">A note on safety:</strong> These are general educational
        techniques, not medical advice. Stop anything that causes pain, check with a doctor before starting
        a new practice if you have an injury or health condition, and use certified instructors on
        CaptureItLive for hands-on guidance.
      </div>
    </div>
  );
}
