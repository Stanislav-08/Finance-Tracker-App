import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./Header.css";

export default function Header() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setName(user?.user_metadata?.username ?? "");
      setEmail(user?.email ?? "");
    });
  }, []);
  return (
    <div className="header">
      <section className="header-row">
        <h1>Welcome{name ? `, ${name}` : ""}</h1>
        <div className="profile-button">
          <img src="/icons/profile-icon.svg" alt="" width="28" height="28" />
          <div className="profile-info"><span>{name}</span><span className="profile-email">{email}</span></div>
        </div>
      </section>
    </div>
  );
}
