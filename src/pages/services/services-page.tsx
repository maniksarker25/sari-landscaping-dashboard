import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Wrench, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { useServicesFilter } from "@/components/services/use-services-filter";
import { ServicesCategoryTabs } from "@/components/services/services-category-tabs";
import { ServicesTable } from "@/components/services/services-table";
import { ServiceViewDialog } from "@/components/services/service-view-dialog";
import {
  useGetServicesQuery,
  useDeleteServiceMutation,
  usePublishServiceMutation,
  useSaveDraftServiceMutation,
} from "@/redux/services/serviceApis";
import type { Service } from "@/types";

export default function ServicesPage() {
  const navigate = useNavigate();

  // Fetch services from RTK Query server API
  const { data: responseData, isLoading, isFetching } = useGetServicesQuery({});
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const apiServices: Service[] | undefined = React.useMemo(() => {
    const data = responseData?.data;
    if (!data) return undefined;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.services)) return data.services;
    return undefined;
  }, [responseData]);

  const {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    viewTarget,
    setViewTarget,
    deleteTarget,
    setDeleteTarget,
    counts,
    filtered,
    handleDelete: localDelete,
  } = useServicesFilter(apiServices);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget._id || deleteTarget.id;
    try {
      if (targetId) {
        await deleteService(targetId).unwrap();
        toast.success(`Service "${deleteTarget.title}" deleted.`);
      } else {
        localDelete(deleteTarget);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete service.");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (isDeleting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Deleting service...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Manage your Landscaping and Pool services listed on your website."
        actions={
          <Button onClick={() => navigate("/services/new")}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Service
          </Button>
        }
      />

      {/* Category Tabs */}
      <ServicesCategoryTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />

      {/* Search Input & Status Indicator */}
      <div className="flex items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search services by title, category, or slug..."
          className="max-w-md w-full"
        />
        {isFetching && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            Updating...
          </div>
        )}
      </div>

      {/* Table, Loading or Empty State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading services...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No services found"
          description={
            search
              ? "Try adjusting your search or switching categories."
              : `No ${activeTab === "all" ? "" : activeTab} services available yet.`
          }
          action={
            <Button onClick={() => navigate("/services/new")}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Service
            </Button>
          }
        />
      ) : (
        <ServicesTable
          services={filtered}
          onView={(service) => setViewTarget(service)}
          onDelete={(service) => setDeleteTarget(service)}
        />
      )}

      {/* View Details Dialog */}
      <ServiceViewDialog
        service={viewTarget}
        open={!!viewTarget}
        onOpenChange={(open) => !open && setViewTarget(null)}
        onDelete={(service) => setDeleteTarget(service)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This will permanently remove the service from your website."
        onConfirm={confirmDelete}
      />
    </div>
  );
}
