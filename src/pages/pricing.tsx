import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";

type Cycle = "monthly" | "annual";

const tiers = [
  {
    id: "community",
    name: "Community",
    tagline: "Get on the mat with everyone else",
    monthly: 0,
    annual: 0,
    cta: "Join free",
    variant: "outline" as const,
    highlight: false,
    features: [
      "Create your profile",
      "Follow instructors",
      "Post & comment in the community feed",
      "Browse the full class directory",
      "RSVP to free community classes",
    ],
  },
  {
    id: "practitioner",
    name: "Practitioner",
    tagline: "For students building a real practice",
    monthly: 12.99,
    annual: 99,
    cta: "Start Practitioner",
    variant: "primary" as const,
    highlight: true,
    badge: "Most popular",
    features: [
      "Everything in Community",
      "Unlimited class RSVPs, including paid sessions",
      "Direct message your instructors",
      "Priority booking on limited-capacity classes",
      "Practice streak & progress tracking",
      "Ad-free experience",
    ],
  },
  {
    id: "instructor-pro",
    name: "Instructor Pro",
    tagline: "For teachers building their business on Yogo",
    monthly: 29.99,
    annual: 249,
    cta: "Start Instructor Pro",
    variant: "secondary" as const,
    highlight: false,
    features: [
      "Everything in Practitioner",
      "List unlimited classes, live or virtual",
      "Accept paid bookings directly through Yogo",
      "Verified instructor badge",
      "Community feed reach & profile boosting",
      "Booking & engagement analytics",
    ],
  },
];

const comparisons = [
  { name: "Down Dog", price: "$9.99/mo" },
  { name: "Alo Moves", price: "$12.99/mo" },
  { name: "Glo", price: "$30/mo" },
  { name: "Yogo Practitioner", price: "$12.99/mo", ours: true },
];

export default function Pricing() {
  const [cycle, setCycle] = useState<Cycle>("monthly");

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-block text-xs font-mono tracking-widest uppercase text-coral-600 bg-coral-50 px-3 py-1 rounded-full mb-6">
          Pricing
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground mb-4">
          Simple pricing, built for practice.
        </h1>
        <p className="text-muted-foreground text-lg">
          Join free. Upgrade when you want more from your practice — or your studio.
        </p>
      </div>

      <div className="flex justify-center mb-14">
        <div className="inline-flex items-center bg-muted rounded-full p-1">
          <button
            onClick={() => setCycle("monthly")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              cycle === "monthly" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setCycle("annual")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              cycle === "annual" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
            }`}
          >
            Annual
            <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">Save ~35%</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const price = cycle === "monthly" ? tier.monthly : tier.annual;
          const period = cycle === "monthly" ? "/mo" : "/yr";
          return (
            <Card
              key={tier.id}
              className={`p-8 flex flex-col ${
                tier.highlight ? "border-coral-300 ring-2 ring-coral-200 relative" : ""
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 text-xs font-medium bg-coral-500 text-white px-3 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" /> {tier.badge}
                </span>
              )}
              <h3 className="font-display text-2xl font-medium mb-1">{tier.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{tier.tagline}</p>
              <div className="mb-6">
                <span className="font-display text-4xl font-medium">
                  {price === 0 ? "Free" : `$${price}`}
                </span>
                {price !== 0 && <span className="text-muted-foreground text-sm">{period}</span>}
              </div>
              <Link href="/signup">
                <Button variant={tier.variant} size="lg" className="w-full mb-8">
                  {tier.cta}
                </Button>
              </Link>
              <ul className="space-y-3 mt-auto">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      <div className="mt-24 max-w-3xl mx-auto text-center">
        <h2 className="font-display text-2xl md:text-3xl font-medium mb-3">
          How Yogo stacks up
        </h2>
        <p className="text-muted-foreground mb-10">
          Practitioner pricing sits right in line with the yoga apps people already pay for —
          except you're supporting real instructors, not a video library.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {comparisons.map((c) => (
            <div
              key={c.name}
              className={`rounded-2xl border p-5 ${
                c.ours ? "border-coral-300 bg-coral-50" : "border-border bg-card"
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${c.ours ? "text-coral-700" : "text-foreground"}`}>
                {c.name}
              </div>
              <div className="font-display text-lg">{c.price}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24 text-center">
        <p className="text-sm text-muted-foreground">
          Instructors keep 100% of class revenue collected outside Yogo — Instructor Pro is a
          flat monthly tool fee, not a commission.
        </p>
      </div>
    </div>
  );
}
