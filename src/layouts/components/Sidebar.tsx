import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { supabase } from "../../lib/supabase";

export default function Sidebar() {
async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <aside className="sidebar">
  <div className="sidebar-logo">
    <h2>Finance Tracker</h2>
  </div>

  <nav className="sidebar-nav">
    <NavLink
      to="/dashboard"
      className={({ isActive }) =>
        isActive ? "nav-item active" : "nav-item"
      }
    >
    <img src="/src/assets/icons/dashboard-icon.svg" alt="Dashboard" className="item-icon" height="24" width="24"/>
      Dashboard
    </NavLink>

    <NavLink
      to="/transactions"
      className={({ isActive }) =>
        isActive ? "nav-item active" : "nav-item"
      }
    >
    <img src="/src/assets/icons/transactions-icon.svg" alt="Transactions" className="item-icon" height="24" width="24"/>
      Transactions
    </NavLink>

    <NavLink
      to="/wallet"
      className={({ isActive }) =>
        isActive ? "nav-item active" : "nav-item"
      }
    >
    <img src="/src/assets/icons/wallet-icon.svg" alt="Wallet" className="item-icon" height="24" width="24"/>
      Wallet
    </NavLink>

    <NavLink
      to="/goals"
      className={({ isActive }) =>
        isActive ? "nav-item active" : "nav-item"
      }
    >
    <img src="/src/assets/icons/goals-icon.svg" alt="Goals" className="item-icon" height="24" width="24"/>
      Goals
    </NavLink>

    <NavLink
      to="/budget"
      className={({ isActive }) =>
        isActive ? "nav-item active" : "nav-item"
      }
    >
    <img src="/src/assets/icons/budget-icon.svg" alt="Budget" className="item-icon" height="24" width="24"/>
      Budget
    </NavLink>

    <NavLink
      to="/analytics"
      className={({ isActive }) =>
        isActive ? "nav-item active" : "nav-item"
      }
    >
    <img src="/src/assets/icons/analytics-icon.svg" alt="Analytics" className="item-icon" height="24" width="24"/>
      Analytics
    </NavLink>

    <NavLink
      to="/settings"
      className={({ isActive }) =>
        isActive ? "nav-item active" : "nav-item"
      }
    >
    <img src="/src/assets/icons/settings-icon.svg" alt="Settings" className="item-icon" height="24" width="24"/>
      Settings
    </NavLink>
  </nav>
  <button
        className="logout-button"
        onClick={handleLogout}
      >
        Log out
      </button>
</aside>
  );
}