import "./Widgets.css"
import { useDashboardData } from "../../../hooks/useDashboardData";

function Expenses() {
    const { expenses, expenseChange } = useDashboardData();

  return (
  <div className="expenses widget">
            <h2 className="card-title">
              Expenses
            </h2>

            <p className="card-value">
              €{expenses.toFixed(2)}
            </p>

            <div className="card-box">
              <div className="percentage-box">
                <span className="card-percentage">
                  {expenseChange}%
                </span>
              </div>

              <span className="card-text">
                vs last month
              </span>
            </div>
  </div>
  );
}

export default Expenses;