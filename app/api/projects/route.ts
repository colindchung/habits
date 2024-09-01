import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/client";

export interface Project {
  name: string;
  description: string;
  colour: number;
}

export interface ProjectsGetResponse {
  projects: Project[];
}

export async function GET() {
  const { data, error } = await supabase.from("projects").select();

  if (error) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }

  return NextResponse.json({ projects: data } as ProjectsGetResponse, {
    status: 200,
  });
}

export async function POST(request: Request) {
  const { project } = await request.json();

  console.log("project", project);
  const { data, error } = await supabase
    .from("projects")
    .upsert(project);

  console.log("data", data);
  console.log("error", error);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
