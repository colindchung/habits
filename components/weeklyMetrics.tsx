import { Label } from "./ui/label";
import { Progress } from "./ui/progress";

const WEEKLY_GOALS = {
  PUSHUPS: 500,
  PULLUPS: 75,
  RUN_METERS: 15000,
  BIKE_METERS: 30000,
};

interface WeeklyMetricsProps {
  data: {
    pushups: number;
    pullups: number;
    run_meters: number;
    bike_meters: number;
  };
}

function WeeklyMetrics({ data }: WeeklyMetricsProps) {
  return (
    <section className="pt-8">
      <h2 className="text-xl font-semibold">Weekly Fitness Goals</h2>

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
            Biking ({data.bike_meters}/{WEEKLY_GOALS.BIKE_METERS})
          </Label>
          <div className="flex flex-row items-center space-x-4">
            <Progress
              value={(100 * data.bike_meters) / WEEKLY_GOALS.BIKE_METERS}
              className="bg-zinc-300 w-48"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default WeeklyMetrics;
