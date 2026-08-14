import { useServicesStore } from "@/lib/content-stores";
import type { Service } from "@/types";
import * as React from "react";
import { toast } from "sonner";

export type ServiceCategoryTab = "all" | "Landscaping" | "Pools";

export function useServicesFilter(apiServices?: Service[]) {
  const localItems = useServicesStore((s) => s.items);
  const remove = useServicesStore((s) => s.remove);

  const items = React.useMemo(() => {
    if (apiServices && Array.isArray(apiServices)) {
      return apiServices;
    }
    return localItems;
  }, [apiServices, localItems]);

  const [activeTab, setActiveTab] = React.useState<ServiceCategoryTab>("all");
  const [search, setSearch] = React.useState("");
  const [viewTarget, setViewTarget] = React.useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Service | null>(null);

  const counts = React.useMemo(() => {
    return {
      all: items.length,
      landscaping: items.filter((s) => s.category?.toLowerCase() === "landscaping").length,
      pools: items.filter((s) => s.category?.toLowerCase() === "pools").length,
    };
  }, [items]);

  const filtered = React.useMemo(() => {
    return items.filter((service) => {
      // Category tab filtering
      if (activeTab !== "all" && service.category?.toLowerCase() !== activeTab.toLowerCase()) {
        return false;
      }

      // Search query filtering
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = service.title.toLowerCase().includes(query);
        const matchesCategory = service.category.toLowerCase().includes(query);
        const matchesSlug = service.slug.toLowerCase().includes(query);
        return matchesTitle || matchesCategory || matchesSlug;
      }

      return true;
    });
  }, [items, activeTab, search]);
  // okey
  function handleDelete(service: Service) {
    remove(service?._id as string);
    toast.success(`"${service.title}" deleted`);
    if (deleteTarget?.id === service._id) {
      setDeleteTarget(null);
    }
  }

  return {
    items,
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
  };
}
