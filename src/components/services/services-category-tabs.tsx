import * as React from "react";
import { LayoutGrid, Trees, Waves } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { ServiceCategoryTab } from "./use-services-filter";

interface ServicesCategoryTabsProps {
  activeTab: ServiceCategoryTab;
  onTabChange: (tab: ServiceCategoryTab) => void;
  counts: {
    all: number;
    landscaping: number;
    pools: number;
  };
}

export function ServicesCategoryTabs({
  activeTab,
  onTabChange,
  counts,
}: ServicesCategoryTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => onTabChange(val as ServiceCategoryTab)}
      className="w-full"
    >
      <TabsList className="h-11 bg-muted/60 p-1">
        <TabsTrigger
          value="all"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
        >
          <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          <span>All Services</span>
          <Badge
            variant={activeTab === "all" ? "default" : "outline"}
            className="ml-1 px-2 py-0 text-[11px] font-semibold"
          >
            {counts.all}
          </Badge>
        </TabsTrigger>

        <TabsTrigger
          value="Landscaping"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
        >
          <Trees className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Landscaping</span>
          <Badge
            variant={activeTab === "Landscaping" ? "default" : "outline"}
            className="ml-1 px-2 py-0 text-[11px] font-semibold"
          >
            {counts.landscaping}
          </Badge>
        </TabsTrigger>

        <TabsTrigger
          value="Pools"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
        >
          <Waves className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <span>Pools</span>
          <Badge
            variant={activeTab === "Pools" ? "default" : "outline"}
            className="ml-1 px-2 py-0 text-[11px] font-semibold"
          >
            {counts.pools}
          </Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
