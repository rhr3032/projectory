import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useProjects } from "@/lib/store";
import type { ProjectStatus, ProjectType, ProjectPriority, ProjectEffort } from "@/lib/store";
import { StatusBadge, PriorityBadge, TypeBadge, EffortBadge } from "@/components/project-badges";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, Pencil, Trash2, Save, X, User, Calendar, Tag } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Required").max(100),
  status: z.enum(["Planning", "In Progress", "Review", "Completed", "On Hold"]),
  type: z.enum(["UI/UX Design", "Web App", "Mobile App"]),
  owner: z.string().min(1, "Required"),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  effort: z.enum(["XS", "S", "M", "L", "XL"]),
  description: z.string().min(1, "Required"),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const { projects, updateProject, deleteProject } = useProjects();
  const [, navigate] = useLocation();
  const [editing, setEditing] = useState(false);

  const project = projects.find((p) => p.id === params.id);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: project
      ? {
          name: project.name,
          status: project.status,
          type: project.type,
          owner: project.owner,
          priority: project.priority,
          effort: project.effort,
          description: project.description,
          dueDate: project.dueDate || "",
          tags: project.tags?.join(", ") || "",
        }
      : undefined,
  });

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <h2 className="text-xl font-bold mb-2">Project not found</h2>
        <p className="text-sm text-muted-foreground mb-4">This project may have been deleted.</p>
        <Link href="/projects">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const onSubmit = (values: FormValues) => {
    updateProject(project.id, {
      name: values.name,
      status: values.status as ProjectStatus,
      type: values.type as ProjectType,
      owner: values.owner,
      priority: values.priority as ProjectPriority,
      effort: values.effort as ProjectEffort,
      description: values.description,
      dueDate: values.dueDate || undefined,
      tags: values.tags ? values.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
    });
    setEditing(false);
  };

  const cancelEdit = () => {
    form.reset();
    setEditing(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/projects">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Created {new Date(project.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!editing && (
            <Button
              data-testid="button-edit-project"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setEditing(true)}
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                data-testid="button-delete-project"
                variant="outline"
                size="sm"
                className="gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
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
                  onClick={() => {
                    deleteProject(project.id);
                    navigate("/projects");
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {editing ? (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Edit Project</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input data-testid="input-edit-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-edit-type">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                            <SelectItem value="Web App">Web App</SelectItem>
                            <SelectItem value="Mobile App">Mobile App</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-edit-status">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Planning">Planning</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Review">Review</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-edit-priority">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Critical">Critical</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="effort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Effort</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-edit-effort">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="XS">XS</SelectItem>
                            <SelectItem value="S">S</SelectItem>
                            <SelectItem value="M">M</SelectItem>
                            <SelectItem value="L">L</SelectItem>
                            <SelectItem value="XL">XL</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="owner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner</FormLabel>
                        <FormControl>
                          <Input data-testid="input-edit-owner" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea data-testid="input-edit-description" className="resize-none" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input data-testid="input-edit-due-date" type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (comma-separated)</FormLabel>
                        <FormControl>
                          <Input data-testid="input-edit-tags" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" className="gap-1.5" onClick={cancelEdit} data-testid="button-cancel-edit">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </Button>
                  <Button type="submit" className="gap-1.5" data-testid="button-save-edit">
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Type", value: <TypeBadge type={project.type} /> },
              { label: "Status", value: <StatusBadge status={project.status} /> },
              { label: "Priority", value: <PriorityBadge priority={project.priority} /> },
              { label: "Effort", value: <EffortBadge effort={project.effort} /> },
              {
                label: "Owner",
                value: (
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    {project.owner}
                  </span>
                ),
              },
              {
                label: "Due Date",
                value: project.dueDate ? (
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Not set</span>
                ),
              },
            ].map(({ label, value }) => (
              <Card key={label} className="bg-muted/30">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">{label}</p>
                  <div>{value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p data-testid="text-description" className="text-sm leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </CardContent>
          </Card>

          {project.tags && project.tags.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      data-testid={`tag-${tag}`}
                      variant="secondary"
                      className="text-xs font-medium"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
