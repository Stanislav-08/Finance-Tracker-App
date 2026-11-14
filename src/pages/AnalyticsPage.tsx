import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { supabase } from "../lib/supabase";
import { getCategories, getTransactions } from "../services/accountService";
import { expensesByCategory } from "../lib/stats";
import MoneyFlowChart from "../layouts/components/MoneyFlowChart";
import "./AnalyticsPage.css";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7", "#ec4899", "#84cc16"];

export default function AnalyticsPage() {
  const [txs, setTxs] = useState<any[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [t, c] = await Promise.all([getTransactions(user.id), getCategories(user.id)]);
      setTxs(t);
      setNames(Object.fromEntries(c.map((x) => [x.id, x.name])));
    })().catch(console.error);
  }, []);

  const now = new Date();
  const data = expensesByCategory(txs, names, now.getMonth(), now.getFullYear());

  return (
    <div className="analytics-page">
      <h1>Analytics</h1>
      <h3>Income vs expenses (6 months)</h3>
      <MoneyFlowChart transactions={txs} />
      <h3>This month's expenses by category</h3>
      {data.length === 0 ? <p>No expenses this month.</p> : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={110}>
                {data.map((d, i) => <Cell key={d.id} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
