import { formatDate } from "@/lib/date";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DatePicker } from "./datepicker";
import { Progress } from "./ui/progress";
import { Label } from "./ui/label";
import { DashboardGetResponse } from "@/app/api/dashboard/route";

const WEEKLY_GOALS = {
  PUSHUPS: 500,
  PULLUPS: 75,
  RUN_METERS: 15000,
  BIKE_METERS: 30000,
};

function Body() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data, isFetching } = useQuery({
    queryKey: ["dashboard", date],
    queryFn: async () => {
      // const formData = new FormData();
      const formattedDate = formatDate(date || new Date(), "YYYY-MM-DD");
      const response = await fetch(`/api/dashboard?date=${formattedDate}`);

      return (await response.json()) as DashboardGetResponse;
    },
  });

  return (
    <main className="h-full w-full py-8">
      <DatePicker date={date} setDate={setDate} />

      {isFetching ? (
        <p>Loading...</p>
      ) : data ? (
        <section className="pt-8">
          <h2 className="text-xl font-semibold">Weekly Goals</h2>

          <div className="flex flex-row flex-wrap space-x-8">
            <div>
              <Label>
                Pushups ({data.weekInfo.pushups}/{WEEKLY_GOALS.PUSHUPS})
              </Label>
              <div className="flex flex-row items-center space-x-4">
                <Progress
                  value={(100 * data.weekInfo.pushups) / WEEKLY_GOALS.PUSHUPS}
                  className="bg-zinc-300 w-48"
                />
              </div>
            </div>
            <div>
              <Label>
                Pullups ({data.weekInfo.pullups}/{WEEKLY_GOALS.PULLUPS})
              </Label>
              <div className="flex flex-row items-center space-x-4">
                <Progress
                  value={(100 * data.weekInfo.pullups) / WEEKLY_GOALS.PULLUPS}
                  className="bg-zinc-300 w-48"
                />
              </div>
            </div>
            <div>
              <Label>
                Running ({data.weekInfo.run_meters}/{WEEKLY_GOALS.RUN_METERS})
              </Label>
              <div className="flex flex-row items-center space-x-4">
                <Progress
                  value={
                    (100 * data.weekInfo.run_meters) / WEEKLY_GOALS.RUN_METERS
                  }
                  className="bg-zinc-300 w-48"
                />
              </div>
            </div>
            <div>
              <Label>
                Running ({data.weekInfo.bike_meters}/{WEEKLY_GOALS.BIKE_METERS})
              </Label>
              <div className="flex flex-row items-center space-x-4">
                <Progress
                  value={
                    (100 * data.weekInfo.bike_meters) / WEEKLY_GOALS.BIKE_METERS
                  }
                  className="bg-zinc-300 w-48"
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <p>No data for this date</p>
      )}
    </main>
  );
}

export default Body;
