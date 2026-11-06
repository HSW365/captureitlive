import { Flower2, HandHeart, Sun, Gem, Crown, Sparkles, type LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

// 1 coin = 1 cent. Instructor earns 70% of every gift, HSW365 keeps 30%. Must match yogo_gift_price / yogo_coin_pack in Supabase.
export const INSTRUCTOR_SHARE = 0.7;
export const CASHOUT_MIN_CENTS = 2000;

export const GIFTS: { id: string; name: string; coins: number; icon: LucideIcon; color: string }[] = [
  { id: "lotus", name: "Lotus", coins: 10, icon: Flower2, color: "#F472B6" },
  { id: "namaste", name: "Namaste", coins: 50, icon: HandHeart, color: "#FB923C" },
  { id: "sun", name: "Sun Salute", coins: 100, icon: Sun, color: "#FBBF24" },
  { id: "gem", name: "Gem", coins: 500, icon: Gem, color: "#22D3EE" },
  { id: "crown", name: "Crown", coins: 1000, icon: Crown, color: "#A855F7" },
  { id: "galaxy", name: "Galaxy", coins: 5000, icon: Sparkles, color: "#E8553A" },
];
export const giftById = (id: string) => GIFTS.find((g) => g.id === id);

export const PACKS = [
  { id: "p5", coins: 500, price: 5 },
  { id: "p10", coins: 1000, price: 10 },
  { id: "p25", coins: 2600, price: 25, bonus: "+100 bonus" },
  { id: "p50", coins: 5300, price: 50, bonus: "+300 bonus" },
  { id: "p100", coins: 11000, price: 100, bonus: "+1,000 bonus" },
];

export interface Wallet { coins: number; earned_cents: number; lifetime_earned_cents: number; pending_coins: number; payout_pending: boolean }
export async function loadWallet(): Promise<Wallet> {
  const { data } = await supabase.rpc("yogo_wallet");
  return (data as Wallet) ?? { coins: 0, earned_cents: 0, lifetime_earned_cents: 0, pending_coins: 0, payout_pending: false };
}

export interface GiftRow { id: string; class_id: string | null; sender_id: string; instructor_id: string; gift: string; coins: number; instructor_cents: number; created_at: string; sender?: { full_name: string } | null }

/** A session is "live" from 15 minutes before it starts until 30 minutes after it ends. */
export function isLive(start: string, minutes: number, now = Date.now()) {
  const s = new Date(start).getTime();
  return now >= s - 15 * 60_000 && now <= s + (minutes + 30) * 60_000;
}
export const fmtCoins = (n: number) => n.toLocaleString();
