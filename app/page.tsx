"use client";

import { formatDate } from "@/lib/date";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { DatePicker } from "@/components/datepicker";
import { DashboardGetResponse } from "@/app/api/dashboard/route";
import WeeklyMetrics from "@/components/weeklyMetrics";
import DailyMetrics, { DailyMetricsHandle } from "@/components/dailyMetrics";
import DailyGoals from "@/components/dailyGoals";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const dailyMetricsRef = useRef<DailyMetricsHandle>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["dashboard", date],
    queryFn: async () => {
      // const formData = new FormData();
      const formattedDate = formatDate(date || new Date(), "YYYY-MM-DD");
      const response = await fetch(`/api/dashboard?date=${formattedDate}`);

      return (await response.json()) as DashboardGetResponse;
    },
  });

  const handleSave = async () => {
    if (dailyMetricsRef.current) {
      const data = dailyMetricsRef.current.getTableData();
      console.log(data);

      const response = await fetch("/api/dashboard", {
        method: "POST",
        body: JSON.stringify({
          date,
          pushups: data.pushups,
          pullups: data.pullups,
          run_meters: data.run_meters,
          bike_meters: data.bike_meters,
          stretch_notes: data.stretch_notes,
          cardio_notes: data.cardio_notes,
          strength_notes: data.strength_notes,
          smoke: data.smoke,
          edibles: data.edibles,
          alcohol: data.alcohol,
          pornography: data.pornography,
          youtube: data.youtube,
          pages_read: data.pages_read,
        }),
      });

      if (response.ok) {
        // TODO: Add toast
        console.log("Data saved successfully");
      } else {
        console.error("Error saving data");
      }

      // TODO: Add usemutation
    }
  };

  return (
    <main className="h-full w-full py-8">
      <DatePicker date={date} setDate={setDate} />
      <section className="pt-8">
        {isFetching ? (
          <p>Loading...</p>
        ) : data ? (
          <div className="flex flex-col">
            <WeeklyMetrics data={data.weekInfo} />
            <DailyGoals
              date={formatDate(date || new Date(), "YYYY-MM-DD")}
              initialGoals={data.goals}
            />
            <DailyMetrics
              data={data.todayInfo}
              date={formatDate(date || new Date(), "YYYY-MM-DD")}
              ref={dailyMetricsRef}
            />
            <div className="w-full my-6 text-right">
              <Button className="py-2 px-3" onClick={handleSave}>
                Save Data
              </Button>
            </div>
          </div>
        ) : (
          <p>No data for this date</p>
        )}
      </section>
    </main>
  );
}
