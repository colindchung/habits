import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/client";

export interface Project {
  name: string;
  description: string;
  iconColour: string;
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

// export async function POST(request: Request) {
//   const { name, description, iconColour } = await request.json();
//   const { data, error } = await supabase
//     .from("projects")
//     .upsert([{ name, description, iconColour }]);

//   if (error) {
//     return NextResponse.error(error.message);
//   }

//   return NextResponse.json(data);
// }
