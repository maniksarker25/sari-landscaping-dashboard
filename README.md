# Aurelia Admin — Content Management Dashboard

A production-grade admin dashboard for managing the Aurelia Outdoor website
content: services, projects, gallery images, blog posts, testimonials, FAQs,
and contact form submissions.

## Stack

- React 18 + TypeScript (strict mode, no `any`)
- Vite
- Tailwind CSS + shadcn/ui-style components (Radix UI primitives)
- Zustand (with `persist` middleware — all data survives a page refresh)
- React Hook Form + Zod for form validation
- React Router v6
- Recharts for dashboard analytics
- Sonner for toast notifications

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173.

**Demo login:**
- Email: `admin@aureliaoutdoor.com`
- Password: `admin123`

(There's an "Autofill demo credentials" link on the login screen too.)

```bash
npm run build      # type-check + production build
npm run preview    # preview the production build
npm run typecheck
npm run lint
```

## What's included

- **Auth** — mock email/password login, persisted session, protected routes
- **Dashboard overview** — stat cards, an inquiry-volume area chart, a
  service-interest bar chart, recent messages, and quick actions
- **Services** — full CRUD, table view, status (draft/published)
- **Projects** — full CRUD, card/grid view with cover images
- **Gallery** — full CRUD, masonry-style grid with category filtering
- **Blog** — full CRUD, table view with cover thumbnails
- **Testimonials** — full CRUD, card grid with star ratings
- **FAQs** — full CRUD, table view grouped by category
- **Messages** — read-only contact form submissions with status management
  (new/read/replied/archived) and a detail dialog
- **Settings** — site info (name, tagline, contact details), appearance
  (color picker + dark mode), and account info

## Theming — one adjustable primary color

Every accent in the dashboard — buttons, active nav items, badges, chart
colors, focus rings — is driven by a single CSS variable, `--primary`. Every
other color (backgrounds, borders, muted text, destructive/success/warning
states) is a fixed neutral scale defined in `src/index.css`, so changing the
primary color never breaks contrast elsewhere.

**To change it as a user:** go to **Settings → Appearance** and either pick a
preset swatch or use the custom color input. The change applies instantly
across the whole dashboard and is saved to `localStorage`, so it persists
across refreshes.

**How it works under the hood:**
- `src/lib/theme.ts` — converts a hex color to an HSL triple and computes a
  readable foreground (black or white) via a YIQ brightness check
- `src/lib/theme-store.ts` — Zustand store holding the current color + light/dark mode
- `src/components/layout/theme-initializer.tsx` — applies the stored color to
  `document.documentElement` as CSS variables on load and on every change
- `tailwind.config.ts` — maps Tailwind's `primary` color to
  `hsl(var(--primary) / <alpha-value>)`, so every `bg-primary`, `text-primary`,
  `border-primary`, etc. utility class picks up the change automatically

**Never hardcode a color in a component.** Use the semantic Tailwind classes
(`bg-primary`, `text-muted-foreground`, `border-border`, `bg-destructive`,
etc.) so the design system stays centralized.

## Data & persistence

This is a **frontend-only** dashboard — there's no backend API. All content
is seeded from `src/data/seed.ts` and stored in `localStorage` via Zustand's
`persist` middleware, so your edits survive page refreshes but are local to
your browser.

To connect this to a real backend:
1. Replace the store actions in `src/lib/content-stores.ts` / `messages-store.ts`
   with API calls (e.g. `fetch`/`axios` to your REST or GraphQL API)
2. Keep the same store shape (`items`, `add`, `update`, `remove`) so the UI
   layer doesn't need to change
3. Swap the mock `login()` in `src/lib/auth-store.ts` for a real auth endpoint

## Project structure

```
src/
├── components/
│   ├── ui/          # shadcn-style primitives (Button, Dialog, Table, Select…)
│   ├── layout/       # Sidebar, Topbar, DashboardLayout, ProtectedRoute, ThemeInitializer
│   └── common/       # PageHeader, StatCard, StatusBadge, SearchInput, ColorPicker…
├── pages/
│   ├── login/
│   ├── dashboard/
│   ├── services/ | projects/ | gallery/ | blog/ | testimonials/ | faqs/
│   ├── messages/
│   └── settings/
├── lib/              # utils, theme engine, zustand stores, zod schemas
├── data/             # seed.ts — placeholder content
└── types/            # shared TypeScript interfaces
```

## Notes

- This dashboard's content models (`Service`, `Project`, `GalleryImage`,
  `BlogPost`, `Testimonial`, `FaqItem`) mirror the ones used in the public
  Aurelia Outdoor website project, so wiring both up to a shared backend
  later is straightforward.
- Replace the demo credentials and wire up real authentication before any
  production deployment — this build's login is intentionally simple for
  local development and demos.
