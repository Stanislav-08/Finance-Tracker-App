import { useEffect, useState } from "react";
import {
  getTotalBalance,
  getTotalSavings,
  getMonthlyContribution,
  getTransactions,
} from "../services/accountService";
import { supabase } from "../lib/supabase";

interface Transaction {
  id: string;
  amount: number | string;
  type: string;
  merchant: string | null;
  description: string | null;
  date: string;
}

export function useDashboardData() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const [
          balance,
          savings,
          contribution,
          transactions,
        ] = await Promise.all([
          getTotalBalance(user.id),
          getTotalSavings(user.id),
          getMonthlyContribution(user.id),
          getTransactions(user.id),
        ]);

        setTotalBalance(Number(balance));
        setTotalSavings(Number(savings));
        setMonthlyContribution(Number(contribution));

        const totalIncome = transactions
          .filter(
            (transaction: Transaction) =>
              transaction.type === "income"
          )
          .reduce(
            (total: number, transaction: Transaction) =>
              total + Number(transaction.amount),
            0
          );

        const totalExpenses = transactions
          .filter(
            (transaction: Transaction) =>
              transaction.type === "expense"
          )
          .reduce(
            (total: number, transaction: Transaction) =>
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
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return {
    totalBalance,
    totalSavings,
    monthlyContribution,
    income,
    expenses,
    loading,
  };
}