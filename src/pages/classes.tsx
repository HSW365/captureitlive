import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { supabase, YogaClass } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

async function fetchClasses(): Promise<YogaClass[]> {
  const { data, error } = await supabase
    .from("yogo_classes")
    .select("*, instructor:yogo_profiles(*)")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });
  if (error) throw error;
  return (data ?? []) as YogaClass[];
}

export default function Classes() {
  const { data, isLoading } = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-medium mb-1">Classes</h1>
      <p className="text-muted-foreground mb-10">Upcoming sessions from instructors across the community.</p>

      {isLoading && <p className="text-muted-foreground text-sm">Loading classes…</p>}
      {!isLoading && data?.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No upcoming classes yet — check back soon.</div>
      )}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {data?.map((c) => (
          <Link key={c.id} href={`/classes/${c.id}`} className="rounded-2xl border border-border bg-card p-6 hover:border-coral-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <Badge tone="teal">{c.session_type === "virtual" ? "Virtual" : "In person"}</Badge>
              <Badge tone="amber">{c.level}</Badge>
            </div>
            <h3 className="font-display text-lg font-medium">{c.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">with {c.instructor?.full_name}</p>
            <p className="text-xs text-muted-foreground mt-3 font-mono">{format(new Date(c.start_time), "EEE, MMM d · h:mm a")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
