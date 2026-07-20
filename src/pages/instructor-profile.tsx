import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { supabase, Profile, YogaClass } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { findOrCreateConversation } from "@/lib/messaging";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { format } from "date-fns";

export default function InstructorProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [, setLocation] = useLocation();
  const [messaging, setMessaging] = useState(false);

  async function startConversation() {
    if (!user || !id) return;
    setMessaging(true);
    try {
      const conversationId = await findOrCreateConversation(user.id, id);
      setLocation(`/messages/${conversationId}`);
    } finally {
      setMessaging(false);
    }
  }

  const { data: profile } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("yogo_profiles").select("*").eq("id", id).single();
      if (error) throw error;
      return data as Profile;
    },
  });

  const { data: classes } = useQuery({
    queryKey: ["instructor-classes", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("yogo_classes").select("*").eq("instructor_id", id).order("start_time", { ascending: true });
      if (error) throw error;
      return data as YogaClass[];
    },
    enabled: !!id,
  });

  const { data: isFollowing } = useQuery({
    queryKey: ["following", id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase.from("yogo_follows").select("follower_id").eq("follower_id", user.id).eq("following_id", id).maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  const toggleFollow = useMutation({
    mutationFn: async () => {
      if (!user || !id) return;
      if (isFollowing) {
        await supabase.from("yogo_follows").delete().eq("follower_id", user.id).eq("following_id", id);
      } else {
        await supabase.from("yogo_follows").insert({ follower_id: user.id, following_id: id });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["following", id, user?.id] }),
  });

  if (!profile) return <div className="max-w-2xl mx-auto px-6 py-20 text-muted-foreground">Loading profile…</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="flex items-start gap-5">
        <Avatar name={profile.full_name} src={profile.avatar_url} className="w-20 h-20 text-2xl shrink-0" />
        <div className="flex-1">
          <h1 className="font-display text-3xl font-medium">{profile.full_name}</h1>
          {profile.headline && <p className="text-muted-foreground mt-1">{profile.headline}</p>}
          {profile.location && <p className="text-xs text-muted-foreground mt-1">{profile.location}</p>}
        </div>
        {user && user.id !== profile.id && (
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={startConversation} disabled={messaging}>
              <MessageCircle size={16} /> Message
            </Button>
            <Button variant={isFollowing ? "outline" : "primary"} size="sm" onClick={() => toggleFollow.mutate()}>
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </div>
        )}
      </div>

      {profile.bio && <p className="mt-6 text-sm leading-relaxed">{profile.bio}</p>}

      {profile.specialties && profile.specialties.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {profile.specialties.map((s) => <Badge key={s} tone="violet">{s}</Badge>)}
        </div>
      )}

      {profile.role === "instructor" && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-medium mb-4">Upcoming classes</h2>
          {classes?.length === 0 && <p className="text-sm text-muted-foreground">No classes scheduled right now.</p>}
          <div className="space-y-3">
            {classes?.map((c) => (
              <a key={c.id} href={`#/classes/${c.id}`} className="block rounded-xl border border-border p-4 hover:border-coral-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{c.title}</span>
                  <Badge tone="coral">{c.level}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{format(new Date(c.start_time), "EEE, MMM d · h:mm a")}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
