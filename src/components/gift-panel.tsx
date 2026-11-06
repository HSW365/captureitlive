import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Coins, X, Radio } from "lucide-react";
import { supabase, Profile } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { GIFTS, PACKS, giftById, loadWallet, fmtCoins, type GiftRow } from "@/lib/gifts";
import { CASHAPP_TAG, ZELLE_TO } from "@/lib/config";

/** Buy coins from HSW365 (Cash App / Zelle). Coins land once the payment is confirmed. */
export function BuyCoins({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [pack, setPack] = useState(PACKS[1]);
  const [method, setMethod] = useState<"cashapp" | "zelle">("cashapp");
  const [ref, setRef] = useState("");
  const [paid, setPaid] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function pay() {
    if (method === "cashapp") window.open(`https://cash.app/${CASHAPP_TAG}/${pack.price}`, "_blank", "noopener");
    else { try { navigator.clipboard.writeText(ZELLE_TO.replace(/\D/g, "")); } catch { /* ignore */ } }
    setPaid(true);
  }
  async function claim() {
    setErr(null); setBusy(true);
    const { error } = await supabase.rpc("yogo_coins_claim", { p_pack: pack.id, p_method: method, p_ref: ref.trim() });
    setBusy(false);
    if (error) return setErr(error.message);
    qc.invalidateQueries({ queryKey: ["wallet"] });
    setDone(true);
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-[60] p-0 sm:p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-[#14141C] text-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="flex items-start justify-between">
          <div><p className="text-xs font-mono uppercase tracking-widest text-amber-300">Coins</p><h2 className="font-display text-2xl font-semibold mt-1">Get coins to send gifts</h2></div>
          <button onClick={onClose} aria-label="Close" className="p-1 text-white/60"><X size={20} /></button>
        </div>
        {done ? (
          <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5 text-sm">
            <p className="font-semibold">Payment sent.</p>
            <p className="text-white/60 mt-1">{fmtCoins(pack.coins)} coins land in your wallet as soon as it's confirmed, usually within minutes.</p>
            <button className="mt-4 w-full h-12 rounded-full bg-white text-black font-semibold" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 mt-5">
              {PACKS.map((p) => (
                <button key={p.id} type="button" onClick={() => { setPack(p); setPaid(false); }}
                  className={`rounded-2xl border p-4 text-left transition-colors ${pack.id === p.id ? "border-amber-300 bg-amber-300/10" : "border-white/10 hover:border-white/25"}`}>
                  <span className="flex items-center gap-1.5 font-semibold"><Coins size={16} className="text-amber-300" />{fmtCoins(p.coins)}</span>
                  <span className="block text-sm text-white/60 mt-1">${p.price}{p.bonus ? ` · ${p.bonus}` : ""}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-5">
              {(["cashapp", "zelle"] as const).map((m) => (
                <button key={m} type="button" onClick={() => { setMethod(m); setPaid(false); }}
                  className={`h-11 rounded-xl border text-sm font-semibold ${method === m ? "border-white bg-white/10" : "border-white/10 text-white/60"}`}>{m === "cashapp" ? "Cash App" : "Zelle"}</button>
              ))}
            </div>
            <button type="button" onClick={pay} className="mt-4 w-full min-h-[56px] rounded-2xl font-semibold text-lg" style={{ background: method === "cashapp" ? "#00C244" : "#6D1ED4" }}>
              {method === "cashapp" ? `Pay $${pack.price} with Cash App` : `Copy Zelle and send $${pack.price}`}
            </button>
            {method === "zelle" && paid && <p className="text-xs text-white/60 text-center mt-2">Copied. Send ${pack.price} to {ZELLE_TO} in your bank's Zelle.</p>}
            {paid && (
              <div className="mt-4 space-y-3">
                <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder={method === "cashapp" ? "Your $cashtag" : "Name on your Zelle account"}
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm outline-none focus:border-amber-300" />
                {err && <p className="text-sm text-red-400">{err}</p>}
                <button disabled={busy || ref.trim().length < 2} onClick={claim} className="w-full h-12 rounded-full bg-white text-black font-semibold disabled:opacity-40">{busy ? "Sending" : "I've paid"}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** Live gifting rail for a session: gift feed for everyone, gift picker for attendees. */
export function LiveGifts({ instructor, classId, live }: { instructor: Profile; classId: string; live: boolean }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const mine = user?.id === instructor.id;
  const [buy, setBuy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [burst, setBurst] = useState<GiftRow | null>(null);
  const seen = useRef<string | null>(null);

  const { data: wallet } = useQuery({ queryKey: ["wallet", user?.id], queryFn: loadWallet, enabled: !!user, refetchInterval: live ? 15000 : false });
  const { data: feed } = useQuery({
    queryKey: ["gifts", classId],
    queryFn: async () => {
      const { data } = await supabase.from("yogo_gifts").select("*, sender:yogo_profiles!yogo_gifts_sender_id_fkey(full_name)").eq("class_id", classId).order("created_at", { ascending: false }).limit(40);
      return (data ?? []) as GiftRow[];
    },
    refetchInterval: live ? 4000 : false,
  });

  useEffect(() => {
    const top = feed?.[0];
    if (!top) return;
    const prev = seen.current;
    seen.current = top.id;
    if (prev && prev !== top.id) { setBurst(top); const t = setTimeout(() => setBurst(null), 3200); return () => clearTimeout(t); }
  }, [feed]);

  async function send(id: string) {
    setErr(null);
    const g = giftById(id)!;
    if ((wallet?.coins ?? 0) < g.coins) return setBuy(true);
    setSending(id);
    const { error } = await supabase.rpc("yogo_send_gift", { p_instructor: instructor.id, p_class: classId, p_gift: id });
    setSending(null);
    if (error) return /enough coins/i.test(error.message) ? setBuy(true) : setErr(error.message);
    qc.invalidateQueries({ queryKey: ["wallet"] });
    qc.invalidateQueries({ queryKey: ["gifts", classId] });
  }

  const totalCoins = (feed ?? []).reduce((t, g) => t + g.coins, 0);
  const first = instructor.full_name.split(" ")[0];
  const B = burst ? giftById(burst.gift) : null;

  return (
    <section className="mt-10 rounded-3xl bg-[#0E0E14] text-white p-6 relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(500px 220px at 10% -20%, rgba(232,85,58,.25), transparent 70%), radial-gradient(400px 200px at 100% 0%, rgba(168,85,247,.2), transparent 70%)" }} />
      <div className="relative flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {live ? <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest bg-red-500 px-2.5 py-1 rounded-full"><Radio size={12} /> Live</span>
            : <span className="text-xs font-bold uppercase tracking-widest text-white/50">Gifts</span>}
          <h2 className="font-display text-xl font-semibold">{mine ? "Your gifts this session" : `Gift ${first}`}</h2>
        </div>
        {user && !mine && (
          <button onClick={() => setBuy(true)} className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-white/10 hover:bg-white/15 text-sm font-semibold">
            <Coins size={15} className="text-amber-300" /> {fmtCoins(wallet?.coins ?? 0)}{wallet?.pending_coins ? <span className="text-white/50 font-normal"> +{fmtCoins(wallet.pending_coins)}</span> : null}
          </button>
        )}
        {mine && <span className="text-sm text-white/70">{fmtCoins(totalCoins)} coins · you earn 70%</span>}
      </div>

      {B && burst && (
        <div key={burst.id} className="relative mt-5 rounded-2xl p-4 flex items-center gap-4 animate-[giftpop_.5s_ease-out]" style={{ background: `linear-gradient(90deg, ${B.color}33, transparent)`, border: `1px solid ${B.color}66` }}>
          <B.icon size={34} style={{ color: B.color }} />
          <p className="font-semibold">{burst.sender?.full_name ?? "Someone"} sent a {B.name}</p>
        </div>
      )}

      {!mine && (
        live ? (
          user ? (
            <div className="relative grid grid-cols-3 sm:grid-cols-6 gap-2 mt-5">
              {GIFTS.map((g) => (
                <button key={g.id} type="button" disabled={!!sending} onClick={() => send(g.id)}
                  className="group rounded-2xl border border-white/10 bg-white/[.03] hover:bg-white/[.07] p-3 flex flex-col items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50">
                  <g.icon size={28} style={{ color: g.color }} className="transition-transform group-hover:scale-110" />
                  <span className="text-xs font-semibold">{g.name}</span>
                  <span className="text-[11px] text-white/55 flex items-center gap-1"><Coins size={11} className="text-amber-300" />{fmtCoins(g.coins)}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="relative mt-5 text-sm text-white/70"><Link href="/signup" className="underline font-semibold text-white">Sign up</Link> to send {first} gifts during class.</p>
          )
        ) : (
          <p className="relative mt-4 text-sm text-white/60">Gifting opens 15 minutes before class starts. Grab coins now so you're ready.</p>
        )
      )}
      {err && <p className="relative mt-3 text-sm text-red-400">{err}</p>}

      {(feed?.length ?? 0) > 0 && (
        <ul className="relative mt-5 space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {feed!.map((f) => { const g = giftById(f.gift); if (!g) return null; return (
            <li key={f.id} className="flex items-center gap-2 text-sm text-white/80">
              <g.icon size={16} style={{ color: g.color }} /><b className="font-semibold text-white">{f.sender?.full_name ?? "Someone"}</b> sent {g.name}
            </li>
          ); })}
        </ul>
      )}
      {buy && <BuyCoins onClose={() => setBuy(false)} />}
    </section>
  );
}
