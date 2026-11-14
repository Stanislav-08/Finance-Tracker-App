import { useState } from "react";
import TransactionsTable from "../layouts/components/TransactionsTable.tsx";
import AddTransactionForm from "../layouts/components/AddTransactionForm.tsx";
import "./TransactionsPage.css";

function TransactionsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="transactions-page">
      <section className="page-title">
        <h1>Transactions</h1>
      </section>
      <AddTransactionForm onCreated={() => setRefreshKey((k) => k + 1)} />
      <TransactionsTable key={refreshKey} full />
    </div>
  );
}

export default TransactionsPage;
