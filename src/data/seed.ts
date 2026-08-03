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
    category: "Pools",
    isPublished: true,
    featuredImage:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800&auto=format&fit=crop",
    sections: [
      {
        _id: "b1",
        blockType: "hero_section",
        order: 0,
        layoutStyle: "full_width",
        content: {
          hero: {
            headline: "Bespoke Pools Designed Around Your Architecture",
            subheadline:
              "We engineer and craft high-end swimming pools built to last.",
            bgImage:
              "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800&auto=format&fit=crop",
            ctaText: "Request Consultation",
            ctaLink: "/contact",
          },
        },
      },
      {
        _id: "b2",
        blockType: "features_grid",
        order: 1,
        layoutStyle: "grid_3_col",
        content: {
          features: [
            {
              title: "Infinity Edges",
              description: "Vanishing waters blending into horizons.",
              iconUrl: "Waves",
            },
            {
              title: "Plunge Pools",
              description: "Compact designs for relaxing and cooling down.",
              iconUrl: "Flame",
            },
            {
              title: "Waterproofing",
              description: "Structural engineering and double-barrier sealing.",
              iconUrl: "Shield",
            },
          ],
        },
      },
      {
        _id: "b3",
        blockType: "rich_text_jodit",
        order: 2,
        layoutStyle: "container_centered",
        content: {
          richTextHtml:
            "<h2>Our Process</h2><p>Building a pool requires structural precision and elegant aesthetics. Our team manages the process from geotech testing to final tile polishing. We offer double-membrane waterproofing, shotcrete core design, and app-controlled chemical balances.</p>",
        },
      },
      {
        _id: "b4",
        blockType: "faq_accordion",
        order: 3,
        layoutStyle: "container_centered",
        content: {
          accordionItems: [
            {
              question: "How long does construction take?",
              answer: "Usually 10-14 weeks depending on size.",
            },
            {
              question: "Do you handle municipality permits?",
              answer:
                "Yes, we handle approvals from Nakheel, Dubai Municipality, and Emaar.",
            },
          ],
        },
      },
    ],
    seo: {
      metaTitle: "Custom Swimming Pool Construction Dubai | Aurelia Pools",
      metaDescription:
        "We design and engineer bespoke concrete swimming pools, lap pools, plunge pools, and luxury infinity pools for villas.",
      keywords: [
        "custom pools",
        "infinity pool construction",
        "pool builders dubai",
      ],
    },
    updatedAt: "2026-06-28T10:00:00Z",
  },
  {
    id: "svc_2",
    slug: "landscape-design",
    title: "Landscape Design",
    category: "Landscaping",
    isPublished: true,
    featuredImage:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
    sections: [
      {
        _id: "b2_1",
        blockType: "hero_section",
        order: 0,
        layoutStyle: "full_width",
        content: {
          hero: {
            headline: "Arid Climate Planting Plans and Hardscaping",
            subheadline:
              "Designing premium garden spaces suited to high temperatures.",
            bgImage:
              "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
            ctaText: "View Portfolio",
            ctaLink: "/gallery",
          },
        },
      },
      {
        _id: "b2_2",
        blockType: "features_grid",
        order: 1,
        layoutStyle: "grid_3_col",
        content: {
          features: [
            {
              title: "Native Planting",
              description: "Species adapted to low water conditions.",
              iconUrl: "Sprout",
            },
            {
              title: "Drip Irrigation",
              description: "Automated, efficient sub-surface systems.",
              iconUrl: "Droplets",
            },
            {
              title: "Hardscaping",
              description: "Paving, pathways, and stone feature walls.",
              iconUrl: "Hammer",
            },
          ],
        },
      },
    ],
    seo: {
      metaTitle: "Landscape Design & Luxury Gardening | Aurelia Landscaping",
      metaDescription:
        "Professional landscape design for high-end villas. Xeriscaping, water-efficient drip irrigation, pathways and gazebos.",
      keywords: ["landscape design", "xeriscaping dubai", "villa gardens"],
    },
    updatedAt: "2026-06-20T10:00:00Z",
  },
  {
    id: "svc_3",
    slug: "outdoor-lighting",
    title: "Outdoor Lighting",
    category: "Landscaping",
    isPublished: false,
    featuredImage:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop",
    sections: [
      {
        _id: "b3_1",
        blockType: "hero_section",
        order: 0,
        layoutStyle: "full_width",
        content: {
          hero: {
            headline: "Layered Outdoor Illumination Schemes",
            subheadline:
              "Creating evening atmospheres for pools, gardens, and facades.",
            bgImage:
              "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop",
          },
        },
      },
    ],
    seo: {
      metaTitle: "Landscape & Pool Lighting Design | Aurelia Outdoor",
      metaDescription:
        "Professional low-voltage outdoor lighting. Accent lighting, underwater pool fixtures, garden pathway illumination.",
    },
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
    coverImage:
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=800&auto=format&fit=crop",
    summary:
      "A vanishing-edge pool and full landscape re-design for a villa backing onto a private lake.",
    scope: [
      "Vanishing-edge pool",
      "Native planting scheme",
      "Pergola & majlis deck",
    ],
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
    coverImage:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=800&auto=format&fit=crop",
    summary:
      "A family-first backyard rebuild pairing a shallow-entry pool with a full outdoor kitchen.",
    scope: [
      "Shallow-entry family pool",
      "Outdoor kitchen island",
      "Shade pergola",
    ],
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
    coverImage:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=800&auto=format&fit=crop",
    summary:
      "A plunge pool and container-planted terrace garden engineered for a rooftop load limit.",
    scope: [
      "Rooftop plunge pool",
      "Lightweight planting system",
      "Integrated drainage",
    ],
    status: "draft",
    updatedAt: "2026-07-05T10:00:00Z",
  },
];

