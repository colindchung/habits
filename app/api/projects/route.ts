import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/client";

export interface Project {
  id: number;
  name: string;
  description: string;
  colour: number;
  completed_at: string | null;
}

export interface ProjectsGetResponse {
  completedProjects: Project[];
  incompleteProjects: Project[];
}

export async function GET() {
  const { data, error } = await supabase.from("projects").select();

  if (error) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }

  if (data) {
    const completedProjects = data.filter((project) => project.completed_at !== null);
    const incompleteProjects = data.filter((project) => project.completed_at === null);
    return NextResponse.json({ completedProjects, incompleteProjects } as ProjectsGetResponse, {
      status: 200,
    });
  }

  return NextResponse.json({ completedProjects: [], incompleteProjects: [] } as ProjectsGetResponse, {
    status: 200,
  });
}

export async function POST(request: Request) {
  const { project } = await request.json();

  const { error } = await supabase
    .from("projects")
    .upsert(project);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
