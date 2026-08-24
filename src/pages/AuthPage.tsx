import AuthForm from "../components/auth/AuthForm.tsx";

function AuthPage() {
  return (
    <main className="app">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Finance Tracker</h1>
            <p>Manage your finances in one place.</p>
          </div>

          <AuthForm />
        </div>
      </div>
    </main>
  );
}

export default AuthPage;