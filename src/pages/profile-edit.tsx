import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { supabase, YOGA_STYLES } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProfileEdit() {
  const { profile, refreshProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    headline: profile?.headline ?? "",
    bio: profile?.bio ?? "",
    location: profile?.location ?? "",
    website: profile?.website ?? "",
    instagram: profile?.instagram ?? "",
    specialties: (profile?.specialties ?? []).join(", "),
  });
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    await supabase.from("yogo_profiles").update({
      full_name: form.full_name,
      headline: form.headline,
      bio: form.bio,
      location: form.location,
      website: form.website,
      instagram: form.instagram,
      specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
      updated_at: new Date().toISOString(),
    }).eq("id", profile.id);
    await refreshProfile();
    setSaving(false);
    setLocation("/dashboard");
  }

  if (!profile) return null;

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-medium mb-8">Edit profile</h1>
      <form onSubmit={onSubmit} className="space-y-5">
        <div><Label>Full name</Label><Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
        <div><Label>Headline</Label><Input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} /></div>
        <div><Label>Bio</Label><Textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
        <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
        {profile.role === "instructor" && (
          <div>
            <Label>Specialties (comma-separated)</Label>
            <Input value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} placeholder={YOGA_STYLES.slice(0, 3).join(", ")} />
          </div>
        )}
        <div><Label>Website</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
        <div><Label>Instagram</Label><Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="@handle" /></div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </form>
    </div>
  );
}
