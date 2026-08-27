import { useEffect, useState } from "react";
import { getTransactions } from "../../services/accountService";
import { supabase } from "../../lib/supabase";
import "./TransactionsTable.css";

interface Transaction {
  id: string;
  accountId: string;
  categoryId: string | null;
  amount: number | string;
  type: string;
  merchant: string | null;
  description: string | null;
  date: string;
  createdAt: string;
}

function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return;
        }

        const data = await getTransactions(user.id);

        setTransactions(data);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, []);

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  if (transactions.length === 0) {
    return <p>No transactions found.</p>;
  }

  return (
    <div className="transactions-list">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Merchant</th>
            <th>Description</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr className="transaction" key={transaction.id}>
              <td>{transaction.merchant || "Unknown"}</td>

              <td>{transaction.description || "—"}</td>

              <td>{new Date(transaction.date).toLocaleDateString()}</td>

              <td>
                <strong
                  className={
                    transaction.type === "income" ? "income" : "expense"
                  }
                >
                  {transaction.type === "income" ? "+" : "-"}€
                  {Number(transaction.amount).toFixed(2)}
                </strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsTable;
