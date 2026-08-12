import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  ImageOff,
  Waves,
  Trees,
} from "lucide-react";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
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
import { formatDate } from "@/lib/utils";
import type { Service } from "@/types";

interface ServicesTableProps {
  services: Service[];
  onView: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export function ServicesTable({
  services,
  onView,
  onDelete,
}: ServicesTableProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-[45%]">Service</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => {
            const isPool = service?.category === "Pools";
            const categoryBadgeStyle = isPool
              ? "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800"
              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";

            return (
              <TableRow
                key={service?.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                      {service?.featuredImage ? (
                        <img
                          src={service?.featuredImage}
                          alt={service?.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageOff className="h-full w-full p-2.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="truncate text-sm font-semibold hover:text-primary cursor-pointer transition-colors"
                        onClick={() => onView(service)}
                      >
                        {service?.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        /{service?.slug}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-medium ${categoryBadgeStyle}`}
                  >
                    {isPool ? (
                      <Waves className="h-3.5 w-3.5" />
                    ) : (
                      <Trees className="h-3.5 w-3.5" />
                    )}
                    {service?.category}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={service?.isPublished ? "published" : "draft"}
                  />
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {service?.updatedAt ? formatDate(service?.updatedAt) : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Row actions"
                        className="h-8 w-8"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => onView(service)}>
                        <Eye className="h-4 w-4 mr-2 text-muted-foreground" />{" "}
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/services/edit/${service?._id}`)
                        }
                      >
                        <Pencil className="h-4 w-4 mr-2 text-muted-foreground" />{" "}
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(service)}
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
}
