import "./Widgets.css"
import { useDashboardData } from "../../../hooks/useDashboardData";

function TotalBalance() {
    const { totalBalance } = useDashboardData();

  return (
  <div className="total-balance widget">
            <h2 className="card-title">
              Total balance
            </h2>

            <p className="card-value">
              €{totalBalance.toFixed(2)}
            </p>

            <div className="card-box">
              <div className="percentage-box">
                <span className="card-percentage">
                  11%
                </span>
              </div>

              <span className="card-text">
                vs last month
              </span>
            </div>
  </div>
  );
}

export default TotalBalance;