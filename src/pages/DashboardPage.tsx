import { useEffect, useState } from "react";
import Header from "../layouts/components/Header";
import { getTotalBalance } from "../services/accountService";
import { supabase } from "../lib/supabase";

import "./DashboardPage.css";

interface CardData {
  title: string;
  value: string;
  percentage: string;
  text: string;
}

export default function DashboardPage() {
const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    async function loadBalance() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const balance = await getTotalBalance(user.id);

      setTotalBalance(balance);
    }

    loadBalance();
  }, []);

const dashboardCards: CardData[] = [
  {
    title: "Total balance",
    value: "€"+totalBalance.toFixed(2),
    percentage: "12.2%",
    text: "vs last month",
  },
  {
    title: "Income",
    value: "€0.00",
    percentage: "1%",
    text: "vs last month",
  },
  {
    title: "Expenses",
    value: "€0.00",
    percentage: "8%",
    text: "vs last month",
  },
  {
    title: "Total savings",
    value: "€0.00",
    percentage: "2%",
    text: "vs last month",
  },
];

  return (
    <div className="dashboard-page">
      <Header />
      <div className="dashboard-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <section className={`dashboard-card div${index + 1}`}>
            <h2 className="card-title">{dashboardCards[index].title}</h2>
            <p className="card-value">{dashboardCards[index].value}</p>
            <div className="card-box">
              <div className="percentage-box">
                <span className="card-percentage">
                  {dashboardCards[index].percentage}
                </span>
              </div>
              <span className="card-text">{dashboardCards[index].text}</span>
            </div>
          </section>
        ))}

        <section className="dashboard-card div5">
          <h3>Money flow</h3>
        </section>

        <section className="dashboard-card div6">
          <h3>Budget</h3>
        </section>

        <section className="dashboard-card div7">
          <h3>Recent transactions</h3>
        </section>

        <section className="dashboard-card div8">
          <h3>Savings goals</h3>
        </section>
      </div>
    </div>
  );
}
