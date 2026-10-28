import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, Profile } from "./supabase";

export interface Membership {
  member: boolean;
  member_until: string | null;
  pending: boolean;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  membership: Membership | null;
  isMember: boolean;
  refreshMembership: () => Promise<void>;
  requireMember: () => boolean;
  signUp: (email: string, password: string, fullName: string, role: "instructor" | "student") => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState<Membership | null>(null);

  async function loadMembership() {
    const { data } = await supabase.rpc("yogo_pay_status");
    setMembership((data as Membership) ?? null);
  }

  async function loadProfile(userId: string) {
    const { data } = await supabase.from("yogo_profiles").select("*").eq("id", userId).maybeSingle();
    setProfile(data as Profile | null);
    await loadMembership();
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setMembership(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // One step: the account is created confirmed server-side (no confirmation email), then signed in.
  async function signUp(email: string, password: string, fullName: string, role: "instructor" | "student") {
    const r = await fetch("https://ucgymjcenpddqshokybj.supabase.co/functions/v1/yogo-signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, fullName, role }),
    });
    const j = await r.json().catch(() => ({}));
    if (j.error) return { error: j.error as string };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: j.exists ? "That email already has an account. Log in instead." : error.message };
    if (data.user) await loadProfile(data.user.id);
    await loadMembership();
    return { error: null };
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function refreshProfile() {
    if (user) await loadProfile(user.id);
  }

  async function refreshMembership() {
    if (user) await loadMembership();
  }

  const isMember = !!membership?.member;

  // Paid membership gates every action. Sends non-members to checkout.
  function requireMember() {
    if (isMember) return true;
    window.location.hash = user ? "#/pricing" : "#/signup";
    return false;
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, membership, isMember, refreshMembership, requireMember, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
