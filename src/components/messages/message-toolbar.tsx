import React, { useCallback } from "react";
import { Search, X, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MessageToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}

export const MessageToolbar = React.memo(function MessageToolbar({
  searchTerm,
  onSearchChange,
  onClearSearch,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  sortOrder,
  onSortChange,
  limit,
  onLimitChange,
}: MessageToolbarProps) {
  const handleSortSelectChange = useCallback(
    (val: string) => {
      const [by, order] = val.split("-");
      if (by && (order === "asc" || order === "desc")) {
        onSortChange(by, order as "asc" | "desc");
      }
    },
    [onSortChange],
  );

  const handleLimitSelectChange = useCallback(
    (val: string) => {
      onLimitChange(Number(val));
    },
    [onLimitChange],
  );

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-8 h-9 text-xs"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={onClearSearch}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Status, Sort & Limit Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
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
          onValueChange={handleSortSelectChange}
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
        <Select value={String(limit)} onValueChange={handleLimitSelectChange}>
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
  );
});
