import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { useSessionContext } from "@/contexts/SessionContext";
import { Button } from "./ui/button";

interface DailyGoalsProps {
  date: string;
  initialGoals: {
    date: string;
    id: number;
    description: string;
    is_completed: boolean;
    notes: string;
  }[];
}

function DailyGoals({ date, initialGoals }: DailyGoalsProps) {
  const [goals, setGoals] = useState(initialGoals);
  const [newGoal, setNewGoal] = useState("");

  const session = useSessionContext();

  useEffect(() => {
    setGoals(initialGoals);
  }, [initialGoals]);

  const addGoal = () => {
    if (!newGoal || newGoal.trim() === "") {
      return;
    }

    const goalRequest = [
      {
        date,
        id: goals.length + 1,
        description: newGoal,
        is_completed: false,
        notes: "",
      },
    ];

    setGoals([...goals, ...goalRequest]);
    setNewGoal("");
    void fetch(`/api/goals`, {
      method: "POST",
      body: JSON.stringify({
        goals: goalRequest,
      }),
    });
  };

  const completeGoal = (id: number) => {
    const newGoals = goals.map((goal) => {
      if (goal.id === id) {
        goal.is_completed = !goal.is_completed;
      }
      return goal;
    });

    setGoals(newGoals);
    void fetch(`/api/goals`, {
      method: "POST",
      body: JSON.stringify({
        goals: newGoals,
      }),
    });
  };

  // const addGoal = (description: string) => {
  //   const newGoal = {
  //     date,
  //     id: goals.length + 1,
  //     description,
  //     is_completed: false,
  //     notes: "",
  //   };

  //   setGoals([...goals, newGoal]);
  //   void fetch(`/api/goals`, {
  //     method: "PUT",
  //     body: JSON.stringify(newGoal),
  //   });
  // };

  return (
    <section className="flex flex-col pt-8 gap-y-2">
      <h2 className="text-xl font-semibold">Today&apos;s Goals</h2>

      <ul className="pl-4">
        {goals.map((goal) => (
          <li key={goal.id} className="flex flex-row items-center gap-4">
            <Checkbox
              checked={goal.is_completed}
              disabled={!session}
              onCheckedChange={() => completeGoal(goal.id)}
            />
            <p>{goal.description}</p>
            {/* TODO: Add Project tags */}
          </li>
        ))}
      </ul>

      {session && (
        <div className="flex flex-row items-center gap-x-4 mt-2 max-w-96">
          <Input
            placeholder="Add a new goal"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
          />
          <Button onClick={addGoal}>Add</Button>
        </div>
      )}

      {/* {session ? (
        <WriteTable data={data} date={date} />
      ) : (
        <ReadOnlyTable data={data} date={date} />
      )} */}
    </section>
  );
}

export default DailyGoals;
