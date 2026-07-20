import { supabase } from "@/lib/supabase";

export interface ConversationSummary {
  id: string;
  other: { id: string; full_name: string; avatar_url: string | null } | null;
  last_message: string | null;
  last_message_at: string | null;
  unread: boolean;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

/** Finds an existing 1:1 conversation between two profiles, or creates one. Returns the conversation id. */
export async function findOrCreateConversation(myId: string, otherId: string): Promise<string> {
  const { data: mine } = await supabase
    .from("yogo_conversation_members")
    .select("conversation_id")
    .eq("profile_id", myId);

  if (mine && mine.length > 0) {
    const conversationIds = mine.map((m) => m.conversation_id);
    const { data: shared } = await supabase
      .from("yogo_conversation_members")
      .select("conversation_id")
      .eq("profile_id", otherId)
      .in("conversation_id", conversationIds);

    if (shared && shared.length > 0) {
      return shared[0].conversation_id;
    }
  }

  const { data: conversation, error } = await supabase
    .from("yogo_conversations")
    .insert({})
    .select("id")
    .single();
  if (error || !conversation) throw error ?? new Error("Could not create conversation");

  await supabase.from("yogo_conversation_members").insert([
    { conversation_id: conversation.id, profile_id: myId },
    { conversation_id: conversation.id, profile_id: otherId },
  ]);

  return conversation.id;
}
