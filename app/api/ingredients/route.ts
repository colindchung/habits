import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/client";
import { getWeekDatesFromDate } from "@/lib/date";

export async function POST(request: Request) {
  const { date, ingredient } = await request.json();

  const firstDayOfWeek = getWeekDatesFromDate(date)[0];

  const { error } = await supabase
    .from("weekly_ingredient")
    .upsert({ date: firstDayOfWeek, name: ingredient });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Successfully updated ingredient" });
}
