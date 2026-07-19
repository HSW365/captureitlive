import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, tone = "coral", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: "coral" | "amber" | "teal" | "violet" }) {
  const tones = {
    coral: "bg-coral-100 text-coral-700",
    amber: "bg-amber-100 text-amber-700",
    teal: "bg-teal-100 text-teal-700",
    violet: "bg-violet-100 text-violet-700",
  };
  return <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", tones[tone], className)} {...props} />;
}
