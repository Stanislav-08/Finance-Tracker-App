import "./Widgets.css"
import { useDashboardData } from "../../../hooks/useDashboardData";

function Income() {
    const { income, incomeChange } = useDashboardData();

  return (
  <div className="income widget">
            <h2 className="card-title">
              Income
            </h2>

            <p className="card-value">
              €{income.toFixed(2)}
            </p>

            <div className="card-box">
              <div className="percentage-box">
                <span className="card-percentage">
                  {incomeChange}%
                </span>
              </div>

              <span className="card-text">
                vs last month
              </span>
            </div>
  </div>
  );
}

export default Income;