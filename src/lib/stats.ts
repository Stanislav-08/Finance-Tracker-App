export interface Tx { amount: number | string; type: string; categoryId: string | null; date: string }

export function monthlySeries(txs: Tx[], months = 6) {
  const now = new Date();
  return Array.from({ length: months }, (_, i) => {
    const ref = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    const inMonth = txs.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
    });
    const sum = (type: string) => inMonth.filter((t) => t.type === type).reduce((a, t) => a + Number(t.amount), 0);
    return { month: ref.toLocaleString("en", { month: "short" }), income: sum("income"), expense: sum("expense") };
  });
}

export function expensesByCategory(txs: Tx[], names: Record<string, string>, month: number, year: number) {
  const totals: Record<string, number> = {};
  txs.forEach((t) => {
    const d = new Date(t.date);
    if (t.type !== "expense" || d.getMonth() !== month || d.getFullYear() !== year) return;
    const k = t.categoryId ?? "none";
    totals[k] = (totals[k] ?? 0) + Number(t.amount);
  });
  return Object.entries(totals).map(([id, value]) => ({ id, name: names[id] ?? "Uncategorized", value }));
}
