import { z } from "zod";

export const serviceFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().min(3, "Slug must be at least 3 characters.").regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  shortDescription: z.string().min(10, "Add a short description (10+ characters)."),
  description: z.string().min(20, "Add a full description (20+ characters)."),
  heroImage: z.string().url("Enter a valid image URL."),
  features: z.string().min(1, "List at least one feature."),
  status: z.enum(["published", "draft"]),
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
  src: z.string().url("Enter a valid image URL."),
  alt: z.string().min(3, "Add descriptive alt text."),
  category: z.enum(["pools", "landscaping", "outdoor-living", "lighting"]),
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
