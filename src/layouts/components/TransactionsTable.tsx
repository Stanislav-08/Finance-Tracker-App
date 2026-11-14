import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { deleteTransaction, getCategories, getTransactions } from "../../services/accountService";
import "./TransactionsTable.css";

export default function TransactionsTable({ full = false }: { full?: boolean }) {
  const [txs, setTxs] = useState<any[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [uid, setUid] = useState("");
  const [q, setQ] = useState("");
  const [typeF, setTypeF] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUid(user.id);
      const [t, c] = await Promise.all([getTransactions(user.id), getCategories(user.id)]);
      setTxs(t);
      setNames(Object.fromEntries(c.map((x) => [x.id, x.name])));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const list = txs.filter((t) =>
      (typeF === "all" || t.type === typeF) &&
      `${t.merchant ?? ""} ${t.description ?? ""} ${names[t.categoryId] ?? ""}`.toLowerCase().includes(q.toLowerCase()));
    return full ? list : list.slice(0, 6);
  }, [txs, q, typeF, names, full]);

  async function remove(id: string) {
    if (!confirm("Delete this transaction? The account balance will be adjusted.")) return;
    await deleteTransaction(uid, id);
    load();
  }

  function exportCsv() {
    const rows = [["Date", "Type", "Category", "Merchant", "Description", "Amount"],
      ...shown.map((t) => [t.date.slice(0, 10), t.type, names[t.categoryId] ?? "", t.merchant ?? "", t.description ?? "", Number(t.amount).toFixed(2)])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "transactions.csv";
    a.click();
  }

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div className="transactions-list">
      {full && (
        <div className="toolbar">
          <input placeholder="Search merchant, description, category…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={typeF} onChange={(e) => setTypeF(e.target.value)}>
            <option value="all">All</option><option value="income">Income</option><option value="expense">Expenses</option>
          </select>
          <button className="btn-ghost" onClick={exportCsv}>Export CSV</button>
        </div>
      )}
      {shown.length === 0 ? <p>No transactions found.</p> : (
        <table>
          <thead><tr><th>Merchant</th><th>Category</th><th>Date</th><th>Amount</th>{full && <th />}</tr></thead>
          <tbody>
            {shown.map((t) => (
              <tr key={t.id}>
                <td>{t.merchant || t.description || "Unknown"}</td>
                <td>{names[t.categoryId] ?? "—"}</td>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td><strong className={t.type === "income" ? "income" : "expense"}>{t.type === "income" ? "+" : "-"}€{Number(t.amount).toFixed(2)}</strong></td>
                {full && <td><button className="btn-danger" onClick={() => remove(t.id)}>Delete</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
