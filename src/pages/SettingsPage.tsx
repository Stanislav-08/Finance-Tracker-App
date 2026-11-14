import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  getMonthlyContribution,
  updateMonthlyContribution,
} from "../services/accountService";
import "./SettingsPage.css";

function SettingsPage() {
  const [amount, setAmount] = useState("0");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      try {
        setAmount(String(await getMonthlyContribution(user.id)));
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      await updateMonthlyContribution(user.id, Number(amount));
      setMessage("Saved.");
    } catch (e) {
      console.error(e);
      setMessage("Failed to save.");
    }
  }

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <form className="auth-form" onSubmit={save} style={{ maxWidth: 420 }}>
        <div className="form-group">
          <label htmlFor="mc">Monthly savings contribution (€)</label>
          <input id="mc" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <button className="auth-button" type="submit">Save</button>
        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
}

export default SettingsPage;
