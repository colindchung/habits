import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/client";

export interface Goal {
  date: string;
  id: number;
  description: string;
  isCompleted: boolean;
  notes: string;
}

export interface GoalsPutRequest {
  goals: Goal[];
}

export async function POST(request: Request) {
  const { goals } = await request.json();
  const { error } = await supabase.from("daily_goals").upsert(goals);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Successfully updated goals" },
    {
      status: 200,
    }
  );
}
