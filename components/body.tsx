import { formatDate } from "@/lib/date";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DatePicker } from "./datepicker";
import { DashboardGetResponse } from "@/app/api/dashboard/route";
import WeeklyMetrics from "./weeklyMetrics";
import DailyMetrics from "./dailyMetrics";

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
        <>
          <WeeklyMetrics data={data.weekInfo} />
          <DailyMetrics data={data.todayInfo} />
        </>
      ) : (
        <p>No data for this date</p>
      )}
    </main>
  );
}

export default Body;
