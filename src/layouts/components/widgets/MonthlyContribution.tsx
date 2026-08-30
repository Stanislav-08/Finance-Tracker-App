import "./Widgets.css"
import { useDashboardData } from "../../../hooks/useDashboardData";

function MonthlyContribution() {
    const { monthlyContribution } = useDashboardData();

  return (
  <div className="expenses widget">
            <h2 className="card-title">
              Monthly contribution
            </h2>

            <p className="card-value">
              €{monthlyContribution.toFixed(2)}
            </p>

            <div className="card-box">
              <div className="percentage-box">
                <span className="card-percentage">
                  2%
                </span>
              </div>

              <span className="card-text">
                vs last month
              </span>
            </div>
  </div>
  );
}

export default MonthlyContribution;