# 🎓 CampusLens — College Discovery Platform

## Antigravity Execution Plan & Prompt

> **Role:** Full Stack Engineer  
> **Goal:** Build a production-grade MVP for a college discovery and decision-making platform.  
> **References:** [Careers360](https://www.careers360.com/) · [CollegeDunia](https://collegedunia.com/)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Feature Requirements](#3-feature-requirements)
4. [Information Architecture & Routing](#4-information-architecture--routing)
5. [Database Schema (PostgreSQL DDL)](#5-database-schema-postgresql-ddl-sql)
6. [API Design](#6-api-design)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Project Structure (Decoupled Monorepo)](#8-project-structure-decoupled-monorepo)
9. [Seed Data Strategy](#9-seed-data-strategy)
10. [Authentication Flow](#10-authentication-flow)
11. [Implementation Plan (Phased)](#11-implementation-plan-phased)
12. [Deployment Strategy](#12-deployment-strategy)
13. [Verification & QA Checklist](#13-verification--qa-checklist)
14. [Antigravity Prompt](#14-antigravity-prompt)

---

## 1. Project Overview

**CampusLens** is a web-based college discovery platform that helps students search, compare, and shortlist colleges across India. It provides:

- A searchable, filterable college directory with infinite scroll
- Rich college detail pages (overview, courses, placements, reviews)
- Side-by-side college comparison (2–3 colleges)
- A rank-based college predictor tool
- A community Q&A / discussion system
- User authentication with saved colleges & comparisons

The product must feel **cohesive, functional, and production-oriented** — not a prototype. All data must come from the database via APIs. No hardcoded frontend-only data.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 14+ (App Router) |
| **Backend Framework** | Express.js (TypeScript) |
| **Language** | TypeScript (strict mode) — used in both frontend and backend |
| **Styling** | TailwindCSS v3 |
| **Database** | PostgreSQL (via Neon) |
| **Database Driver** | Raw PostgreSQL (`pg` or `@neondatabase/serverless`) — backend only |
| **Auth** | NextAuth.js v5 (frontend) + Express middleware (backend JWT verification) |
| **State** | React Query (TanStack Query v5) for server state, Zustand for client state |
| **Validation** | Zod (shared between frontend & backend via a common types approach) |
| **Deployment** | Vercel (frontend) · Render (backend) · Neon (database) |

### Key Libraries

**Frontend (`frontend/`):**
```
next, react, react-dom, typescript
tailwindcss, postcss, autoprefixer
next-auth, @auth/core
@tanstack/react-query
zod
zustand
lucide-react (icons)
clsx, tailwind-merge (utility)
```

**Backend (`backend/`):**
```
express, @types/express, typescript, tsx
pg, @types/pg (or @neondatabase/serverless)
zod
cors, @types/cors
helmet
bcryptjs, @types/bcryptjs
jsonwebtoken, @types/jsonwebtoken
dotenv
```

---

## 3. Feature Requirements

### 3.1 College Listing + Search

**What to build:**
- A `/colleges` page with a searchable, filterable list of colleges
- Server-side search powered by Postgres full-text search or `ILIKE` queries
- Filter sidebar with: state/city, fees range, rating range, course type, college type (govt/private), exam accepted
- Sort by: rating, fees (low→high / high→low), name (A-Z)
- Infinite scroll pagination (cursor-based) — load 20 colleges per batch
- Each college card displays: name, location (city, state), fee range, average rating, type badge (govt/private), a thumbnail image

**UX Reference (Careers360/CollegeDunia):**
- Sticky filter sidebar on desktop, bottom sheet / drawer on mobile
- Pill-style active filter chips with clear-all
- Skeleton loaders during fetch
- "X colleges found" result count header
- URL-synced filters (query params) for shareable searches

---

### 3.2 College Detail Page

**What to build:**
- A dynamic route `/colleges/[slug]` for each college
- Tabbed content sections: **Overview · Courses · Placements · Reviews**
- **Overview tab:** college name, description, established year, type, accreditation, location, total students, campus size, website link, hero image/gallery
- **Courses tab:** list of courses offered with duration, fees, and eligibility. Filterable by level (UG/PG)
- **Placements tab:** placement statistics — highest package, average package, median package, top recruiters list, placement percentage, year-wise placement data
- **Reviews tab:** list of user-submitted reviews with rating (1-5 stars), title, body, author, date. Average rating breakdown. Allow logged-in users to submit a review
- Sticky header with college name + CTA buttons (Compare, Save)
- Breadcrumb navigation

**UX Reference:**
- Smooth tab navigation (no page reload)
- Star rating visualization
- Structured data cards for placements (like a stats dashboard)

---

### 3.3 Compare Colleges

**What to build:**
- A `/compare` page allowing side-by-side comparison of 2–3 colleges
- College selector: search + autocomplete dropdown to add colleges
- Comparison table with rows: fees, average placement, highest placement, rating, location, type, established year, accreditation, student count
- Highlight differences (e.g., bold the "better" value in each row)
- Ability to remove/swap a college from comparison
- Save comparison (for logged-in users)

**UX Reference (Careers360 compare-colleges):**
- Fixed college header row that sticks on scroll
- Add college button with search modal
- Mobile: horizontal scroll for the comparison table
- Share comparison via URL (college IDs as query params)

---

### 3.4 Predictor Tool

**What to build:**
- A `/predictor` page with a form:
  - Select exam (JEE Main, JEE Advanced, NEET, MHT CET, KCET, etc.)
  - Enter rank (numeric input with validation)
  - Optional: category (General, OBC, SC, ST, EWS)
- On submit, return a list of recommended colleges sorted by match confidence
- Logic: dataset-driven matching using a `predictor_cutoffs` table that maps (exam, rank_range, category) → eligible colleges
- Results displayed as cards with: college name, expected round of allotment, previous year cutoff rank, link to college detail page

**Data Design:**
- `PredictorCutoff` table with columns: `examName`, `category`, `minRank`, `maxRank`, `collegeId`, `courseName`, `year`
- Seed with realistic mock data for 5–8 exams across 50+ colleges

---

### 3.5 Q&A / Discussion

**What to build:**
- A `/discussions` page listing all questions (paginated, sorted by recent/popular)
- A `/discussions/[id]` page showing a single question with all answers
- Post a question form (title, body, tags) — requires login
- Answer a question (body text) — requires login
- Upvote/downvote on questions and answers
- Tag-based filtering (e.g., "JEE", "Placements", "Hostel", "Admissions")
- Search within discussions

**UX Reference:**
- Card-based question list with: title, excerpt, author, answer count, vote count, tags, timestamp
- Threaded answer view under each question
- "Ask a Question" floating action button

---

### 3.6 Authentication + Saved Items

**What to build:**
- `/auth/login` and `/auth/signup` pages
- Authentication via:
  - Email + password (credentials provider)
  - Google OAuth (optional but recommended)
- Protected routes: posting reviews, asking/answering questions, saving colleges/comparisons
- `/dashboard` page for logged-in users showing:
  - Saved colleges (with remove option)
  - Saved comparisons (with remove option)
  - My reviews
  - My questions & answers
- Session-based auth with JWT tokens (NextAuth.js)

---

## 4. Information Architecture & Routing

```
/ ................................. Homepage (hero search, featured colleges, quick links)
/colleges ......................... College listing with search + filters
/colleges/[slug] .................. College detail page (tabbed)
/compare .......................... Compare colleges (2-3 side by side)
/compare?colleges=id1,id2,id3 .... Shareable comparison URL
/predictor ........................ College predictor tool
/discussions ...................... Q&A listing page
/discussions/[id] ................. Single question + answers
/discussions/ask .................. Ask a question form (protected)
/auth/login ....................... Login page
/auth/signup ...................... Signup page
/dashboard ........................ User dashboard (protected)
/dashboard/saved-colleges ......... Saved colleges
/dashboard/saved-comparisons ...... Saved comparisons
```

### Layout Structure

```
RootLayout
├── Header (navbar with search, nav links, auth buttons)
├── <children> (page content)
└── Footer (links, about, social)
```

---

## 5. Database Schema (PostgreSQL DDL SQL)

Instead of using Prisma ORM, we will use raw SQL scripts to define and manage our database structure. This provides direct control over types, constraints, and indexes.

```sql
-- ==================== ENUMS ====================
CREATE TYPE college_type AS ENUM ('GOVERNMENT', 'PRIVATE', 'DEEMED', 'AUTONOMOUS');
CREATE TYPE course_level AS ENUM ('UG', 'PG', 'DIPLOMA', 'PHD', 'CERTIFICATE');
CREATE TYPE student_category AS ENUM ('GENERAL', 'OBC', 'SC', 'ST', 'EWS');

-- ==================== AUTH TABLES (NextAuth pg-adapter compatible) ====================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  image VARCHAR(255),
  hashed_password VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type VARCHAR(255),
  scope VARCHAR(255),
  id_token TEXT,
  session_state VARCHAR(255),
  UNIQUE (provider, provider_account_id)
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);

CREATE TABLE verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- ==================== COLLEGES ====================
CREATE TABLE colleges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  type college_type DEFAULT 'PRIVATE',
  established_year INTEGER,
  accreditation VARCHAR(255),
  website VARCHAR(255),
  image_url VARCHAR(255),
  gallery_images TEXT[], -- Array of image URLs
  
  -- Location
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  address TEXT,
  pincode VARCHAR(10),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  
  -- Stats
  total_students INTEGER,
  campus_size VARCHAR(100),
  
  -- Fees & Rating
  fees_min INTEGER,
  fees_max INTEGER,
  rating DOUBLE PRECISION DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  
  -- Exams accepted
  exams_accepted VARCHAR(100)[],
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== COURSES ====================
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  level course_level NOT NULL,
  duration VARCHAR(100) NOT NULL,
  fees INTEGER,
  eligibility TEXT,
  seats INTEGER
);

-- ==================== PLACEMENTS ====================
CREATE TABLE placements (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  highest_package DOUBLE PRECISION, -- in LPA
  average_package DOUBLE PRECISION, -- in LPA
  median_package DOUBLE PRECISION,  -- in LPA
  placement_percentage DOUBLE PRECISION,
  total_students_placed INTEGER,
  total_students INTEGER,
  top_recruiters VARCHAR(255)[],
  UNIQUE (college_id, year)
);

-- ==================== REVIEWS ====================
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== PREDICTOR ====================
CREATE TABLE predictor_cutoffs (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  exam_name VARCHAR(100) NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  category student_category DEFAULT 'GENERAL',
  min_rank INTEGER NOT NULL,
  max_rank INTEGER NOT NULL,
  year INTEGER NOT NULL
);

-- ==================== Q&A / DISCUSSIONS ====================
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  tags VARCHAR(100)[],
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  answer_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  value INTEGER CHECK (value = 1 OR value = -1),
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  answer_id INTEGER REFERENCES answers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (question_id IS NOT NULL AND answer_id IS NULL) OR 
    (answer_id IS NOT NULL AND question_id IS NULL)
  ),
  UNIQUE (user_id, question_id),
  UNIQUE (user_id, answer_id)
);

-- ==================== SAVED ITEMS ====================
CREATE TABLE saved_colleges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, college_id)
);

CREATE TABLE saved_comparisons (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  college_ids INTEGER[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== INDEXES & PERFORMANCE ====================
CREATE INDEX idx_colleges_slug ON colleges(slug);
CREATE INDEX idx_colleges_state ON colleges(state);
CREATE INDEX idx_colleges_city ON colleges(city);
CREATE INDEX idx_colleges_type ON colleges(type);
CREATE INDEX idx_colleges_rating ON colleges(rating);
CREATE INDEX idx_colleges_fees ON colleges(fees_min, fees_max);
CREATE INDEX idx_courses_college ON courses(college_id);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_placements_college ON placements(college_id);
CREATE INDEX idx_reviews_college ON reviews(college_id);
CREATE INDEX idx_predictor_search ON predictor_cutoffs(exam_name, category);
```

---

## 6. API Design

All APIs are built as **Express.js route handlers** in the `backend/` service. The frontend (`frontend/`) communicates with the backend via `NEXT_PUBLIC_API_URL` environment variable.

### 6.1 College APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/colleges` | List colleges with search, filters, pagination | Public |
| `GET` | `/api/colleges/[slug]` | Get single college detail | Public |
| `GET` | `/api/colleges/[slug]/courses` | Get courses for a college | Public |
| `GET` | `/api/colleges/[slug]/placements` | Get placement data | Public |
| `GET` | `/api/colleges/[slug]/reviews` | Get reviews (paginated) | Public |
| `POST` | `/api/colleges/[slug]/reviews` | Submit a review | 🔒 Auth |

**`GET /api/colleges` Query Parameters:**

```
?q=string              // search query (name, city, state)
&state=string          // filter by state
&city=string           // filter by city
&type=GOVERNMENT|PRIVATE|DEEMED|AUTONOMOUS
&feesMin=number        // min annual fees
&feesMax=number        // max annual fees
&ratingMin=number      // min rating (0-5)
&exam=string           // exam accepted filter
&sort=rating|fees_asc|fees_desc|name
&cursor=string         // cursor for infinite scroll
&limit=20              // items per page
```

**Response shape:**

```typescript
{
  colleges: College[],
  nextCursor: string | null,
  totalCount: number
}
```

### 6.2 Compare APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/compare?ids=id1,id2,id3` | Get comparison data for 2-3 colleges | Public |
| `POST` | `/api/comparisons` | Save a comparison | 🔒 Auth |
| `GET` | `/api/comparisons` | Get user's saved comparisons | 🔒 Auth |
| `DELETE` | `/api/comparisons/[id]` | Delete a saved comparison | 🔒 Auth |

### 6.3 Predictor APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/predictor/exams` | List available exams | Public |
| `POST` | `/api/predictor` | Get predicted colleges for exam + rank | Public |

**`POST /api/predictor` Body:**

```typescript
{
  exam: string,       // exam name
  rank: number,       // user's rank
  category: Category  // GENERAL, OBC, SC, ST, EWS
}
```

### 6.4 Discussion APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/discussions` | List questions (paginated) | Public |
| `GET` | `/api/discussions/[id]` | Get question + answers | Public |
| `POST` | `/api/discussions` | Post a new question | 🔒 Auth |
| `POST` | `/api/discussions/[id]/answers` | Post an answer | 🔒 Auth |
| `POST` | `/api/discussions/[id]/vote` | Vote on question | 🔒 Auth |
| `POST` | `/api/discussions/answers/[id]/vote` | Vote on answer | 🔒 Auth |

### 6.5 User / Saved Items APIs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/user/saved-colleges` | Get saved colleges | 🔒 Auth |
| `POST` | `/api/user/saved-colleges` | Save a college | 🔒 Auth |
| `DELETE` | `/api/user/saved-colleges/[collegeId]` | Unsave a college | 🔒 Auth |
| `GET` | `/api/user/profile` | Get user profile + stats | 🔒 Auth |

### 6.6 Auth APIs (NextAuth.js)

| Endpoint | Description |
|----------|-------------|
| `/api/auth/[...nextauth]` | NextAuth.js catch-all handler |
| `/api/auth/register` | Custom registration endpoint |

---

## 7. Frontend Architecture

### State Management Strategy

```
┌─────────────────────────────────────────────┐
│                  Frontend                   │
├──────────────────┬──────────────────────────┤
│  Server State    │  Client State            │
│  (TanStack Query)│  (Zustand)               │
│                  │                          │
│  • College list  │  • Compare selection     │
│  • College detail│  • Filter state (URL)    │
│  • Discussions   │  • UI modals/drawers     │
│  • Reviews       │  • Search input          │
│  • User data     │  • Auth session          │
└──────────────────┴──────────────────────────┘
```

### Data Fetching Pattern

- **Server Components** for initial page loads (SSR/SSG) — college listing, college detail, discussions
- **Client Components** for interactive features — search input, filters, infinite scroll, voting, forms
- **React Query** for all client-side data fetching with caching, background refetch, optimistic updates (votes)
- **URL state** for filters/search — use `useSearchParams` to keep filters in the URL

### Error Handling

- Zod schemas shared between API routes and client forms
- API routes return consistent error shapes: `{ error: string, details?: ZodError }`
- Client-side error boundaries for component-level failures
- Toast notifications for user actions (save, vote, submit review)

---

## 8. Project Structure (Decoupled Monorepo)

> **Architecture:** The project is split into two independent deployable services inside a single repository. The `frontend/` is a Next.js app deployed on **Vercel**. The `backend/` is an Express.js API server deployed on **Render**. They communicate via REST over `NEXT_PUBLIC_API_URL`.

```
CampusLens/
├── frontend/                           # Next.js 14+ App (Vercel)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx              # Root layout (providers, header, footer)
│   │   │   ├── page.tsx                # Homepage
│   │   │   ├── colleges/
│   │   │   │   ├── page.tsx            # College listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx        # College detail
│   │   │   ├── compare/
│   │   │   │   └── page.tsx            # Compare page
│   │   │   ├── predictor/
│   │   │   │   └── page.tsx            # Predictor tool
│   │   │   ├── discussions/
│   │   │   │   ├── page.tsx            # Discussions listing
│   │   │   │   ├── ask/
│   │   │   │   │   └── page.tsx        # Ask question form
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # Question detail + answers
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx        # Login page
│   │   │   │   └── signup/
│   │   │   │       └── page.tsx        # Signup page
│   │   │   └── dashboard/
│   │   │       ├── page.tsx            # User dashboard
│   │   │       ├── saved-colleges/
│   │   │       │   └── page.tsx
│   │   │       └── saved-comparisons/
│   │   │           └── page.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                     # Base UI primitives
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Drawer.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   ├── StarRating.tsx
│   │   │   │   ├── Tabs.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── Pagination.tsx
│   │   │   │   ├── SearchInput.tsx
│   │   │   │   └── EmptyState.tsx
│   │   │   │
│   │   │   ├── layout/                 # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Breadcrumb.tsx
│   │   │   │   └── MobileNav.tsx
│   │   │   │
│   │   │   ├── colleges/               # College feature components
│   │   │   │   ├── CollegeCard.tsx
│   │   │   │   ├── CollegeGrid.tsx
│   │   │   │   ├── CollegeFilters.tsx
│   │   │   │   ├── CollegeSearch.tsx
│   │   │   │   ├── CollegeDetailHeader.tsx
│   │   │   │   ├── CollegeOverview.tsx
│   │   │   │   ├── CollegeCourses.tsx
│   │   │   │   ├── CollegePlacements.tsx
│   │   │   │   ├── CollegeReviews.tsx
│   │   │   │   ├── ReviewForm.tsx
│   │   │   │   └── SaveCollegeButton.tsx
│   │   │   │
│   │   │   ├── compare/                # Compare feature components
│   │   │   │   ├── CompareTable.tsx
│   │   │   │   ├── CollegeSelector.tsx
│   │   │   │   └── CompareHeader.tsx
│   │   │   │
│   │   │   ├── predictor/              # Predictor feature components
│   │   │   │   ├── PredictorForm.tsx
│   │   │   │   └── PredictorResults.tsx
│   │   │   │
│   │   │   ├── discussions/            # Q&A feature components
│   │   │   │   ├── QuestionCard.tsx
│   │   │   │   ├── QuestionList.tsx
│   │   │   │   ├── QuestionDetail.tsx
│   │   │   │   ├── AnswerCard.tsx
│   │   │   │   ├── AnswerForm.tsx
│   │   │   │   ├── AskQuestionForm.tsx
│   │   │   │   └── VoteButtons.tsx
│   │   │   │
│   │   │   ├── auth/                   # Auth components
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   └── AuthGuard.tsx
│   │   │   │
│   │   │   └── dashboard/              # Dashboard components
│   │   │       ├── SavedCollegesList.tsx
│   │   │       ├── SavedComparisonsList.tsx
│   │   │       └── UserStats.tsx
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                  # Axios/fetch wrapper with NEXT_PUBLIC_API_URL base
│   │   │   ├── auth.ts                 # NextAuth config (calls backend /auth endpoints)
│   │   │   ├── validations/            # Zod schemas (client-side validation)
│   │   │   │   ├── college.ts
│   │   │   │   ├── review.ts
│   │   │   │   ├── discussion.ts
│   │   │   │   ├── predictor.ts
│   │   │   │   └── auth.ts
│   │   │   ├── utils.ts                # Utility functions (cn, formatCurrency, etc.)
│   │   │   └── constants.ts            # App-wide constants (exam list, states, etc.)
│   │   │
│   │   ├── hooks/
│   │   │   ├── useColleges.ts          # React Query hooks for colleges
│   │   │   ├── useCollege.ts           # Single college hook
│   │   │   ├── useCompare.ts           # Comparison state & fetching
│   │   │   ├── usePredictor.ts         # Predictor query
│   │   │   ├── useDiscussions.ts       # Discussion hooks
│   │   │   ├── useSavedColleges.ts     # Saved colleges hooks
│   │   │   ├── useInfiniteScroll.ts    # Infinite scroll observer
│   │   │   └── useDebounce.ts          # Debounced search
│   │   │
│   │   ├── stores/
│   │   │   ├── compareStore.ts         # Zustand store for compare selection
│   │   │   └── uiStore.ts             # UI state (modals, drawers)
│   │   │
│   │   └── types/
│   │       └── index.ts                # Shared TypeScript types (frontend)
│   │
│   ├── public/                         # Static assets
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.local                      # NEXT_PUBLIC_API_URL, NEXTAUTH_SECRET, etc.
│
├── backend/                            # Express.js API Server (Render)
│   ├── src/
│   │   ├── index.ts                    # Express app entry point (cors, helmet, routes)
│   │   ├── config/
│   │   │   └── db.ts                   # PostgreSQL connection pool (pg / @neondatabase/serverless)
│   │   │
│   │   ├── routes/                     # Express route definitions
│   │   │   ├── auth.routes.ts          # /api/auth/* (login, register)
│   │   │   ├── colleges.routes.ts      # /api/colleges/*
│   │   │   ├── compare.routes.ts       # /api/compare, /api/comparisons/*
│   │   │   ├── predictor.routes.ts     # /api/predictor/*
│   │   │   ├── discussions.routes.ts   # /api/discussions/*
│   │   │   └── user.routes.ts          # /api/user/* (saved colleges, profile)
│   │   │
│   │   ├── controllers/               # Route handler logic
│   │   │   ├── auth.controller.ts
│   │   │   ├── colleges.controller.ts
│   │   │   ├── compare.controller.ts
│   │   │   ├── predictor.controller.ts
│   │   │   ├── discussions.controller.ts
│   │   │   └── user.controller.ts
│   │   │
│   │   ├── middleware/                 # Express middleware
│   │   │   ├── auth.middleware.ts      # JWT verification (verify token from NextAuth)
│   │   │   ├── validate.middleware.ts  # Zod request validation
│   │   │   └── errorHandler.ts        # Global error handler
│   │   │
│   │   ├── validations/               # Zod schemas (server-side)
│   │   │   ├── college.ts
│   │   │   ├── review.ts
│   │   │   ├── discussion.ts
│   │   │   ├── predictor.ts
│   │   │   └── auth.ts
│   │   │
│   │   └── types/
│   │       └── index.ts                # Shared TypeScript types (backend)
│   │
│   ├── db/
│   │   ├── schema.sql                  # Pure PostgreSQL DDL table structures & indexes
│   │   ├── seed.ts                     # Seeding script using raw SQL with parameterized values
│   │   └── setup.ts                    # Simple runner to execute schema.sql against database
│   │
│   ├── tsconfig.json
│   ├── package.json
│   └── .env                            # DATABASE_URL, JWT_SECRET, CORS_ORIGIN, PORT
│
├── .gitignore
└── README.md
```

---

## 9. Seed Data Strategy

Create a comprehensive seed script (`backend/db/seed.ts`) that connects via `pg` and populates the database using SQL inserts with parameterized values:

| Entity | Count | Notes |
|--------|-------|-------|
| Colleges | 80–100 | Mix of IITs, NITs, IIITs, private colleges, state universities |
| Courses per college | 5–15 | B.Tech, M.Tech, MBA, BBA, B.Sc, etc. |
| Placements per college | 3 years | 2022, 2023, 2024 data |
| Reviews per college | 3–10 | Varied ratings |
| Predictor cutoffs | 200–400 | Across 8 exams, multiple categories |
| Questions | 30–50 | With tags |
| Answers | 50–100 | Distributed across questions |
| Users | 20 | Test accounts with reviews/questions |

**Seed data should be realistic:**
- Use actual Indian college names (IIT Bombay, NIT Trichy, BITS Pilani, etc.)
- Use real city/state combinations
- Use realistic fee ranges (₹50K – ₹25L)
- Use realistic placement figures (₹3 LPA – ₹2 Cr)
- Use common Indian engineering exam names

---

## 10. Authentication Flow

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Login/    │────▶│  NextAuth.js     │────▶│  Express Backend │────▶│  PostgreSQL │
│   Signup    │     │  (frontend)      │     │  /api/auth/*     │     │  (Neon)     │
│   Page      │     │  JWT strategy    │     │  bcrypt + JWT    │     │             │
└─────────────┘     └──────────────────┘     └──────────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
              Credentials    Google OAuth
              (email/pass)   (optional)
```

**Authentication Architecture (Decoupled):**

1. **Frontend (NextAuth.js):**
   - JWT session strategy (no database sessions for scalability)
   - Credentials provider calls `backend/api/auth/login` to verify user
   - Client-side `useSession()` for conditional UI rendering
   - NextAuth middleware protects `/dashboard/*` routes
   - JWT token is sent in `Authorization: Bearer <token>` header on all backend API calls

2. **Backend (Express):**
   - `/api/auth/register` — creates user with bcrypt-hashed password
   - `/api/auth/login` — verifies credentials, returns user object
   - `auth.middleware.ts` — verifies JWT on protected routes
   - All protected endpoints require valid JWT in Authorization header

---

## 11. Implementation Plan (Phased)

### Phase 1: Foundation (Day 1-2)

```
[ ] Initialize frontend: npx -y create-next-app@latest ./frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
[ ] Initialize backend: mkdir backend && cd backend && npm init -y && npm install express pg cors helmet bcryptjs jsonwebtoken zod dotenv
[ ] Set up backend Express server (src/index.ts) with cors, helmet, JSON parsing
[ ] Set up raw PostgreSQL connection pool in backend/src/config/db.ts
[ ] Create pure SQL database DDL in backend/db/schema.sql
[ ] Run database setup to initialize tables (backend/db/setup.ts)
[ ] Set up backend routes/controllers folder structure
[ ] Build backend auth routes (register, login) with bcrypt + JWT
[ ] Build backend auth middleware (JWT verification)
[ ] Build base UI components in frontend (Button, Input, Card, Badge, Skeleton, etc.)
[ ] Build layout components in frontend (Header, Footer, MobileNav)
[ ] Set up NextAuth.js in frontend (calls backend /api/auth/login)
[ ] Create frontend auth pages (login, signup)
[ ] Create frontend lib/api.ts (fetch wrapper with NEXT_PUBLIC_API_URL)
[ ] Set up React Query provider in frontend
[ ] Create seed script (backend/db/seed.ts) and populate database
```

### Phase 2: College Listing + Detail (Day 3-4)

```
[ ] Build backend colleges controller + routes (list, detail, courses, placements, reviews)
[ ] Build GET /api/colleges with search, filters, cursor pagination (backend)
[ ] Build GET /api/colleges/:slug with relations (backend)
[ ] Build GET /api/colleges/:slug/courses (backend)
[ ] Build GET /api/colleges/:slug/placements (backend)
[ ] Build GET /api/colleges/:slug/reviews + POST (backend)
[ ] Build frontend CollegeCard component
[ ] Build frontend CollegeFilters (sidebar with all filter options)
[ ] Build frontend CollegeSearch with debounced input
[ ] Build frontend college listing page with infinite scroll
[ ] Build frontend college detail page with tabs (Overview, Courses, Placements, Reviews)
[ ] Build frontend ReviewForm component
[ ] Build frontend SaveCollegeButton + backend API
[ ] URL-synced filters
```

### Phase 3: Compare + Predictor (Day 5-6)

```
[ ] Build compare Zustand store (frontend)
[ ] Build backend compare controller + routes
[ ] Build frontend CollegeSelector with autocomplete
[ ] Build frontend CompareTable component
[ ] Build frontend compare page
[ ] Build backend predictor controller + routes
[ ] Build frontend PredictorForm component
[ ] Build frontend PredictorResults component
[ ] Build frontend predictor page
[ ] Save comparison API (backend) + UI (frontend)
```

### Phase 4: Q&A + Dashboard (Day 7-8)

```
[ ] Build backend discussion controller + routes (CRUD + voting)
[ ] Build frontend QuestionCard, QuestionList components
[ ] Build frontend discussions listing page
[ ] Build frontend question detail page with answers
[ ] Build frontend AskQuestionForm + AnswerForm
[ ] Build frontend VoteButtons with optimistic updates
[ ] Build backend user controller + routes (saved colleges, profile)
[ ] Build frontend user dashboard page
[ ] Build frontend SavedCollegesList, SavedComparisonsList
[ ] Build frontend UserStats component
```

### Phase 5: Polish + Deploy (Day 9-10)

```
[ ] Homepage design (hero search, featured colleges, stats)
[ ] Responsive design audit (mobile, tablet, desktop)
[ ] Loading states (skeletons) for all data-fetching pages
[ ] Error states and empty states for all pages
[ ] SEO: meta tags, Open Graph, structured data
[ ] Performance: image optimization, code splitting
[ ] Deploy frontend to Vercel (connect GitHub repo, set root directory to frontend/)
[ ] Deploy backend to Render (connect GitHub repo, set root directory to backend/)
[ ] Connect Neon database to backend
[ ] Configure environment variables on Vercel and Render
[ ] Test cross-origin API communication
[ ] Final QA pass
```

---

## 12. Deployment Strategy

> **Architecture:** Frontend and backend are deployed as separate services. They communicate over HTTPS via REST APIs.

### Frontend → Vercel

| Setting | Value |
|---------|-------|
| **Platform** | Vercel |
| **Root Directory** | `frontend/` |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |
| **Framework Preset** | Next.js |

```yaml
# Environment Variables (Vercel Dashboard → frontend)
NEXT_PUBLIC_API_URL=https://campuslens-api.onrender.com
NEXTAUTH_SECRET=<random-secret>
NEXTAUTH_URL=https://campuslens.vercel.app
GOOGLE_CLIENT_ID=<optional>
GOOGLE_CLIENT_SECRET=<optional>
```

### Backend → Render

| Setting | Value |
|---------|-------|
| **Platform** | Render (Web Service) |
| **Root Directory** | `backend/` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Runtime** | Node.js |
| **Plan** | Free / Starter |

```yaml
# Environment Variables (Render Dashboard → backend)
DATABASE_URL=postgresql://...@neon.tech/campuslens?sslmode=require
JWT_SECRET=<same-as-NEXTAUTH_SECRET>
CORS_ORIGIN=https://campuslens.vercel.app
PORT=3001
NODE_ENV=production
```

**Backend `package.json` scripts:**
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:setup": "tsx db/setup.ts",
    "db:seed": "tsx db/seed.ts"
  }
}
```

### Database → Neon

- Create a Neon project with a `campuslens` database
- Use connection pooling for production
- Initialize the schema: `cd backend && npm run db:setup`
- Seed data: `cd backend && npm run db:seed`
- Run setup and seed once after initial deployment

### CORS Configuration

The Express backend must allow requests from the Vercel frontend domain:

```typescript
// backend/src/index.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
```

### Local Development

```bash
# Terminal 1 — Backend
cd backend
npm run dev          # Runs on http://localhost:3001

# Terminal 2 — Frontend
cd frontend
npm run dev          # Runs on http://localhost:3000
```

**Frontend `.env.local` (local dev):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_SECRET=dev-secret
NEXTAUTH_URL=http://localhost:3000
```

**Backend `.env` (local dev):**
```
DATABASE_URL=postgresql://user:pass@localhost:5432/campuslens
JWT_SECRET=dev-secret
CORS_ORIGIN=http://localhost:3000
PORT=3001
```

---

## 13. Verification & QA Checklist

### Functional Testing

- [ ] Search colleges by name → results match
- [ ] Apply filters → results update correctly
- [ ] Infinite scroll loads next page
- [ ] College detail page renders all tabs with correct data
- [ ] Submit a review (logged in) → review appears in list
- [ ] Compare 2-3 colleges → table renders correctly
- [ ] Predictor: input exam + rank → get results
- [ ] Post a question → appears in listing
- [ ] Post an answer → appears under question
- [ ] Vote on question/answer → count updates
- [ ] Save/unsave a college → dashboard reflects change
- [ ] Login/signup works with credentials
- [ ] Protected routes redirect to login

### Responsive Testing

- [ ] Mobile (375px): all pages usable, filters in drawer
- [ ] Tablet (768px): grid adjusts, compare scrolls horizontally
- [ ] Desktop (1280px): full layout with sidebar filters

### Performance

- [ ] Lighthouse score > 80 on all core pages
- [ ] No layout shifts (CLS < 0.1)
- [ ] First contentful paint < 2s
- [ ] API responses < 500ms

---