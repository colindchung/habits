import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { useSessionContext } from "@/contexts/SessionContext";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useQuery } from "@tanstack/react-query";
import supabase from "@/lib/supabase/client";
import { intToHex } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface DailyGoalsProps {
  date: string;
  initialGoals: {
    date: string;
    id: number;
    description: string;
    is_completed: boolean;
    notes: string;
    project?: {
      id: number;
      name: string;
      colour: number;
    };
  }[];
}

function DailyGoals({ date, initialGoals }: DailyGoalsProps) {
  const [goals, setGoals] = useState(initialGoals);
  const [newGoal, setNewGoal] = useState("");
  const [projectId, setProjectId] = useState<string>("-");

  const session = useSessionContext();

  const { data: projects } = useQuery({
    queryKey: ["projects", "dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) {
        throw error;
      }

      return data as { id: number; name: string; colour: string }[];
    },
  });

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
        project_id: projectId === "-" ? null : parseInt(projectId),
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

  return (
    <section className="flex flex-col pt-8 gap-y-2">
      <h2 className="text-xl font-semibold">Today&apos;s Goals</h2>

      <ul className="pl-4">
        {goals.map((goal) => (
          <li
            key={goal.id}
            className="flex flex-row items-center gap-y-4 gap-x-2"
          >
            <Checkbox
              checked={goal.is_completed}
              disabled={!session}
              onCheckedChange={() => completeGoal(goal.id)}
            />
            {goal.project ? (
              <TooltipProvider>
                <Tooltip delayDuration={50}>
                  <TooltipTrigger>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: intToHex(goal.project.colour) }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{goal.project.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="w-3 h-3" />
            )}
            <p>{goal.description}</p>
          </li>
        ))}
      </ul>

      {session && (
        <div className="flex flex-row items-center gap-x-4 mt-2 max-w-xl">
          <Input
            className="flex-3"
            placeholder="Add a new goal"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
          />
          <Select
            value={projectId}
            onValueChange={(value) => setProjectId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-">-- Select --</SelectItem>
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
