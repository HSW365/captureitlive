import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { ChatMessage } from "@/lib/messaging";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ConversationRow {
  id: string;
  otherId: string;
  otherName: string;
  otherAvatar: string | null;
  lastMessage: string | null;
  lastAt: string | null;
}

function useConversations(myId?: string) {
  return useQuery({
    queryKey: ["conversations", myId],
    enabled: !!myId,
    refetchInterval: 15000,
    queryFn: async (): Promise<ConversationRow[]> => {
      const { data: memberships } = await supabase
        .from("yogo_conversation_members")
        .select("conversation_id")
        .eq("profile_id", myId!);

      const conversationIds = (memberships ?? []).map((m) => m.conversation_id);
      if (conversationIds.length === 0) return [];

      const { data: allMembers } = await supabase
        .from("yogo_conversation_members")
        .select("conversation_id, profile_id, yogo_profiles(id, full_name, avatar_url)")
        .in("conversation_id", conversationIds);

      const { data: messages } = await supabase
        .from("yogo_messages")
        .select("conversation_id, content, created_at")
        .in("conversation_id", conversationIds)
        .order("created_at", { ascending: false });

      return conversationIds.map((cid) => {
        const other = (allMembers ?? []).find(
          (m: any) => m.conversation_id === cid && m.profile_id !== myId
        ) as any;
        const lastMsg = (messages ?? []).find((m: any) => m.conversation_id === cid);
        return {
          id: cid,
          otherId: other?.profile_id ?? "",
          otherName: other?.yogo_profiles?.full_name ?? "Someone",
          otherAvatar: other?.yogo_profiles?.avatar_url ?? null,
          lastMessage: lastMsg?.content ?? null,
          lastAt: lastMsg?.created_at ?? null,
        };
      }).sort((a, b) => (b.lastAt ?? "").localeCompare(a.lastAt ?? ""));
    },
  });
}

function ConversationList({ activeId }: { activeId?: string }) {
  const { profile } = useAuth();
  const { data: conversations, isLoading } = useConversations(profile?.id);

  return (
    <div className="border-r border-border h-full flex flex-col">
      <div className="px-5 py-4 border-b border-border">
        <h1 className="font-display text-xl font-medium">Messages</h1>
      </div>
      <div className="flex-1 overflow-y-auto thin-scroll">
        {isLoading && <p className="p-5 text-sm text-muted-foreground">Loading…</p>}
        {conversations?.length === 0 && (
          <div className="p-5 text-sm text-muted-foreground">
            No conversations yet. Visit an{" "}
            <Link href="/instructors" className="text-coral-600 font-medium">instructor's profile</Link>{" "}
            to start one.
          </div>
        )}
        {conversations?.map((c) => (
          <Link
            key={c.id}
            href={`/messages/${c.id}`}
            className={cn(
              "flex items-center gap-3 px-5 py-4 border-b border-border/60 hover:bg-muted/60 transition-colors",
              activeId === c.id && "bg-muted"
            )}
          >
            <Avatar name={c.otherName} src={c.otherAvatar} className="w-11 h-11 text-sm shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-sm truncate">{c.otherName}</p>
                {c.lastAt && (
                  <span className="text-xs text-muted-foreground shrink-0 font-mono">
                    {formatDistanceToNow(new Date(c.lastAt), { addSuffix: false })}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{c.lastMessage ?? "Say hello 👋"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ChatThread({ conversationId }: { conversationId: string }) {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: other } = useQuery({
    queryKey: ["conversation-other", conversationId, profile?.id],
    enabled: !!profile,
    queryFn: async () => {
      const { data } = await supabase
        .from("yogo_conversation_members")
        .select("profile_id, yogo_profiles(full_name, avatar_url)")
        .eq("conversation_id", conversationId)
        .neq("profile_id", profile!.id)
        .maybeSingle();
      return data as any;
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const { data } = await supabase
        .from("yogo_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      return (data ?? []) as ChatMessage[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "yogo_messages", filter: `conversation_id=eq.${conversationId}` },
        () => {
          qc.invalidateQueries({ queryKey: ["messages", conversationId] });
          qc.invalidateQueries({ queryKey: ["conversations", profile?.id] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversationId, qc, profile?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !profile) return;
    setSending(true);
    const content = draft.trim();
    setDraft("");
    await supabase.from("yogo_messages").insert({
      conversation_id: conversationId,
      sender_id: profile.id,
      content,
    });
    setSending(false);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border flex items-center gap-3">
        <Avatar name={other?.yogo_profiles?.full_name ?? "…"} src={other?.yogo_profiles?.avatar_url} className="w-9 h-9 text-xs" />
        <p className="font-medium text-sm">{other?.yogo_profiles?.full_name ?? "Loading…"}</p>
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll px-5 py-6 space-y-3">
        {messages?.map((m) => {
          const mine = m.sender_id === profile?.id;
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-soft",
                  mine ? "bg-gradient-to-b from-coral-500 to-coral-600 text-white rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"
                )}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="p-4 border-t border-border flex items-center gap-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a message…"
          className="flex-1 h-11 rounded-full border border-border bg-background px-5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" size="md" disabled={sending || !draft.trim()} className="rounded-full !px-4">
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
}

export default function Messages() {
  const { id } = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const { profile } = useAuth();

  if (!profile) return <div className="max-w-3xl mx-auto px-6 py-20 text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-5rem)]">
      <div className="grid md:grid-cols-[320px_1fr] h-full border-x border-border">
        <div className={cn(id ? "hidden md:block" : "block", "h-full")}>
          <ConversationList activeId={id} />
        </div>
        <div className={cn(id ? "block" : "hidden md:flex", "h-full")}>
          {id ? (
            <ChatThread conversationId={id} />
          ) : (
            <div className="h-full flex-1 hidden md:flex flex-col items-center justify-center text-muted-foreground gap-3">
              <MessageCircle size={32} className="opacity-40" />
              <p className="text-sm">Select a conversation to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