export const seedGallery: GalleryImage[] = [];

export const seedBlogPosts: BlogPost[] = [
  {
    id: "post_1",
    slug: "choosing-a-pool-finish",
    title: "Choosing the Right Pool Finish for a Desert Climate",
    excerpt:
      "Plaster, pebble, or tile — the finish you choose affects everything from maintenance cost to look.",
    content:
      "The finish on a pool shell does more than set the color of the water...",
    coverImage:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop",
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
    excerpt:
      "Lush doesn't have to mean thirsty. Here's how we build planting schemes on minimal irrigation.",
    content:
      "A common misconception is that a lush garden requires heavy irrigation...",
    coverImage:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
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
    excerpt:
      "The most common lighting mistake we see is a single bright source instead of layers.",
    content:
      "Good outdoor lighting is rarely about brightness — it's about layering...",
    coverImage:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop",
    author: "Aurelia Design Studio",
    category: "Lighting",
    status: "draft",
    publishedAt: "2026-07-10T10:00:00Z",
    updatedAt: "2026-07-10T10:00:00Z",
  },
];

export const seedTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sara Al Mansoori",
    role: "Homeowner, Al Barari",
    quote:
      "They treated our garden's existing trees as something to design around, not remove.",
    rating: 5,
    status: "published",
    updatedAt: "2026-06-10T10:00:00Z",
  },
  {
    id: "t2",
    name: "James Whitfield",
    role: "Homeowner, Emirates Hills",
    quote: "Clear communication from the first site visit to handover.",
    rating: 5,
    status: "published",
    updatedAt: "2026-06-11T10:00:00Z",
  },
  {
    id: "t3",
    name: "Fatima Rahman",
    role: "Property Manager, Jumeirah Golf Estates",
    quote: "The smoothest pool renovation we've overseen.",
    rating: 4,
    status: "draft",
    updatedAt: "2026-06-12T10:00:00Z",
  },
];

export const seedFaqs: FaqItem[] = [
  {
    id: "f1",
    category: "pools",
    question: "How long does a custom pool build typically take?",
    answer:
      "Most residential pools take 10–14 weeks from groundbreaking to first fill.",
    status: "published",
    updatedAt: "2026-05-01T10:00:00Z",
  },
  {
    id: "f2",
    category: "pools",
    question: "Do you handle permits and approvals?",
    answer:
      "Yes. We manage the full permit and approval process for every construction contract.",
    status: "published",
    updatedAt: "2026-05-02T10:00:00Z",
  },
  {
    id: "f3",
    category: "landscaping",
    question: "Can you work with an existing garden rather than starting over?",
    answer:
      "In most cases, yes — our design team assesses what's worth keeping first.",
    status: "published",
    updatedAt: "2026-05-03T10:00:00Z",
  },
  {
    id: "f4",
    category: "pricing",
    question: "How is a project quoted?",
    answer:
      "After an initial site visit, we provide a fixed-scope quote broken down by phase.",
    status: "draft",
    updatedAt: "2026-07-01T10:00:00Z",
  },
];

export const seedMessages: ContactMessage[] = [
  {
    id: "msg_1",
    name: "Layla Haddad",
    email: "layla@example.com",
    phone: "+971 50 123 4567",
    service: "custom-pool-construction",
    message:
      "We're renovating our backyard in Arabian Ranches and would like a quote for a plunge pool.",
    status: "new",
    receivedAt: "2026-07-15T14:20:00Z",
  },
  {
    id: "msg_2",
    name: "Michael Chen",
    email: "michael@example.com",
    phone: "+971 55 987 6543",
    service: "landscape-design",
    message: "Looking for a full landscape redesign, roughly 600 sqm plot.",
    status: "read",
    receivedAt: "2026-07-14T09:05:00Z",
  },
  {
    id: "msg_3",
    name: "Aisha Rahman",
    email: "aisha@example.com",
    service: "outdoor-lighting",
    message: "Can you provide lighting design for an existing garden and pool?",
    status: "replied",
    receivedAt: "2026-07-11T11:40:00Z",
  },
  {
    id: "msg_4",
    name: "Tom Fletcher",
    email: "tom@example.com",
    phone: "+971 52 222 3344",
    service: "maintenance-programs",
    message:
      "Interested in a quarterly maintenance program for our villa pool.",
    status: "new",
    receivedAt: "2026-07-16T08:15:00Z",
  },
  {
    id: "msg_5",
    name: "Noura Al Suwaidi",
    email: "noura@example.com",
    service: "pool-renovation",
    message:
      "Our 8-year-old pool needs re-tiling, can someone come take a look?",
    status: "archived",
    receivedAt: "2026-07-02T16:50:00Z",
  },
];
