export type ContentStatus = "published" | "draft";

export interface HeroContent {
  headline: string;
  subheadline?: string;
  bgImage: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface FeatureItem {
  title: string;
  description?: string;
  iconUrl?: string;
}

export interface GalleryItem {
  uploadKey?: string;
  imageUrl?: string;
  caption?: string;
  altText?: string;
  file?: File;
}

export interface AccordionItem {
  question: string;
  answer: string;
}

export interface CtaContent {
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  phoneNumber?: string;
}

export interface TechnicalSpec {
  label: string;
  value: string;
}

export interface BlockContent {
  hero?: HeroContent;
  richTextHtml?: string;
  features?: FeatureItem[];
  gallery?: GalleryItem[];
  accordionItems?: AccordionItem[];
  cta?: CtaContent;
  specs?: TechnicalSpec[];
}

export type BlockType =
  | "hero_section"
  | "rich_text_jodit"
  | "features_grid"
  | "gallery_grid"
  | "faq_accordion"
  | "cta_banner"
  | "technical_specs"
  | "contact_form";

export type LayoutStyle =
  | "grid_2_col"
  | "grid_3_col"
  | "grid_4_col"
  | "grid_6_col"
  | "default"
  | "full_width"
  | "container_centered"
  | "two_column_split"
  | "card_grid"
  | "accent_bg";

export interface PageBlock {
  _id?: string;
  blockType: BlockType;
  order: number;
  layoutStyle: LayoutStyle;
  content: BlockContent;
}

export interface SeoSettings {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
}

export interface Service {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  category: "Pools" | "Landscaping";
  isPublished: boolean;
  featuredImage: string;
  featuredImageFile?: File;
  sections: PageBlock[];
  seo?: SeoSettings;
  createdAt?: string;
  updatedAt?: string;
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
  category: "pools" | "landscaping";
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

export type FaqCategory =
  | "general"
  | "pools"
  | "landscaping"
  | "maintenance"
  | "pricing";

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
