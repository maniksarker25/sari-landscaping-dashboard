import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Star, StarHalf, Upload, X, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";
import {
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
} from "@/redux/services/testimonialApis";

interface TestimonialFormDialogProps {
  open: boolean;
  testimonial?: Testimonial;
  onOpenChange: (open: boolean) => void;
}

export function TestimonialFormDialog({ open, testimonial, onOpenChange }: TestimonialFormDialogProps) {
  const isEditing = !!testimonial;
  const [createTestimonial, { isLoading: isCreating }] = useCreateTestimonialMutation();
  const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation();

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: { name: "", role: "", roleOrLocation: "", quote: "", rating: 5, status: "Published" },
  });

  React.useEffect(() => {
    if (open) {
      const initialRole = testimonial?.roleOrLocation || testimonial?.role || "";
      const rawStatus = String(testimonial?.status || "").toLowerCase();
      const initialStatus = rawStatus === "draft" ? "Draft" : "Published";

      reset(
        testimonial
          ? {
              name: testimonial.name,
              role: initialRole,
              roleOrLocation: initialRole,
              quote: testimonial.quote,
              rating: testimonial.rating,
              status: initialStatus as any,
            }
          : { name: "", role: "", roleOrLocation: "", quote: "", rating: 5, status: "Published" }
      );
      setSelectedFile(null);
      setPreviewUrl(testimonial?.image || null);
    }
  }, [open, testimonial, reset]);

  const status = watch("status");
  const rating = watch("rating");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  async function onSubmit(values: TestimonialFormValues) {
    try {
      const formData = new FormData();
      const roleText = values.roleOrLocation || values.role || "";
      
      const payloadData = {
        name: values.name,
        roleOrLocation: roleText,
        quote: values.quote,
        rating: Number(values.rating),
        status: values.status === "published" || values.status === "Published" ? "Published" : "Draft",
      };

      formData.append("data", JSON.stringify(payloadData));

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (isEditing && testimonial) {
        const id = testimonial._id || testimonial.id;
        await updateTestimonial({ id, formData }).unwrap();
        toast.success(`Testimonial from "${values.name}" updated successfully`);
      } else {
        await createTestimonial(formData).unwrap();
        toast.success(`Testimonial from "${values.name}" added successfully`);
      }

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save testimonial. Please try again.");
    }
  }

  const isSubmitting = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update client testimonial details." : "Add a new client testimonial."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Jane Doe" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleOrLocation">Role / Location</Label>
              <Input
                id="roleOrLocation"
                placeholder="Dhaka / Homeowner"
                {...register("roleOrLocation")}
              />
              {errors.roleOrLocation && (
                <p className="text-xs text-destructive">{errors.roleOrLocation.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote">Quote</Label>
            <Textarea id="quote" rows={3} placeholder="Excellent service..." {...register("quote")} />
            {errors.quote && <p className="text-xs text-destructive">{errors.quote.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Rating ({rating || 5} Stars)</Label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((starIndex) => {
                  const currentRating = Number(rating || 5);
                  const isFull = currentRating >= starIndex;
                  const isHalf = currentRating >= starIndex - 0.5 && currentRating < starIndex;

                  return (
                    <div key={starIndex} className="relative select-none">
                      {isFull ? (
                        <Star className="h-6 w-6 fill-primary text-primary transition-colors" />
                      ) : isHalf ? (
                        <StarHalf className="h-6 w-6 fill-primary text-primary transition-colors" />
                      ) : (
                        <Star className="h-6 w-6 text-muted-foreground/30 transition-colors" />
                      )}

                      {/* Left half button for half star */}
                      <button
                        type="button"
                        className="absolute inset-y-0 left-0 w-1/2 cursor-pointer z-10 opacity-0"
                        onClick={() => setValue("rating", starIndex - 0.5, { shouldValidate: true, shouldDirty: true })}
                        title={`${starIndex - 0.5} stars`}
                        aria-label={`${starIndex - 0.5} stars`}
                      />

                      {/* Right half button for full star */}
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 w-1/2 cursor-pointer z-10 opacity-0"
                        onClick={() => setValue("rating", starIndex, { shouldValidate: true, shouldDirty: true })}
                        title={`${starIndex} stars`}
                        aria-label={`${starIndex} stars`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(val) => setValue("status", val as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Client Image</Label>
            {previewUrl ? (
              <div className="relative h-28 w-28 overflow-hidden rounded-md border">
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute right-1 top-1 rounded-full bg-background/80 p-1 text-destructive hover:bg-background"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-3 text-sm hover:bg-accent/50 w-full">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Upload Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Save changes"
              ) : (
                "Add testimonial"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
