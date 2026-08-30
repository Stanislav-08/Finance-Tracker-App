import "./WalletPage.css";

function WalletPage() {
  return (
    <div className="wallet-page">
      <div className="title-row">
        <div className="goal-icon">
          <img
            src="/src/assets/icons/calendar-icon.svg"
            alt="Icon"
            className="item-icon"
            height="24"
            width="24"
          />
        </div>
        <div className="title-column">
          <h1 className="goal-title">Summer vacation</h1>
          <div className="category-box">
            <span className="category">LEISURE</span>
          </div>
        </div>
      </div>
      <div className="money-row">
        <h3 className="current-amount">€23500</h3>
        <span className="goal-amount">of €25000</span>
      </div>
      <div className="progress-bar">
        <div className="current-progress"></div>
      </div>
      <div className="deadline-row">
        <div className="deadline-box">
          <img
            src="/src/assets/icons/calendar-icon.svg"
            alt="Calendar"
            className="item-icon"
            height="16"
            width="16"
          />
          <span className="time-left">5 month left</span>
        </div>
        <span className="goal-percentage">75%</span>
      </div>
    </div>
  );
}

export default WalletPage;
