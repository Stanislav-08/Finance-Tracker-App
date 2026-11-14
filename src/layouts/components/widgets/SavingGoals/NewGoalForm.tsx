import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../lib/supabase.ts";
import { createSavingsGoal } from "../../../../services/accountService";

import "./NewGoalForm.css";

interface Category {
  id: string;
  name: string;
  icon: string;
}

const categories: Category[] = [
  {
    id: "1",
    name: "Business",
    icon: "/icons/business-icon.svg",
  },
  {
    id: "2",
    name: "Car",
    icon: "/icons/car-icon.svg",
  },
  {
    id: "3",
    name: "Education",
    icon: "/icons/education-icon.svg",
  },
  {
    id: "4",
    name: "Emergency",
    icon: "/icons/emergency-icon.svg",
  },
  {
    id: "5",
    name: "Family",
    icon: "/icons/family-icon.svg",
  },
  {
    id: "6",
    name: "Health",
    icon: "/icons/health-icon.svg",
  },
  {
    id: "7",
    name: "Home",
    icon: "/icons/home-icon.svg",
  },
  {
    id: "8",
    name: "Investment",
    icon: "/icons/investment-icon.svg",
  },
  {
    id: "9",
    name: "Leisure",
    icon: "/icons/leisure-icon.svg",
  },
  {
    id: "14",
    name: "Travel",
    icon: "/icons/travel-icon.svg",
  },
  {
    id: "11",
    name: "Major purchase",
    icon: "/icons/major-purchase-icon.svg",
  },
  {
    id: "13",
    name: "Short term",
    icon: "/icons/short-term-icon.svg",
  },
  {
    id: "10",
    name: "Long term",
    icon: "/icons/long-term-icon.svg",
  },
  {
    id: "12",
    name: "Other",
    icon: "/icons/other-icon.svg",
  },
];

function NewGoalForm() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [goalName, setGoalName] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }

    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User is not authenticated.");
      }

      await createSavingsGoal(
        user.id,
        goalName,
        selectedCategory,
        Number(amount),
        deadline
      );

      navigate("/goals");
    } catch (error) {
      console.error(
        "Failed to create savings goal:",
        error
      );

      alert("Failed to create savings goal.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    navigate("/goals");
  }

  return (
    <form
      className="new-goal-form"
      onSubmit={handleSubmit}
    >
      <div className="title-row">
        <h2>Add new goal</h2>
      </div>

      <div className="name-row">
        <label htmlFor="goal-name">
          Goal name
        </label>

        <input
          id="goal-name"
          type="text"
          placeholder="e.g., New Car, Emergency Fund"
          value={goalName}
          onChange={(event) =>
            setGoalName(event.target.value)
          }
          required
        />
      </div>

      <div className="category-row">
        <label>Select Category</label>

        <div className="category-options">
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={`option ${
                selectedCategory === category.id
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setSelectedCategory(category.id)
              }
            >
              <div className="icon-box">
                <img
                  src={category.icon}
                  alt={category.name}
                  width="16"
                  height="16"
                />
              </div>

              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="amount-row">
        <label htmlFor="goal-amount">
          Saving amount
        </label>

        <input
          id="goal-amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g., 25000"
          value={amount}
          onChange={(event) =>
            setAmount(event.target.value)
          }
          required
        />
      </div>

      <div className="deadline-row">
        <label htmlFor="goal-deadline">
          Target date
        </label>

        <input
          id="goal-deadline"
          type="date"
          value={deadline}
          onChange={(event) =>
            setDeadline(event.target.value)
          }
          required
        />
      </div>

      <div className="finish-row">
        <button
          type="button"
          className="cancel-button"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="finish-button"
          disabled={loading}
        >
          {loading ? "Creating..." : "Finish"}
        </button>
      </div>
    </form>
  );
}

export default NewGoalForm;
