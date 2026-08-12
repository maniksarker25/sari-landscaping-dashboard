import * as React from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  MessageSquareQuote,
  Star,
  StarHalf,
  Loader2,
  User,
  Search,
  X,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Pagination } from "@/components/common/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTestimonialsStore } from "@/lib/content-stores";
import type { Testimonial } from "@/types";
import { TestimonialFormDialog } from "@/pages/testimonials/testimonial-form-dialog";
import {
  useGetTestimonialsQuery,
  useDeleteTestimonialMutation,
  type GetTestimonialsQueryParams,
} from "@/redux/services/testimonialApis";

function TestimonialsSkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="flex flex-col">
          <CardContent className="flex flex-1 flex-col p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-2 pt-1">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
              <Skeleton className="h-3.5 w-4/6" />
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-border">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 flex-1 rounded-md" />
              <Skeleton className="h-8 w-10 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5 text-primary">
      {[1, 2, 3, 4, 5].map((i) => {
        if (i <= fullStars) {
          return <Star key={i} className="h-3.5 w-3.5 fill-current" />;
        }
        if (i === fullStars + 1 && hasHalfStar) {
          return <StarHalf key={i} className="h-3.5 w-3.5 fill-current" />;
        }
        return (
          <Star key={i} className="h-3.5 w-3.5 text-muted-foreground/30" />
        );
      })}
      <span className="ml-1 text-xs font-semibold text-foreground/80">
        {rating}
      </span>
    </div>
  );
}

export default function TestimonialsPage() {
  // Query parameters state
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);
  const [sortBy, setSortBy] = React.useState<string>("createdAt");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    React.useState<string>("");

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Query Params Object
  const queryParams: GetTestimonialsQueryParams = React.useMemo(() => {
    const params: GetTestimonialsQueryParams = {
      page,
      limit,
      sortBy,
      sortOrder,
    };
    if (debouncedSearchTerm.trim()) {
      params.searchTerm = debouncedSearchTerm.trim();
    }
    return params;
  }, [page, limit, sortBy, sortOrder, debouncedSearchTerm]);

  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetTestimonialsQuery(queryParams);

  const [deleteTestimonial, { isLoading: isDeleting }] =
    useDeleteTestimonialMutation();
  const fallbackItems = useTestimonialsStore((s) => s.items);

  const [formState, setFormState] = React.useState<{
    open: boolean;
    testimonial?: Testimonial;
  }>({
    open: false,
  });
  const [deleteTarget, setDeleteTarget] = React.useState<Testimonial | null>(
    null,
  );

  // Normalize API data or fallback
  const items: Testimonial[] = React.useMemo(() => {
    if (apiResponse && Array.isArray(apiResponse.data)) {
      return apiResponse.data.map((item) => ({
        _id: item._id || item.id,
        id: item._id || item.id || "",
        name: item.name,
        role: item.roleOrLocation || item.role || "",
        roleOrLocation: item.roleOrLocation || item.role || "",
        quote: item.quote,
        rating: item.rating || 5,
        image: item.image,
        status: item.status || "Published",
        createdAt: item.createdAt,
        updatedAt: item.updatedAt || new Date().toISOString(),
      }));
    } else if (Array.isArray(apiResponse)) {
      return (apiResponse as any[]).map((item) => ({
        _id: item._id || item.id,
        id: item._id || item.id || "",
        name: item.name,
        role: item.roleOrLocation || item.role || "",
        roleOrLocation: item.roleOrLocation || item.role || "",
        quote: item.quote,
        rating: item.rating || 5,
        image: item.image,
        status: item.status || "Published",
        createdAt: item.createdAt,
        updatedAt: item.updatedAt || new Date().toISOString(),
      }));
    }
    return isError ? fallbackItems : [];
  }, [apiResponse, isError, fallbackItems]);

  const meta = apiResponse?.meta;
  const totalPages =
    meta?.totalPage || Math.ceil((meta?.total || items.length) / limit) || 1;

  async function handleDelete(testimonial: Testimonial) {
    const id = testimonial._id || testimonial.id;
    try {
      await deleteTestimonial(id).unwrap();
      toast.success(`Testimonial from "${testimonial.name}" deleted`);
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to delete testimonial from "${testimonial.name}"`,
      );
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Manage client testimonials shown on your website."
        actions={
          <Button onClick={() => setFormState({ open: true })}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Testimonial
          </Button>
        }
      />

      {/* Toolbar: Search, Sort & Limit */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setDebouncedSearchTerm("");
                setPage(1);
              }}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort & Limit Controls */}
        <div className="flex items-center gap-2">
          {/* Sort By & Order Select */}
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(val) => {
              const [by, order] = val.split("-");
              if (by) setSortBy(by);
              if (order === "asc" || order === "desc") setSortOrder(order);
              setPage(1);
            }}
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
              <SelectItem value="rating-desc" className="text-xs">
                Rating (High-Low)
              </SelectItem>
              <SelectItem value="rating-asc" className="text-xs">
                Rating (Low-High)
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Limit Select */}
          <Select
            value={String(limit)}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1);
            }}
          >
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

      {isLoading || isFetching ? (
        <TestimonialsSkeletonGrid />
      ) : items.length === 0 ? (
        <EmptyState
          icon={MessageSquareQuote}
          title="No testimonials found"
          description={
            debouncedSearchTerm
              ? `No results matching "${debouncedSearchTerm}"`
              : "Try adding your first client testimonial."
          }
          action={
            <Button onClick={() => setFormState({ open: true })}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Testimonial
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((testimonial) => (
            <Card
              key={testimonial._id || testimonial.id}
              className="flex flex-col"
            >
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <RatingStars rating={testimonial.rating} />
                  <StatusBadge status={testimonial.status} />
                </div>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="mt-4 flex items-center gap-3 border-t border-border pt-3">
                  <Avatar className="h-9 w-9 border">
                    {testimonial.image ? (
                      <AvatarImage
                        src={testimonial.image}
                        alt={testimonial.name}
                      />
                    ) : null}
                    <AvatarFallback>
                      {testimonial.name ? (
                        testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.roleOrLocation || testimonial.role}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setFormState({ open: true, testimonial })}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(testimonial)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={meta?.total}
        onPageChange={setPage}
        disabled={isFetching}
      />

      <TestimonialFormDialog
        open={formState.open}
        testimonial={formState.testimonial}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && !isDeleting && setDeleteTarget(null)}
        title={`Delete testimonial from "${deleteTarget?.name}"?`}
        description="This will permanently remove the testimonial from your website."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        loading={isDeleting}
      />
    </div>
  );
}
