import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Onboarding() {
  const { profile, refreshProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocationField] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    await supabase.from("yogo_profiles").update({ headline, bio, location }).eq("id", profile.id);
    await refreshProfile();
    setSaving(false);
    setLocation("/community");
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl font-medium mb-2">One more thing</h1>
      <p className="text-muted-foreground mb-8">
        A quick line about yourself helps {profile?.role === "instructor" ? "students" : "instructors"} find you.
      </p>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <Label htmlFor="headline">Headline</Label>
          <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)}
            placeholder={profile?.role === "instructor" ? "Vinyasa & breathwork teacher" : "Finding steadiness on the mat"} />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={location} onChange={(e) => setLocationField(e.target.value)} placeholder="Austin, TX" />
        </div>
        <div>
          <Label htmlFor="bio">A little about you</Label>
          <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Share what brought you to yoga…" />
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving…" : "Enter CaptureItLive"}</Button>
      </form>
    </div>
  );
}
