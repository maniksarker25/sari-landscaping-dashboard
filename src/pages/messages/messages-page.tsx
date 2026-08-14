import * as React from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Pagination } from "@/components/common/pagination";
import { MessageToolbar } from "@/components/messages/message-toolbar";
import { MessageTable } from "@/components/messages/message-table";
import { MessageDetailModal } from "@/components/messages/message-detail-modal";
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
  const [deleteContact, { isLoading: isDeleting }] =
    useDeleteContactMutation();

  const [selected, setSelected] = React.useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] =
    React.useState<ContactMessage | null>(null);

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

  const handleOpenMessage = React.useCallback(
    async (message: ContactMessage) => {
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
    },
    [updateContactStatus],
  );

  const handleUpdateStatus = React.useCallback(
    async (id: string, status: string) => {
      try {
        await updateContactStatus({ id, status }).unwrap();
        toast.success(`Message marked as ${status}`);
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to update status");
      }
    },
    [updateContactStatus],
  );

  const handleDelete = React.useCallback(
    async (message: ContactMessage) => {
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
    },
    [deleteContact],
  );

  const handleClearSearch = React.useCallback(() => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setPage(1);
  }, []);

  const handleStatusFilterChange = React.useCallback((status: string) => {
    setStatusFilter(status);
    setPage(1);
  }, []);

  const handleSortChange = React.useCallback(
    (newSortBy: string, newSortOrder: "asc" | "desc") => {
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
      setPage(1);
    },
    [],
  );

  const handleLimitChange = React.useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setSelected(null);
  }, []);

  const handleUpdateSelectedStatus = React.useCallback((status: string) => {
    setSelected((prev) => (prev ? { ...prev, status: status as any } : null));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Contact form submissions from your website."
      />

      <MessageToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={handleClearSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        limit={limit}
        onLimitChange={handleLimitChange}
      />

      <MessageTable
        items={items}
        isLoading={isLoading}
        isFetching={isFetching}
        debouncedSearchTerm={debouncedSearchTerm}
        onOpenMessage={handleOpenMessage}
        onUpdateStatus={handleUpdateStatus}
        onSelectDeleteTarget={setDeleteTarget}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={meta?.total}
        onPageChange={setPage}
        disabled={isFetching}
      />

      <MessageDetailModal
        selected={selected}
        onClose={handleCloseModal}
        onUpdateStatus={handleUpdateStatus}
        onUpdateSelectedStatus={handleUpdateSelectedStatus}
      />

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
