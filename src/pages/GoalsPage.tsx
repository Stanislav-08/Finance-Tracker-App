import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import MonthlyContribution from "../layouts/components/widgets/MonthlyContribution";
import TotalSavings from "../layouts/components/widgets/TotalSavings";
import {
  addGoal,
  type GoalData,
} from "../layouts/components/widgets/SavingGoals/SavingGoals";
import { getSavingsGoals } from "../services/accountService";
import { supabase } from "../lib/supabase";

import "./GoalsPage.css";

interface SavingsGoal {
  id: string;
  categoryId: string;
  name: string;
  target: number | string;
  current: number | string;
  deadline: string | null;
  category: {
    name: string;
  };
}

function GoalsPage() {
  const navigate = useNavigate();

  const parentRef = useRef<HTMLDivElement>(null);

  const [goals, setGoals] = useState<SavingsGoal[]>([]);

  useEffect(() => {
    async function loadGoals() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const data = await getSavingsGoals(user.id);

        // Only keep the 4 most recent goals
        setGoals(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load savings goals:", error);
      }
    }

    loadGoals();
  }, []);

  useEffect(() => {
    if (!parentRef.current) return;

    parentRef.current.innerHTML = "";

    goals.forEach((goal) => {
      const target = Number(goal.target);
      const current = Number(goal.current);

      const percentage =
        target > 0 ? Math.round((current / target) * 100) : 0;

      const goalData: GoalData = {
        title: goal.name,
        category: goal.category.name.toUpperCase(),
        currentAmount: `€${current.toFixed(2)}`,
        targetAmount: `€${target.toFixed(2)}`,
        percentage,
        timeLeft: goal.deadline
          ? getTimeLeft(goal.deadline)
          : "No deadline",
        iconSrc: "/src/assets/icons/calendar-icon.svg",
      };

      const widgetNode = addGoal(goalData);

      parentRef.current?.appendChild(widgetNode);
    });
  }, [goals]);

  function handleAddGoal() {
    navigate("/goals/add");
  }

  return (
    <div className="goals-page">
      <div className="info-row row">
        <TotalSavings />
        <MonthlyContribution />
      </div>

      <div className="widgets-row row">
        <div className="goals-column column">
          <div className="widget-title">
            <h2>My goals</h2>

            <span className="all-text" onClick={() => navigate("/goals/all")}>
              View all →
            </span>
          </div>

          <div
            className="parent"
            ref={parentRef}
          ></div>

          <div
            className="add-goal widget"
            onClick={handleAddGoal}
          >
            <span>Add a goal</span>
          </div>
        </div>

        <div className="activity-column column">
          <div className="rules widget"></div>

          <div className="activity widget"></div>
        </div>
      </div>
    </div>
  );
}

function getTimeLeft(deadline: string): string {
  const today = new Date();
  const deadlineDate = new Date(deadline);

  const difference =
    deadlineDate.getTime() - today.getTime();

  if (difference <= 0) {
    return "Deadline passed";
  }

  const days = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  if (days < 30) {
    return `${days} day${days === 1 ? "" : "s"} left`;
  }

  const months = Math.ceil(days / 30);

  return `${months} month${months === 1 ? "" : "s"} left`;
}

export default GoalsPage;
