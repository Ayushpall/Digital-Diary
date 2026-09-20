# Digital Diary — Architecture & Technical Reference

> A sensory, tactile digital journaling application designed to recreate the intimate sensation of writing with authentic pen on paper, backed by multi-tenant cloud persistence.

---

## 1. High-Level System Architecture

```mermaid
graph TD
    subgraph Client ["Client Layer (Browser)"]
        UI[Next.js 15 App Router & React 19]
        Flipbook[Framer Motion 3D Flipbook Engine]
        Ink[Handwriting & Paper Texture Renderer]
        Canvas[HTML5 2D Drawing & Keepsake Canvas]
        Paging[Intelligent Sentence-Boundary Pagination]
    end

    subgraph Middleware ["Auth & Security Edge"]
        ClerkEdge[Clerk Next.js Middleware]
        RouteGuard[Protected Routes: /dashboard, /editor, /diary, /calendar]
    end

    subgraph API ["Serverless API Layer (/api)"]
        EntriesAPI["/api/entries (CRUD, search, pagination)"]
        DiariesAPI["/api/diaries (Volume management, covers)"]
        StatsAPI["/api/stats (Tenant reflections, streaks)"]
        HealthAPI["/api/health (Database connectivity probe)"]
    end

    subgraph Persistence ["Data & Storage Layer"]
        PrismaORM[Prisma ORM Client]
        NeonPG[(Neon Serverless PostgreSQL)]
        PublicAssets[Public Covers & Kept Assets]
    end

    UI --> ClerkEdge
    ClerkEdge --> API
    API --> PrismaORM
    PrismaORM --> NeonPG
    UI -.-> PublicAssets
```

---

## 2. Directory Structure & Codebase Organization

```
d:/Antigravity/Digital diary/
├── prisma/
│   └── schema.prisma           # Database models, relations & indexes
├── public/
│   ├── covers/                 # High-resolution keepsake cover artworks
│   │   ├── embossed-leather.png
│   │   ├── rain-forest.png
│   │   ├── writer-celestial.png
│   │   └── creative-typewriter.png
│   ├── sound/                  # Physical paper-flip velvet audio effects
│   └── textures/               # Paper grain, lined rules, parchment overlays
├── src/
│   ├── app/                    # Next.js App Router Pages & API Endpoints
│   │   ├── (auth)/             # Clerk Sign-In & Sign-Up routes
│   │   ├── api/
│   │   │   ├── diaries/        # GET, POST, DELETE /api/diaries/[id]
│   │   │   ├── entries/        # GET, POST, PUT, DELETE /api/entries/[id]
│   │   │   ├── health/         # System heartbeat probe
│   │   │   └── stats/          # Word counts, volumes bound, streaks
│   │   ├── calendar/           # Timeline memory calendar with single-leaf flip
│   │   ├── dashboard/          # Desk hub, volume grid, recent entries, theme gallery
│   │   ├── diary/demo/         # 3D physical book simulation reading room
│   │   ├── editor/demo/        # Creative writing studio (ink, sketches, keepsakes)
│   │   ├── search/             # Full-text reflection search & date filtering
│   │   ├── layout.tsx          # Root font loading (Newsreader, Kalam, Outfit)
│   │   └── page.tsx            # Heirloom landing experience
│   ├── components/
│   │   ├── calendar/           # CalendarView grid & CalendarEntry leaf
│   │   ├── creative/           # DrawingCanvas, ImageUploader, StickerPicker
│   │   ├── dashboard/          # DiaryGrid, RecentEntries, DiaryStats, Header
│   │   ├── diary/              # DiaryBook, DiaryCover, DiaryPage, PageFlip
│   │   ├── editor/             # EditorToolbar, TextEditor
│   │   ├── handwriting/        # HandwritingRenderer (fluid ink variations)
│   │   └── layout/             # DashboardSidebar, MobileBottomNav
│   ├── lib/
│   │   ├── cover-themes.ts     # Registry for illustrated & leather cover styles
│   │   ├── pagination.ts       # Sentence-aware text pagination engine
│   │   ├── prisma.ts           # Global singleton PrismaClient instance
│   │   └── use-diary-data.ts   # SWR/optimistic state management hook
│   ├── types/                  # Shared TypeScript interfaces
│   └── middleware.ts           # Clerk authentication route guard
```

---

## 3. Database Architecture (Neon PostgreSQL)

