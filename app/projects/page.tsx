"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectsGetResponse } from "../api/projects/route";
import { Button } from "@/components/ui/button";
import { useSessionContext } from "@/contexts/SessionContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HexColorPicker } from "react-colorful";
import { hexToInt, intToHex } from "@/lib/utils";
import { Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/date";

export default function Projects() {
  const queryClient = useQueryClient();

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

  const completeProject = useMutation({
    mutationFn: async (projectId: number) => {
      const localDate = new Date();
      const formattedDate = formatDate(localDate, "YYYY-MM-DD");

      const response = await fetch(`/api/projects`, {
        method: "POST",
        body: JSON.stringify({
          project: {
            id: projectId,
            completed_at: formattedDate,
          },
        }),
      });

      if (!response.ok) {
        return null;
      }

      const currentProject = data?.incompleteProjects.find((project) => project.id === projectId);
      if (currentProject) {
        currentProject.completed_at = formattedDate;

        const newData = {
          completedProjects: [...data?.completedProjects || [], currentProject],
          incompleteProjects: data?.incompleteProjects.filter((project) => project.id !== projectId),
        }

        return newData;
      }      
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(["projects"], data);
      }
    },
  });

  const session = useSessionContext();
  const [isCreating, setIsCreating] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectColour, setProjectColour] = useState("#000000");

  const handleCreateProject = () => {
    createProject.mutate({ name: projectName, description: projectDescription, colour: projectColour });
  };

  return (
    <main className="h-full w-full py-8">

      <span className="flex flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold">Projects</h2>
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
      </span>

      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col items-start pt-2">
          <h2 className="text-lg font-semibold mt-4">Open Projects</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colour</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.incompleteProjects.map((project) => (
                <TableRow key={project.name}>
                  <TableCell className="w-16">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: intToHex(project.colour) }} />
                  </TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  {
                    session && (
                      <TableCell className="w-16">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button variant="ghost" className="p-2" onClick={() => completeProject.mutate(project.id)}>
                                <Check size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Complete Project
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    )
                  }
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <h2 className="text-lg font-semibold mt-4">Completed Projects</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colour</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Completed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.completedProjects.map((project) => (
                <TableRow key={project.name}>
                  <TableCell className="w-16">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: intToHex(project.colour) }} />
                  </TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.completed_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
