import * as React from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  HelpCircle,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetFaqsQuery,
  useDeleteFaqMutation,
  type FaqItemApi,
} from "@/redux/services/manage/faqApi";
import { FaqFormDialog } from "@/pages/faqs/faq-form-dialog";

export default function FaqsPage() {
  const { data: response, isLoading, isError } = useGetFaqsQuery();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const [formState, setFormState] = React.useState<{
    open: boolean;
    faq?: FaqItemApi;
  }>({ open: false });
  const [deleteTarget, setDeleteTarget] = React.useState<FaqItemApi | null>(
    null,
  );

  const faqs = response?.data || [];

  async function handleDelete(faq: FaqItemApi) {
    const id = faq._id || faq.id;
    if (!id) return;
    try {
      await deleteFaq(id).unwrap();
      toast.success("FAQ deleted successfully");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete FAQ");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQs"
        description="Manage frequently asked questions shown on your website."
        actions={
          <Button onClick={() => setFormState({ open: true })}>
            <Plus className="h-4 w-4" /> Add FAQ
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
          Failed to load FAQs. Please try again.
        </div>
      ) : faqs.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No FAQs found"
          description="Add your first question to display here."
          action={
            <Button onClick={() => setFormState({ open: true })}>
              <Plus className="h-4 w-4" /> Add FAQ
            </Button>
          }
        />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Answer</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.map((faq) => {
                const id = faq._id || faq.id;
                return (
                  <TableRow key={id}>
                    <TableCell className="max-w-xs sm:max-w-md">
                      <p className="font-medium text-sm">{faq.question}</p>
                    </TableCell>
                    <TableCell className="max-w-xs sm:max-w-md">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {faq.answer}
                      </p>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Row actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setFormState({ open: true, faq })}
                          >
                            <Pencil className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(faq)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <FaqFormDialog
        open={formState.open}
        faq={formState.faq}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this FAQ?"
        description="This will permanently remove the question from your website."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        loading={isDeleting}
      />
    </div>
  );
}
