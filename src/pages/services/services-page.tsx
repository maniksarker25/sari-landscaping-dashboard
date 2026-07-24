import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Wrench } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { useServicesFilter } from "@/components/services/use-services-filter";
import { ServicesCategoryTabs } from "@/components/services/services-category-tabs";
import { ServicesTable } from "@/components/services/services-table";
import { ServiceViewDialog } from "@/components/services/service-view-dialog";

export default function ServicesPage() {
  const navigate = useNavigate();
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
    handleDelete,
  } = useServicesFilter();

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

      {/* Search Input */}
      <div className="flex items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search services by title, category, or slug..."
          className="max-w-md w-full"
        />
      </div>

      {/* Table or Empty State */}
      {filtered.length === 0 ? (
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
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </div>
  );
}
