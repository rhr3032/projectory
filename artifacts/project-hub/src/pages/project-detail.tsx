import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useProjects } from "@/lib/store";
import type { ProjectStatus, ProjectType, ProjectPriority, ProjectEffort, ProjectDevice } from "@/lib/store";
import { StatusBadge, PriorityBadge, TypeBadge, EffortBadge, DeviceBadge } from "@/components/project-badges";
import { RichTextEditor, RichTextDisplay } from "@/components/rich-text-editor";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  ArrowLeft, Pencil, Trash2, Save, X, User, Calendar, Tag,
  ExternalLink, Link2, Plus, Building2, Phone,
} from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Required").max(100),
  status: z.enum(["Planning", "In Progress", "Review", "Completed", "On Hold"]),
  type: z.enum(["UI/UX Design", "Web App", "Mobile App"]),
  owner: z.string().min(1, "Required"),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  effort: z.enum(["XS", "S", "M", "L", "XL"]),
  device: z.enum(["Desktop", "Mobile", "Tablet", "TV", "POS", "Other"]).optional(),
  description: z.string().min(1, "Required"),
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

function formatDate(d?: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

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
          device: project.device,
          description: project.description,
          startDate: project.startDate || "",
          endDate: project.endDate || "",
          deadline: project.deadline || "",
          clientName: project.clientName || "",
          clientContact: project.clientContact || "",
          previewLink: project.previewLink || "",
          resourceLinks: project.resourceLinks?.map((url) => ({ url })) || [],
          overview: project.overview || "",
          businessGoal: project.businessGoal || "",
          targetAudience: project.targetAudience || "",
          competitors: project.competitors || "",
          tags: project.tags?.join(", ") || "",
        }
      : undefined,
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "resourceLinks" });

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
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditing(true)}>
              <Pencil className="w-3.5 h-3.5" /> Edit
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60">
                <Trash2 className="w-3.5 h-3.5" /> Delete
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
                  onClick={() => { deleteProject(project.id); navigate("/projects"); }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {editing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                          <SelectItem value="Web App">Web App</SelectItem>
                          <SelectItem value="Mobile App">Mobile App</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                  )} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField control={form.control} name="priority" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                  )} />
                  <FormField control={form.control} name="effort" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Effort</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
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
                  )} />
                  <FormField control={form.control} name="device" render={({ field }) => (
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
                  )} />
                </div>

                <FormField control={form.control} name="owner" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <FormField control={form.control} name="startDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="endDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="deadline" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="clientName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Acme Corp" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="clientContact" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email / Phone</FormLabel>
                      <FormControl><Input placeholder="hello@acme.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="previewLink" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preview Link</FormLabel>
                    <FormControl><Input placeholder="https://preview.yourproject.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium leading-none">Resource Links</label>
                    <Button type="button" variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => append({ url: "" })}>
                      <Plus className="w-3 h-3" /> Add Link
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-start gap-2">
                        <FormField control={form.control} name={`resourceLinks.${index}.url`} render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl><Input placeholder="https://figma.com/file/..." {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive flex-shrink-0" onClick={() => remove(index)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                    {fields.length === 0 && (
                      <p className="text-xs text-muted-foreground py-1">No resource links yet.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="overview" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Overview</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A concise 1–2 sentence summary of this project." className="resize-none" rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="businessGoal" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Goal</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What business outcome does this project achieve?" className="resize-none" rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="targetAudience" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Who is this project designed for?" className="resize-none" rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="competitors" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competitors <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g. Notion, Linear, Asana" className="resize-none" rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField control={form.control} name="tags" render={({ field }) => (
                  <FormItem>
                    <FormControl><Input placeholder="design, mobile, core (comma-separated)" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-3 pb-6">
              <Button type="button" variant="outline" className="gap-1.5" onClick={cancelEdit}>
                <X className="w-3.5 h-3.5" /> Cancel
              </Button>
              <Button type="submit" className="gap-1.5">
                <Save className="w-3.5 h-3.5" /> Save Changes
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="space-y-4">
          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Type", value: <TypeBadge type={project.type} /> },
              { label: "Status", value: <StatusBadge status={project.status} /> },
              { label: "Priority", value: <PriorityBadge priority={project.priority} /> },
              { label: "Effort", value: <EffortBadge effort={project.effort} /> },
              {
                label: "Device",
                value: project.device ? <DeviceBadge device={project.device} /> : <span className="text-sm text-muted-foreground">Not set</span>,
              },
              {
                label: "Owner",
                value: (
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <User className="w-3.5 h-3.5 text-muted-foreground" /> {project.owner}
                  </span>
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

          {/* Dates */}
          {(project.startDate || project.endDate || project.deadline) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {project.startDate && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Start</p>
                      <p className="font-medium">{formatDate(project.startDate)}</p>
                    </div>
                  )}
                  {project.endDate && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">End</p>
                      <p className="font-medium">{formatDate(project.endDate)}</p>
                    </div>
                  )}
                  {project.deadline && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Deadline</p>
                      <p className="font-medium text-orange-600 dark:text-orange-400">{formatDate(project.deadline)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Client */}
          {(project.clientName || project.clientContact) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3 h-3" /> Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm">
                  {project.clientName && (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{project.clientName}</span>
                    </div>
                  )}
                  {project.clientContact && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{project.clientContact}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextDisplay html={project.description} />
            </CardContent>
          </Card>

          {/* Preview & Resources */}
          {(project.previewLink || (project.resourceLinks && project.resourceLinks.length > 0)) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Link2 className="w-3 h-3" /> Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.previewLink && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Preview</p>
                    <a
                      href={project.previewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {project.previewLink}
                    </a>
                  </div>
                )}
                {project.resourceLinks && project.resourceLinks.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Resources</p>
                    <div className="space-y-1">
                      {project.resourceLinks.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                        >
                          <Link2 className="w-3 h-3 flex-shrink-0" />
                          {url}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Project Strategy */}
          {(project.overview || project.businessGoal || project.targetAudience || project.competitors) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.overview && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">Overview</p>
                    <p className="text-sm leading-relaxed">{project.overview}</p>
                  </div>
                )}
                {project.businessGoal && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">Business Goal</p>
                    <p className="text-sm leading-relaxed">{project.businessGoal}</p>
                  </div>
                )}
                {project.targetAudience && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">Target Audience</p>
                    <p className="text-sm leading-relaxed">{project.targetAudience}</p>
                  </div>
                )}
                {project.competitors && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">Competitors</p>
                    <p className="text-sm leading-relaxed">{project.competitors}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tags */}
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
                    <Badge key={tag} variant="secondary" className="text-xs font-medium">{tag}</Badge>
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
