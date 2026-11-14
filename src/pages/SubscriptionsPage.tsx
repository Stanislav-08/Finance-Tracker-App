import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { createSubscription, deleteSubscription, getSubscriptions } from "../services/accountService";

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<any[]>([]);
  const [uid, setUid] = useState("");
  const [f, setF] = useState({ name: "", amount: "", billingCycle: "monthly", nextPaymentDate: new Date().toISOString().slice(0, 10) });

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUid(user.id);
    setSubs(await getSubscriptions(user.id));
  }, []);
  useEffect(() => { load().catch(console.error); }, [load]);

  const monthly = subs.reduce((a, s) => a + (s.billingCycle === "yearly" ? Number(s.amount) / 12 : Number(s.amount)), 0);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await createSubscription(uid, { ...f, amount: Number(f.amount) });
    setF({ ...f, name: "", amount: "" });
    load();
  }

  return (
    <div>
      <h1>Subscriptions</h1>
      <div className="row info-row">
        <div className="widget"><h2 className="card-title">Monthly cost</h2><p className="card-value">€{monthly.toFixed(2)}</p></div>
        <div className="widget"><h2 className="card-title">Yearly cost</h2><p className="card-value">€{(monthly * 12).toFixed(2)}</p></div>
      </div>
      <form className="card toolbar" onSubmit={add}>
        <input placeholder="Name (e.g. Netflix)" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
        <input type="number" min="0.01" step="0.01" placeholder="Amount" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} required />
        <select value={f.billingCycle} onChange={(e) => setF({ ...f, billingCycle: e.target.value })}><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select>
        <input type="date" value={f.nextPaymentDate} onChange={(e) => setF({ ...f, nextPaymentDate: e.target.value })} required />
        <button className="btn" type="submit">Add</button>
      </form>
      <div className="card">
        {subs.length === 0 ? <p>No subscriptions yet.</p> : (
          <table><thead><tr><th>Name</th><th>Cycle</th><th>Next payment</th><th>Amount</th><th /></tr></thead>
            <tbody>{subs.map((s) => (
              <tr key={s.id}><td>{s.name}</td><td>{s.billingCycle}</td><td>{new Date(s.nextPaymentDate).toLocaleDateString()}</td>
                <td>€{Number(s.amount).toFixed(2)}</td>
                <td><button className="btn-danger" onClick={async () => { await deleteSubscription(uid, s.id); load(); }}>Remove</button></td></tr>
            ))}</tbody></table>
        )}
      </div>
    </div>
  );
}
