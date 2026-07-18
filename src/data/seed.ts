import type {
  Service,
  Project,
  GalleryImage,
  BlogPost,
  Testimonial,
  FaqItem,
  ContactMessage,
} from "@/types";

export const seedServices: Service[] = [
  {
    id: "svc_1",
    slug: "custom-pool-construction",
    title: "Custom Pool Construction",
    shortDescription: "Engineered swimming pools shaped around your architecture.",
    description:
      "We design and build swimming pools as an extension of your home's architecture rather than an afterthought in the yard.",
    heroImage: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800&auto=format&fit=crop",
    features: ["Infinity & vanishing-edge pools", "Plunge & lap pools", "Structural engineering & waterproofing"],
    status: "published",
    updatedAt: "2026-06-28T10:00:00Z",
  },
  {
    id: "svc_2",
    slug: "landscape-design",
    title: "Landscape Design",
    shortDescription: "Planting plans and hardscaping built for the climate.",
    description: "Our landscape team designs planting schemes and hardscape layouts suited to arid climates.",
    heroImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
    features: ["Native & climate-adapted planting", "Drip irrigation design", "Hardscaping & pathways"],
    status: "published",
    updatedAt: "2026-06-20T10:00:00Z",
  },
  {
    id: "svc_3",
    slug: "outdoor-lighting",
    title: "Outdoor Lighting",
    shortDescription: "Layered lighting design for pools, gardens, and facades.",
    description: "Lighting is where a landscape either comes alive at night or disappears.",
    heroImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop",
    features: ["Underwater pool lighting", "Garden & pathway lighting", "App-controlled smart scenes"],
    status: "draft",
    updatedAt: "2026-07-02T10:00:00Z",
  },
];

export const seedProjects: Project[] = [
  {
    id: "proj_1",
    slug: "al-barari-villa-oasis",
    title: "Al Barari Villa Oasis",
    category: "Pool & Landscape",
    location: "Dubai, UAE",
    year: "2024",
    coverImage: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=800&auto=format&fit=crop",
    summary: "A vanishing-edge pool and full landscape re-design for a villa backing onto a private lake.",
    scope: ["Vanishing-edge pool", "Native planting scheme", "Pergola & majlis deck"],
    status: "published",
    updatedAt: "2026-06-15T10:00:00Z",
  },
  {
    id: "proj_2",
    slug: "emirates-hills-family-retreat",
    title: "Emirates Hills Family Retreat",
    category: "Outdoor Living",
    location: "Dubai, UAE",
    year: "2023",
    coverImage: "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=800&auto=format&fit=crop",
    summary: "A family-first backyard rebuild pairing a shallow-entry pool with a full outdoor kitchen.",
    scope: ["Shallow-entry family pool", "Outdoor kitchen island", "Shade pergola"],
    status: "published",
    updatedAt: "2026-05-30T10:00:00Z",
  },
  {
    id: "proj_3",
    slug: "palm-jumeirah-penthouse-terrace",
    title: "Palm Jumeirah Penthouse Terrace",
    category: "Rooftop & Terrace",
    location: "Dubai, UAE",
    year: "2024",
    coverImage: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=800&auto=format&fit=crop",
    summary: "A plunge pool and container-planted terrace garden engineered for a rooftop load limit.",
    scope: ["Rooftop plunge pool", "Lightweight planting system", "Integrated drainage"],
    status: "draft",
    updatedAt: "2026-07-05T10:00:00Z",
  },
];

