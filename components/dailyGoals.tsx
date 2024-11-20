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
import { useMutation, useQuery } from "@tanstack/react-query";
import supabase from "@/lib/supabase/client";
import { intToHex } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { TrashIcon } from "lucide-react";

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
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .is("completed_at", null);
      if (error) {
        throw error;
      }

      return data as { id: number; name: string; colour: number }[];
    },
  });

  useEffect(() => {
    setGoals(initialGoals);
  }, [initialGoals]);

  const createGoal = useMutation({
    mutationFn: async (goal: {
      date: string;
      id: number;
      description: string;
      is_completed: boolean;
      notes: string;
      project_id: number | null;
    }) => {
      const response = await fetch(`/api/goals`, {
        method: "POST",
        body: JSON.stringify({
          goals: goal,
        }),
      });

      if (!response.ok) {
        return null;
      }

      const newGoal = {
        ...goal,
        project: projects?.find((project) => project.id === goal.project_id),
      };

      return newGoal;
    },
    onSuccess: (data) => {
      if (data) {
        setGoals([...goals, data]);
        setNewGoal("");
      }
    },
  });

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
        // Remove project from request object
        goals: newGoals.map(({ project, ...goal }) => goal),
      }),
    });
  };

  const deleteGoal = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/goals`, {
        method: "DELETE",
        body: JSON.stringify({ id, date }),
      });

      const newGoals = goals.filter((goal) => goal.id !== id);
      setGoals(newGoals);
    },
  });

  return (
    <section className="flex flex-col pt-8 gap-y-2">
      <h2 className="text-2xl font-semibold">Today&apos;s Goals</h2>

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

            <div
              className="hover:bg-slate-100 rounded-md p-1"
              onClick={() => deleteGoal.mutate(goal.id)}
            >
              <TrashIcon className="w-4 h-4" />
            </div>
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
          <Button
            onClick={() =>
              createGoal.mutate({
                id: goals.length + 1,
                date: date,
                description: newGoal,
                is_completed: false,
                notes: "",
                project_id: projectId === "-" ? null : parseInt(projectId),
              })
            }
          >
            Add
          </Button>
        </div>
      )}
    </section>
  );
}

export default DailyGoals;
