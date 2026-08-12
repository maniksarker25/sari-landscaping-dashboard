import * as React from "react";
import { toast } from "sonner";
import {
  Mail,
  MoreHorizontal,
  Trash2,
  Archive,
  CheckCheck,
  MailOpen,
  Loader2,
  Search,
  X,
  ArrowUpDown,
  Phone,
  Tag,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { MessageStatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Pagination } from "@/components/common/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/utils";
import type { ContactMessage } from "@/types";
import {
  useGetContactsQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
  CONTACT_STATUS,
  type GetContactsQueryParams,
} from "@/redux/services/messageApis";

export default function MessagesPage() {
  // Query state parameters
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);
  const [sortBy, setSortBy] = React.useState<string>("createdAt");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    React.useState<string>("");

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const queryParams: GetContactsQueryParams = React.useMemo(() => {
    const params: GetContactsQueryParams = {
      page,
      limit,
      sortBy,
      sortOrder,
    };
    if (statusFilter && statusFilter !== "all") {
      params.status = statusFilter;
    }
    if (debouncedSearchTerm.trim()) {
      params.searchTerm = debouncedSearchTerm.trim();
    }
    return params;
  }, [page, limit, sortBy, sortOrder, statusFilter, debouncedSearchTerm]);

  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useGetContactsQuery(queryParams);

  const [updateContactStatus] = useUpdateContactStatusMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  const [selected, setSelected] = React.useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ContactMessage | null>(
    null,
  );

  // Map API contact response items to ContactMessage
  const items: ContactMessage[] = React.useMemo(() => {
    const apiData = apiResponse?.data;
    if (Array.isArray(apiData)) {
      return apiData.map((item) => ({
        _id: item._id || item.id,
        id: item._id || item.id || "",
        name: item.name,
        email: item.email,
        phone: item.phone || "",
        interestedCategory: item.interestedCategory || "",
        interestedService:
          item.interestedService ||
          item.interestedCategory ||
          "General Inquiry",
        service:
          item.interestedService ||
          item.interestedCategory ||
          "General Inquiry",
        message: item.message,
        status: (item.status as any) || "New",
        receivedAt:
          item.createdAt || item.updatedAt || new Date().toISOString(),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    }
    return [];
  }, [apiResponse]);

  const meta = apiResponse?.meta;
  const totalPages =
    meta?.totalPage || Math.ceil((meta?.total || items.length) / limit) || 1;

  async function openMessage(message: ContactMessage) {
    setSelected(message);
    if (String(message.status).toLowerCase() === "new") {
      try {
        await updateContactStatus({
          id: message.id,
          status: CONTACT_STATUS.Read,
        }).unwrap();
      } catch (err) {
        // silent error handling
      }
    }
  }

  async function handleUpdateStatus(id: string, status: string) {
    try {
      await updateContactStatus({ id, status }).unwrap();
      toast.success(`Message marked as ${status}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  }

  async function handleDelete(message: ContactMessage) {
    try {
      await deleteContact(message.id).unwrap();
      toast.success(`Message from "${message.name}" deleted`);
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to delete message from "${message.name}"`,
      );
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Contact form submissions from your website."
      />

      {/* Toolbar: Search, Status, Sort & Limit */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setDebouncedSearchTerm("");
                setPage(1);
              }}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status, Sort & Limit Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[130px] text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All Statuses
              </SelectItem>
              <SelectItem value="New" className="text-xs">
                New
              </SelectItem>
              <SelectItem value="Read" className="text-xs">
                Read
              </SelectItem>
              <SelectItem value="Replied" className="text-xs">
                Replied
              </SelectItem>
              <SelectItem value="Archived" className="text-xs">
                Archived
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(val) => {
              const [by, order] = val.split("-");
              if (by) setSortBy(by);
              if (order === "asc" || order === "desc") setSortOrder(order);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[160px] text-xs">
              <ArrowUpDown className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc" className="text-xs">
                Newest First
              </SelectItem>
              <SelectItem value="createdAt-asc" className="text-xs">
                Oldest First
              </SelectItem>
              <SelectItem value="name-asc" className="text-xs">
                Name (A-Z)
              </SelectItem>
              <SelectItem value="name-desc" className="text-xs">
                Name (Z-A)
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Limit */}
          <Select
            value={String(limit)}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[95px] text-xs">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10" className="text-xs">
                10 / page
              </SelectItem>
              <SelectItem value="20" className="text-xs">
                20 / page
              </SelectItem>
              <SelectItem value="50" className="text-xs">
                50 / page
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading Skeleton vs Table */}
      {isLoading || isFetching ? (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0"
            >
              <div className="space-y-1.5 w-1/4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No messages found"
          description={
            debouncedSearchTerm
              ? `No messages matching "${debouncedSearchTerm}"`
              : "No contact submissions received yet."
          }
        />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Category & Service</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((message) => {
                const isUnread = String(message.status).toLowerCase() === "new";
                return (
                  <TableRow
                    key={message._id || message.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openMessage(message)}
                  >
                    <TableCell>
                      <p
                        className={
                          isUnread
                            ? "font-semibold text-foreground"
                            : "font-medium"
                        }
                      >
                        {message.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {message.email}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {message.phone ? (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground/70" />
                          {message.phone}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        {message.interestedCategory && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            {message.interestedCategory}
                          </span>
                        )}
                        <span className="text-xs font-medium text-foreground/90">
                          {message.interestedService || message.service}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate text-xs text-muted-foreground">
                        {message.message}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(message.receivedAt)}
                    </TableCell>
                    <TableCell>
                      <MessageStatusBadge status={message.status} />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
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
                            onClick={() =>
                              handleUpdateStatus(
                                message.id,
                                CONTACT_STATUS.Read,
                              )
                            }
                          >
                            <MailOpen className="h-4 w-4 mr-2" /> Mark as read
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(
                                message.id,
                                CONTACT_STATUS.Replied,
                              )
                            }
                          >
                            <CheckCheck className="h-4 w-4 mr-2" /> Mark as
                            replied
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(
                                message.id,
                                CONTACT_STATUS.Archived,
                              )
                            }
                          >
                            <Archive className="h-4 w-4 mr-2" /> Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(message)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
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

      {/* Pagination Controls */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={meta?.total}
        onPageChange={setPage}
        disabled={isFetching}
      />

      {/* Message Details Modal */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>
                  {selected.email}
                  {selected.phone ? ` · ${selected.phone}` : ""} ·{" "}
                  {formatDateTime(selected.receivedAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 rounded-lg border bg-muted/40 p-3 text-xs">
                  {selected.interestedCategory && (
                    <div>
                      <p className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
                        Category
                      </p>
                      <p className="mt-0.5 font-medium text-foreground">
                        {selected.interestedCategory}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
                      Service
                    </p>
                    <p className="mt-0.5 font-medium text-foreground">
                      {selected.interestedService || selected.service}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Message
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground bg-muted/20 p-3 rounded-md border">
                    {selected.message}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${selected.email}`}>Reply by email</a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      handleUpdateStatus(selected.id, CONTACT_STATUS.Replied);
                      setSelected((prev) =>
                        prev
                          ? { ...prev, status: CONTACT_STATUS.Replied }
                          : null,
                      );
                    }}
                  >
                    <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark as replied
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      handleUpdateStatus(selected.id, CONTACT_STATUS.Archived);
                      setSelected((prev) =>
                        prev
                          ? { ...prev, status: CONTACT_STATUS.Archived }
                          : null,
                      );
                    }}
                  >
                    <Archive className="h-3.5 w-3.5 mr-1" /> Archive
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && !isDeleting && setDeleteTarget(null)}
        title="Delete this message?"
        description="This will permanently remove the message."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        loading={isDeleting}
      />
    </div>
  );
}
