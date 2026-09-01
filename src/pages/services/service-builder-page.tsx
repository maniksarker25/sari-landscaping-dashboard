import * as React from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ChevronLeft,
  Save,
  Eye,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Loader2,
  Layers,
  FileText,
  ImageIcon,
  Grid,
  HelpCircle,
  Megaphone,
  Wrench,
  Mail,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Info,
  Code2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";  
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { CategoryPicker } from "@/components/services/builder/category-picker";
import { SeoPanel } from "@/components/services/builder/seo-panel";
import { PresetImages } from "@/components/services/builder/preset-images";
import { PagePreview } from "@/components/services/builder/page-preview";
import {
  HeroSectionEditor,
  RichTextEditor,
  FeaturesGridEditor,
  GalleryGridEditor,
  FaqAccordionEditor,
  CtaBannerEditor,
  TechnicalSpecsEditor,
} from "@/components/services/builder/block-editors";

import { serviceFormSchema, type ServiceFormValues } from "@/lib/validations";
import { useServicesStore } from "@/lib/content-stores";
import { slugify, generateId } from "@/lib/utils";
import type { Service, PageBlock, BlockType, LayoutStyle } from "@/types";
import {
  useGetSingleServiceQuery,
  useCreateDraftServiceMutation,
  useCreatePublishedServiceMutation,
  useUpdateServiceMutation,
} from "@/redux/services/serviceApis";
import { buildServiceFormData } from "@/lib/service-payload-builder";

