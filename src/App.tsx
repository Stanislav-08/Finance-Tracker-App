import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";

import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import WalletPage from "./pages/WalletPage";
import GoalsPage from "./pages/GoalsPage";
import BudgetPage from "./pages/BudgetPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import AddGoalPage from "./pages/AddGoalPage";
import AllGoalsPage from "./pages/AllGoalsPage";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {!session ? (
          <Route path="*" element={<AuthPage />} />
        ) : (
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
            path="/transactions"
            element={<TransactionsPage />}
            />

            <Route
            path="/wallet"
            element={<WalletPage />}
            />

            <Route
            path="/goals"
            element={<GoalsPage />}
            />

            <Route
            path="/goals/add"
            element={<AddGoalPage />}
            />

            <Route
            path="/goals/all"
            element={<AllGoalsPage />}
            />

            <Route
            path="/budget"
            element={<BudgetPage />}
            />

            <Route
            path="/analytics"
            element={<AnalyticsPage />}
            />

            <Route
            path="/settings"
            element={<SettingsPage />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

function AuthPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();
    setMessage("");

    if (isRegistering) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) {
    setMessage(error.message);
    return;
  }

  setMessage(
    "Account created. Check your email if confirmation is required."
  );
} else {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setMessage(error.message);
      }
    }
  }

  return (
    <main className="app">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Finance Tracker</h1>

            <p>
              {isRegistering
                ? "Create your account"
                : "Sign in to your account"}
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            {isRegistering && (
  <div className="form-group">
    <label htmlFor="username">
      Username
    </label>

    <input
      id="username"
      type="text"
      value={username}
      onChange={(event) =>
        setUsername(event.target.value)
      }
      required
      minLength={3}
      maxLength={30}
    />
  </div>
)}
            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                minLength={6}
              />
            </div>

            <button
              className="auth-button"
              type="submit"
            >
              {isRegistering
                ? "Create account"
                : "Sign in"}
            </button>

            {message && (
              <p className="auth-message">
                {message}
              </p>
            )}
          </form>

          <div className="auth-footer">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(
                  !isRegistering
                );
                setMessage("");
              }}
            >
              {isRegistering
                ? "Already have an account? Sign in"
                : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;