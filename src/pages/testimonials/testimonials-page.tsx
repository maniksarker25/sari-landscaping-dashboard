import * as React from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, MessageSquareQuote, Star } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTestimonialsStore } from "@/lib/content-stores";
import type { Testimonial } from "@/types";
import { TestimonialFormDialog } from "@/pages/testimonials/testimonial-form-dialog";

export default function TestimonialsPage() {
  const items = useTestimonialsStore((s) => s.items);
  const remove = useTestimonialsStore((s) => s.remove);

  const [search, setSearch] = React.useState("");
  const [formState, setFormState] = React.useState<{ open: boolean; testimonial?: Testimonial }>({ open: false });
  const [deleteTarget, setDeleteTarget] = React.useState<Testimonial | null>(null);

  const filtered = items.filter((t) =>
    [t.name, t.role, t.quote].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(testimonial: Testimonial) {
    remove(testimonial.id);
    toast.success(`Testimonial from "${testimonial.name}" deleted`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Manage client testimonials shown on your website."
        actions={
          <Button onClick={() => setFormState({ open: true })}>
            <Plus className="h-4 w-4" /> Add Testimonial
          </Button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search testimonials..." className="max-w-sm" />

      {filtered.length === 0 ? (
        <EmptyState
          icon={MessageSquareQuote}
          title="No testimonials found"
          description="Try a different search, or add your first testimonial."
          action={
            <Button onClick={() => setFormState({ open: true })}>
              <Plus className="h-4 w-4" /> Add Testimonial
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((testimonial) => (
            <Card key={testimonial.id} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-primary">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <StatusBadge status={testimonial.status} />
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-4 border-t border-border pt-3">
                  <p className="text-sm font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setFormState({ open: true, testimonial })}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(testimonial)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TestimonialFormDialog
        open={formState.open}
        testimonial={formState.testimonial}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete testimonial from "${deleteTarget?.name}"?`}
        description="This will permanently remove the testimonial from your website."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </div>
  );
}
