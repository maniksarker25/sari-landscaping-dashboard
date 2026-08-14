import React, { useMemo } from "react";
import {
  Wrench,
  FolderKanban,
  Mail,
  MessageSquareQuote,
  Loader2,
} from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardMetaResponse } from "@/redux/services/metaApis";

interface DashboardStatCardsProps {
  metaResponse?: DashboardMetaResponse;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export const DashboardStatCards = React.memo(function DashboardStatCards({
  metaResponse,
  isLoading,
  isFetching,
  isError,
}: DashboardStatCardsProps) {
  const meta = useMemo(() => metaResponse?.data, [metaResponse]);

  const activeServicesValue = useMemo(() => {
    if (isLoading) return <Skeleton className="h-8 w-16" />;
    if (isError) return "0";
    return (
      <span className="flex items-center gap-2">
        {meta?.totalServices ?? 0}
        {isFetching && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        )}
      </span>
    );
  }, [isLoading, isError, meta?.totalServices, isFetching]);

  const galleryItemsValue = useMemo(() => {
    if (isLoading) return <Skeleton className="h-8 w-16" />;
    if (isError) return "0";
    return (
      <span className="flex items-center gap-2">
        {meta?.totalGallery ?? 0}
        {isFetching && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        )}
      </span>
    );
  }, [isLoading, isError, meta?.totalGallery, isFetching]);

  const newMessagesValue = useMemo(() => {
    if (isLoading) return <Skeleton className="h-8 w-16" />;
    if (isError) return "0";
    return (
      <span className="flex items-center gap-2">
        {meta?.totalNewMessages ?? 0}
        {isFetching && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        )}
      </span>
    );
  }, [isLoading, isError, meta?.totalNewMessages, isFetching]);

  const testimonialsValue = useMemo(() => {
    if (isLoading) return <Skeleton className="h-8 w-16" />;
    if (isError) return "0";
    return (
      <span className="flex items-center gap-2">
        {meta?.totalTestimonial ?? 0}
        {isFetching && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        )}
      </span>
    );
  }, [isLoading, isError, meta?.totalTestimonial, isFetching]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Active Services"
        value={activeServicesValue}
        icon={Wrench}
      />
      <StatCard
        label="Gallery Items"
        value={galleryItemsValue}
        icon={FolderKanban}
      />
      <StatCard
        label="New Messages"
        value={newMessagesValue}
        icon={Mail}
      />
      <StatCard
        label="Testimonials"
        value={testimonialsValue}
        icon={MessageSquareQuote}
      />
    </div>
  );
});
