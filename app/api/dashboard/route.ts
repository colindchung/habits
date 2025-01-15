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
    smoke: boolean;
    alcohol: boolean;
    edibles: boolean;
    pornography: boolean;
    youtube: boolean;
    pages_read: number;
  };
  goals: {
    date: string;
    id: number;
    description: string;
    is_completed: boolean;
    notes: string;
  }[];
  weekInfo: {
    pushups: number;
    pullups: number;
    run_meters: number;
    bike_meters: number;
    pages_read: number;
  };
  ingredient: string;
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

    const { data: dailyGoalsForWeek, error: goalsError } = await supabase
      .from("daily_goals")
      .select(
        `
          date,
          id,
          description,
          is_completed,
          notes,
          project_id,
          project:projects (
            id,
            name,
            colour
          )
      `
      )
      .eq("date", date)
      .order("id", { ascending: true });

    if (goalsError) {
      return NextResponse.json({ error: goalsError.message }, { status: 500 });
    }

    const { data: ingredientData, error: ingredientError } = await supabase
      .from("weekly_ingredient")
      .select("name")
      .eq("date", weekDates[0]);

    if (ingredientError) {
      return NextResponse.json(
        { error: ingredientError.message },
        { status: 500 }
      );
    }

    const todayInfo = dailyInfoForWeek.find((day) => day.date === date);
    const weekInfo = dailyInfoForWeek.reduce(
      (acc, obj) => {
        acc.pushups += obj.pushups || 0;
        acc.pullups += obj.pullups || 0;
        acc.run_meters += obj.run_meters || 0;
        acc.bike_meters += obj.bike_meters || 0;
        acc.pages_read += obj.pages_read || 0;
        return acc;
      },
      { pushups: 0, pullups: 0, run_meters: 0, bike_meters: 0, pages_read: 0 }
    );

    const response: DashboardGetResponse = {
      todayInfo,
      goals: dailyGoalsForWeek,
      weekInfo,
      ingredient: ingredientData[0]?.name || "",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

export interface DailyNotesRequestType {
  date: string;
  pushups: number;
  pullups: number;
  run_meters: number;
  bike_meters: number;
  smoke: boolean;
  alcohol: boolean;
  edibles: boolean;
  pornography: boolean;
  youtube: boolean;
  pages_read: number;
}

export async function POST(request: Request) {
  const {
    date,
    pushups,
    pullups,
    run_meters,
    bike_meters,
    smoke,
    alcohol,
    edibles,
    pornography,
    youtube,
    pages_read,
  } = await request.json();

  try {
    const { data, error } = await supabase.from("daily_notes").upsert(
      [
        {
          date,
          pushups,
          pullups,
          run_meters,
          bike_meters,
          smoke,
          alcohol,
          edibles,
          pornography,
          youtube,
          pages_read,
        },
      ],
      {
        onConflict: "date",
      }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Error saving data" }, { status: 500 });
  }
}
