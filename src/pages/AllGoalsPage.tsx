import "./AllGoalsPage.css";
import { useEffect, useState } from "react";
import { getSavingsGoals } from "../services/accountService";
import { supabase } from "../lib/supabase";

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

function AllGoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGoals() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const data = await getSavingsGoals(user.id);

        setGoals(data);
      } catch (error) {
        console.error(
          "Failed to load savings goals:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadGoals();
  }, []);

  if (loading) {
    return <div className="all-goals-page">Loading goals...</div>;
  }

  return (
    <div className="all-goals-page">
      <div className="page-title">
        <h1>All Goals</h1>
      </div>

      {goals.length === 0 ? (
        <p>No savings goals found.</p>
      ) : (
        <div className="goals-list">
          {goals.map((goal) => {
            const target = Number(goal.target);
            const current = Number(goal.current);

            const percentage =
              target > 0
                ? Math.min(
                    100,
                    Math.round((current / target) * 100)
                  )
                : 0;

            return (
              <div
                className="goal-card"
                key={goal.id}
              >
                <div className="goal-header">
                  <div>
                    <h2>{goal.name}</h2>

                    <span>
                      {goal.category.name}
                    </span>
                  </div>

                  <strong>
                    {percentage}%
                  </strong>
                </div>

                <div className="goal-amount">
                  <strong>
                    €{current.toFixed(2)}
                  </strong>

                  <span>
                    of €{target.toFixed(2)}
                  </span>
                </div>

                <div className="progress-bar">
                  <div
                    className="current-progress"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <div className="goal-footer">
                  <span>
                    {goal.deadline
                      ? new Date(
                          goal.deadline
                        ).toLocaleDateString()
                      : "No deadline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AllGoalsPage;