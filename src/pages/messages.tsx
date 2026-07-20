import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { supabase, Profile, Message } from "@/lib/supabase";
import { Avatar } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface ConversationRow {
  id: string;
  created_at: string;
  otherMember: Profile;
  lastMessage: Message | null;
  unread: boolean;
}

async function fetchConversations(myId: string): Promise<ConversationRow[]> {
  const { data: memberships, error: memErr } = await supabase
    .from("yogo_conversation_members")
    .select("conversation_id, last_read_at")
    .eq("profile_id", myId);
  if (memErr) throw memErr;
  if (!memberships || memberships.length === 0) return [];

  const convoIds = memberships.map((m) => m.conversation_id);

  const { data: allMembers, error: allErr } = await supabase
    .from("yogo_conversation_members")
    .select("conversation_id, profile_id, yogo_profiles(*)")
    .in("conversation_id", convoIds);
  if (allErr) throw allErr;

  const { data: messages, error: msgErr } = await supabase
    .from("yogo_messages")
    .select("*")
    .in("conversation_id", convoIds)
    .order("created_at", { ascending: false });
  if (msgErr) throw msgErr;

  return convoIds
    .map((cid) => {
      const membership = memberships.find((m) => m.conversation_id === cid);
      const otherMemberRow = (allMembers ?? []).find(
        (m: any) => m.conversation_id === cid && m.profile_id !== myId
      );
      const otherMember = otherMemberRow?.yogo_profiles as Profile | undefined;
      const convoMessages = (messages ?? []).filter((m) => m.conversation_id === cid);
      const lastMessage = convoMessages[0] ?? null;
      const lastReadAt = membership?.last_read_at ? new Date(membership.last_read_at) : null;
      const unread = !!lastMessage && (!lastReadAt || new Date(lastMessage.created_at) > lastReadAt) && lastMessage.sender_id !== myId;

      return {
        id: cid,
        created_at: lastMessage?.created_at ?? "",
        otherMember: otherMember as Profile,
        lastMessage,
        unread,
      };
    })
    .filter((c) => !!c.otherMember)
    .sort((a, b) => (b.lastMessage?.created_at ?? "").localeCompare(a.lastMessage?.created_at ?? ""));
}

export default function Messages() {
  const { profile } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["conversations", profile?.id],
    queryFn: () => fetchConversations(profile!.id),
    enabled: !!profile,
    refetchInterval: 15000,
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-medium mb-1">Messages</h1>
      <p className="text-muted-foreground mb-10">Conversations with your community.</p>

      {isLoading && <p className="text-muted-foreground text-sm">Loading conversations…</p>}
      {!isLoading && data?.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No conversations yet — visit an <Link href="/instructors" className="text-coral-600">instructor's profile</Link> to say hello.
        </div>
      )}

      <div className="space-y-2">
        {data?.map((c) => (
          <Link
            key={c.id}
            href={`/messages/${c.id}`}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-coral-300 transition-colors"
          >
            <Avatar name={c.otherMember.full_name} src={c.otherMember.avatar_url} className="w-11 h-11 text-sm shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-sm truncate">{c.otherMember.full_name}</p>
                {c.lastMessage && (
                  <span className="text-xs text-muted-foreground shrink-0 font-mono">
                    {formatDistanceToNow(new Date(c.lastMessage.created_at), { addSuffix: true })}
                  </span>
                )}
              </div>
              <p className={`text-sm truncate mt-0.5 ${c.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                {c.lastMessage?.content ?? "Say hello"}
              </p>
            </div>
            {c.unread && <span className="w-2.5 h-2.5 rounded-full bg-coral-500 shrink-0" />}
          </Link>
        ))}
      </div>
    </div>
  );
}
