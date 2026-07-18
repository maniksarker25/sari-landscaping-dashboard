import * as React from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, HelpCircle, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFaqsStore } from "@/lib/content-stores";
import type { FaqItem } from "@/types";
import { FaqFormDialog } from "@/pages/faqs/faq-form-dialog";

export default function FaqsPage() {
  const items = useFaqsStore((s) => s.items);
  const remove = useFaqsStore((s) => s.remove);

  const [search, setSearch] = React.useState("");
  const [formState, setFormState] = React.useState<{ open: boolean; faq?: FaqItem }>({ open: false });
  const [deleteTarget, setDeleteTarget] = React.useState<FaqItem | null>(null);

  const filtered = items.filter((faq) =>
    [faq.question, faq.answer, faq.category].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(faq: FaqItem) {
    remove(faq.id);
    toast.success("FAQ deleted");
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

      <SearchInput value={search} onChange={setSearch} placeholder="Search FAQs..." className="max-w-sm" />

      {filtered.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No FAQs found"
          description="Try a different search, or add your first question."
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
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="max-w-md">
                    <p className="truncate text-sm font-medium">{faq.question}</p>
                    <p className="truncate text-xs text-muted-foreground">{faq.answer}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {faq.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={faq.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Row actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setFormState({ open: true, faq })}>
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
              ))}
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
      />
    </div>
  );
}