export default function ServiceBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditing = !!id;
  const { data: singleServiceResponse, isLoading: isLoadingSingle } =
    useGetSingleServiceQuery(id!, { skip: !isEditing });

  const [createDraftService, { isLoading: isCreatingDraft }] =
    useCreateDraftServiceMutation();
  const [createPublishedService, { isLoading: isCreatingPublished }] =
    useCreatePublishedServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

  const isSubmittingApi = isCreatingDraft || isCreatingPublished || isUpdating;

  // Fallback to local store item if offline or single query pending
  const localItems = useServicesStore((s) => s.items);
  const localService = React.useMemo(
    () => localItems.find((item) => item.id === id || item._id === id),
    [localItems, id],
  );
  const fetchedService = singleServiceResponse?.data || localService;

  const [previewModalOpen, setPreviewModalOpen] = React.useState(false);
  const [generalSettingsOpen, setGeneralSettingsOpen] = React.useState(true);
  const [collapsedSections, setCollapsedSections] = React.useState<
    Record<string, boolean>
  >({});

  // Setup form methods
  const methods = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      category: undefined,
      isPublished: false,
      featuredImage: "",
      sections: [],
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
        canonicalUrl: "",
        ogImage: "",
      },
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = methods;

  // useFieldArray for dynamic sections
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "sections",
  });

  // Watch top-level values
  const title = watch("title");
  const slug = watch("slug");
  const category = watch("category");
  const isPublished = watch("isPublished");
  const sections = watch("sections") || [];

  // Load existing service values in edit mode
  React.useEffect(() => {
    if (isEditing) {
      if (fetchedService) {
        reset({
          title: fetchedService.title,
          slug: fetchedService.slug,
          category: fetchedService.category,
          isPublished: fetchedService.isPublished,
          featuredImage: fetchedService.featuredImage || "",
          sections: fetchedService.sections || [],
          seo: fetchedService.seo || {
            metaTitle: "",
            metaDescription: "",
            keywords: [],
            canonicalUrl: "",
            ogImage: "asd",
          },
        });
      }
    }
  }, [isEditing, fetchedService, reset]);

  // Handle title change slug generation
  const handleTitleBlur = () => {
    if (!isEditing && title && !slug) {
      setValue("slug", slugify(title), { shouldValidate: true });
    }
  };

  // Drag & drop sorting handlers
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    move(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Sections toggle collapse
  const toggleSectionExpand = React.useCallback((sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  // Block Content initial state factories
  const createDefaultBlockContent = (type: BlockType) => {
    switch (type) {
      case "hero_section":
        return {
          hero: {
            headline: "",
            subheadline: "",
            bgImage: "",
            ctaText: "Get Free Quote",
            ctaLink: "/contact-us",
          },
        };
      case "rich_text_jodit":
        return {
          richTextHtml: "<p></p>",
        };
      case "features_grid":
        return {
          features: [],
        };
      case "gallery_grid":
        return {
          gallery: [],
        };
      case "faq_accordion":
        return {
          accordionItems: [
            { question: "FAQ Question 1", answer: "FAQ Answer details..." },
          ],
        };
      case "cta_banner":
        return {
          cta: {
            title: "Dynamic Call to Action Title",
            description:
              "Ready to start your next landscape or pool design build project?",
            buttonText: "Contact Us",
            buttonLink: "/contact-us",
            phoneNumber: "+971 50 123 4567",
          },
        };
      case "technical_specs":
        return {
          specs: [{ label: "Spec Name", value: "Spec Value" }],
        };
      case "contact_form":
      default:
        return {};
    }
  };

  const handleAddSection = (type: BlockType) => {
    const newSection: PageBlock = {
      blockType: type,
      order: sections.length,
      layoutStyle: "default",
      content: createDefaultBlockContent(type),
    };

    append(newSection);
    toast.success(`Added ${type.replace("_", " ")} section.`);
  };

  const handleRemoveSection = React.useCallback(
    (index: number) => {
      remove(index);
      toast.error("Removed page section.");
    },
    [remove],
  );

  const handleLayoutStyleChange = React.useCallback(
    (index: number, style: LayoutStyle) => {
      setValue(`sections.${index}.layoutStyle`, style);
    },
    [setValue],
  );

  // Deferred sections for smooth, non-blocking background compiler rendering
  const deferredSections = React.useDeferredValue(sections);

  // Inspector modal state
  const [inspectModalOpen, setInspectModalOpen] = React.useState(false);
  const [inspectData, setInspectData] = React.useState<{
    endpoint: string;
    dataJson: string;
    serviceImageInfo: string;
    galleryMapJson: string;
    galleryFilesCount: number;
    galleryFileNames: string[];
  } | null>(null);

  const handleOpenInspectPayload = () => {
    const values = methods.getValues();
    const formData = buildServiceFormData(values, { isUpdate: isEditing });

    const endpoint = isEditing
      ? `PATCH /service/update/${id || fetchedService?._id || fetchedService?.id || ":id"}`
      : values.isPublished
        ? "POST /service/create-published"
        : "POST /service/create-draft";

    const dataStr = (formData.get("data") as string) || "{}";
    let prettyDataJson = dataStr;
    try {
      prettyDataJson = JSON.stringify(JSON.parse(dataStr), null, 2);
    } catch (e) {}

    const serviceImgFile = formData.get("service_image");
    const serviceImgInfo =
      serviceImgFile && serviceImgFile instanceof File
        ? `File: ${serviceImgFile.name} (${(serviceImgFile.size / 1024).toFixed(1)} KB)`
        : values.featuredImage
          ? `URL: ${values.featuredImage}`
          : "None";

    const mapStr = (formData.get("galleryImageMap") as string) || "[]";
    let prettyMapJson = mapStr;
    try {
      prettyMapJson = JSON.stringify(JSON.parse(mapStr), null, 2);
    } catch (e) {}

    const galleryFiles = formData.getAll("gallery_images") as File[];
    const galleryFileNames = galleryFiles.map(
      (f, idx) =>
        `[fileIndex ${idx}]: ${f.name} (${(f.size / 1024).toFixed(1)} KB)`,
    );

    setInspectData({
      endpoint,
      dataJson: prettyDataJson,
      serviceImageInfo: serviceImgInfo,
      galleryMapJson: prettyMapJson,
      galleryFilesCount: galleryFiles.length,
      galleryFileNames,
    });
    setInspectModalOpen(true);
  };

  const handleSaveService = async (asPublished: boolean) => {
    const isValid = await methods.trigger();
    if (!isValid) {
      toast.error("Please resolve form validation errors before saving.");
      return;
    }

    const values = methods.getValues();
    values.isPublished = asPublished;

    // Normalize order keys
    values.sections = (values.sections || []).map((sec, idx) => ({
      ...sec,
      order: idx + 1,
    }));

    // Build FormData matching backend spec
    const formData = buildServiceFormData(values, { isUpdate: isEditing });

    const endpoint = isEditing
      ? `PATCH /service/update/${id || fetchedService?._id || fetchedService?.id || ""}`
      : asPublished
        ? "POST /service/create-published"
        : "POST /service/create-draft";

    // Format & output clear developer payload in browser dev console
    // console.group(
    //   "%c🚀 SUBMITTING MULTIPART SERVICE FORM DATA PAYLOAD",
    //   "color: #06b6d4; font-size: 13px; font-weight: bold;",
    // );
    // console.log("📍 Target Endpoint:", endpoint);

    try {
      const rawDataStr = formData.get("data") as string;
      // console.log("📄 Key 'data' (Parsed Object):", JSON.parse(rawDataStr));
      // console.log("📄 Key 'data' (Raw JSON String):", rawDataStr);
    } catch (err) {
      // console.log("📄 Key 'data':", formData.get("data"));
    }

    if (formData.has("service_image")) {
      // console.log(
      //   "🖼️ Key 'service_image' (File):",
      //   formData.get("service_image"),
      // );
    } else {
      // console.log(
      //   "🖼️ Key 'service_image': None (keeping existing URL or default)",
      // );
    }

    if (formData.has("galleryImageMap")) {
      try {
        const mapStr = formData.get("galleryImageMap") as string;
        // console.log(
        //   "🗺️ Key 'galleryImageMap' (Parsed Array):",
        //   JSON.parse(mapStr),
        // );
        // console.log("🗺️ Key 'galleryImageMap' (Raw JSON):", mapStr);
      } catch (err) {
        // console.log(
        //   "🗺️ Key 'galleryImageMap':",
        //   formData.get("galleryImageMap"),
        // );
      }
    } else {
      // console.log("🗺️ Key 'galleryImageMap': None");
    }

    const galleryFiles = formData.getAll("gallery_images");
    if (galleryFiles.length > 0) {
      // console.log("📁 Key 'gallery_images' (Files Array):", galleryFiles);
    } else {
      // console.log("📁 Key 'gallery_images': None");
    }

    // console.groupEnd();

    try {
      if (isEditing) {
        const targetId = id || fetchedService?._id || fetchedService?.id || "";
        await updateService({ id: targetId, formData }).unwrap();
        toast.success(`Service "${values.title}" updated successfully.`);
      } else {
        if (asPublished) {
          await createPublishedService(formData).unwrap();
          toast.success(
            `Published service "${values.title}" successfully! Check console (F12) for payload.`,
          );
        } else {
          await createDraftService(formData).unwrap();
          toast.success(
            `Saved service "${values.title}" as draft. Check console (F12) for payload.`,
          );
        }
      }
      navigate("/services");
    } catch (error: any) {
      // console.error("Save service error:", error);
      toast.error(
        error?.data?.message ||
          "Failed to save service. Check backend connection.",
      );
    }
  };

  // CATEGORY PICKER SCREEN (only when adding a new service and category isn't set yet)
  if (!isEditing && !category) {
    return (
      <CategoryPicker
        onSelect={(c) => setValue("category", c, { shouldValidate: true })}
        onCancel={() => navigate("/services")}
      />
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="flex h-[calc(100vh-7rem)] flex-col gap-6">
        {/* Sticky Action Header */}
        <div className="flex shrink-0 flex-col gap-4 border-b border-border bg-background pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/services")}
              title="Go back to Services"
              className="h-9 w-9"
              type="button"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {isEditing ? "Modify Service CMS" : "Service Dynamic Builder"}
                </h1>
                <Badge variant={isPublished ? "default" : "secondary"}>
                  {isPublished ? "Published" : "Draft"}
                </Badge>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                  {category}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Configure hierarchical grid elements, media, SEO metadata, and
                sections.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPreviewModalOpen(true)}
              title="Open Page Live Web Preview Modal"
              className="h-9 gap-1.5 px-3.5 text-xs font-semibold border-primary/40 text-primary hover:bg-primary/5"
            >
              <Eye className="h-4 w-4" /> Live Preview
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleOpenInspectPayload}
              title="Inspect FormData Payload JSON and Files"
              className="h-9 gap-1.5 px-3 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/5"
            >
              <Code2 className="h-4 w-4" /> Inspect Payload
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleSaveService(false)}
              disabled={isSubmittingApi}
              className="h-9 gap-1.5 px-3.5 text-xs font-semibold"
            >
              {isCreatingDraft ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Draft
            </Button>

            <Button
              type="button"
              onClick={() => handleSaveService(true)}
              disabled={isSubmittingApi}
              className="h-9 gap-1.5 px-4 text-xs font-semibold"
            >
              {isCreatingPublished || isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isEditing ? "Update Service" : "Publish Service"}
            </Button>
          </div>
        </div>

        {/* Workspace Layout: Main Content (Left) + Sticky Add Block Sidebar (Right) */}
        <div className="min-h-0 flex-1 scrollbar-thin overflow-y-auto pr-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24 max-w-7xl mx-auto">
            {/* Main Editor Content (Left 8/9 Cols) */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              {/* 1. General page info (Collapsible) */}
              <Card className="border border-border bg-card">
                <div
                  onClick={() => setGeneralSettingsOpen(!generalSettingsOpen)}
                  className="flex items-center justify-between p-5 border-b border-border cursor-pointer hover:bg-muted/10 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold tracking-tight text-foreground">
                      General Page Info
                    </span>
                  </div>
                  {generalSettingsOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {generalSettingsOpen && (
                  <CardContent className="space-y-4 pt-5 pb-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="title"
                          className="text-xs font-semibold text-muted-foreground"
                        >
                          Service Title{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="title"
                          placeholder="e.g. Infinity Pools Construction"
                          {...register("title")}
                          onBlur={handleTitleBlur}
                          className="h-10 text-sm"
                        />
                        {errors.title && (
                          <p className="text-xs text-destructive">
                            {errors.title.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="slug"
                          className="text-xs font-semibold text-muted-foreground"
                        >
                          URL Slug <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="slug"
                          placeholder="infinity-pools-construction"
                          {...register("slug")}
                          className="h-10 text-sm"
                        />
                        {errors.slug && (
                          <p className="text-xs text-destructive">
                            {errors.slug.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Featured image input */}
                    <PresetImages />
                  </CardContent>
                )}
              </Card>

              {/* 2. DYNAMIC SECTION BUILDER */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Grid className="h-4.5 w-4.5 text-primary" />
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
                      Page Sections ({sections.length})
                    </h3>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    Drag sections to rearrange layout order
                  </span>
                </div>

                {/* Section cards lists */}
                {sections.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-border p-12 text-center bg-muted/10">
                    <Layers className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-foreground">
                      No sections created yet
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Pick a block type from the sidebar to add structural
                      layers to this page.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fields.map((field, index) => {
                      const blockType =
                        sections[index]?.blockType || "rich_text_jodit";
                      const layoutStyle =
                        sections[index]?.layoutStyle || "default";
                      const blockId = field.id;
                      const isExpanded = !collapsedSections[blockId];
                      const blockTitle =
                        sections[index]?.content?.hero?.headline ||
                        sections[index]?.content?.cta?.title ||
                        `Section ${index + 1}: ${blockType.replace("_", " ").toUpperCase()}`;

                      return (
                        <SectionEditorCard
                          key={field.id}
                          index={index}
                          fieldId={field.id}
                          blockType={blockType}
                          layoutStyle={layoutStyle}
                          blockTitle={blockTitle}
                          isExpanded={isExpanded}
                          isDragging={draggedIndex === index}
                          onToggleExpand={toggleSectionExpand}
                          onRemove={handleRemoveSection}
                          onDragStart={handleDragStart}
                          onDragOver={handleDragOver}
                          onDragEnd={handleDragEnd}
                          onLayoutStyleChange={handleLayoutStyleChange}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. SEO & Metatags Configuration */}
              <SeoPanel />
            </div>

            {/* Sticky Add Block Sidebar (Right 4/3 Cols) */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-6">
              <div className="sticky top-0 space-y-4">
                <Card className="border border-border bg-card shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="h-4 w-4 text-primary" />
                      Add Section Block
                    </Label>
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-bold"
                    >
                      {sections.length} Added
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Click any block type below to insert a new section into your
                    service layout.
                  </p>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSection("rich_text_jodit")}
                      className="flex items-center justify-start h-10 gap-2.5 text-xs px-3 hover:border-primary hover:bg-primary/5 group"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      <span className="font-semibold text-foreground">
                        Rich Text Block
                      </span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSection("features_grid")}
                      className="flex items-center justify-start h-10 gap-2.5 text-xs px-3 hover:border-primary hover:bg-primary/5 group"
                    >
                      <Grid className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      <span className="font-semibold text-foreground">
                        Features Grid
                      </span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSection("gallery_grid")}
                      className="flex items-center justify-start h-10 gap-2.5 text-xs px-3 hover:border-primary hover:bg-primary/5 group"
                    >
                      <ImageIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      <span className="font-semibold text-foreground">
                        Gallery Grid
                      </span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSection("faq_accordion")}
                      className="flex items-center justify-start h-10 gap-2.5 text-xs px-3 hover:border-primary hover:bg-primary/5 group"
                    >
                      <HelpCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      <span className="font-semibold text-foreground">
                        FAQ Accordion
                      </span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSection("cta_banner")}
                      className="flex items-center justify-start h-10 gap-2.5 text-xs px-3 hover:border-primary hover:bg-primary/5 group"
                    >
                      <Layers className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      <span className="font-semibold text-foreground">
                        CTA Banner
                      </span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSection("technical_specs")}
                      className="flex items-center justify-start h-10 gap-2.5 text-xs px-3 hover:border-primary hover:bg-primary/5 group"
                    >
                      <Wrench className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      <span className="font-semibold text-foreground">
                        Technical Specs
                      </span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSection("contact_form")}
                      className="flex items-center justify-start h-10 gap-2.5 text-xs px-3 hover:border-primary hover:bg-primary/5 group"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      <span className="font-semibold text-foreground">
                        Contact Form
                      </span>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Live Page Preview Modal Dialog */}
        <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto space-y-4 p-6">
            <DialogHeader className="border-b pb-3">
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Real-time Service Page Web Preview
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Interactive responsive preview showing how this service page
                will render on live desktop and mobile viewports.
              </DialogDescription>
            </DialogHeader>

            <div className="pt-2">
              <PagePreview sections={deferredSections} />
            </div>
          </DialogContent>
        </Dialog>

        {/* Payload Inspector Modal Dialog */}
        <Dialog open={inspectModalOpen} onOpenChange={setInspectModalOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                Multipart Form Payload Inspector
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                This inspects the exact `FormData` binary payload, JSON data
                string, and gallery file mappings prepared for API submission.
              </DialogDescription>
            </DialogHeader>

            {inspectData && (
              <div className="space-y-4 text-xs">
                <div className="rounded-md border p-3 bg-muted/30 space-y-1">
                  <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
                    API Target Endpoint
                  </span>
                  <p className="font-mono font-bold text-primary">
                    {inspectData.endpoint}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
                    Key: &quot;data&quot; (Clean JSON Payload)
                  </span>
                  <pre className="p-3 rounded-md bg-slate-950 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-64 scrollbar-thin">
                    {inspectData.dataJson}
                  </pre>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-md border p-3 bg-muted/30 space-y-1">
                    <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
                      Key: &quot;service_image&quot;
                    </span>
                    <p className="font-mono text-foreground">
                      {inspectData.serviceImageInfo}
                    </p>
                  </div>

                  <div className="rounded-md border p-3 bg-muted/30 space-y-1">
                    <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
                      Key: &quot;gallery_images&quot; (
                      {inspectData.galleryFilesCount} Files)
                    </span>
                    {inspectData.galleryFileNames.length > 0 ? (
                      <ul className="font-mono text-emerald-600 dark:text-emerald-400 space-y-0.5 max-h-24 overflow-y-auto">
                        {inspectData.galleryFileNames.map((fn, idx) => (
                          <li key={idx}>{fn}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-mono text-muted-foreground">
                        No gallery files attached
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
                    Key: &quot;galleryImageMap&quot; (JSON Mapping)
                  </span>
                  <pre className="p-3 rounded-md bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-40 scrollbar-thin">
                    {inspectData.galleryMapJson}
                  </pre>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </FormProvider>
  );
}

interface SectionEditorCardProps {
  index: number;
  fieldId: string;
  blockType: BlockType;
  layoutStyle: LayoutStyle;
  blockTitle: string;
  isExpanded: boolean;
  isDragging: boolean;
  onToggleExpand: (id: string) => void;
  onRemove: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onLayoutStyleChange: (index: number, style: LayoutStyle) => void;
}

const SectionEditorCard = React.memo(function SectionEditorCard({
  index,
  fieldId,
  blockType,
  layoutStyle,
  blockTitle,
  isExpanded,
  isDragging,
  onToggleExpand,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
  onLayoutStyleChange,
}: SectionEditorCardProps) {
  return (
    <div
      onDragOver={(e) => onDragOver(e, index)}
      className={`rounded-lg border border-border bg-card shadow-sm transition-all duration-200 ${
        isDragging ? "opacity-40 border-primary" : ""
      }`}
    >
      {/* Card Header Accordion Trigger */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-t-lg select-none">
        <div className="flex items-center gap-3 min-w-0">
          <div
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnd={onDragEnd}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground pr-1 p-1 rounded hover:bg-muted/60 transition-colors"
            title="Drag to reorder section"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <Badge className="text-[10px] uppercase font-bold shrink-0">
            {blockType.replace("_", " ")}
          </Badge>
          <span className="text-xs font-semibold text-foreground truncate max-w-[200px] md:max-w-xs">
            {blockTitle}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onToggleExpand(fieldId)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Section Inputs Panel */}
      {isExpanded && (
        <div className="p-5 border-t border-border space-y-4 bg-card rounded-b-lg">
          {/* Layout Style select */}
          <div className="w-full max-w-[250px] space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              Layout Template Style
            </Label>
            <Select
              value={layoutStyle}
              onValueChange={(val) =>
                onLayoutStyleChange(index, val as LayoutStyle)
              }
            >
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Flex</SelectItem>
                <SelectItem value="full_width">Full Screen Width</SelectItem>
                <SelectItem value="container_centered">
                  Centered Container
                </SelectItem>
                <SelectItem value="grid_2_col">2-Column Grid</SelectItem>
                <SelectItem value="grid_3_col">3-Column Grid</SelectItem>
                <SelectItem value="grid_4_col">4-Column Grid</SelectItem>
                <SelectItem value="two_column_split">
                  Two Column Split
                </SelectItem>
                <SelectItem value="accent_bg">
                  Accent Background Block
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Forms depending on blockType */}
          {blockType === "hero_section" && <HeroSectionEditor index={index} />}
          {blockType === "rich_text_jodit" && <RichTextEditor index={index} />}
          {blockType === "features_grid" && (
            <FeaturesGridEditor index={index} />
          )}
          {blockType === "gallery_grid" && <GalleryGridEditor index={index} />}
          {blockType === "faq_accordion" && (
            <FaqAccordionEditor index={index} />
          )}
          {blockType === "cta_banner" && <CtaBannerEditor index={index} />}
          {blockType === "technical_specs" && (
            <TechnicalSpecsEditor index={index} />
          )}
          {blockType === "contact_form" && (
            <div className="p-4 border border-dashed rounded-lg bg-muted/20 text-center">
              <Info className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Contact Form renders public contact fields (Name, Email,
                Message, Service details, Phone). Layout templates determine
                background themes.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
