# Opportuni — Codebase Analysis

## 1. Project Overview

**Opportuni** is a platform connecting young talents in Latin America (primarily Mexico and Colombia) with scholarships, job opportunities, accelerator programs, and professional development resources. It operates with 2,500+ members across WhatsApp communities.

- **Framework:** Next.js 14.2.18 (App Router)
- **Language:** TypeScript 5
- **UI:** React 18.3.1, Tailwind CSS 3.4
- **3D Graphics:** React Three Fiber + Drei + Three.js
- **AI Integration:** Anthropic Claude API (`@anthropic-ai/sdk`)
- **Authentication:** Accesly SDK (social login)
- **Package Manager:** Bun (with npm fallback)
- **Deployment:** Vercel (auto-deploy)

---

## 2. Directory Structure

```
opportuni/
├── app/                            # Next.js App Router
│   ├── api/                        # Serverless API routes
│   │   ├── chat/route.ts           # Claude-powered opportunity search
│   │   ├── vacantes/route.ts       # Job listings CRUD
│   │   └── cv/route.ts             # CV submission (revision & asesoría)
│   ├── lib/                        # Utilities and data stores
│   │   ├── vacantes-store.ts       # Job listings data + CRUD logic
│   │   ├── convocatorias-store.ts  # Scholarships/programs data
│   │   └── convocatorias.json      # Static list of 29+ opportunities
│   ├── chat/page.tsx               # AI-powered opportunity finder
│   ├── vacantes/page.tsx           # Job listings page
│   ├── convocatorias/page.tsx      # Scholarships/programs page
│   ├── cv/                         # CV services
│   │   ├── page.tsx                # CV builder wizard
│   │   ├── revision/page.tsx       # CV review form
│   │   └── asesoria/page.tsx       # 1-on-1 career counseling
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   ├── providers.tsx               # Accesly context provider
│   └── globals.css                 # Global styles & Tailwind directives
├── public/                         # Static assets (logos)
├── tailwind.config.ts              # Custom Tailwind theme
├── next.config.js                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── postcss.config.mjs              # PostCSS plugins
└── .env.example                    # Environment variable template
```

---

## 3. Frontend Architecture

### Pages & Routing

| Route | Purpose |
|---|---|
| `/` | Landing page — hero, value proposition, testimonials, FAQ, WhatsApp join flow |
| `/chat` | AI chatbot for opportunity discovery (login required) |
| `/vacantes` | Job listings with type filtering (remoto / presencial / híbrido) |
| `/convocatorias` | Curated scholarships, accelerators, grants (members-only) |
| `/cv` | Multi-step CV builder wizard (corporativo / creativo styles) |
| `/cv/revision` | CV review submission form (paid: $300 MXN) |
| `/cv/asesoria` | 1-on-1 career counseling booking (paid: $300 MXN / 30 min) |

### State Management

- **Local state only** — React `useState` hooks throughout; no Redux, Zustand, or global stores.
- **Auth context** — Accesly provider wraps the app; components access user data via `useAccesly()`.
- **Data fetching** — Client-side `fetch()` calls to internal API routes.

### Styling

- **Tailwind CSS** with extensive custom theme extensions.
- **CSS variables** in `globals.css` for the brand palette:
  - Rosa (`#e3216d`), Naranja (`#f89b0e`), Lila (`#7c5cfc`), Teal (`#0ec4a9`)
  - Cream (`#fdf6ee`), Dark (`#1a1a2e`)
- **Bento design system** — thick borders, offset drop shadows, playful rounded corners, bold typography.
- **Custom animations** — float, pulse, slide-up, scroll, twinkle, bop (15+ keyframe definitions).
- **Fonts** — Bricolage Grotesque, DM Mono, Gabarito, Playfair Display (Google Fonts via `next/font`).

### Component Patterns

- All pages are `"use client"` (client-side rendered).
- Inline component definitions within page files (no shared component library).
- Auth guards on `/chat` and `/convocatorias` check `wallet` before rendering.
- Utility functions like `getNameFromEmail()` for display name extraction.

---

## 4. Backend / API

### Route Handlers

**`GET /api/vacantes`** — Returns all job listings.

**`POST /api/vacantes`** — Creates a new job posting with validation (required: titulo, empresa, ubicacion, tipo, descripcion; optional: salario, requisitos[], url).

**`DELETE /api/vacantes?id={id}`** — Removes a job by ID.

**`POST /api/chat`** — Sends user messages to Claude Sonnet for intelligent opportunity matching. Accepts `{ messages[], userProfile? }`. Returns matched opportunities in structured JSON. Falls back gracefully if `ANTHROPIC_API_KEY` is missing.

**`POST /api/cv`** — Handles CV review submissions (FormData with file upload) and asesoría requests (JSON). Supports types: `revision` and `asesoria`. Uses in-memory storage.

