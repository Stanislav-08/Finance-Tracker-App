import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { createAccount, getAccounts, type AccountItem } from "../services/accountService";
import "./WalletPage.css";

export default function WalletPage() {
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [name, setName] = useState("");
  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setAccounts(await getAccounts(user.id));
  }, []);
  useEffect(() => { load().catch(console.error); }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !name.trim()) return;
    await createAccount(user.id, name.trim(), "EUR");
    setName(""); load();
  }

  return (
    <div className="wallet-page">
      <h1>Wallet</h1>
      {accounts.map((a) => (
        <div key={a.id} className="goal-card" style={{ marginBottom: 12 }}>
          <h2>{a.name}</h2><strong>{a.currency} {Number(a.balance).toFixed(2)}</strong>
        </div>
      ))}
      <form onSubmit={add} className="auth-form" style={{ maxWidth: 360 }}>
        <input placeholder="New account name" value={name} onChange={(e) => setName(e.target.value)} required />
        <button className="auth-button" type="submit">Add account</button>
      </form>
    </div>
  );
}
