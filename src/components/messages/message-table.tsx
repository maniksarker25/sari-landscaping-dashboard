import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  MoreHorizontal,
  Trash2,
  Archive,
  CheckCheck,
  MailOpen,
  Phone,
  Eye,
} from "lucide-react";
import { MessageStatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { formatDateTime } from "@/lib/utils";
import type { ContactMessage } from "@/types";
import { CONTACT_STATUS } from "@/redux/services/messageApis";

interface MessageTableProps {
  items: ContactMessage[];
  isLoading: boolean;
  isFetching: boolean;
  debouncedSearchTerm: string;
  onOpenMessage: (message: ContactMessage) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onSelectDeleteTarget: (message: ContactMessage) => void;
}

export const MessageTable = React.memo(function MessageTable({
  items,
  isLoading,
  isFetching,
  debouncedSearchTerm,
  onOpenMessage,
  onUpdateStatus,
  onSelectDeleteTarget,
}: MessageTableProps) {
  const navigate = useNavigate();

  const handleNavigateDetail = useCallback(
    (id: string) => {
      navigate(`/messages/${id}`);
    },
    [navigate],
  );

  if (isLoading || isFetching) {
    return (
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
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Mail}
        title="No messages found"
        description={
          debouncedSearchTerm
            ? `No messages matching "${debouncedSearchTerm}"`
            : "No contact submissions received yet."
        }
      />
    );
  }

  return (
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
                onClick={() => onOpenMessage(message)}
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
                        onClick={() => handleNavigateDetail(message.id)}
                      >
                        <Eye className="h-4 w-4 mr-2 text-primary" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onUpdateStatus(
                            message.id,
                            CONTACT_STATUS.Read,
                          )
                        }
                      >
                        <MailOpen className="h-4 w-4 mr-2" /> Mark as read
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onUpdateStatus(
                            message.id,
                            CONTACT_STATUS.Replied,
                          )
                        }
                      >
                        <CheckCheck className="h-4 w-4 mr-2" /> Mark as replied
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onUpdateStatus(
                            message.id,
                            CONTACT_STATUS.Archived,
                          )
                        }
                      >
                        <Archive className="h-4 w-4 mr-2" /> Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onSelectDeleteTarget(message)}
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
  );
});
