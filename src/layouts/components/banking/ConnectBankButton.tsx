import { useState } from "react";

import { supabase } from "../../lib/supabase";

export default function ConnectBankButton() {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function connectBank() {
    setLoading(true);
    setError("");

    try {
      const {
        data: {
          session,
        },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          "You must be logged in."
        );
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/banking/connect`,
        {
          headers: {
            Authorization:
              `Bearer ${session.access_token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Failed to connect bank."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={connectBank}
        disabled={loading}
      >
        {loading
          ? "Connecting..."
          : "Connect bank account"}
      </button>

      {error && (
        <p>{error}</p>
      )}
    </div>
  );
}