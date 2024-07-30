"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { ProjectsGetResponse } from "../api/projects/route";
import { Button } from "@/components/ui/button";
import { useSessionContext } from "@/contexts/SessionContext";

export default function Projects() {
  const { data, isFetching } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch(`/api/projects`);
      return (await response.json()) as ProjectsGetResponse;
    },
  });

  const session = useSessionContext();

  return (
    <main className="h-full w-full py-8">
      <h2 className="text-xl font-semibold">Projects</h2>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col items-end pt-8">
          {session && (
            <Button className="border-none rounded py-2 px-3 mb-4">
              Create Project
            </Button>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Colour</TableHead>
                <TableHead className="w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.projects.map((project) => (
                <TableRow key={project.name}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.iconColour}</TableCell>
                  <TableCell className="w-16">
                    <button className="p-2 bg-slate-100 rounded-sm">
                      Edit
                    </button>
                    <button className="p-2 bg-slate-100 rounded-sm">
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
