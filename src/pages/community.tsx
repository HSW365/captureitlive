import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { supabase, Post, ENERGY_TAGS } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

async function fetchFeed(userId: string | undefined): Promise<Post[]> {
  const { data: posts, error } = await supabase
    .from("yogo_posts")
    .select("*, author:yogo_profiles(*)")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;

  const ids = (posts ?? []).map((p) => p.id);
  const [{ data: likes }, { data: comments }, { data: myLikes }] = await Promise.all([
    supabase.from("yogo_post_likes").select("post_id"),
    supabase.from("yogo_post_comments").select("post_id"),
    userId ? supabase.from("yogo_post_likes").select("post_id").eq("user_id", userId) : Promise.resolve({ data: [] as { post_id: string }[] }),
  ]);

  const likeCounts = new Map<string, number>();
  (likes ?? []).forEach((l: any) => likeCounts.set(l.post_id, (likeCounts.get(l.post_id) ?? 0) + 1));
  const commentCounts = new Map<string, number>();
  (comments ?? []).forEach((c: any) => commentCounts.set(c.post_id, (commentCounts.get(c.post_id) ?? 0) + 1));
  const myLikedSet = new Set((myLikes ?? []).map((l: any) => l.post_id));

  return (posts ?? []).map((p: any) => ({
    ...p,
    like_count: likeCounts.get(p.id) ?? 0,
    comment_count: commentCounts.get(p.id) ?? 0,
    liked_by_me: myLikedSet.has(p.id),
  }));
}

function Composer({ onPosted }: { onPosted: () => void }) {
  const { profile } = useAuth();
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  async function submit() {
    if (!profile || !content.trim()) return;
    setPosting(true);
    await supabase.from("yogo_posts").insert({ author_id: profile.id, content: content.trim(), energy_tag: tag });
    setContent("");
    setTag(null);
    setPosting(false);
    onPosted();
  }

  if (!profile) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 mb-8">
      <div className="flex gap-3">
        <Avatar name={profile.full_name} src={profile.avatar_url} className="w-10 h-10 text-xs shrink-0" />
        <div className="flex-1">
          <Textarea rows={3} placeholder="Share a reflection, a breakthrough, a question…" value={content} onChange={(e) => setContent(e.target.value)} />
          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            <div className="flex gap-2 flex-wrap">
              {ENERGY_TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(tag === t ? null : t)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    tag === t ? "border-coral-500 bg-coral-50 text-coral-700" : "border-border text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <Button size="sm" onClick={submit} disabled={posting || !content.trim()}>{posting ? "Posting…" : "Post"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const toggleLike = useMutation({
    mutationFn: async () => {
      if (!user) return;
      if (post.liked_by_me) {
        await supabase.from("yogo_post_likes").delete().eq("post_id", post.id).eq("user_id", user.id);
      } else {
        await supabase.from("yogo_post_likes").insert({ post_id: post.id, user_id: user.id });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feed"] }),
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-3">
        <Avatar name={post.author?.full_name ?? "?"} src={post.author?.avatar_url} className="w-10 h-10 text-xs" />
        <div>
          <Link href={`/instructors/${post.author_id}`} className="font-medium text-sm hover:text-coral-600">{post.author?.full_name}</Link>
          <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</p>
        </div>
        {post.energy_tag && <Badge tone="amber" className="ml-auto">{post.energy_tag}</Badge>}
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
      <div className="flex items-center gap-5 mt-4 text-muted-foreground">
        <button onClick={() => toggleLike.mutate()} className={`flex items-center gap-1.5 text-sm transition-colors ${post.liked_by_me ? "text-coral-600" : "hover:text-coral-600"}`}>
          <Heart size={16} fill={post.liked_by_me ? "currentColor" : "none"} /> {post.like_count}
        </button>
        <span className="flex items-center gap-1.5 text-sm"><MessageCircle size={16} /> {post.comment_count}</span>
      </div>
    </div>
  );
}

export default function Community() {
  const { user } = useAuth();
  const { data: posts, isLoading, refetch } = useQuery({ queryKey: ["feed"], queryFn: () => fetchFeed(user?.id) });

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-medium mb-1">Community</h1>
      <p className="text-muted-foreground mb-8">Reflections and energy from the Yogo community.</p>
      <Composer onPosted={refetch} />
      {isLoading && <p className="text-muted-foreground text-sm">Loading the feed…</p>}
      {!isLoading && posts?.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No posts yet. Be the first to share something.</p>
        </div>
      )}
      <div className="space-y-4">
        {posts?.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}
