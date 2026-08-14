import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { MessageStatusBadge } from "@/components/common/status-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { useGetContactsQuery } from "@/redux/services/messageApis";

export const RecentMessagesCard = React.memo(function RecentMessagesCard() {
  const {
    data: contactsApi,
    isLoading: isContactsLoading,
    isFetching: isContactsFetching,
    isError: isContactsError,
  } = useGetContactsQuery({
    page: 1,
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const recentMessages = useMemo(() => {
    const apiData = contactsApi?.data;
    if (Array.isArray(apiData)) {
      return apiData.slice(0, 5).map((item) => ({
        id: item?._id || item?.id || "",
        name: item?.name || "Anonymous",
        email: item?.email || "",
        phone: item?.phone || "",
        service:
          item?.interestedService ||
          item?.interestedCategory ||
          "General Inquiry",
        message: item?.message || "",
        status: item?.status || "New",
        receivedAt:
          item?.createdAt || item?.updatedAt || new Date().toISOString(),
      }));
    }
    return [];
  }, [contactsApi]);

  const skeletonList = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center justify-between gap-4 rounded-md px-2 py-3"
      >
        <div className="space-y-1.5 min-w-0 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3.5 w-3/4" />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    ));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div>
            <CardTitle>Recent messages</CardTitle>
            <CardDescription>
              The latest contact form submissions.
            </CardDescription>
          </div>
          {isContactsFetching && !isContactsLoading && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          )}
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/messages">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-1">
        {isContactsLoading ? (
          <div className="space-y-2 py-2">{skeletonList}</div>
        ) : isContactsError ? (
          <p className="py-6 text-center text-xs text-destructive">
            Failed to load recent messages.
          </p>
        ) : recentMessages?.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            No recent contact messages found.
          </p>
        ) : (
          recentMessages?.map((message) => (
            <Link
              key={message?.id}
              to="/messages"
              className="flex items-center justify-between gap-4 rounded-md px-2 py-3 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{message?.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {message?.message}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {formatDateTime(message?.receivedAt)}
                </span>
                <MessageStatusBadge status={message?.status || "New"} />
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
});
