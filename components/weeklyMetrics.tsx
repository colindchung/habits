import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const WEEKLY_GOALS = {
  PUSHUPS: 250,
  PULLUPS: 50,
  RUN_METERS: 15000,
  BIKE_METERS: 30000,
  PAGES_READ: 100,
};

export interface WeeklyMetricsData {
  pushups: number;
  pullups: number;
  run_meters: number;
  bike_meters: number;
  pages_read: number;
}

interface WeeklyMetricsProps {
  date: string;
  data: WeeklyMetricsData;
  ingredient: string;
}

function WeeklyMetrics({ date, data, ingredient }: WeeklyMetricsProps) {
  const [ingredientInput, setIngredientInput] = useState(ingredient);

  const updateIngredient = useMutation({
    mutationFn: async (ingredient: string) => {
      const response = await fetch("/api/ingredients", {
        method: "POST",
        body: JSON.stringify({
          date,
          ingredient,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to update ingredient");
      } else {
        toast.success("Successfully updated ingredient");
      }
    },
  });

  return (
    <>
      <h2 className="text-2xl font-semibold">Weekly Fitness Goals</h2>
      <div className="flex flex-row flex-wrap gap-8">
        <div>
          <Label>
            Pushups ({data.pushups}/{WEEKLY_GOALS.PUSHUPS})
          </Label>
          <div className="flex flex-row items-center space-x-4">
            <Progress
              value={(100 * data.pushups) / WEEKLY_GOALS.PUSHUPS}
              className="bg-zinc-300 w-48"
            />
          </div>
        </div>
        <div>
          <Label>
            Pullups ({data.pullups}/{WEEKLY_GOALS.PULLUPS})
          </Label>
          <div className="flex flex-row items-center space-x-4">
            <Progress
              value={(100 * data.pullups) / WEEKLY_GOALS.PULLUPS}
              className="bg-zinc-300 w-48"
            />
          </div>
        </div>
        <div>
          <Label>
            Running ({data.run_meters}/{WEEKLY_GOALS.RUN_METERS})
          </Label>
          <div className="flex flex-row items-center space-x-4">
            <Progress
              value={(100 * data.run_meters) / WEEKLY_GOALS.RUN_METERS}
              className="bg-zinc-300 w-48"
            />
          </div>
        </div>
        <div>
          <Label>
            Pages Read ({data.pages_read}/{WEEKLY_GOALS.PAGES_READ})
          </Label>
          <div className="flex flex-row items-center space-x-4">
            <Progress
              value={(100 * data.pages_read) / WEEKLY_GOALS.PAGES_READ}
              className="bg-zinc-300 w-48"
            />
          </div>
        </div>
      </div>
      <div className="pt-8">
        <span className="flex flex-row items-center space-x-2 text-xl">
          <h2 className="font-semibold">Weekly Ingredient:</h2>
          <Input
            className="w-48"
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
          />
          <Button
            onClick={() => updateIngredient.mutate(ingredientInput)}
            disabled={ingredient === ingredientInput}
          >
            Update
          </Button>
        </span>
      </div>
    </>
  );
}

export default WeeklyMetrics;
