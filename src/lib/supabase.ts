import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ucgymjcenpddqshokybj.supabase.co";
const supabaseAnonKey = "sb_publishable_jhGeMveNoNVrWMP3T3Nzvw_4P8XuhMc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  role: "instructor" | "student";
  full_name: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  specialties: string[] | null;
  experience_level: string | null;
  website: string | null;
  instagram: string | null;
  energy_points: number;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  energy_tag: string | null;
  created_at: string;
  author?: Profile;
  like_count?: number;
  comment_count?: number;
  liked_by_me?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Profile;
}

export interface YogaClass {
  id: string;
  instructor_id: string;
  title: string;
  description: string;
  style: string | null;
  level: "all-levels" | "beginner" | "intermediate" | "advanced";
  session_type: "in-person" | "virtual";
  location: string | null;
  meeting_link: string | null;
  start_time: string;
  duration_minutes: number;
  capacity: number;
  created_at: string;
  instructor?: Profile;
  rsvp_count?: number;
  rsvped_by_me?: boolean;
}

export interface Conversation {
  id: string;
  created_at: string;
  other_member?: Profile;
  last_message?: Message | null;
  unread_count?: number;
}

export interface ConversationMember {
  conversation_id: string;
  profile_id: string;
  last_read_at: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: Profile;
}

export const ENERGY_TAGS = ["Grounding", "Uplifting", "Restorative", "Challenging", "Joyful"] as const;
export const YOGA_STYLES = ["Vinyasa", "Hatha", "Yin", "Ashtanga", "Restorative", "Power", "Kundalini", "Prenatal"] as const;
