import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projectFormSchema, type ProjectFormValues } from "@/lib/validations";
import { useProjectsStore } from "@/lib/content-stores";
import { slugify, generateId } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectFormDialogProps {
  open: boolean;
  project?: Project;
  onOpenChange: (open: boolean) => void;
}

export function ProjectFormDialog({ open, project, onOpenChange }: ProjectFormDialogProps) {
  const add = useProjectsStore((s) => s.add);
  const update = useProjectsStore((s) => s.update);
  const isEditing = !!project;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      category: "",
      location: "",
      year: String(new Date().getFullYear()),
      coverImage: "",
      summary: "",
      scope: "",
      status: "draft",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset(
        project
          ? {
              title: project.title,
              slug: project.slug,
              category: project.category,
              location: project.location,
              year: project.year,
              coverImage: project.coverImage,
              summary: project.summary,
              scope: project.scope.join("\n"),
              status: project.status,
            }
          : {
              title: "",
              slug: "",
              category: "",
              location: "",
              year: String(new Date().getFullYear()),
              coverImage: "",
              summary: "",
              scope: "",
              status: "draft",
            }
      );
    }
  }, [open, project, reset]);

  const status = watch("status");
  const title = watch("title");

  function handleTitleBlur() {
    if (!isEditing && title && !watch("slug")) {
      setValue("slug", slugify(title));
    }
  }

  async function onSubmit(values: ProjectFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const scopeList = values.scope
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (isEditing && project) {
      update(project.id, { ...values, scope: scopeList, updatedAt: new Date().toISOString() });
      toast.success(`"${values.title}" updated`);
    } else {
      add({ id: generateId("proj"), ...values, scope: scopeList, updatedAt: new Date().toISOString() });
      toast.success(`"${values.title}" created`);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Project" : "Add Project"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details for this project." : "Add a completed project to your portfolio."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} onBlur={handleTitleBlur} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register("slug")} />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="Pool & Landscape" {...register("category")} />
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Dubai, UAE" {...register("location")} />
              {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" placeholder="2026" {...register("year")} />
              {errors.year && <p className="text-xs text-destructive">{errors.year.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover image URL</Label>
            <Input id="coverImage" placeholder="https://..." {...register("coverImage")} />
            {errors.coverImage && <p className="text-xs text-destructive">{errors.coverImage.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" rows={3} {...register("summary")} />
            {errors.summary && <p className="text-xs text-destructive">{errors.summary.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="scope">Scope of work (one per line)</Label>
            <Textarea id="scope" rows={3} {...register("scope")} />
            {errors.scope && <p className="text-xs text-destructive">{errors.scope.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value) => setValue("status", value as "published" | "draft")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? "Save changes" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
