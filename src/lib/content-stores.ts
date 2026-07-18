import { createEntityStore } from "@/lib/create-entity-store";
import type { Service, Project, GalleryImage, BlogPost, Testimonial, FaqItem } from "@/types";
import {
  seedServices,
  seedProjects,
  seedGallery,
  seedBlogPosts,
  seedTestimonials,
  seedFaqs,
} from "@/data/seed";

export const useServicesStore = createEntityStore<Service>("aurelia-admin-services", seedServices);
export const useProjectsStore = createEntityStore<Project>("aurelia-admin-projects", seedProjects);
export const useGalleryStore = createEntityStore<GalleryImage>("aurelia-admin-gallery", seedGallery);
export const useBlogStore = createEntityStore<BlogPost>("aurelia-admin-blog", seedBlogPosts);
export const useTestimonialsStore = createEntityStore<Testimonial>(
  "aurelia-admin-testimonials",
  seedTestimonials
);
export const useFaqsStore = createEntityStore<FaqItem>("aurelia-admin-faqs", seedFaqs);
