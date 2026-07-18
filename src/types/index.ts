export type ContentStatus = "published" | "draft";

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  features: string[];
  status: ContentStatus;
  updatedAt: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  coverImage: string;
  summary: string;
  scope: string[];
  status: ContentStatus;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: "pools" | "landscaping" | "outdoor-living" | "lighting";
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  status: ContentStatus;
  publishedAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  status: ContentStatus;
  updatedAt: string;
}

export type FaqCategory = "general" | "pools" | "landscaping" | "maintenance" | "pricing";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  status: ContentStatus;
  updatedAt: string;
}

export type MessageStatus = "new" | "read" | "replied" | "archived";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  status: MessageStatus;
  receivedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "editor";
  avatarInitials: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  socials: { label: string; href: string }[];
}
