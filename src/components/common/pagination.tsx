import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
  showPageNumbers?: boolean;
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
  disabled = false,
  className,
  showPageNumbers = true,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page number sequence with ellipses
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      if (page < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-4 text-xs",
        className
      )}
    >
      <p className="text-muted-foreground">
        Page <span className="font-semibold text-foreground">{page}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
        {totalItems !== undefined && (
          <span className="ml-1">({totalItems} total)</span>
        )}
      </p>

      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || disabled}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="h-8 px-2 text-xs"
        >
          <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
        </Button>

        {/* Direct Page Number Buttons */}
        {showPageNumbers &&
          getPageNumbers().map((item, idx) => {
            if (item === "ellipsis") {
              return (
                <div
                  key={`ellipsis-${idx}`}
                  className="flex h-8 w-8 items-center justify-center text-muted-foreground"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </div>
              );
            }

            const isCurrent = item === page;
            return (
              <Button
                key={item}
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                disabled={disabled}
                onClick={() => onPageChange(item)}
                className={cn("h-8 w-8 p-0 text-xs", isCurrent && "font-semibold")}
              >
                {item}
              </Button>
            );
          })}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages || disabled}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="h-8 px-2 text-xs"
        >
          Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
