import { Link } from "wouter";
import { useProjects } from "@/lib/store";
import type { ProjectStatus } from "@/lib/store";
import { StatusBadge, PriorityBadge, TypeBadge, EffortBadge, DeviceBadge } from "@/components/project-badges";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, User, Calendar } from "lucide-react";

const COLUMNS: { status: ProjectStatus; topColor: string }[] = [
  { status: "Planning", topColor: "border-t-blue-400" },
  { status: "In Progress", topColor: "border-t-orange-400" },
  { status: "Review", topColor: "border-t-purple-400" },
  { status: "On Hold", topColor: "border-t-gray-400" },
  { status: "Completed", topColor: "border-t-green-400" },
];

export default function Board() {
  const { projects } = useProjects();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Board</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Projects organized by status</p>
        </div>
        <Link href="/projects/new">
          <Button data-testid="button-new-project-board" className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(({ status, topColor }) => {
          const col = projects.filter((p) => p.status === status);
          return (
            <div key={status} className="flex-shrink-0 w-72">
              <div className="flex items-center gap-2 mb-3">
                <StatusBadge status={status} />
                <span className="text-xs font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {col.length}
                </span>
              </div>

              <div
                className={`min-h-96 rounded-xl border-2 border-t-4 border-border bg-muted/30 p-3 space-y-2.5 ${topColor}`}
              >
                {col.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-xs text-muted-foreground">No projects here</p>
                  </div>
                ) : (
                  col.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      data-testid={`card-board-${project.id}`}
                    >
                      <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-border/60 mb-2.5">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-semibold text-sm leading-tight">{project.name}</span>
                            <PriorityBadge priority={project.priority} />
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                            {project.description}
                          </p>
                          <div className="flex items-center gap-1.5 flex-wrap mb-2">
                            <TypeBadge type={project.type} />
                            <EffortBadge effort={project.effort} />
                            {project.device && <DeviceBadge device={project.device} />}
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 font-medium">
                              <User className="w-3 h-3" />
                              {project.owner.split(" ")[0]}
                            </span>
                            {project.deadline && (
                              <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                                <Calendar className="w-3 h-3" />
                                {new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
