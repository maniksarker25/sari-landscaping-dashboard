import * as React from "react";
import { toast } from "sonner";
import { Mail, MoreHorizontal, Trash2, Archive, CheckCheck, MailOpen } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { MessageStatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useMessagesStore } from "@/lib/messages-store";
import { formatDateTime } from "@/lib/utils";
import type { ContactMessage } from "@/types";

export default function MessagesPage() {
  const items = useMessagesStore((s) => s.items);
  const setStatus = useMessagesStore((s) => s.setStatus);
  const remove = useMessagesStore((s) => s.remove);

  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ContactMessage | null>(null);

  const filtered = [...items]
    .sort((a, b) => +new Date(b.receivedAt) - +new Date(a.receivedAt))
    .filter((m) => [m.name, m.email, m.message, m.service].join(" ").toLowerCase().includes(search.toLowerCase()));

  function openMessage(message: ContactMessage) {
    setSelected(message);
    if (message.status === "new") setStatus(message.id, "read");
  }

  function handleDelete(message: ContactMessage) {
    remove(message.id);
    toast.success(`Message from "${message.name}" deleted`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Contact form submissions from your website."
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search messages..." className="max-w-sm" />

      {filtered.length === 0 ? (
        <EmptyState icon={Mail} title="No messages found" description="Try a different search term." />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((message) => (
                <TableRow
                  key={message.id}
                  className="cursor-pointer"
                  onClick={() => openMessage(message)}
                >
                  <TableCell>
                    <p className={message.status === "new" ? "font-semibold" : "font-medium"}>{message.name}</p>
                    <p className="text-xs text-muted-foreground">{message.email}</p>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate text-sm text-muted-foreground">{message.message}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{message.service.replace(/-/g, " ")}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(message.receivedAt)}</TableCell>
                  <TableCell>
                    <MessageStatusBadge status={message.status} />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Row actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setStatus(message.id, "read")}>
                          <MailOpen className="h-4 w-4" /> Mark as read
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus(message.id, "replied")}>
                          <CheckCheck className="h-4 w-4" /> Mark as replied
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus(message.id, "archived")}>
                          <Archive className="h-4 w-4" /> Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(message)}
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

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>
                  {selected.email}
                  {selected.phone ? ` · ${selected.phone}` : ""} · {formatDateTime(selected.receivedAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Service of interest
                  </p>
                  <p className="mt-1 text-sm capitalize">{selected.service.replace(/-/g, " ")}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Message</p>
                  <p className="mt-1 text-sm leading-relaxed">{selected.message}</p>
                </div>
                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${selected.email}`}>Reply by email</a>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setStatus(selected.id, "replied")}>
                    <CheckCheck className="h-3.5 w-3.5" /> Mark as replied
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setStatus(selected.id, "archived")}>
                    <Archive className="h-3.5 w-3.5" /> Archive
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this message?"
        description="This will permanently remove the message."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </div>
  );
}
