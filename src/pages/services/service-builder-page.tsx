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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

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

export default function ServiceBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const items = useServicesStore((s) => s.items);
  const add = useServicesStore((s) => s.add);
  const update = useServicesStore((s) => s.update);

  const isEditing = !!id;
  const service = React.useMemo(
    () => items.find((item) => item.id === id),
    [items, id],
  );

  const [mobileTab, setMobileTab] = React.useState<"editor" | "preview">(
    "editor",
  );
  const [generalSettingsOpen, setGeneralSettingsOpen] = React.useState(true);
  const [expandedSections, setExpandedSections] = React.useState<
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
    formState: { errors, isSubmitting },
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
      if (service) {
        reset({
          title: service.title,
          slug: service.slug,
          category: service.category,
          isPublished: service.isPublished,
          featuredImage: service.featuredImage,
          sections: service.sections,
          seo: service.seo || {
            metaTitle: "",
            metaDescription: "",
            keywords: [],
            canonicalUrl: "",
            ogImage: "",
          },
        });

        // Expand first section by default
        if (service.sections && service.sections[0]) {
          setExpandedSections({ [service.sections[0]._id]: true });
        }
      } else {
        toast.error("Service not found");
        navigate("/services");
      }
    }
  }, [isEditing, service, reset, navigate]);

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
  const toggleSectionExpand = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Block Content initial state factories
  const createDefaultBlockContent = (type: BlockType) => {
    switch (type) {
      case "hero_section":
        return {
          hero: {
            headline: "Headline goes here",
            subheadline: "Subheadline describing details goes here",
            bgImage:
              "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800",
            ctaText: "Get Free Quote",
            ctaLink: "/contact-us",
          },
        };
      case "rich_text_jodit":
        return {
          richTextHtml: "<p>Write rich description contents...</p>",
        };
      case "features_grid":
        return {
          features: [
            {
              title: "Example Feature Title",
              description: "Example description...",
              iconUrl: "Waves",
            },
          ],
        };
      case "gallery_grid":
        return {
          gallery: [
            {
              imageUrl:
                "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800",
              caption: "Gallery Image",
              altText: "Gallery Image",
            },
          ],
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
    const _id = generateId("blk");
    const newSection: PageBlock = {
      _id,
      blockType: type,
      order: sections.length,
      layoutStyle: "default",
      content: createDefaultBlockContent(type),
    };

    append(newSection);
    setExpandedSections((prev) => ({
      ...prev,
      [_id]: true,
    }));
    toast.success(`Added ${type.replace("_", " ")} section.`);
  };

  const handleFormSubmit = async (values: ServiceFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Normalize order keys
    const sortedSections = values.sections.map((sec, index) => ({
      ...sec,
      order: index,
    }));

    const finalValues = {
      ...values,
      sections: sortedSections,
    };

    if (isEditing && service) {
      update(service.id, {
        ...finalValues,
        updatedAt: new Date().toISOString(),
      });
      toast.success("Service updated successfully.");
    } else {
      add({
        id: generateId("svc"),
        ...finalValues,
        updatedAt: new Date().toISOString(),
      });
      toast.success("Service created successfully.");
    }
    navigate("/services");
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
            <div className="flex items-center gap-2 border border-border rounded-md px-3 py-1.5 bg-card text-xs">
              <span className="font-medium text-muted-foreground">
                Published:
              </span>
              <Switch
                checked={isPublished}
                onCheckedChange={(val) => setValue("isPublished", val)}
              />
            </div>

            <Button
              onClick={handleSubmit(handleFormSubmit)}
              disabled={isSubmitting}
              className="h-9 gap-1.5 px-4 text-xs font-semibold"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Service
            </Button>
          </div>
        </div>

        {/* Workspace content splitting */}
        <div className="min-h-0 flex-1">
          {/* Mobile layout tabs toggler */}
          <div className="block lg:hidden mb-4">
            <Tabs
              value={mobileTab}
              onValueChange={(v) => setMobileTab(v as "editor" | "preview")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="editor" className="gap-1.5">
                  <FileText className="h-4 w-4" /> Editor Workspace
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-1.5">
                  <Eye className="h-4 w-4" /> Real-time Page
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid h-full grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
            {/* Editor workspace pane (Left) */}
            <div
              className={`scrollbar-thin h-full overflow-y-auto pr-2 lg:col-span-7 lg:block ${
                mobileTab === "editor" ? "block" : "hidden"
              }`}
            >
              <div className="space-y-6 pb-24">
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

                {/* 3. DYNAMIC SECTION BUILDER */}
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
                        Pick a block type below to add structural layers to this
                        page.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {fields.map((field, index) => {
                        const blockType =
                          sections[index]?.blockType || "rich_text_jodit";
                        const blockId = sections[index]?._id || field.id;
                        const isExpanded = !!expandedSections[blockId];
                        const blockTitle =
                          sections[index]?.content?.hero?.headline ||
                          sections[index]?.content?.cta?.title ||
                          `Section ${index + 1}: ${blockType.replace("_", " ").toUpperCase()}`;

                        return (
                          <div
                            key={field.id}
                            onDragOver={(e) => handleDragOver(e, index)}
                            className={`rounded-lg border border-border bg-card shadow-sm transition-all duration-200 ${
                              draggedIndex === index
                                ? "opacity-40 border-primary"
                                : ""
                            }`}
                          >
                            {/* Card Header Accordion Trigger */}
                            <div className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-t-lg select-none">
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, index)}
                                  onDragEnd={handleDragEnd}
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
                                  onClick={() => toggleSectionExpand(blockId)}
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
                                  onClick={() => {
                                    remove(index);
                                    toast.error("Removed page section.");
                                  }}
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
                                    value={
                                      sections[index]?.layoutStyle || "default"
                                    }
                                    onValueChange={(val) =>
                                      setValue(
                                        `sections.${index}.layoutStyle`,
                                        val as LayoutStyle,
                                      )
                                    }
                                  >
                                    <SelectTrigger className="h-10 text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="default">
                                        Default Flex
                                      </SelectItem>
                                      <SelectItem value="full_width">
                                        Full Screen Width
                                      </SelectItem>
                                      <SelectItem value="container_centered">
                                        Centered Container
                                      </SelectItem>
                                      <SelectItem value="grid_2_col">
                                        2-Column Grid
                                      </SelectItem>
                                      <SelectItem value="grid_3_col">
                                        3-Column Grid
                                      </SelectItem>
                                      <SelectItem value="grid_4_col">
                                        4-Column Grid
                                      </SelectItem>
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
                                {blockType === "hero_section" && (
                                  <HeroSectionEditor index={index} />
                                )}
                                {blockType === "rich_text_jodit" && (
                                  <RichTextEditor index={index} />
                                )}
                                {blockType === "features_grid" && (
                                  <FeaturesGridEditor index={index} />
                                )}
                                {blockType === "gallery_grid" && (
                                  <GalleryGridEditor index={index} />
                                )}
                                {blockType === "faq_accordion" && (
                                  <FaqAccordionEditor index={index} />
                                )}
                                {blockType === "cta_banner" && (
                                  <CtaBannerEditor index={index} />
                                )}
                                {blockType === "technical_specs" && (
                                  <TechnicalSpecsEditor index={index} />
                                )}
                                {blockType === "contact_form" && (
                                  <div className="p-4 border border-dashed rounded-lg bg-muted/20 text-center">
                                    <Info className="h-5 w-5 text-primary mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      Contact Form renders public contact fields
                                      (Name, Email, Message, Service details,
                                      Phone). Layout templates determine
                                      background themes.
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. ADD NEW SECTION SELECTOR */}
                <div className="rounded-xl border border-border p-6 bg-card space-y-4">
                  <Label className="text-xs font-bold text-foreground uppercase tracking-wider block border-b pb-2">
                    Add Block Layout Section
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSection("hero_section")}
                      className="flex flex-col h-20 gap-1.5 items-center justify-center text-xs hover:border-primary hover:bg-primary/5 group"
                    >
                      <Megaphone className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>Hero Section</span>
                    </Button> */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSection("rich_text_jodit")}
                      className="flex flex-col h-20 gap-1.5 items-center justify-center text-xs hover:border-primary hover:bg-primary/5 group"
                    >
                      <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>Rich Text block</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSection("features_grid")}
                      className="flex flex-col h-20 gap-1.5 items-center justify-center text-xs hover:border-primary hover:bg-primary/5 group"
                    >
                      <Grid className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>Features Grid</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSection("gallery_grid")}
                      className="flex flex-col h-20 gap-1.5 items-center justify-center text-xs hover:border-primary hover:bg-primary/5 group"
                    >
                      <ImageIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>Gallery Grid</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSection("faq_accordion")}
                      className="flex flex-col h-20 gap-1.5 items-center justify-center text-xs hover:border-primary hover:bg-primary/5 group"
                    >
                      <HelpCircle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>FAQ Accordion</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSection("cta_banner")}
                      className="flex flex-col h-20 gap-1.5 items-center justify-center text-xs hover:border-primary hover:bg-primary/5 group"
                    >
                      <Layers className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>CTA Banner</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSection("technical_specs")}
                      className="flex flex-col h-20 gap-1.5 items-center justify-center text-xs hover:border-primary hover:bg-primary/5 group"
                    >
                      <Wrench className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>Technical Specs</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSection("contact_form")}
                      className="flex flex-col h-20 gap-1.5 items-center justify-center text-xs hover:border-primary hover:bg-primary/5 group"
                    >
                      <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>Contact Form</span>
                    </Button>
                  </div>
                </div>

                {/* 2. SEO & Metatags Configuration */}
                <SeoPanel />
              </div>
            </div>

            {/* Live Web Preview Frame (Right) */}
            <div
              className={`h-full overflow-hidden lg:col-span-5 lg:flex lg:flex-col ${
                mobileTab === "preview" ? "flex" : "hidden lg:flex"
              }`}
            >
              <PagePreview sections={sections} />
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
