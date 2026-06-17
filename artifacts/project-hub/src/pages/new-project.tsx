import { useLocation } from "wouter";
import { useProjects } from "@/lib/store";
import type { ProjectStatus, ProjectType, ProjectPriority, ProjectEffort } from "@/lib/store";
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
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "wouter";

const schema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  status: z.enum(["Planning", "In Progress", "Review", "Completed", "On Hold"]),
  type: z.enum(["UI/UX Design", "Web App", "Mobile App"]),
  owner: z.string().min(1, "Owner is required"),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  effort: z.enum(["XS", "S", "M", "L", "XL"]),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewProject() {
  const { addProject } = useProjects();
  const [, navigate] = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      status: "Planning",
      type: "UI/UX Design",
      owner: "",
      priority: "Medium",
      effort: "M",
      description: "",
      dueDate: "",
      tags: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    addProject({
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
    navigate("/projects");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/projects">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New Project</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Fill in the details to create a new project</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input data-testid="input-project-name" placeholder="e.g. Redesign Onboarding Flow" {...field} />
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
                      <FormLabel>Type <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-type">
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
                      <FormLabel>Status <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-status">
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
                      <FormLabel>Priority <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-priority">
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
                      <FormLabel>Effort <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-effort">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="XS">XS — Extra Small</SelectItem>
                          <SelectItem value="S">S — Small</SelectItem>
                          <SelectItem value="M">M — Medium</SelectItem>
                          <SelectItem value="L">L — Large</SelectItem>
                          <SelectItem value="XL">XL — Extra Large</SelectItem>
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
                      <FormLabel>Owner <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input data-testid="input-owner" placeholder="Name" {...field} />
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
                    <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        data-testid="input-description"
                        placeholder="What is this project about? What does success look like?"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
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
                        <Input data-testid="input-due-date" type="date" {...field} />
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
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input data-testid="input-tags" placeholder="design, mobile, core (comma-separated)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Link href="/projects">
                  <Button type="button" variant="outline" data-testid="button-cancel">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="gap-2" data-testid="button-submit-project">
                  <Plus className="w-4 h-4" />
                  Create Project
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
