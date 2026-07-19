import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const features = [
  "Full community feed — post, comment, connect",
  "Follow every instructor on Yogo",
  "Unlimited class RSVPs, including paid sessions",
  "Direct message instructors",
  "List & sell your own classes if you teach",
  "Priority booking on limited-capacity classes",
  "Ad-free, always",
];

export default function Pricing() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
      <span className="inline-block text-xs font-mono tracking-widest uppercase text-coral-600 bg-coral-50 px-3 py-1 rounded-full mb-6">
        Pricing
      </span>
      <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground mb-4">
        One membership. Everything included.
      </h1>
      <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">
        Yogo runs on one simple subscription — students and instructors, same price,
        full access. No free tier, no locked features.
      </p>

      <Card className="p-10 max-w-md mx-auto text-left border-coral-300 ring-2 ring-coral-200">
        <h2 className="font-display text-2xl font-medium mb-1">Yogo Membership</h2>
        <p className="text-sm text-muted-foreground mb-6">For every student and instructor</p>
        <div className="mb-8">
          <span className="font-display text-5xl font-medium">$8</span>
          <span className="text-muted-foreground text-base">/mo</span>
        </div>
        <Link href="/signup">
          <Button size="lg" className="w-full mb-8">Subscribe & join Yogo</Button>
        </Link>
        <ul className="space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
              <span className="text-foreground/90">{f}</span>
            </li>
          ))}
        </ul>
      </Card>

      <p className="text-sm text-muted-foreground mt-10">
        Cancel anytime. Instructors keep 100% of class payments collected outside Yogo —
        the $8/mo covers your account, not a commission.
      </p>
    </div>
  );
}
