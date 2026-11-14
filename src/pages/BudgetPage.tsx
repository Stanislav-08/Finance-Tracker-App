import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getBudgets, getCategories, getTransactions, saveBudget, type CategoryItem } from "../services/accountService";
import { expensesByCategory } from "../lib/stats";
import "./BudgetPage.css";

export default function BudgetPage() {
  const now = new Date(), month = now.getMonth() + 1, year = now.getFullYear();
  const [cats, setCats] = useState<CategoryItem[]>([]);
  const [limits, setLimits] = useState<Record<string, number>>({});
  const [spent, setSpent] = useState<Record<string, number>>({});
  const [uid, setUid] = useState("");

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUid(user.id);
    const [c, b, t] = await Promise.all([getCategories(user.id), getBudgets(user.id, month, year), getTransactions(user.id)]);
    setCats(c.filter((x) => x.type === "expense"));
    setLimits(Object.fromEntries(b.map((x: any) => [x.categoryId, Number(x.amount)])));
    setSpent(Object.fromEntries(expensesByCategory(t, {}, now.getMonth(), year).map((x) => [x.id, x.value])));
  }, []);

  useEffect(() => { load().catch(console.error); }, [load]);

  async function set(categoryId: string) {
    const v = prompt("Monthly budget (€):", String(limits[categoryId] ?? 0));
    if (v === null || !Number.isFinite(Number(v))) return;
    await saveBudget(uid, categoryId, month, year, Number(v));
    load();
  }

  return (
    <div className="budget-page">
      <h1>Budget — {now.toLocaleString("en", { month: "long", year: "numeric" })}</h1>
      {cats.map((c) => {
        const limit = limits[c.id] ?? 0, used = spent[c.id] ?? 0;
        const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
        return (
          <div key={c.id} className="goal-card" style={{ marginBottom: 12 }}>
            <div className="goal-header"><h2>{c.name}</h2>
              <button onClick={() => set(c.id)}>{limit ? "Edit" : "Set"} budget</button></div>
            <div>€{used.toFixed(2)} of €{limit.toFixed(2)}</div>
            <div className="progress-bar"><div className="current-progress" style={{ width: `${pct}%`, background: used > limit && limit > 0 ? "#ef4444" : undefined }} /></div>
          </div>
        );
      })}
    </div>
  );
}
