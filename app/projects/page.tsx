"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProjectsGetResponse } from "../api/projects/route";
import { Button } from "@/components/ui/button";
import { useSessionContext } from "@/contexts/SessionContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HexColorPicker } from "react-colorful";
import { hexToInt, intToHex } from "@/lib/utils";

export default function Projects() {
  const { data, isFetching } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch(`/api/projects`);
      return (await response.json()) as ProjectsGetResponse;
    },
  });

  const createProject = useMutation({
    mutationFn: async (project: {
      name: string;
      description: string;
      colour: string;
    }) => {
      const response = await fetch(`/api/projects`, {
        method: "POST",
        body: JSON.stringify({
          project: {
            name: project.name,
            description: project.description,
            colour: hexToInt(project.colour),
          },
        }),
      });

      return (await response.json()) as ProjectsGetResponse;
    },
  });

  // const completeProject = useMutation({
  //   mutationFn: async (projectId: number) => {
  //     const response = await fetch(`/api/projects`, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         project: {
  //           id: projectId,
  //           completed: true,
  //         },
  //       }),
  //     });

  //     return (await response.json()) as ProjectsGetResponse;
  //   },
  // });

  const session = useSessionContext();
  const [isCreating, setIsCreating] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectColour, setProjectColour] = useState("#000000");

  const handleCreateProject = () => {
    createProject.mutate({ name: projectName, description: projectDescription, colour: projectColour });
  };

  // const handleCompleteProject = (projectId: number) => {
  //   completeProject.mutate(projectId);
  // };

  return (
    <main className="h-full w-full py-8">
      <h2 className="text-xl font-semibold">Projects</h2>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col items-end pt-8">
          {session && (
            <>
            <Button className="border-none rounded py-2 px-3 mb-4" onClick={() => setIsCreating(true)}>
              Create Project
              </Button>
              <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                  </DialogHeader>
                  <form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <Label className="font-semibold">Name</Label>
                      <Input value={projectName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)} />
                    </div>  
                    <div className="flex flex-col gap-1">
                      <Label className="font-semibold">Description</Label>
                      <Input value={projectDescription} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectDescription(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                    <Label className="font-semibold">Colour</Label>
                      <HexColorPicker color={projectColour} onChange={setProjectColour} />
                    </div>
                    <Button className="border-none rounded py-2 px-3" onClick={handleCreateProject}>Create</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colour</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                {/* {
                  session && (
                    <TableHead className="w-16">Actions</TableHead>
                  )
                } */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.projects.map((project) => (
                <TableRow key={project.name}>
                  <TableCell className="w-16">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: intToHex(project.colour) }} />
                  </TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  {/* {
                    session && (
                      <Button variant="ghost" className="p-2" onClick={() => handleCompleteProject(project.id)}>
                        <Check size={16} />
                      </Button>
                    )
                  } */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
