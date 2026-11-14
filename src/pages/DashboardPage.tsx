import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getTransactions } from "../services/accountService";
import MoneyFlowChart from "../layouts/components/MoneyFlowChart";
import Header from "../layouts/components/Header";
import "./DashboardPage.css";
import TransactionsTable from "../layouts/components/TransactionsTable.tsx";
import "../layouts/components/ScrollbarStyle.css";
import TotalBalance from "../layouts/components/widgets/TotalBalance.tsx";
import Income from "../layouts/components/widgets/Income.tsx";
import Expenses from "../layouts/components/widgets/Expenses.tsx";
import TotalSavings from "../layouts/components/widgets/TotalSavings.tsx";

function DashboardPage() {
  const [txs, setTxs] = useState<any[]>([]);
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => user && getTransactions(user.id)).then((t) => t && setTxs(t)).catch(console.error);
  }, []);

  return (
    <div className="dashboard-page">
      <Header />
      <div className="info-row row">
      <TotalBalance />
      <Income />
      <Expenses />
      <TotalSavings />
      </div>
      <div className="money-row row">
        <div className="money-flow card">
          <h3>Money flow</h3>
          <MoneyFlowChart transactions={txs} />
        </div>
        <div className="budget card">
          <h3>Budget</h3>
        </div>
      </div>
      <div className="money-row row">
        <div className="transactions card">
          <h3>Transactions</h3>
          <TransactionsTable />
        </div>
        <div className="saving-goals card">
          <h3>Saving goals</h3>
        </div>
      </div>
    </div>
  );
}
export default DashboardPage;