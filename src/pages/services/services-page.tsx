import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, MoreHorizontal, ImageOff } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusBadge } from "@/components/common/status-badge";
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
import { Wrench } from "lucide-react";
import { useServicesStore } from "@/lib/content-stores";
import { formatDate } from "@/lib/utils";
import type { Service } from "@/types";

export default function ServicesPage() {
  const navigate = useNavigate();
  const items = useServicesStore((s) => s.items);
  const remove = useServicesStore((s) => s.remove);

  const [search, setSearch] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<Service | null>(null);

  const filtered = items.filter((service) =>
    [service.title, service.category, service.slug]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  function handleDelete(service: Service) {
    remove(service.id);
    toast.success(`"${service.title}" deleted`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Manage the services listed on your website."
        actions={
          <Button onClick={() => navigate("/services/new")}>
            <Plus className="h-4 w-4" /> Add Service
          </Button>
        }
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search services..."
        className="max-w-sm"
      />
      {filtered.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No services found"
          description="Try a different search, or add your first service."
          action={
            <Button onClick={() => navigate("/services/new")}>
              <Plus className="h-4 w-4" /> Add Service
            </Button>
          }
        />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        {service.featuredImage ? (
                          <img
                            src={service.featuredImage}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageOff className="h-full w-full p-2 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {service.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          /{service.slug} • {service.category}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={service.isPublished ? "published" : "draft"} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(service.updatedAt)}
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
                          onClick={() => navigate(`/services/edit/${service.id}`)}
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(service)}
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

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This will permanently remove the service from your website."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </div>
  );
}
