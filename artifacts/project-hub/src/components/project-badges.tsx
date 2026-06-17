import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  AlertOctagon,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Minus,
} from "lucide-react";
import type { ProjectStatus, ProjectPriority, ProjectType, ProjectEffort } from "@/lib/store";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const config: Record<ProjectStatus, { label: string; className: string }> = {
    Planning: {
      label: "Planning",
      className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    },
    "In Progress": {
      label: "In Progress",
      className: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
    },
    Review: {
      label: "Review",
      className: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    },
    Completed: {
      label: "Completed",
      className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
    },
    "On Hold": {
      label: "On Hold",
      className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    },
  };
  const c = config[status];
  return (
    <Badge variant="outline" className={cn("font-medium text-xs", c.className)}>
      {c.label}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: ProjectPriority }) {
  const config: Record<ProjectPriority, { icon: React.ReactNode; className: string }> = {
    Critical: {
      icon: <AlertOctagon className="w-3 h-3" />,
      className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    },
    High: {
      icon: <ArrowUp className="w-3 h-3" />,
      className: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
    },
    Medium: {
      icon: <ArrowRight className="w-3 h-3" />,
      className: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
    },
    Low: {
      icon: <ArrowDown className="w-3 h-3" />,
      className: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    },
  };
  const c = config[priority];
  return (
    <Badge variant="outline" className={cn("font-medium text-xs gap-1", c.className)}>
      {c.icon}
      {priority}
    </Badge>
  );
}

export function TypeBadge({ type }: { type: ProjectType }) {
  const config: Record<ProjectType, { label: string; className: string }> = {
    "UI/UX Design": {
      label: "UI/UX Design",
      className: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
    },
    "Web App": {
      label: "Web App",
      className: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
    },
    "Mobile App": {
      label: "Mobile App",
      className: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
    },
  };
  const c = config[type];
  return (
    <Badge variant="outline" className={cn("font-medium text-xs", c.className)}>
      {c.label}
    </Badge>
  );
}

export function EffortBadge({ effort }: { effort: ProjectEffort }) {
  const config: Record<ProjectEffort, string> = {
    XS: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
    S: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
    M: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
    L: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300",
    XL: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
  };
  return (
    <Badge variant="outline" className={cn("font-medium text-xs font-mono", config[effort])}>
      {effort}
    </Badge>
  );
}

export function EffortDots({ effort }: { effort: ProjectEffort }) {
  const levels: Record<ProjectEffort, number> = { XS: 1, S: 2, M: 3, L: 4, XL: 5 };
  const count = levels[effort];
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Minus
          key={i}
          className={cn("w-3 h-2", i <= count ? "text-primary" : "text-muted-foreground/30")}
        />
      ))}
    </div>
  );
}