```mermaid
erDiagram
    User ||--o{ Diary : "binds"
    User ||--o{ Entry : "pens"
    User ||--o{ Tag : "creates"
    Diary ||--o{ Entry : "contains"

    User {
        string id PK "Clerk User ID"
        string email UK
        string name
        string imageUrl
        string tier "free | pro"
        datetime createdAt
        datetime updatedAt
    }

    Diary {
        string id PK "cuid()"
        string userId FK
        string title
        string description
        string coverColor "embossed-leather | rain-forest | writer-celestial | ..."
        string paperStyle "ruled | dots | blank"
        boolean isFavorite
        datetime createdAt
        datetime updatedAt
    }

    Entry {
        string id PK "cuid()"
        string userId FK
        string diaryId FK
        string title
        string content "Text"
        json blocks "Creative media attachments"
        string handwritingFont "cursive | sans | serif"
        string inkColor "midnight | sepia | forest | royal"
        datetime date
        string mood "happy | reflective | peaceful | ..."
        string weather
        boolean isFavorite
        datetime createdAt
        datetime updatedAt
    }

    Tag {
        string id PK "cuid()"
        string userId FK
        string name
        string color
    }
```

### Multi-Tenant Isolation Guarantees
- **Tenant Scoping:** Every query in `/api/diaries` and `/api/entries` enforces `where: { userId }` using Clerk's cryptographically verified session token (`await auth()`).
- **Cascade Cleanup:** Deleting a `Diary` volume uses Prisma `onDelete: Cascade` to safely erase all contained `Entry` leaves without orphaned records.

---

## 4. Key Architectural Systems

### A. 3D Page Flip Simulation (`src/components/diary/PageFlip.tsx`)
- Powered by `framer-motion` using CSS 3D perspectives (`perspective: 1400px`) and `transform-style: preserve-3d`.
- **Double-Spread Mode:** Desktop reading room flips 2-page leaves (`origin: "auto"`).
- **Single-Leaf Mode:** Calendar and mobile views flip a single leaf anchored directly to the left leather book spine (`origin: "left"`).

### B. Natural Text Pagination Engine (`src/lib/pagination.ts`)
- Prevents awkward text overflow and maintains realistic notebook proportions.
- Scans character chunks (default: 380 chars for single leaves, 500 chars for spreads) and prioritizes:
  1. Double newlines (paragraph ends).
  2. Single newlines (verse/line breaks).
  3. Punctuation boundaries (`. `, `! `, `? `).
  4. Word spaces (never breaks mid-word).

### C. Heirloom Cover Themes Registry (`src/lib/cover-themes.ts`)
- Central source of truth for all journal cover styles.
- **Illustrated Artworks:**
  - `embossed-leather` (Saddle leather with flying birds & wrap tie)
  - `rain-forest` (Dewdrop foliage & misty forest watercolor)
  - `writer-celestial` (Starlight midnight ink, scroll & inkwell)
  - `creative-typewriter` (Vintage typewriter with artistic swirls)
- **Classic Leathers:** `burgundy`, `forest`, `navy`, `leather`.
- Rendered dynamically in [DiaryCover.tsx](file:///d:/Antigravity/Digital%20diary/src/components/diary/DiaryCover.tsx) with stitched borders, brass filigree corner hardware, and bookmark ribbons.

### D. Time-Aware Ambient Experience
- [DashboardHeader.tsx](file:///d:/Antigravity/Digital%20diary/src/components/dashboard/DashboardHeader.tsx) inspects the user's local system time to render contextual greetings:
  - `04:00 – 11:59` → *"Good morning 👋"*
  - `12:00 – 16:59` → *"Good afternoon 👋"*
  - `17:00 – 03:59` → *"Good evening 👋"*
- Uses `suppressHydrationWarning` to eliminate server/client time-zone mismatch flashes.

---

## 5. Instructions for Setup, Running & Deployment

### Prerequisites
- **Node.js**: v18.17+ or v20+
- **Database**: PostgreSQL (e.g. Neon Serverless Postgres)
- **Authentication**: Clerk project API keys

### Local Development Instructions
1. **Clone repository:**
   ```bash
   git clone https://github.com/Ayushpall/Digital-Diary.git
   cd "Digital diary"
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables (`.env.local`):**
   ```env
   DATABASE_URL="postgresql://user:password@ep-sample.neon.tech/neondb?sslmode=require"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
   ```
4. **Push database schema:**
   ```bash
   npx prisma db push
   ```
5. **Run dev server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

### Quality Assurance & Validation Commands
- **Type Checking:** `npx tsc --noEmit`
- **Linting:** `npm run lint`
- **Production Compilation:** `npm run build`

### Cloud Deployment (Vercel)
1. Import repository on [Vercel](https://vercel.com).
2. Set Environment Variables in Project Settings (`DATABASE_URL`, Clerk keys).
3. Push to `main` branch (`git push origin main`); Vercel automatically deploys within 60-90 seconds.
