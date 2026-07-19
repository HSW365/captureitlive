import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { supabase, YogaClass, Profile, YOGA_STYLES } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

function NewClassDialog({ instructorId, onCreated }: { instructorId: string; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", style: YOGA_STYLES[0] as string, level: "all-levels",
    session_type: "virtual", location: "", meeting_link: "",
    start_time: "", duration_minutes: 60, capacity: 20,
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("yogo_classes").insert({
      ...form,
      instructor_id: instructorId,
      start_time: new Date(form.start_time).toISOString(),
    });
    setSaving(false);
    setOpen(false);
    onCreated();
  }

  if (!open) return <Button onClick={() => setOpen(true)}>Create a class</Button>;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setOpen(false)}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-card rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto space-y-4">
        <h2 className="font-display text-xl font-medium">New class</h2>
        <div><Label>Title</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Style</Label>
            <Select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })}>
              {YOGA_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          <div><Label>Level</Label>
            <Select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              {["all-levels", "beginner", "intermediate", "advanced"].map((l) => <option key={l} value={l}>{l}</option>)}
            </Select>
          </div>
        </div>
        <div><Label>Format</Label>
          <Select value={form.session_type} onChange={(e) => setForm({ ...form, session_type: e.target.value })}>
            <option value="virtual">Virtual</option>
            <option value="in-person">In person</option>
          </Select>
        </div>
        {form.session_type === "in-person" ? (
          <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
        ) : (
          <div><Label>Meeting link</Label><Input value={form.meeting_link} onChange={(e) => setForm({ ...form, meeting_link: e.target.value })} /></div>
        )}
        <div><Label>Starts at</Label><Input type="datetime-local" required value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Duration (min)</Label><Input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })} /></div>
          <div><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={saving}>{saving ? "Creating…" : "Create"}</Button>
        </div>
      </form>
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();
  const qc = useQueryClient();

  const { data: myClasses, refetch: refetchClasses } = useQuery({
    queryKey: ["my-classes", profile?.id],
    queryFn: async () => {
      const { data } = await supabase.from("yogo_classes").select("*").eq("instructor_id", profile!.id).order("start_time");
      return (data ?? []) as YogaClass[];
    },
    enabled: profile?.role === "instructor",
  });

  const { data: myRsvps } = useQuery({
    queryKey: ["my-rsvps", profile?.id],
    queryFn: async () => {
      const { data } = await supabase.from("yogo_class_rsvps").select("class_id, yogo_classes(*, instructor:yogo_profiles(*))").eq("student_id", profile!.id);
      return (data ?? []).map((r: any) => r.yogo_classes) as YogaClass[];
    },
    enabled: profile?.role === "student",
  });

  const { data: following } = useQuery({
    queryKey: ["my-following", profile?.id],
    queryFn: async () => {
      const { data } = await supabase.from("yogo_follows").select("following_id, yogo_profiles!yogo_follows_following_id_fkey(*)").eq("follower_id", profile!.id);
      return (data ?? []).map((f: any) => f.yogo_profiles) as Profile[];
    },
    enabled: !!profile,
  });

  if (!profile) return <div className="max-w-3xl mx-auto px-6 py-20 text-muted-foreground">Loading dashboard…</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-3xl font-medium">Hi, {profile.full_name.split(" ")[0]}</h1>
        <Link href="/profile/edit"><Button variant="outline" size="sm">Edit profile</Button></Link>
      </div>
      <p className="text-muted-foreground mb-10">
        <Badge tone="violet" className="mr-2">{profile.role}</Badge>
        {profile.energy_points} energy points
      </p>

      {profile.role === "instructor" && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-medium">Your classes</h2>
            <NewClassDialog instructorId={profile.id} onCreated={() => { refetchClasses(); qc.invalidateQueries({ queryKey: ["classes"] }); }} />
          </div>
          {myClasses?.length === 0 && <p className="text-sm text-muted-foreground">You haven't created any classes yet.</p>}
          <div className="space-y-3">
            {myClasses?.map((c) => (
              <Link key={c.id} href={`/classes/${c.id}`} className="flex items-center justify-between rounded-xl border border-border p-4 hover:border-coral-300">
                <div>
                  <p className="font-medium text-sm">{c.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">{format(new Date(c.start_time), "EEE, MMM d · h:mm a")}</p>
                </div>
                <Badge tone="amber">{c.level}</Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {profile.role === "student" && (
        <section className="mb-12">
          <h2 className="font-display text-xl font-medium mb-4">Your RSVPs</h2>
          {myRsvps?.length === 0 && <p className="text-sm text-muted-foreground">No upcoming classes yet — <Link href="/classes" className="text-coral-600">browse classes</Link>.</p>}
          <div className="space-y-3">
            {myRsvps?.map((c) => (
              <Link key={c.id} href={`/classes/${c.id}`} className="flex items-center justify-between rounded-xl border border-border p-4 hover:border-coral-300">
                <div>
                  <p className="font-medium text-sm">{c.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">{format(new Date(c.start_time), "EEE, MMM d · h:mm a")} with {c.instructor?.full_name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-xl font-medium mb-4">Following</h2>
        {following?.length === 0 && <p className="text-sm text-muted-foreground">You're not following anyone yet — <Link href="/instructors" className="text-coral-600">meet instructors</Link>.</p>}
        <div className="grid sm:grid-cols-2 gap-3">
          {following?.map((f) => (
            <Link key={f.id} href={`/instructors/${f.id}`} className="rounded-xl border border-border p-4 hover:border-coral-300 text-sm font-medium">
              {f.full_name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
