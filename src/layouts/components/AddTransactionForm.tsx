import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  createTransaction,
  getAccounts,
  getCategories,
  type AccountItem,
  type CategoryItem,
} from "../../services/accountService";

interface Props {
  onCreated: () => void;
}

export default function AddTransactionForm({ onCreated }: Props) {
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const [acc, cats] = await Promise.all([
          getAccounts(user.id),
          getCategories(user.id),
        ]);
        setAccounts(acc);
        setCategories(cats);
        if (acc[0]) setAccountId(acc[0].id);
      } catch (e) {
        console.error(e);
        setError("Could not load accounts/categories.");
      }
    }
    load();
  }, []);

  const visibleCategories = categories.filter((c) => c.type === type);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      await createTransaction(user.id, {
        accountId,
        categoryId: categoryId || undefined,
        amount: Number(amount),
        type,
        merchant: merchant || undefined,
        description: description || undefined,
        date,
      });

      setAmount("");
      setMerchant("");
      setDescription("");
      onCreated();
    } catch (e) {
      console.error(e);
      setError("Failed to save transaction.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} style={{ maxWidth: 520, marginBottom: 24 }}>
      <h3>Add transaction</h3>

      <div className="form-group">
        <label>Type</label>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as "income" | "expense");
            setCategoryId("");
          }}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="form-group">
        <label>Account</label>
        <select value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.currency})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Category</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">— none —</option>
          {visibleCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Amount</label>
        <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Merchant</label>
        <input type="text" value={merchant} onChange={(e) => setMerchant(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Description</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <button className="auth-button" type="submit" disabled={saving || !accountId}>
        {saving ? "Saving..." : "Add transaction"}
      </button>

      {error && <p className="auth-message">{error}</p>}
    </form>
  );
}
