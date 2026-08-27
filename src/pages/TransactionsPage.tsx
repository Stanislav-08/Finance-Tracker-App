import TransactionsTable from "../layouts/components/TransactionsTable.tsx";
import "./TransactionsPage.css";

function TransactionsPage() {
  return (
    <div className="transactions-page">
      <section className="page-title">
        <h1>Transactions</h1>
      </section>
        <TransactionsTable />
    </div>
  );
}

export default TransactionsPage;
