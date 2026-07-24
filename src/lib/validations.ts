import { z } from "zod";

export const heroContentSchema = z.object({
  headline: z.string().min(3, "Headline must be at least 3 characters."),
  subheadline: z.string().optional(),
  bgImage: z.string().url("Enter a valid background image URL."),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
});

export const featureItemSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  iconUrl: z.string().optional(),
});

export const galleryItemSchema = z.object({
  imageUrl: z.string().min(1, "Image is required."),
  caption: z.string().optional(),
  altText: z.string().optional(),
});

export const accordionItemSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters."),
  answer: z.string().min(3, "Answer must be at least 3 characters."),
});

export const ctaContentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export const technicalSpecSchema = z.object({
  label: z.string().min(1, "Label is required."),
  value: z.string().min(1, "Value is required."),
});

export const blockContentSchema = z.object({
  hero: heroContentSchema.optional(),
  richTextHtml: z.string().optional(),
  features: z.array(featureItemSchema).optional(),
  gallery: z.array(galleryItemSchema).optional(),
  accordionItems: z.array(accordionItemSchema).optional(),
  cta: ctaContentSchema.optional(),
  specs: z.array(technicalSpecSchema).optional(),
});

export const pageBlockSchema = z.object({
  _id: z.string(),
  blockType: z.enum([
    "hero_section",
    "rich_text_jodit",
    "features_grid",
    "gallery_grid",
    "faq_accordion",
    "cta_banner",
    "technical_specs",
    "contact_form",
  ]),
  order: z.number().default(0),
  layoutStyle: z.enum([
    "grid_2_col",
    "grid_3_col",
    "grid_4_col",
    "grid_6_col",
    "default",
    "full_width",
    "container_centered",
    "two_column_split",
    "card_grid",
    "accent_bg",
  ]).default("grid_3_col"),
  content: blockContentSchema,
});

export const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().optional(),
  ogImage: z.string().optional(),
});

export const serviceFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().min(3, "Slug must be at least 3 characters.").regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  category: z.enum(["Pools", "Landscaping"]),
  isPublished: z.boolean().default(false),
  featuredImage: z.string().min(1, "Featured image is required."),
  sections: z.array(pageBlockSchema),
  seo: seoSchema.optional(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export const projectFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().min(3, "Slug must be at least 3 characters.").regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  category: z.string().min(2, "Enter a category."),
  location: z.string().min(2, "Enter a location."),
  year: z.string().regex(/^\d{4}$/, "Enter a 4-digit year."),
  coverImage: z.string().url("Enter a valid image URL."),
  summary: z.string().min(10, "Add a project summary (10+ characters)."),
  scope: z.string().min(1, "List at least one scope item."),
  status: z.enum(["published", "draft"]),
});
export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const galleryFormSchema = z.object({
  src: z.string().min(1, "Image is required."),
  alt: z.string().min(3, "Add descriptive alt text."),
  category: z.enum(["pools", "landscaping"]),
});
export type GalleryFormValues = z.infer<typeof galleryFormSchema>;

export const blogFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().min(3, "Slug must be at least 3 characters.").regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  excerpt: z.string().min(10, "Add an excerpt (10+ characters)."),
  content: z.string().min(20, "Add post content (20+ characters)."),
  coverImage: z.string().url("Enter a valid image URL."),
  author: z.string().min(2, "Enter an author name."),
  category: z.string().min(2, "Enter a category."),
  status: z.enum(["published", "draft"]),
});
export type BlogFormValues = z.infer<typeof blogFormSchema>;

export const testimonialFormSchema = z.object({
  name: z.string().min(2, "Enter a name."),
  role: z.string().min(2, "Enter a role or location."),
  quote: z.string().min(10, "Quote should be at least 10 characters."),
  rating: z.coerce.number().min(1).max(5),
  status: z.enum(["published", "draft"]),
});
export type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

export const faqFormSchema = z.object({
  question: z.string().min(5, "Enter a question."),
  answer: z.string().min(10, "Enter an answer (10+ characters)."),
  category: z.enum(["general", "pools", "landscaping", "maintenance", "pricing"]),
  status: z.enum(["published", "draft"]),
});
export type FaqFormValues = z.infer<typeof faqFormSchema>;

export const settingsFormSchema = z.object({
  siteName: z.string().min(2, "Enter a site name."),
  tagline: z.string().min(2, "Enter a tagline."),
  description: z.string().min(10, "Enter a description."),
  phone: z.string().min(6, "Enter a phone number."),
  email: z.string().email("Enter a valid email address."),
  address: z.string().min(5, "Enter an address."),
});
export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
