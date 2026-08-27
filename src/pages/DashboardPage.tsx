import { useEffect, useState } from "react";
import Header from "../layouts/components/Header";
import {
  getTotalBalance,
  getTotalSavings,
  getTransactions,
} from "../services/accountService";
import { supabase } from "../lib/supabase";
import "./DashboardPage.css";
import TransactionsTable from "../layouts/components/TransactionsTable.tsx";
import "../layouts/components/ScrollbarStyle.css";

interface Transaction {
  id: string;
  amount: number | string;
  type: string;
  merchant: string | null;
  description: string | null;
  date: string;
}

interface CardData {
  title: string;
  value: string;
  percentage: string;
  text: string;
}

export default function DashboardPage() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const balance = await getTotalBalance(user.id);
        const savings = await getTotalSavings(user.id);
        const transactions: Transaction[] =
          await getTransactions(user.id);

        setTotalBalance(Number(balance));
        setTotalSavings(Number(savings));

        const totalIncome = transactions
          .filter(
            (transaction) => transaction.type === "income"
          )
          .reduce(
            (total, transaction) =>
              total + Number(transaction.amount),
            0
          );

        const totalExpenses = transactions
          .filter(
            (transaction) => transaction.type === "expense"
          )
          .reduce(
            (total, transaction) =>
              total + Number(transaction.amount),
            0
          );

        setIncome(totalIncome);
        setExpenses(totalExpenses);
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );
      }
    }

    loadDashboardData();
  }, []);

  const dashboardCards: CardData[] = [
    {
      title: "Total balance",
      value: `€${totalBalance.toFixed(2)}`,
      percentage: "12.2%",
      text: "vs last month",
    },
    {
      title: "Income",
      value: `€${income.toFixed(2)}`,
      percentage: "1%",
      text: "vs last month",
    },
    {
      title: "Expenses",
      value: `€${expenses.toFixed(2)}`,
      percentage: "8%",
      text: "vs last month",
    },
    {
      title: "Total savings",
      value: `€${totalSavings.toFixed(2)}`,
      percentage: "2%",
      text: "vs last month",
    },
  ];

  return (
    <div className="dashboard-page">
      <Header />

      <div className="dashboard-grid">
        {dashboardCards.map((card, index) => (
          <section
            key={card.title}
            className={`dashboard-card div${index + 1}`}
          >
            <h2 className="card-title">
              {card.title}
            </h2>

            <p className="card-value">
              {card.value}
            </p>

            <div className="card-box">
              <div className="percentage-box">
                <span className="card-percentage">
                  {card.percentage}
                </span>
              </div>

              <span className="card-text">
                {card.text}
              </span>
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
          <h3>Savings goals</h3>
        </section>

        <section className="dashboard-card div8 custom-scrollbar">
          <h3>Recent transactions</h3>
          <TransactionsTable />
        </section>
      </div>
    </div>
  );
}