import React, { createContext, useContext, useState, ReactNode } from "react";

export type ProjectStatus = "Planning" | "In Progress" | "Review" | "Completed" | "On Hold";
export type ProjectType = "UI/UX Design" | "Web App" | "Mobile App";
export type ProjectPriority = "Critical" | "High" | "Medium" | "Low";
export type ProjectEffort = "XS" | "S" | "M" | "L" | "XL";
export type ProjectDevice = "Desktop" | "Mobile" | "Tablet" | "TV" | "POS" | "Other";

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  type: ProjectType;
  owner: string;
  priority: ProjectPriority;
  effort: ProjectEffort;
  device?: ProjectDevice;
  description: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  deadline?: string;
  clientName?: string;
  clientContact?: string;
  previewLink?: string;
  resourceLinks?: string[];
  tags?: string[];
}

const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Design System v2",
    status: "In Progress",
    type: "UI/UX Design",
    owner: "Alex Rivera",
    priority: "High",
    effort: "L",
    device: "Desktop",
    description: "<p>Overhaul the existing design system to support <strong>dark mode</strong> and better accessibility.</p><ul><li>Token architecture revamp</li><li>Component library update</li><li>Figma kit sync</li></ul>",
    createdAt: "2023-09-15T10:00:00Z",
    startDate: "2023-09-15",
    endDate: "2023-11-30",
    deadline: "2023-11-01",
    clientName: "Internal",
    tags: ["system", "figma", "core"]
  },
  {
    id: "proj-2",
    name: "Mobile Banking App",
    status: "Review",
    type: "Mobile App",
    owner: "Sarah Chen",
    priority: "Critical",
    effort: "XL",
    device: "Mobile",
    description: "<p>Complete redesign and native development of the <strong>core banking application</strong>.</p><p>Includes biometric auth, push notifications, and a new transaction feed.</p>",
    createdAt: "2023-05-10T08:30:00Z",
    startDate: "2023-05-10",
    endDate: "2023-12-31",
    deadline: "2023-10-15",
    clientName: "FinCo Ltd",
    clientContact: "contact@finco.com",
    previewLink: "https://preview.finco.app",
    resourceLinks: ["https://figma.com/file/banking-app", "https://docs.finco.app"],
    tags: ["fintech", "react-native", "critical"]
  },
  {
    id: "proj-3",
    name: "Dashboard Analytics",
    status: "Planning",
    type: "Web App",
    owner: "Jordan Lee",
    priority: "Medium",
    effort: "M",
    device: "Desktop",
    description: "<p>Add new analytics charts and data export capabilities to the admin dashboard.</p>",
    createdAt: "2023-10-01T14:20:00Z",
    startDate: "2023-10-15",
    deadline: "2024-01-15",
    clientName: "Acme Corp",
    clientContact: "+1 555 234 5678",
    tags: ["data", "charts"]
  },
  {
    id: "proj-4",
    name: "Redesign Onboarding Flow",
    status: "In Progress",
    type: "UI/UX Design",
    owner: "Alex Rivera",
    priority: "High",
    effort: "S",
    device: "Mobile",
    description: "<p>Streamline the user onboarding process to <strong>reduce drop-off rates</strong> by 40%.</p>",
    createdAt: "2023-09-28T09:15:00Z",
    startDate: "2023-09-28",
    deadline: "2023-10-20",
    tags: ["growth", "ux"]
  },
  {
    id: "proj-5",
    name: "E-commerce Checkout Optimization",
    status: "Completed",
    type: "Web App",
    owner: "Taylor Kim",
    priority: "Critical",
    effort: "L",
    device: "Tablet",
    description: "<p>Implement <strong>one-click checkout</strong> and alternative payment methods including Apple Pay and Google Pay.</p>",
    createdAt: "2023-07-05T11:00:00Z",
    startDate: "2023-07-05",
    endDate: "2023-09-10",
    deadline: "2023-09-10",
    clientName: "ShopFast Inc",
    clientContact: "pm@shopfast.io",
    previewLink: "https://shopfast.io/checkout",
    tags: ["payments", "conversion"]
  },
  {
    id: "proj-6",
    name: "iOS Widgets",
    status: "On Hold",
    type: "Mobile App",
    owner: "Sarah Chen",
    priority: "Low",
    effort: "S",
    device: "Mobile",
    description: "<p>Create home screen widgets for quick account balance viewing.</p>",
    createdAt: "2023-08-12T16:45:00Z",
    tags: ["ios", "nice-to-have"]
  },
  {
    id: "proj-7",
    name: "Marketing Site Refresh",
    status: "Planning",
    type: "UI/UX Design",
    owner: "Jordan Lee",
    priority: "Medium",
    effort: "M",
    device: "Desktop",
    description: "<p>Update the public marketing site with the <em>new brand guidelines</em> and improved conversion pages.</p>",
    createdAt: "2023-10-05T10:30:00Z",
    startDate: "2023-10-15",
    deadline: "2023-12-01",
    clientName: "Brand Co",
    clientContact: "hello@brandco.com",
    tags: ["marketing", "web"]
  },
  {
    id: "proj-8",
    name: "User Preferences Migration",
    status: "In Progress",
    type: "Web App",
    owner: "Taylor Kim",
    priority: "High",
    effort: "M",
    device: "Desktop",
    description: "<p>Move user settings to the new <strong>scalable database architecture</strong>.</p>",
    createdAt: "2023-09-20T13:00:00Z",
    startDate: "2023-09-20",
    deadline: "2023-11-30",
    tags: ["backend", "tech-debt"]
  }
];

interface ProjectsContextType {
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "createdAt">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const addProject = (projectData: Omit<Project, "id" | "createdAt">) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProjectsContext.Provider value={{ projects, addProject, updateProject, deleteProject }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
