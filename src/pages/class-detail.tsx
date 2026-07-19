import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, YogaClass } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Link } from "wouter";

export default function ClassDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const qc = useQueryClient();

  const { data: cls } = useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("yogo_classes").select("*, instructor:yogo_profiles(*)").eq("id", id).single();
      if (error) throw error;
      return data as YogaClass;
    },
  });

  const { data: rsvpCount } = useQuery({
    queryKey: ["rsvp-count", id],
    queryFn: async () => {
      const { count } = await supabase.from("yogo_class_rsvps").select("*", { count: "exact", head: true }).eq("class_id", id);
      return count ?? 0;
    },
  });

  const { data: myRsvp } = useQuery({
    queryKey: ["my-rsvp", id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase.from("yogo_class_rsvps").select("class_id").eq("class_id", id).eq("student_id", user.id).maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  const toggleRsvp = useMutation({
    mutationFn: async () => {
      if (!user || !id) return;
      if (myRsvp) {
        await supabase.from("yogo_class_rsvps").delete().eq("class_id", id).eq("student_id", user.id);
      } else {
        await supabase.from("yogo_class_rsvps").insert({ class_id: id, student_id: user.id });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-rsvp", id, user?.id] });
      qc.invalidateQueries({ queryKey: ["rsvp-count", id] });
    },
  });

  if (!cls) return <div className="max-w-2xl mx-auto px-6 py-20 text-muted-foreground">Loading class…</div>;

  const full = (rsvpCount ?? 0) >= cls.capacity;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2 mb-4">
        <Badge tone="teal">{cls.session_type === "virtual" ? "Virtual" : "In person"}</Badge>
        <Badge tone="amber">{cls.level}</Badge>
        {cls.style && <Badge tone="coral">{cls.style}</Badge>}
      </div>
      <h1 className="font-display text-3xl font-medium">{cls.title}</h1>
      <p className="text-muted-foreground mt-2 font-mono text-sm">
        {format(new Date(cls.start_time), "EEEE, MMMM d · h:mm a")} · {cls.duration_minutes} min
      </p>

      <Link href={`/instructors/${cls.instructor_id}`} className="flex items-center gap-3 mt-6 group">
        <Avatar name={cls.instructor?.full_name ?? "?"} src={cls.instructor?.avatar_url} className="w-11 h-11 text-sm" />
        <div>
          <p className="text-sm font-medium group-hover:text-coral-600">{cls.instructor?.full_name}</p>
          <p className="text-xs text-muted-foreground">{cls.instructor?.headline}</p>
        </div>
      </Link>

      <p className="mt-6 text-sm leading-relaxed whitespace-pre-wrap">{cls.description}</p>

      {cls.session_type === "in-person" && cls.location && (
        <p className="mt-4 text-sm"><span className="text-muted-foreground">Location: </span>{cls.location}</p>
      )}
      {cls.session_type === "virtual" && cls.meeting_link && myRsvp && (
        <p className="mt-4 text-sm"><span className="text-muted-foreground">Meeting link: </span><a href={cls.meeting_link} className="text-coral-600 underline">{cls.meeting_link}</a></p>
      )}

      <div className="mt-8 flex items-center gap-4">
        {profile ? (
          <Button onClick={() => toggleRsvp.mutate()} disabled={!myRsvp && full} variant={myRsvp ? "outline" : "primary"}>
            {myRsvp ? "Cancel RSVP" : full ? "Class full" : "RSVP"}
          </Button>
        ) : (
          <Link href="/login"><Button>Log in to RSVP</Button></Link>
        )}
        <span className="text-sm text-muted-foreground font-mono">{rsvpCount ?? 0} / {cls.capacity} spots filled</span>
      </div>
    </div>
  );
}
