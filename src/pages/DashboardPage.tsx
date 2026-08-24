import { supabase } from "../lib/supabase";

function DashboardPage() {
  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Finance Tracker</h1>

        <button
          className="auth-secondary-button"
          onClick={handleLogout}
        >
          Log out
        </button>
      </header>

      <section className="dashboard-content">
        <h2>Dashboard</h2>

        <p>
          Your financial overview will appear here.
        </p>
      </section>
    </main>
  );
}

export default DashboardPage;