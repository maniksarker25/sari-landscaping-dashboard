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
import { faqFormSchema, type FaqFormValues } from "@/lib/validations";
import { useFaqsStore } from "@/lib/content-stores";
import { generateId } from "@/lib/utils";
import type { FaqItem } from "@/types";

interface FaqFormDialogProps {
  open: boolean;
  faq?: FaqItem;
  onOpenChange: (open: boolean) => void;
}

const categoryLabels: Record<FaqFormValues["category"], string> = {
  general: "General",
  pools: "Pools",
  landscaping: "Landscaping",
  maintenance: "Maintenance",
  pricing: "Pricing",
};

export function FaqFormDialog({ open, faq, onOpenChange }: FaqFormDialogProps) {
  const add = useFaqsStore((s) => s.add);
  const update = useFaqsStore((s) => s.update);
  const isEditing = !!faq;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: { question: "", answer: "", category: "general", status: "draft" },
  });

  React.useEffect(() => {
    if (open) {
      reset(
        faq
          ? { question: faq.question, answer: faq.answer, category: faq.category, status: faq.status }
          : { question: "", answer: "", category: "general", status: "draft" }
      );
    }
  }, [open, faq, reset]);

  const status = watch("status");
  const category = watch("category");

  async function onSubmit(values: FaqFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (isEditing && faq) {
      update(faq.id, { ...values, updatedAt: new Date().toISOString() });
      toast.success("FAQ updated");
    } else {
      add({ id: generateId("faq"), ...values, updatedAt: new Date().toISOString() });
      toast.success("FAQ added");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this question and answer." : "Add a new question and answer."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input id="question" {...register("question")} />
            {errors.question && <p className="text-xs text-destructive">{errors.question.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea id="answer" rows={4} {...register("answer")} />
            {errors.answer && <p className="text-xs text-destructive">{errors.answer.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(value) => setValue("category", value as FaqFormValues["category"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? "Save changes" : "Add FAQ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
