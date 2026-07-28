# 🏛️ Aurelia Admin — Outdoor Content Management & Analytics Dashboard

A modern, production-grade admin dashboard and Content Management System (CMS) designed for the **Aurelia Outdoor** website. This application enables comprehensive, real-time control over outdoor service categories, dynamically built landing pages, project portfolios, gallery images, blog posts, testimonials, FAQs, and contact submissions.

---

## 🛠️ Technology Stack & Architecture

This application is built with a modern, strict-type frontend stack optimized for speed, maintainability, and clean user experience.

- **Framework**: React 18 + TypeScript (strict mode, zero usage of `any`).
- **Build Tool**: Vite (blazing fast dev server and optimized production bundles).
- **Styling**: Tailwind CSS + Custom CSS variables mapping.
- **Component Primitives**: Radix UI Primitives (accessible, unstyled, and highly customizable foundations).
- **State Management**: Zustand with persistent storage (`persist` middleware to ensure all configuration and content survives page refreshes).
- **Forms & Validation**: React Hook Form + Zod (comprehensive validation schemas, inline errors, and clean API models).
- **Router**: React Router DOM v6 (declarative client-side routing, protected routes, and layouts).
- **Analytics & Visualizations**: Recharts (fully responsive, styled SVG charts).
- **Notifications**: Sonner (premium toast notifications with rich colors and interactive controls).

---

## 🚀 Key Features List

The Aurelia Admin dashboard includes the following modules:

### 1. 📊 Overview Dashboard & Analytics
A centralized landing hub providing critical metrics and visual data insights:
- **Core KPIs**: Interactive stat cards highlighting *Active Services*, *Published Projects*, *New Messages*, and *Testimonials*, with trend indicators.
- **Inquiry Volume**: An area chart (powered by Recharts) showing a 6-month historical trend of customer contact submissions.
- **Interest by Service**: A horizontal bar chart mapping client interest metrics between pool construction and landscape designs.
- **Recent Messages Inbox Feed**: Quick-view card listing the latest contact form entries, containing author info, message snippets, timestamps, and status badges.
- **Quick Actions**: One-click shortcuts for standard administration tasks.

### 2. 🏗️ Dynamic Service Builder (Hierarchical Page CMS)
A powerful drag-and-drop page builder enabling managers to compose complex landing pages without touching code:
- **Category Splitting**: Segregate service pages dynamically under **Pools** or **Landscaping**.
- **Real-time Live Preview**: A side-by-side pane rendering the public-facing view of the service page in real-time as sections are modified.
- **Drag-and-Drop Reordering**: Change layout structure on the fly using active grab-handle draggable rows.
- **Status Controls**: Toggle between *Published* and *Draft* status with instant updates.
- **SEO & Metadata Panel**: Custom inputs for SEO Title, Meta Description, Keywords, Canonical URLs, and Open Graph (OG) Images.
- **Modular Blocks Directory**:
  - **Hero Section**: Headline, subheadline, customizable call-to-action (CTA) buttons, and background image preset selector.
  - **Rich Text**: Full-content editor using HTML block components.
  - **Features Grid**: Multi-column list detailing core highlights with customizable icon options.
  - **Gallery Grid**: Configurable image collections with custom caption overlays and alt-text tags.
  - **FAQ Accordion**: Built-in question & answer accordions specific to a service.
  - **CTA Banner**: Highlighted banners featuring descriptions, action links, and click-to-call phone numbers.
  - **Technical Specs**: Tabular list of technical properties (e.g., depths, shell materials, warranty details).
  - **Contact Form**: An integrated block allowing visitors to request consultation details.
- **Layout Template Engine**: Select layout styling presets per section block (e.g., Default Flex, Full Screen Width, Centered Container, 2-Column Grid, 3-Column Grid, 4-Column Grid, Two Column Split, Accent Background Block).

### 3. 🖼️ Gallery Media Manager
A masonry grid manager for website imagery:
- **Masonry Layout**: Renders images dynamically in an organized grid.
- **Category Filter**: Filter gallery photos between pools and landscaping.
- **Media CRUD**: Add new images (via URL endpoints), modify descriptive alt texts, re-categorize, and delete assets with safety confirmation dialogs.

### 4. 📝 Blog Article Workspace
A blog publishing workflow page:
- **Data Table View**: Overview of all articles containing cover image thumbnails, titles, authors, categories, status badges, and formatted publication dates.
- **Interactive Search**: Real-time filtering matching by title, category, or author.
- **Post Form Drawer**: Slide-out dialog with Zod validation managing titles, excerpts, HTML content, slug verification, cover images, author assignments, and publish schedules.

### 5. 💬 Testimonials CMS
Manage customer social proof:
- **Card-Grid Layout**: Easy visual scan of client feedback.
- **Star Rating Selector**: Configurable visual star ratings (1 to 5 stars).
- **CRUD Operations**: Add, edit, or archive client reviews with customized names, roles/locations, and testimonials.

