import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useProjects } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FolderKanban,
  Columns3,
  Plus,
  Menu,
  Sun,
  Moon,
  Hexagon,
} from "lucide-react";

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const toggle = () => {
    document.documentElement.classList.toggle("dark");
    setDark((d) => !d);
  };
  return { dark, toggle };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { projects } = useProjects();
  const { dark, toggle } = useDarkMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  const inProgress = projects.filter((p) => p.status === "In Progress").length;

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard", count: null },
    { href: "/projects", icon: FolderKanban, label: "Projects", count: projects.length },
    { href: "/board", icon: Columns3, label: "Board", count: inProgress },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
          <Hexagon className="w-4 h-4" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-semibold text-sm leading-none" style={{ fontFamily: "var(--app-font-display)" }}>Projectory</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Design & Dev Projects</p>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label, count }) => {
          const isActive = href === "/" ? location === "/" : location.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              data-testid={`nav-${label.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors group",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground")} />
              <span className="flex-1">{label}</span>
              {count !== null && (
                <span className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded",
                  isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 pb-4 space-y-2">
        <Separator className="mb-3" />
        <Link href="/projects/new" onClick={() => setMobileOpen(false)}>
          <Button
            data-testid="button-new-project-sidebar"
            className="w-full gap-2"
            size="sm"
          >
            <Plus className="w-3.5 h-3.5" />
            New Project
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-2 text-muted-foreground"
          onClick={toggle}
          data-testid="button-toggle-dark"
        >
          {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          {dark ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden md:flex flex-col w-56 border-r border-border bg-sidebar shrink-0">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 flex flex-col w-56 h-full bg-sidebar border-r border-border shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground">
              <Hexagon className="w-3.5 h-3.5" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-sm" style={{ fontFamily: "var(--app-font-display)" }}>Projectory</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileOpen(true)}>
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