### Data Layer

- **In-memory JavaScript arrays** — no database, no ORM.
- `vacantes-store.ts` — `Vacante` interface with CRUD functions (`getVacantes`, `addVacante`, `removeVacante`). Ships with 2 sample listings.
- `convocatorias-store.ts` — `Convocatoria` interface with 14 fields and 13 opportunity types. Loads from a static JSON file containing 29+ curated opportunities.

### Authentication

- **Accesly SDK** provides social login.
- Lightweight — wallet contains email; no role-based access control.

---

## 5. Key Dependencies

### Production

| Package | Version | Purpose |
|---|---|---|
| `next` | 14.2.18 | React framework (App Router) |
| `react` / `react-dom` | 18.3.1 | UI library |
| `@anthropic-ai/sdk` | 0.74.0 | Claude API for AI chat |
| `@react-three/fiber` | 8.15.19 | React renderer for Three.js |
| `@react-three/drei` | 9.92.7 | Three.js helpers and abstractions |
| `three` | 0.182.0 | 3D graphics engine |
| `accesly` | 0.1.3 | Social login SDK |

### Development

| Package | Purpose |
|---|---|
| `typescript` ^5 | Type checking |
| `tailwindcss` ^3.4 | Utility-first CSS |
| `postcss` ^8 + `autoprefixer` ^10 | CSS processing |
| `@types/node`, `@types/react`, `@types/react-dom`, `@types/three` | Type definitions |

---

## 6. Configuration

- **`next.config.js`** — Minimal; `reactStrictMode: true` only.
- **`tsconfig.json`** — Strict mode, ESNext target, bundler module resolution, `@/*` path alias.
- **`tailwind.config.ts`** — Custom colors (opportuni palette), bento border radii (16/28/36px), color-specific box shadows, 15+ animation keyframes.
- **Environment variables** — `NEXT_PUBLIC_ACCESLY_APP_ID` (client), `ANTHROPIC_API_KEY` (server).

---

## 7. Design Patterns & Architecture Decisions

### Patterns

1. **Bento design system** — Consistent visual language across all UI: thick borders, offset shadows, rounded corners, vibrant colors.
2. **Client-side rendering** — Every page uses `"use client"` for interactivity.
3. **API-driven data** — Jobs and opportunities fetched via internal API routes, not SSR.
4. **Progressive fallbacks** — Chat API gracefully handles missing API keys.
5. **Monolithic pages** — Each page file contains its own components, styles, and logic.

### Notable Decisions

- **No database** — In-memory stores are sufficient for the current MVP but will need migration for production.
- **No component library** — All UI is custom Tailwind + CSS; no shadcn, Chakra UI, or similar.
- **No global state management** — React hooks only; complexity is low enough to avoid Redux/Zustand.
- **Direct Claude integration** — Server-side API route calls Claude directly for intelligent opportunity matching.
- **Spanish-first** — All user-facing content is in Spanish, targeting LATAM audiences.

---

## 8. Features

1. **Job Listings** — Browse and filter jobs by modality (remoto, presencial, híbrido).
2. **AI Chat Assistant** — Natural language search for opportunities, powered by Claude.
3. **Curated Convocatorias** — 29+ pre-vetted scholarships, accelerators, grants, competitions (members-only access).
4. **CV Builder** — Multi-step wizard generating professional CVs in two styles (corporativo, creativo).
5. **CV Review Service** — Submit a CV for human expert feedback ($300 MXN).
6. **Career Counseling** — 1-on-1 sessions with a career advisor ($300 MXN / 30 min).
7. **WhatsApp Communities** — Direct join links for Mexico (+8K members) and Colombia (+1.5K members).
8. **Social Authentication** — Login via Accesly SDK.

---

## 9. Deployment

- **Platform:** Vercel with automatic deploys from the main branch.
- **Build command:** `next build`
- **Dev server:** `bun run dev` / `npm run dev`
- **No Docker, CI/CD pipelines, or infrastructure-as-code** — relies entirely on Vercel's managed platform.

---

## 10. Areas for Improvement

- **Persistence** — Replace in-memory stores with a database (e.g., PostgreSQL, Supabase, PlanetScale).
- **Server-side rendering** — Leverage Next.js SSR/RSC for SEO-critical pages (landing, vacantes, convocatorias).
- **Component extraction** — Break monolithic page files into reusable components in a shared `components/` directory.
- **Testing** — No test files exist; add unit and integration tests.
- **API validation** — Add schema validation (e.g., Zod) for API inputs.
- **Error handling** — Improve error boundaries and user-facing error states.
- **Internationalization** — Add i18n support for potential expansion beyond Spanish-speaking markets.
- **Accessibility** — Audit and improve ARIA attributes, keyboard navigation, and screen reader support.
