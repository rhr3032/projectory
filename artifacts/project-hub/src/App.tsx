import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProjectsProvider } from "@/lib/store";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Projects from "@/pages/projects";
import NewProject from "@/pages/new-project";
import ProjectDetail from "@/pages/project-detail";
import Board from "@/pages/board";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/projects" component={Projects} />
        <Route path="/projects/new" component={NewProject} />
        <Route path="/projects/:id">
          {(params) => <ProjectDetail params={params as { id: string }} />}
        </Route>
        <Route path="/board" component={Board} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ProjectsProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </ProjectsProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
