import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { money } from "@/components/pay-instructor";

interface Payout { id: string; full_name: string; amount_cents: number; method: string; handle: string; status: string; created_at: string; decided_at: string | null }
interface Overview { pending: Payout[]; recent: Payout[]; gift_coins_30d: number; instructor_cents_30d: number; coin_sales_cents_30d: number; owed_cents: number }


export default function AdminPayouts() {
  const { isOwner: owner } = useAuth();
  const qc = useQueryClient();
  const { data, error } = useQuery({
    queryKey: ["admin-payouts"],
    queryFn: async () => { const { data, error } = await supabase.rpc("yogo_admin_payouts"); if (error) throw error; return data as Overview; },
    enabled: owner,
  });
  async function decide(id: string, paid: boolean) {
    await supabase.rpc("yogo_admin_payout_decide", { p_id: id, p_paid: paid });
    qc.invalidateQueries({ queryKey: ["admin-payouts"] });
  }
  if (!owner) return <div className="max-w-xl mx-auto px-6 py-24 text-center text-muted-foreground">Owner only.</div>;
  if (error) return <div className="max-w-xl mx-auto px-6 py-24 text-destructive">{(error as Error).message}</div>;
  if (!data) return <div className="max-w-xl mx-auto px-6 py-24 text-muted-foreground">Loading…</div>;
  const yourCut = Math.max(0, data.gift_coins_30d - data.instructor_cents_30d);
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-medium">Gifts and payouts</h1>
      <p className="text-muted-foreground mt-1">Coin purchases are approved in your HSW365 payments console. Instructor cash outs are below.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
        {[["Coin sales, 30 days", money(data.coin_sales_cents_30d)], ["Gifts sent, 30 days", money(data.gift_coins_30d)], ["Your 30% cut", money(yourCut)], ["Owed to instructors", money(data.owed_cents)]].map(([l, v]) => (
          <div key={l} className="rounded-2xl border border-border p-4 bg-card"><p className="font-display text-2xl font-medium">{v}</p><p className="text-xs text-muted-foreground mt-1">{l}</p></div>
        ))}
      </div>
      <h2 className="font-display text-xl font-medium mt-10 mb-3">Cash outs to send</h2>
      {data.pending.length === 0 && <p className="text-sm text-muted-foreground">Nothing to send right now.</p>}
      <div className="space-y-2">
        {data.pending.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{money(p.amount_cents)} to {p.full_name}</p>
              <p className="text-sm text-muted-foreground">{p.method} · <span className="font-mono">{p.handle}</span> · requested {format(new Date(p.created_at), "MMM d, h:mm a")}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => decide(p.id, false)}>Reject</Button>
              <Button size="sm" onClick={() => decide(p.id, true)}>Mark sent</Button>
            </div>
          </div>
        ))}
      </div>
      {data.recent.length > 0 && (
        <>
          <h2 className="font-display text-xl font-medium mt-10 mb-3">Recent</h2>
          <div className="text-sm space-y-1">
            {data.recent.map((p) => (
              <div key={p.id} className="flex justify-between border-b border-border py-2"><span>{p.full_name} · {p.method}</span><span className="font-mono">{money(p.amount_cents)} · {p.status}</span></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
