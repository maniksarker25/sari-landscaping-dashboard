import * as React from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, MoreHorizontal, Newspaper } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBlogStore } from "@/lib/content-stores";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";
import { BlogFormDialog } from "@/pages/blog/blog-form-dialog";

export default function BlogPage() {
  const items = useBlogStore((s) => s.items);
  const remove = useBlogStore((s) => s.remove);

  const [search, setSearch] = React.useState("");
  const [formState, setFormState] = React.useState<{ open: boolean; post?: BlogPost }>({ open: false });
  const [deleteTarget, setDeleteTarget] = React.useState<BlogPost | null>(null);

  const filtered = items.filter((post) =>
    [post.title, post.category, post.author].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(post: BlogPost) {
    remove(post.id);
    toast.success(`"${post.title}" deleted`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog"
        description="Write and manage articles published to your blog."
        actions={
          <Button onClick={() => setFormState({ open: true })}>
            <Plus className="h-4 w-4" /> New Post
          </Button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search posts..." className="max-w-sm" />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No posts found"
          description="Try a different search, or write your first post."
          action={
            <Button onClick={() => setFormState({ open: true })}>
              <Plus className="h-4 w-4" /> New Post
            </Button>
          }
        />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                        <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{post.title}</p>
                        <p className="truncate text-xs text-muted-foreground">by {post.author}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{post.category}</TableCell>
                  <TableCell>
                    <StatusBadge status={post.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(post.publishedAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Row actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setFormState({ open: true, post })}>
                          <Pencil className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(post)}
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

      <BlogFormDialog
        open={formState.open}
        post={formState.post}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This will permanently remove the post from your blog."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </div>
  );
}
