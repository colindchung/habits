import { NextResponse } from "next/server";
import { formatDate, getWeekDatesFromDate } from "@/lib/date";
import supabase from "@/lib/supabase/client";
import { parseUrlQueryParams } from "@/lib/utils";

export interface DashboardGetResponse {
  todayInfo?: {
    pushups: number;
    pullups: number;
    run_meters: number;
    bike_meters: number;
    stretch_html: string;
    strength_html: string;
    smoke: boolean;
    alcohol: boolean;
    edibles: boolean;
  };
  weekInfo: {
    pushups: number;
    pullups: number;
    run_meters: number;
    bike_meters: number;
  };
}

export async function GET(request: Request) {
  let date =
    parseUrlQueryParams(request.url)["date"] ||
    formatDate(new Date(), "YYYY-MM-DD");

  const weekDates = getWeekDatesFromDate(date);

  try {
    const { data: dailyInfoForWeek, error } = await supabase
      .from("daily_notes")
      .select(
        `
          date,
          pushups,
          pullups,
          run_meters,
          bike_meters,
          stretch_html,
          strength_html,
          smoke,
          alcohol,
          edibles,
          pornography,
          youtube,
          pages_read
      `
      )
      .in("date", weekDates);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const todayInfo = dailyInfoForWeek.find((day) => day.date === date);
    const weekInfo = dailyInfoForWeek.reduce(
      (acc, obj) => {
        acc.pushups += obj.pushups;
        acc.pullups += obj.pullups;
        acc.run_meters += obj.run_meters;
        acc.bike_meters += obj.bike_meters;
        return acc;
      },
      { pushups: 0, pullups: 0, run_meters: 0, bike_meters: 0 }
    );

    const response: DashboardGetResponse = {
      todayInfo,
      weekInfo,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
