import { supabase } from "@/lib/supabase";
export interface NilAthlete { user_id: string; display_name: string; sport: string; level: "middle" | "high" | "amateur"; school: string | null; grad_year: number | null; city_state: string | null; bio: string | null; instagram: string | null; guardian_ok: boolean; listed: boolean }
export interface NilClip { id: string; user_id: string; title: string; path: string; created_at: string }
export interface NilOrg { user_id: string; kind: "college" | "brand"; org_name: string; website: string | null; contact_email: string | null; approved: boolean }
export interface NilOffer { id: string; org_id: string; athlete_id: string; kind: "recruiting" | "brand_deal"; message: string; amount_text: string | null; status: "sent" | "accepted" | "declined"; created_at: string }
export const signed = async (path: string) => (await supabase.storage.from("nil-clips").createSignedUrl(path, 3600)).data?.signedUrl ?? "";
