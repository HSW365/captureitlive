import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { supabase, Profile } from "@/lib/supabase";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

async function fetchInstructors(): Promise<Profile[]> {
  const { data, error } = await supabase.from("yogo_profiles").select("*").eq("role", "instructor").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export default function Instructors() {
  const { data, isLoading } = useQuery({ queryKey: ["instructors"], queryFn: fetchInstructors });

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-medium mb-1">Instructors</h1>
      <p className="text-muted-foreground mb-10">Teachers building community on Yogo, worldwide.</p>

      {isLoading && <p className="text-muted-foreground text-sm">Loading instructors…</p>}
      {!isLoading && data?.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No instructors yet — be the first to join as one.</div>
      )}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {data?.map((p) => (
          <Link key={p.id} href={`/instructors/${p.id}`} className="rounded-2xl border border-border bg-card p-6 hover:border-coral-300 transition-colors">
            <Avatar name={p.full_name} src={p.avatar_url} className="w-14 h-14 text-base mb-4" />
            <h3 className="font-display text-lg font-medium">{p.full_name}</h3>
            {p.headline && <p className="text-sm text-muted-foreground mt-1">{p.headline}</p>}
            {p.location && <p className="text-xs text-muted-foreground mt-2">{p.location}</p>}
            {p.specialties && p.specialties.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {p.specialties.slice(0, 3).map((s) => <Badge key={s} tone="teal">{s}</Badge>)}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
