import { useState } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./Sidebar.css";

const links = [
  ["/dashboard", "Dashboard", "dashboard"], ["/transactions", "Transactions", "transactions"],
  ["/wallet", "Wallet", "wallet"], ["/goals", "Goals", "goals"], ["/budget", "Budget", "budget"],
  ["/subscriptions", "Subscriptions", "calendar"], ["/analytics", "Analytics", "analytics"], ["/settings", "Settings", "settings"],
];

export default function Sidebar() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme ?? "light");
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch { /* ignore */ }
    setTheme(next);
  }
  return (
    <aside className="sidebar">
      <div className="sidebar-logo"><h2>Finance Tracker</h2></div>
      <nav className="sidebar-nav">
        {links.map(([to, label, icon]) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <img src={`/icons/${icon}-icon.svg`} alt="" className="item-icon" width="22" height="22" />{label}
          </NavLink>
        ))}
      </nav>
      <button className="theme-button" onClick={toggle}>{theme === "dark" ? "☀ Light mode" : "☾ Dark mode"}</button>
      <button className="logout-button" onClick={() => supabase.auth.signOut()}>Log out</button>
    </aside>
  );
}
