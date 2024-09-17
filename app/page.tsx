"use client";

import { formatDate } from "@/lib/date";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { DatePicker } from "@/components/datepicker";
import { DashboardGetResponse } from "@/app/api/dashboard/route";
import WeeklyMetrics, { WeeklyMetricsData } from "@/components/weeklyMetrics";
import DailyMetrics, { DailyMetricsHandle } from "@/components/dailyMetrics";
import DailyGoals from "@/components/dailyGoals";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const dailyMetricsRef = useRef<DailyMetricsHandle>(null);
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: ["dashboard", date],
    queryFn: async () => {
      const formattedDate = formatDate(date || new Date(), "YYYY-MM-DD");
      const response = await fetch(`/api/dashboard?date=${formattedDate}`);

      return (await response.json()) as DashboardGetResponse;
    },
  });

  const handleSaveMutation = useMutation({
    mutationFn: async (): Promise<{
      newData: DashboardGetResponse | null;
    }> => {
      if (!dailyMetricsRef.current) return { newData: null };
      const data = dailyMetricsRef.current.getTableData();

      // get local date
      const localDate = new Date(date || new Date());
      const formattedDate = formatDate(localDate, "YYYY-MM-DD");

      const response = await fetch("/api/dashboard", {
        method: "POST",
        body: JSON.stringify({
          date: formattedDate,
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

      if (!response.ok) {
        toast.error("Error saving data");
        return { newData: null };
      }

      const previousData = queryClient.getQueryData<DashboardGetResponse>([
        "dashboard",
        date,
      ]);

      if (!previousData) {
        throw new Error("No previous data found");
      }

      return {
        newData: {
          ...previousData,
          todayInfo: data,
          weekInfo: {
            pushups:
              previousData.weekInfo.pushups +
              data.pushups -
              (previousData.todayInfo?.pushups || 0),
            pullups:
              previousData.weekInfo.pullups +
              data.pullups -
              (previousData.todayInfo?.pullups || 0),
            run_meters:
              previousData.weekInfo.run_meters +
              data.run_meters -
              (previousData.todayInfo?.run_meters || 0),
            bike_meters:
              previousData.weekInfo.bike_meters +
              data.bike_meters -
              (previousData.todayInfo?.bike_meters || 0),
            pages_read:
              previousData.weekInfo.pages_read +
              data.pages_read -
              (previousData.todayInfo?.pages_read || 0),
          } as WeeklyMetricsData,
        },
      };
    },
    onSuccess: (data) => {
      toast.success("Updated successfully");

      if (data.newData) {
        queryClient.setQueryData<DashboardGetResponse>(["dashboard", date], {
          ...data.newData,
        });
      }
    },
  });

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
              <Button
                className="py-2 px-3"
                onClick={() => handleSaveMutation.mutateAsync()}
              >
                Save Data
              </Button>
            </div>
          </div>
        ) : (
          <p>No data for this date</p>
        )}
      </section>
      <Toaster position="bottom-center" />
    </main>
  );
}
