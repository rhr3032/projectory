import { useLocation, Link } from "wouter";
import { useProjects } from "@/lib/store";
import type { ProjectStatus, ProjectType, ProjectPriority, ProjectEffort, ProjectDevice } from "@/lib/store";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  status: z.enum(["Planning", "In Progress", "Review", "Completed", "On Hold"]),
  type: z.enum(["UI/UX Design", "Web App", "Mobile App"]),
  owner: z.string().min(1, "Owner is required"),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  effort: z.enum(["XS", "S", "M", "L", "XL"]),
  device: z.enum(["Desktop", "Mobile", "Tablet", "TV", "POS", "Other"]).optional(),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  deadline: z.string().optional(),
  clientName: z.string().optional(),
  clientContact: z.string().optional(),
  previewLink: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  resourceLinks: z.array(z.object({ url: z.string().url("Must be a valid URL").or(z.literal("")) })).optional(),
  overview: z.string().optional(),
  businessGoal: z.string().optional(),
  targetAudience: z.string().optional(),
  competitors: z.string().optional(),
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
      device: undefined,
      description: "",
      startDate: "",
      endDate: "",
      deadline: "",
      clientName: "",
      clientContact: "",
      previewLink: "",
      resourceLinks: [],
      overview: "",
      businessGoal: "",
      targetAudience: "",
      competitors: "",
      tags: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "resourceLinks" });

  const onSubmit = (values: FormValues) => {
    addProject({
      name: values.name,
      status: values.status as ProjectStatus,
      type: values.type as ProjectType,
      owner: values.owner,
      priority: values.priority as ProjectPriority,
      effort: values.effort as ProjectEffort,
      device: values.device as ProjectDevice | undefined,
      description: values.description,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
      deadline: values.deadline || undefined,
      clientName: values.clientName || undefined,
      clientContact: values.clientContact || undefined,
      previewLink: values.previewLink || undefined,
      resourceLinks: values.resourceLinks?.map((r) => r.url).filter(Boolean) || undefined,
      overview: values.overview || undefined,
      businessGoal: values.businessGoal || undefined,
      targetAudience: values.targetAudience || undefined,
      competitors: values.competitors || undefined,
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          {/* Core Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Redesign Onboarding Flow" {...field} />
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
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
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
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
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
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
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
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
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
                  name="device"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ""}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Desktop">🖥 Desktop</SelectItem>
                          <SelectItem value="Mobile">📱 Mobile</SelectItem>
                          <SelectItem value="Tablet">📲 Tablet</SelectItem>
                          <SelectItem value="TV">📺 TV</SelectItem>
                          <SelectItem value="POS">🛒 POS</SelectItem>
                          <SelectItem value="Other">⚙️ Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="What is this project about? What does success look like?"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Client */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Acme Corp" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email / Phone</FormLabel>
                      <FormControl><Input placeholder="e.g. hello@acme.com or +1 555 000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="previewLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preview Link</FormLabel>
                    <FormControl><Input placeholder="https://preview.yourproject.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium leading-none">Resource Links</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1.5 text-xs"
                    onClick={() => append({ url: "" })}
                  >
                    <Plus className="w-3 h-3" /> Add Link
                  </Button>
                </div>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2">
                      <FormField
                        control={form.control}
                        name={`resourceLinks.${index}.url`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="https://figma.com/file/..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive flex-shrink-0"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <p className="text-xs text-muted-foreground py-1">No resource links yet. Click "Add Link" to add one.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Strategy */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Overview</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A concise 1–2 sentence summary of what this project is and why it matters."
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Goal</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What business outcome does this project achieve? e.g. Increase conversion by 20%."
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Who is this project designed for? Describe the primary users."
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="competitors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competitors <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List competing products or alternatives, e.g. Notion, Linear, Asana."
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="design, mobile, core (comma-separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3 pb-6">
            <Link href="/projects">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" className="gap-2">
              <Plus className="w-4 h-4" />
              Create Project
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