export const seedGallery: GalleryImage[] = [
  { id: "g1", category: "pools", src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600&auto=format&fit=crop", alt: "Infinity-edge pool at dusk", updatedAt: "2026-06-01T10:00:00Z" },
  { id: "g2", category: "landscaping", src: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=600&auto=format&fit=crop", alt: "Landscaped garden pathway", updatedAt: "2026-06-02T10:00:00Z" },
  { id: "g3", category: "outdoor-living", src: "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=600&auto=format&fit=crop", alt: "Outdoor kitchen and pergola", updatedAt: "2026-06-03T10:00:00Z" },
  { id: "g4", category: "lighting", src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600&auto=format&fit=crop", alt: "Garden path lighting at night", updatedAt: "2026-06-04T10:00:00Z" },
  { id: "g5", category: "pools", src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=600&auto=format&fit=crop", alt: "Renovated pool with new tiling", updatedAt: "2026-06-05T10:00:00Z" },
  { id: "g6", category: "pools", src: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=600&auto=format&fit=crop", alt: "Villa pool with lake backdrop", updatedAt: "2026-06-06T10:00:00Z" },
];

export const seedBlogPosts: BlogPost[] = [
  {
    id: "post_1",
    slug: "choosing-a-pool-finish",
    title: "Choosing the Right Pool Finish for a Desert Climate",
    excerpt: "Plaster, pebble, or tile — the finish you choose affects everything from maintenance cost to look.",
    content: "The finish on a pool shell does more than set the color of the water...",
    coverImage: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop",
    author: "Aurelia Design Studio",
    category: "Pools",
    status: "published",
    publishedAt: "2026-05-12T10:00:00Z",
    updatedAt: "2026-05-12T10:00:00Z",
  },
  {
    id: "post_2",
    slug: "drought-tolerant-planting-guide",
    title: "A Practical Guide to Drought-Tolerant Planting",
    excerpt: "Lush doesn't have to mean thirsty. Here's how we build planting schemes on minimal irrigation.",
    content: "A common misconception is that a lush garden requires heavy irrigation...",
    coverImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
    author: "Aurelia Design Studio",
    category: "Landscaping",
    status: "published",
    publishedAt: "2026-03-02T10:00:00Z",
    updatedAt: "2026-03-02T10:00:00Z",
  },
  {
    id: "post_3",
    slug: "outdoor-lighting-layering",
    title: "Why Outdoor Lighting Should Be Layered, Not Uniform",
    excerpt: "The most common lighting mistake we see is a single bright source instead of layers.",
    content: "Good outdoor lighting is rarely about brightness — it's about layering...",
    coverImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop",
    author: "Aurelia Design Studio",
    category: "Lighting",
    status: "draft",
    publishedAt: "2026-07-10T10:00:00Z",
    updatedAt: "2026-07-10T10:00:00Z",
  },
];

export const seedTestimonials: Testimonial[] = [
  { id: "t1", name: "Sara Al Mansoori", role: "Homeowner, Al Barari", quote: "They treated our garden's existing trees as something to design around, not remove.", rating: 5, status: "published", updatedAt: "2026-06-10T10:00:00Z" },
  { id: "t2", name: "James Whitfield", role: "Homeowner, Emirates Hills", quote: "Clear communication from the first site visit to handover.", rating: 5, status: "published", updatedAt: "2026-06-11T10:00:00Z" },
  { id: "t3", name: "Fatima Rahman", role: "Property Manager, Jumeirah Golf Estates", quote: "The smoothest pool renovation we've overseen.", rating: 4, status: "draft", updatedAt: "2026-06-12T10:00:00Z" },
];

export const seedFaqs: FaqItem[] = [
  { id: "f1", category: "pools", question: "How long does a custom pool build typically take?", answer: "Most residential pools take 10–14 weeks from groundbreaking to first fill.", status: "published", updatedAt: "2026-05-01T10:00:00Z" },
  { id: "f2", category: "pools", question: "Do you handle permits and approvals?", answer: "Yes. We manage the full permit and approval process for every construction contract.", status: "published", updatedAt: "2026-05-02T10:00:00Z" },
  { id: "f3", category: "landscaping", question: "Can you work with an existing garden rather than starting over?", answer: "In most cases, yes — our design team assesses what's worth keeping first.", status: "published", updatedAt: "2026-05-03T10:00:00Z" },
  { id: "f4", category: "pricing", question: "How is a project quoted?", answer: "After an initial site visit, we provide a fixed-scope quote broken down by phase.", status: "draft", updatedAt: "2026-07-01T10:00:00Z" },
];

export const seedMessages: ContactMessage[] = [
  { id: "msg_1", name: "Layla Haddad", email: "layla@example.com", phone: "+971 50 123 4567", service: "custom-pool-construction", message: "We're renovating our backyard in Arabian Ranches and would like a quote for a plunge pool.", status: "new", receivedAt: "2026-07-15T14:20:00Z" },
  { id: "msg_2", name: "Michael Chen", email: "michael@example.com", phone: "+971 55 987 6543", service: "landscape-design", message: "Looking for a full landscape redesign, roughly 600 sqm plot.", status: "read", receivedAt: "2026-07-14T09:05:00Z" },
  { id: "msg_3", name: "Aisha Rahman", email: "aisha@example.com", service: "outdoor-lighting", message: "Can you provide lighting design for an existing garden and pool?", status: "replied", receivedAt: "2026-07-11T11:40:00Z" },
  { id: "msg_4", name: "Tom Fletcher", email: "tom@example.com", phone: "+971 52 222 3344", service: "maintenance-programs", message: "Interested in a quarterly maintenance program for our villa pool.", status: "new", receivedAt: "2026-07-16T08:15:00Z" },
  { id: "msg_5", name: "Noura Al Suwaidi", email: "noura@example.com", service: "pool-renovation", message: "Our 8-year-old pool needs re-tiling, can someone come take a look?", status: "archived", receivedAt: "2026-07-02T16:50:00Z" },
];
