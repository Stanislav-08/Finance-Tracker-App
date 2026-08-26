import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./Header.css";

export default function Header() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function getUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUsername(user.user_metadata?.username ?? "");
        setEmail(user.email ?? "");
      }
    }

    getUserData();
  }, []);

  return (
    <div className="header">
      <section className="header-row">
        <h1>
          Welcome{username ? `, ${username}` : ""}
        </h1>

        <div className="header-cell">
          <div className="icon-button">
            <img
              src="/src/assets/icons/notifications-icon.svg"
              alt="Notifications"
              width="24"
              height="24"
            />
          </div>

          <div className="profile-button">
            <div className="profile-picture">
              <img
                src="/src/assets/icons/profile-icon.svg"
                alt="Profile"
                width="24"
                height="24"
              />
            </div>

            <div className="profile-info">
              <span className="profile-name">
                {username || "Unknown"}
              </span>

              <span className="profile-email">
                {email || "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="header-row">
        <div className="header-cell">
          <div className="icon-button">
            <img
              src="/src/assets/icons/calendar-icon.svg"
              alt="Calendar"
              width="24"
              height="24"
            />
          </div>

          <div className="icon-button2">
            <span>This Month</span>
          </div>
        </div>

        <div className="header-cell">
          <div className="icon-button2">
            <img
              src="/src/assets/icons/widget-icon.svg"
              alt="Widget"
              width="24"
              height="24"
            />

            <span>Manage widgets</span>
          </div>

          <div className="icon-button2">
            <img
              src="/src/assets/icons/plus-icon.svg"
              alt="Plus"
              width="24"
              height="24"
            />

            <span>Add new widget</span>
          </div>
        </div>
      </section>
    </div>
  );
}