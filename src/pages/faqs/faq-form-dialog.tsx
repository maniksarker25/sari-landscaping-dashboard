import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { faqFormSchema, type FaqFormValues } from "@/lib/validations";
import {
  useAddFaqMutation,
  useEditFaqMutation,
  type FaqItemApi,
} from "@/redux/services/manage/faqApi";

interface FaqFormDialogProps {
  open: boolean;
  faq?: FaqItemApi;
  onOpenChange: (open: boolean) => void;
}

export function FaqFormDialog({ open, faq, onOpenChange }: FaqFormDialogProps) {
  const [addFaq, { isLoading: isAdding }] = useAddFaqMutation();
  const [editFaq, { isLoading: isEditing }] = useEditFaqMutation();
  const isEditMode = !!faq;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: { question: "", answer: "", category: "general", status: "published" },
  });

  React.useEffect(() => {
    if (open) {
      reset(
        faq
          ? {
              question: faq.question || "",
              answer: faq.answer || "",
              category: (faq.category as any) || "general",
              status: (faq.status as any) || "published",
            }
          : { question: "", answer: "", category: "general", status: "published" }
      );
    }
  }, [open, faq, reset]);

  const isSubmitting = isAdding || isEditing;

  async function onSubmit(values: FaqFormValues) {
    try {
      if (isEditMode && faq) {
        const id = faq._id || faq.id;
        if (!id) return;
        await editFaq({
          id,
          data: {
            question: values.question,
            answer: values.answer,
          },
        }).unwrap();
        toast.success("FAQ updated successfully");
      } else {
        await addFaq({
          question: values.question,
          answer: values.answer,
        }).unwrap();
        toast.success("FAQ added successfully");
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update this question and answer." : "Add a new question and answer."}
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Save changes" : "Add FAQ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
