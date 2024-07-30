"use client";

import { formatDate } from "@/lib/date";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DatePicker } from "@/components/datepicker";
import { DashboardGetResponse } from "@/app/api/dashboard/route";
import WeeklyMetrics from "@/components/weeklyMetrics";
import DailyMetrics from "@/components/dailyMetrics";
import DailyGoals from "@/components/dailyGoals";

export default function Home() {
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
      <section className="pt-8">
        {isFetching ? (
          <p>Loading...</p>
        ) : data ? (
          <>
            <WeeklyMetrics data={data.weekInfo} />
            <DailyGoals
              date={formatDate(date || new Date(), "YYYY-MM-DD")}
              initialGoals={data.goals}
            />
            <DailyMetrics
              data={data.todayInfo}
              date={formatDate(date || new Date(), "YYYY-MM-DD")}
            />
          </>
        ) : (
          <p>No data for this date</p>
        )}
      </section>
    </main>
  );
}
