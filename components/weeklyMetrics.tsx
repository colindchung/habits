import { Label } from "./ui/label";
import { Progress } from "./ui/progress";

const WEEKLY_GOALS = {
  PUSHUPS: 350,
  PULLUPS: 70,
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
  data: WeeklyMetricsData;
}

function WeeklyMetrics({ data }: WeeklyMetricsProps) {
  return (
    <>
      <h2 className="text-xl font-semibold">Weekly Goals</h2>
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
    </>
  );
}

export default WeeklyMetrics;
