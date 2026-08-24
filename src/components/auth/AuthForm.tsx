import { useState } from "react";
import { supabase } from "../../lib/supabase";

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isRegistering, setIsRegistering] =
    useState(false);

  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    if (isRegistering) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Account created.");
      return;
    }

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setMessage(error.message);
    }
  }

  function toggleMode() {
    setIsRegistering((current) => !current);
    setMessage("");
  }

  return (
    <>
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
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
          onClick={toggleMode}
        >
          {isRegistering
            ? "Already have an account? Sign in"
            : "Don't have an account? Create one"}
        </button>
      </div>
    </>
  );
}

export default AuthForm;