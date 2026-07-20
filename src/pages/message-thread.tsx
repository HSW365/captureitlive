import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { supabase, Profile, Message } from "@/lib/supabase";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export default function MessageThread() {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: otherMember } = useQuery({
    queryKey: ["thread-other-member", id, profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("yogo_conversation_members")
        .select("profile_id, yogo_profiles(*)")
        .eq("conversation_id", id)
        .neq("profile_id", profile!.id)
        .maybeSingle();
      if (error) throw error;
      return (data as any)?.yogo_profiles as Profile | undefined;
    },
    enabled: !!id && !!profile,
  });

  const { data: messages } = useQuery({
    queryKey: ["thread-messages", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("yogo_messages")
        .select("*")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Message[];
    },
    enabled: !!id,
  });

  // Mark as read when opening the thread.
  useEffect(() => {
    if (!id || !profile) return;
    supabase
      .from("yogo_conversation_members")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", id)
      .eq("profile_id", profile.id)
      .then(() => qc.invalidateQueries({ queryKey: ["conversations", profile.id] }));
  }, [id, profile?.id]);

  // Realtime subscription for new messages in this conversation.
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`messages-${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "yogo_messages", filter: `conversation_id=eq.${id}` },
        () => qc.invalidateQueries({ queryKey: ["thread-messages", id] })
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !profile || !id) return;
    setSending(true);
    const content = text.trim();
    setText("");
    const { error } = await supabase.from("yogo_messages").insert({
      conversation_id: id,
      sender_id: profile.id,
      content,
    });
    setSending(false);
    if (!error) qc.invalidateQueries({ queryKey: ["thread-messages", id] });
  }

  if (!profile) return <div className="max-w-2xl mx-auto px-6 py-20 text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col h-[calc(100vh-5rem)]">
      <div className="flex items-center gap-3 pb-5 border-b border-border">
        <Link href="/messages" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={18} />
        </Link>
        {otherMember && (
          <>
            <Avatar name={otherMember.full_name} src={otherMember.avatar_url} className="w-9 h-9 text-xs" />
            <Link href={`/instructors/${otherMember.id}`} className="font-display text-lg font-medium hover:text-coral-600">
              {otherMember.full_name}
            </Link>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 space-y-3">
        {messages?.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">
            This is the start of your conversation with {otherMember?.full_name ?? "them"}.
          </p>
        )}
        {messages?.map((m) => {
          const mine = m.sender_id === profile.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  mine ? "bg-coral-500 text-white" : "bg-card border border-border"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
                <p className={`text-[10px] mt-1 font-mono ${mine ? "text-white/70" : "text-muted-foreground"}`}>
                  {format(new Date(m.created_at), "h:mm a")}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="flex items-center gap-2 pt-4 border-t border-border">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message…"
          className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral-300"
        />
        <Button type="submit" size="sm" disabled={sending || !text.trim()}>Send</Button>
      </form>
    </div>
  );
}
