import { Link } from "wouter";
import { useProjects } from "@/lib/store";
import type { ProjectStatus, ProjectPriority, ProjectType } from "@/lib/store";
import { StatusBadge, PriorityBadge, TypeBadge } from "@/components/project-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const STATUS_ORDER: ProjectStatus[] = ["In Progress", "Review", "Planning", "On Hold", "Completed"];

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-bold mt-1" style={{ fontFamily: "var(--app-font-display)" }}>{value}</p>
          </div>
          <div className={`p-2.5 rounded-xl ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { projects } = useProjects();

  const stats = {
    total: projects.length,
    inProgress: projects.filter((p) => p.status === "In Progress").length,
    completed: projects.filter((p) => p.status === "Completed").length,
    critical: projects.filter((p) => p.priority === "Critical").length,
  };

  const byStatus = STATUS_ORDER.map((s) => ({
    status: s,
    count: projects.filter((p) => p.status === s).length,
  })).filter((x) => x.count > 0);

  const byType: Record<ProjectType, number> = {
    "UI/UX Design": projects.filter((p) => p.type === "UI/UX Design").length,
    "Web App": projects.filter((p) => p.type === "Web App").length,
    "Mobile App": projects.filter((p) => p.type === "Mobile App").length,
  };

  const recent = [...projects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const critical = projects.filter((p) => p.priority === "Critical" && p.status !== "Completed").slice(0, 3);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {projects.length} project{projects.length !== 1 ? "s" : ""} across your workspace
          </p>
        </div>
        <Link href="/projects/new">
          <Button data-testid="button-new-project-dashboard" className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Projects" value={stats.total} icon={FolderKanban} color="bg-primary/10 text-primary" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Clock} color="bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} color="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400" />
        <StatCard label="Critical Priority" value={stats.critical} icon={AlertCircle} color="bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">By Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {byStatus.map(({ status, count }) => (
              <div key={status} className="flex items-center justify-between">
                <StatusBadge status={status} />
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">By Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(Object.entries(byType) as [ProjectType, number][]).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <TypeBadge type={type} />
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: stats.total ? `${(count / stats.total) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Critical Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {critical.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No critical items</p>
              </div>
            ) : (
              <div className="space-y-2">
                {critical.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    data-testid={`card-critical-${p.id}`}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/60 transition-colors"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <span className="text-sm font-medium truncate flex-1">{p.name}</span>
                    <StatusBadge status={p.status} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Projects</CardTitle>
          <Link
            href="/projects"
            className="text-xs text-primary font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {recent.map((project) => (
              <div
                key={project.id}
                data-testid={`row-recent-${project.id}`}
                className="flex items-center gap-4 py-3 group"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/projects/${project.id}`}
                    className="font-medium text-sm hover:text-primary transition-colors truncate block"
                  >
                    {project.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{project.description.replace(/<[^>]*>/g, "")}</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                  <TypeBadge type={project.type} />
                  <StatusBadge status={project.status} />
                  <PriorityBadge priority={project.priority} />
                </div>
                <Link href={`/projects/${project.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
