import { useState } from "react";
import { Link } from "wouter";
import { useProjects } from "@/lib/store";
import type { ProjectStatus, ProjectPriority, ProjectType, ProjectDevice } from "@/lib/store";
import { StatusBadge, PriorityBadge, TypeBadge, EffortBadge, DeviceBadge } from "@/components/project-badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  FolderKanban,
  Trash2,
  ArrowRight,
  User,
  Calendar,
  X,
  Building2,
} from "lucide-react";

type SortKey = "name" | "createdAt" | "priority" | "status";

const PRIORITY_ORDER: Record<ProjectPriority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

export default function Projects() {
  const { projects, deleteProject } = useProjects();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "all">("all");
  const [filterType, setFilterType] = useState<ProjectType | "all">("all");
  const [filterPriority, setFilterPriority] = useState<ProjectPriority | "all">("all");
  const [filterDevice, setFilterDevice] = useState<ProjectDevice | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");

  const filtered = projects
    .filter((p) => {
      const q = search.toLowerCase();
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      if (filterType !== "all" && p.type !== filterType) return false;
      if (filterPriority !== "all" && p.priority !== filterPriority) return false;
      if (filterDevice !== "all" && p.device !== filterDevice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "createdAt") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortKey === "priority") return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sortKey === "status") return a.status.localeCompare(b.status);
      return 0;
    });

  const hasFilters = search || filterStatus !== "all" || filterType !== "all" || filterPriority !== "all" || filterDevice !== "all";

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("all");
    setFilterType("all");
    setFilterPriority("all");
    setFilterDevice("all");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{projects.length} total projects</p>
        </div>
        <Link href="/projects/new">
          <Button data-testid="button-new-project-list" className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            data-testid="input-search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as ProjectStatus | "all")}>
          <SelectTrigger data-testid="select-filter-status" className="w-36 h-8 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Review">Review</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={(v) => setFilterType(v as ProjectType | "all")}>
          <SelectTrigger data-testid="select-filter-type" className="w-36 h-8 text-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
            <SelectItem value="Web App">Web App</SelectItem>
            <SelectItem value="Mobile App">Mobile App</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as ProjectPriority | "all")}>
          <SelectTrigger data-testid="select-filter-priority" className="w-36 h-8 text-sm">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterDevice} onValueChange={(v) => setFilterDevice(v as ProjectDevice | "all")}>
          <SelectTrigger data-testid="select-filter-device" className="w-36 h-8 text-sm">
            <SelectValue placeholder="Device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Devices</SelectItem>
            <SelectItem value="Desktop">Desktop</SelectItem>
            <SelectItem value="Mobile">Mobile</SelectItem>
            <SelectItem value="Tablet">Tablet</SelectItem>
            <SelectItem value="TV">TV</SelectItem>
            <SelectItem value="POS">POS</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
          <SelectTrigger data-testid="select-sort" className="w-36 h-8 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Newest First</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground" onClick={clearFilters}>
            <X className="w-3 h-3" /> Clear
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderKanban className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="font-bold text-lg mb-1">No projects found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {hasFilters ? "Try adjusting your filters." : "Create your first project to get started."}
          </p>
          {!hasFilters && (
            <Link href="/projects/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> New Project
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((project) => (
            <Card
              key={project.id}
              data-testid={`card-project-${project.id}`}
              className="group hover:shadow-sm transition-all"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <Link
                        href={`/projects/${project.id}`}
                        className="font-semibold text-sm hover:text-primary transition-colors"
                      >
                        {project.name}
                      </Link>
                      <StatusBadge status={project.status} />
                      <PriorityBadge priority={project.priority} />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{project.description.replace(/<[^>]*>/g, "")}</p>
                    <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {project.owner}
                      </span>
                      {project.clientName && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {project.clientName}
                        </span>
                      )}
                      {project.deadline && (
                        <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-medium">
                          <Calendar className="w-3 h-3" />
                          {new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      )}
                      <TypeBadge type={project.type} />
                      <EffortBadge effort={project.effort} />
                      {project.device && <DeviceBadge device={project.device} />}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          data-testid={`button-delete-${project.id}`}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete project?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete <strong>{project.name}</strong>. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteProject(project.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Link href={`/projects/${project.id}`}>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
