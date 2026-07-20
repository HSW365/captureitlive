import { supabase } from "@/lib/supabase";

/**
 * Finds an existing 1:1 conversation between the two profile ids, or creates
 * a new one, and returns its id.
 */
export async function startConversation(myId: string, otherId: string): Promise<string> {
  // Find conversations myId belongs to, then check which of those otherId also belongs to.
  const { data: mine, error: mineErr } = await supabase
    .from("yogo_conversation_members")
    .select("conversation_id")
    .eq("profile_id", myId);
  if (mineErr) throw mineErr;

  const myConvoIds = (mine ?? []).map((m) => m.conversation_id);

  if (myConvoIds.length > 0) {
    const { data: shared, error: sharedErr } = await supabase
      .from("yogo_conversation_members")
      .select("conversation_id")
      .eq("profile_id", otherId)
      .in("conversation_id", myConvoIds);
    if (sharedErr) throw sharedErr;
    if (shared && shared.length > 0) return shared[0].conversation_id;
  }

  const { data: convo, error: convoErr } = await supabase
    .from("yogo_conversations")
    .insert({})
    .select("id")
    .single();
  if (convoErr) throw convoErr;

  const { error: membersErr } = await supabase.from("yogo_conversation_members").insert([
    { conversation_id: convo.id, profile_id: myId },
    { conversation_id: convo.id, profile_id: otherId },
  ]);
  if (membersErr) throw membersErr;

  return convo.id as string;
}
