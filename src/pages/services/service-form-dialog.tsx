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
import { serviceFormSchema, type ServiceFormValues } from "@/lib/validations";
import { useServicesStore } from "@/lib/content-stores";
import { slugify, generateId } from "@/lib/utils";
import type { Service } from "@/types";

interface ServiceFormDialogProps {
  open: boolean;
  service?: Service;
  onOpenChange: (open: boolean) => void;
}

export function ServiceFormDialog({ open, service, onOpenChange }: ServiceFormDialogProps) {
  const add = useServicesStore((s) => s.add);
  const update = useServicesStore((s) => s.update);
  const isEditing = !!service;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      description: "",
      heroImage: "",
      features: "",
      status: "draft",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset(
        service
          ? {
              title: service.title,
              slug: service.slug,
              shortDescription: service.shortDescription,
              description: service.description,
              heroImage: service.heroImage,
              features: service.features.join("\n"),
              status: service.status,
            }
          : {
              title: "",
              slug: "",
              shortDescription: "",
              description: "",
              heroImage: "",
              features: "",
              status: "draft",
            }
      );
    }
  }, [open, service, reset]);

  const status = watch("status");
  const title = watch("title");

  function handleTitleBlur() {
    if (!isEditing && title && !watch("slug")) {
      setValue("slug", slugify(title));
    }
  }

  async function onSubmit(values: ServiceFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const featureList = values.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    if (isEditing && service) {
      update(service.id, { ...values, features: featureList, updatedAt: new Date().toISOString() });
      toast.success(`"${values.title}" updated`);
    } else {
      add({
        id: generateId("svc"),
        ...values,
        features: featureList,
        updatedAt: new Date().toISOString(),
      });
      toast.success(`"${values.title}" created`);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Service" : "Add Service"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details for this service." : "Add a new service to your website."}
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

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short description</Label>
            <Input id="shortDescription" {...register("shortDescription")} />
            {errors.shortDescription && (
              <p className="text-xs text-destructive">{errors.shortDescription.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full description</Label>
            <Textarea id="description" rows={3} {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroImage">Hero image URL</Label>
            <Input id="heroImage" placeholder="https://..." {...register("heroImage")} />
            {errors.heroImage && <p className="text-xs text-destructive">{errors.heroImage.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Features (one per line)</Label>
            <Textarea id="features" rows={3} {...register("features")} />
            {errors.features && <p className="text-xs text-destructive">{errors.features.message}</p>}
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
              {isEditing ? "Save changes" : "Create service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