### 6. ❓ FAQs Knowledge Center
A unified management tool for frequently asked questions:
- **Categorized Groups**: FAQ entries sorted by category (*General*, *Pools*, *Landscaping*, *Maintenance*, *Pricing*).
- **Table Controls**: Add, edit, draft, and delete FAQs with validation rules requiring clean content formatting.

### 7. 📬 Inbox & Contact Form Messages
A read-only customer relation panel for incoming website submissions:
- **Status Manager**: Move messages through lifecycle stages (*New*, *Read*, *Replied*, *Archived*).
- **Message detail dialog**: Opens detail views displaying client metadata (name, email, phone, requested service, message body, and receipt date).

### 8. 🎨 Global Settings & Theme Engine
Configure business settings and change UI appearance instantly:
- **Site Profile Info**: Modify details such as Site Name, Tagline, Description, Support Phone, Email, Physical Address, and Social Media links.
- **Custom Accent Selector**: Select predefined color swatches or type custom hex colors. The engine automatically converts input to HSL values (`--primary`), checks YIQ brightness to set readable text contrast on active elements, and applies variables globally.
- **Light & Dark Theme Toggle**: One-click system-wide theme switching.
- **Credentials & Profile**: Simulation of profile details and password changes.

---

## 🎨 Theme Engine Configuration Details

Accent highlights (buttons, navigation elements, badges, charts, indicators) are controlled by a single CSS variable: `--primary`. Neutral background tones, cards, inputs, and borders use a fixed neutral color palette defined in `src/index.css` to prevent contrast issues.

**Under the Hood:**
1. **Conversion (`src/lib/theme.ts`)**: Converts input hex codes to HSL triples and calculates foreground colors (black/white) using YIQ brightness checks to maintain readability.
2. **State (`src/lib/theme-store.ts`)**: Stored in a Zustand state engine persisted to `localStorage`.
3. **Application (`src/components/layout/theme-initializer.tsx`)**: Injects the active HSL value into the `document.documentElement` dynamically.
4. **Tailwind Mapping (`tailwind.config.ts`)**: Configured to map `primary` to the dynamic variable:
   ```ts
   // tailwind.config.ts
   colors: {
     primary: {
       DEFAULT: "hsl(var(--primary) / <alpha-value>)",
       foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
     }
   }
   ```

---

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/             # Radix UI + shadcn primitive components (Buttons, Dialogs, Tables, Inputs)
│   ├── layout/         # Core layouts (Sidebar, Topbar, Main Dashboard Layout, Route Guards)
│   ├── common/         # Reusable widgets (PageHeader, StatCard, StatusBadge, SearchInput)
│   └── services/       # Builder components (Category pickers, block editors, preview templates)
├── pages/
│   ├── login/          # Mock Authentication interface
│   ├── dashboard/      # Overview analytics and charts
│   ├── services/       # Service CMS & dynamic page builders
│   ├── gallery/        # Masonry filterable image grid
│   ├── blog/           # Blog post table & form dialogs
│   ├── testimonials/   # Customer reviews grid
│   ├── faqs/           # Frequently asked questions list
│   ├── messages/       # Contact form submissions inbox
│   └── settings/       # Profile configuration & styling workspace
├── lib/                # Theme engines, utility builders, zustand stores, and Zod schemas
├── data/               # seed.ts — Initial fallback mock dataset
└── types/              # TypeScript declarations and schema models
```

---

## 💾 Data Flow & Future Backend Integration

Aurelia Admin is currently a **frontend-only** client. It is configured to run out-of-the-box using local storage persistence:

- **Current Architecture**: Content is seeded from `src/data/seed.ts` and managed locally inside the browser memory. Zustand stores use `persist` middleware to ensure all data is preserved during restarts and page reloads.
- **Backend Migration**:
  1. Replace content store calls in `src/lib/content-stores.ts` and `src/lib/messages-store.ts` with API actions (e.g., using `fetch` or `axios`).
  2. Keep current store signatures (`items`, `add`, `update`, `remove`) intact so no layout or page component code needs alteration.
  3. Replace the mock authentication methods in `src/lib/auth-store.ts` with your actual JWT authentication endpoint.

---

## 🏁 Getting Started

Follow these steps to run the admin dashboard locally:

### 1. Installation
Install the project dependencies:
```bash
npm install
```

### 2. Run Local Development Server
Start the Vite developer environment:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Demo Credentials
Log into the interface with these credentials:
- **Email**: `admin@aureliaoutdoor.com`
- **Password**: `admin123`
*(An "Autofill demo credentials" helper link is available on the login page)*

### 4. Build and Code Quality Commands
Use the following commands to check quality and compile the project:
```bash
npm run build      # Perform TypeScript compilation check & create production build
npm run preview    # Run local preview of compiled production bundle
npm run typecheck  # Run strict TypeScript compiler verification
npm run lint       # Run ESLint validation checks
```
