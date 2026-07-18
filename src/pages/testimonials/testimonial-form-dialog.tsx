import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Star } from "lucide-react";
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
import { testimonialFormSchema, type TestimonialFormValues } from "@/lib/validations";
import { useTestimonialsStore } from "@/lib/content-stores";
import { generateId, cn } from "@/lib/utils";
import type { Testimonial } from "@/types";

interface TestimonialFormDialogProps {
  open: boolean;
  testimonial?: Testimonial;
  onOpenChange: (open: boolean) => void;
}

export function TestimonialFormDialog({ open, testimonial, onOpenChange }: TestimonialFormDialogProps) {
  const add = useTestimonialsStore((s) => s.add);
  const update = useTestimonialsStore((s) => s.update);
  const isEditing = !!testimonial;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: { name: "", role: "", quote: "", rating: 5, status: "draft" },
  });

  React.useEffect(() => {
    if (open) {
      reset(
        testimonial
          ? {
              name: testimonial.name,
              role: testimonial.role,
              quote: testimonial.quote,
              rating: testimonial.rating,
              status: testimonial.status,
            }
          : { name: "", role: "", quote: "", rating: 5, status: "draft" }
      );
    }
  }, [open, testimonial, reset]);

  const status = watch("status");
  const rating = watch("rating");

  async function onSubmit(values: TestimonialFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (isEditing && testimonial) {
      update(testimonial.id, { ...values, updatedAt: new Date().toISOString() });
      toast.success(`Testimonial from "${values.name}" updated`);
    } else {
      add({ id: generateId("t"), ...values, updatedAt: new Date().toISOString() });
      toast.success(`Testimonial from "${values.name}" added`);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this client testimonial." : "Add a new client testimonial."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role / Location</Label>
              <Input id="role" placeholder="Homeowner, Al Barari" {...register("role")} />
              {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote">Quote</Label>
            <Textarea id="quote" rows={3} {...register("quote")} />
            {errors.quote && <p className="text-xs text-destructive">{errors.quote.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue("rating", value)}
                  aria-label={`${value} star${value > 1 ? "s" : ""}`}
                >
                  <Star
                    className={cn(
                      "h-6 w-6 transition-colors",
                      value <= rating ? "fill-primary text-primary" : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
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
              {isEditing ? "Save changes" : "Add testimonial"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
