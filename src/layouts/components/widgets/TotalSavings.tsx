import "./Widgets.css"
import { useDashboardData } from "../../../hooks/useDashboardData";

function TotalSavings() {
    const { totalSavings } = useDashboardData();

  return (
  <div className="total-savings widget">
            <h2 className="card-title">
              Total savings
            </h2>

            <p className="card-value">
              €{totalSavings.toFixed(2)}
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

export default TotalSavings;