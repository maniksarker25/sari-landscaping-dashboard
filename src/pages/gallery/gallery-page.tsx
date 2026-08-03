import * as React from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Waves,
  Trees,
  LayoutGrid,
  Loader2,
  Search,
  X,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GalleryImage } from "@/types";
import { GalleryFormDialog } from "@/pages/gallery/gallery-form-dialog";
import {
  useGetGalleryQuery,
  useDeleteGalleryMutation,
  type GetGalleryQueryParams,
} from "@/redux/services/galleryApis";

export default function GalleryPage() {
  // API Query Parameters state
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);
  const [sortBy, setSortBy] = React.useState<string>("createdAt");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [category, setCategory] = React.useState<string>("all");

  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    React.useState<string>("");

  // Debounce search term input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Construct query object
  const queryParams: GetGalleryQueryParams = React.useMemo(() => {
    const params: GetGalleryQueryParams = {
      page,
      limit,
      sortBy,
      sortOrder,
    };
    if (category && category !== "all") {
      params.category = category;
    }
    if (debouncedSearchTerm.trim()) {
      params.searchTerm = debouncedSearchTerm.trim();
    }
    return params;
  }, [page, limit, sortBy, sortOrder, category, debouncedSearchTerm]);

  const {
    data: galleryResponse,
    isLoading,
    isFetching,
  } = useGetGalleryQuery(queryParams);

  const [deleteGallery] = useDeleteGalleryMutation();

  const [formState, setFormState] = React.useState<{
    open: boolean;
    image?: GalleryImage;
  }>({ open: false });
  const [deleteTarget, setDeleteTarget] = React.useState<GalleryImage | null>(
    null,
  );

  const items: GalleryImage[] = React.useMemo(() => {
    const apiItems = galleryResponse?.data;
    if (Array.isArray(apiItems)) {
      return apiItems.map((item) => ({
        id: item?._id || item?.id || "",
        src: item?.image || "",
        alt: item?.imageAlt || "",
        category:
          item?.category?.toLowerCase() === "pools" ? "pools" : "landscaping",
        location: item?.location || "",
        updatedAt: item?.updatedAt || new Date().toISOString(),
      }));
    }
    return [];
  }, [galleryResponse]);

  const meta = galleryResponse?.meta;
  const totalPages = meta?.totalPage || 1;

  async function handleDelete(image: GalleryImage) {
    try {
      const response = await deleteGallery(image.id).unwrap();
      if (!response?.success) {
        throw new Error(response?.message);
      }
      toast.success("Image removed from gallery");
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to remove image from gallery";
      toast.error(errorMessage);
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        description="Manage the Pools and Landscaping photo gallery shown on your website."
        actions={
          <Button onClick={() => setFormState({ open: true })}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Image
          </Button>
        }
      />

      {/* Toolbar: Filter Tabs, Search Bar, Sort & Limit */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Tabs */}
        <Tabs
          value={category}
          onValueChange={(val) => {
            setCategory(val);
            setPage(1);
          }}
          className="w-full sm:w-auto"
        >
          <TabsList className="h-10 bg-muted/60 p-1">
            <TabsTrigger
              value="all"
              className="flex items-center gap-1.5 px-3 text-xs font-medium"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>All</span>
            </TabsTrigger>
            <TabsTrigger
              value="Pools"
              className="flex items-center gap-1.5 px-3 text-xs font-medium"
            >
              <Waves className="h-3.5 w-3.5 text-sky-500" />
              <span>Pools</span>
            </TabsTrigger>
            <TabsTrigger
              value="Landscaping"
              className="flex items-center gap-1.5 px-3 text-xs font-medium"
            >
              <Trees className="h-3.5 w-3.5 text-emerald-500" />
              <span>Landscaping</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search, Sort & Limit Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search gallery..."
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
            <SelectTrigger className="h-9 w-[140px] text-xs">
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
              <SelectItem value="imageAlt-asc" className="text-xs">
                Alt Text (A-Z)
              </SelectItem>
              <SelectItem value="imageAlt-desc" className="text-xs">
                Alt Text (Z-A)
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

      {/* Loading State */}
      {isLoading || isFetching ? (
        <div className="flex items-center justify-center min-h-[250px] gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm font-medium">Loading gallery...</span>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No images found"
          description={
            debouncedSearchTerm
              ? `No results matching "${debouncedSearchTerm}"`
              : "Add an image or choose a different category."
          }
          action={
            <Button onClick={() => setFormState({ open: true })}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Image
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((image) => {
            const isPool = image.category === "pools";
            return (
              <div
                key={image.id}
                className="group relative aspect-4/3 overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs transition-all duration-300 hover:border-primary/50 hover:shadow-md"
              >
                {/* Image */}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Category Badge Pill */}
                <div className="absolute left-2 top-2 z-10">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide shadow-sm backdrop-blur-md ${
                      isPool
                        ? "bg-sky-500/90 text-white"
                        : "bg-emerald-600/90 text-white"
                    }`}
                  >
                    {isPool ? (
                      <Waves className="h-3 w-3" />
                    ) : (
                      <Trees className="h-3 w-3" />
                    )}
                    <span className="capitalize">{image.category}</span>
                  </span>
                </div>

                {/* Hover Overlay & Actions */}
                <div className="absolute inset-0 z-20 flex flex-col justify-between bg-black/50 p-2.5 backdrop-blur-[2px] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="flex justify-end gap-1.5">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => setFormState({ open: true, image })}
                      aria-label="Edit image"
                      className="h-7 w-7 rounded-full bg-white/90 text-foreground hover:bg-white dark:bg-zinc-800/90 dark:text-zinc-100 dark:hover:bg-zinc-800 shadow-sm"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setDeleteTarget(image)}
                      aria-label="Delete image"
                      className="h-7 w-7 rounded-full shadow-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <p className="line-clamp-2 text-[11px] font-medium text-white/90 drop-shadow-sm">
                    {image.alt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs">
          <p className="text-muted-foreground">
            Page <span className="font-semibold text-foreground">{page}</span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
            {meta?.total !== undefined && (
              <span className="ml-1">({meta.total} items total)</span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 text-xs"
            >
              Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Form & Delete Dialogs */}
      <GalleryFormDialog
        open={formState.open}
        image={formState.image}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this image?"
        description="This will permanently remove the image from your gallery."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </div>
  );
}
