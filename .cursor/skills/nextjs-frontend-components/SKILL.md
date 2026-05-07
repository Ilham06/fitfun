---
name: nextjs-frontend-components
description: Build, review, and structure UI components for FitScan — a fitness PWA built with Next.js App Router, React 19, Tailwind CSS v4, JavaScript (no TypeScript), GPT-4o, and Prisma/PostgreSQL. Use when creating or reviewing pages, layouts, components, or any UI element in this project. Includes FitScan design tokens, color palette, screen map, and API route reference.
---

# FitScan — Frontend Component Guide

## Stack

| Layer | Detail |
|-------|--------|
| Framework | Next.js 16 — **App Router** |
| React | 19 |
| Styling | Tailwind CSS **v4** (CSS-first config, no `tailwind.config.js`) |
| Language | **JavaScript** `.js` / `.jsx` — no TypeScript |
| Fonts | Playfair Display (display) + Plus Jakarta Sans (body) via `next/font/google` |
| Auth | NextAuth.js v5 — Google OAuth only |
| Database | PostgreSQL + Prisma |
| AI | OpenAI GPT-4o (Vision + chat) |
| Barcode | ZXing + Open Food Facts fallback |

---

## File & Folder Conventions

```
src/
└── app/
    ├── layout.js                 # Root layout — fonts, metadata
    ├── page.js                   # Splash / entry (/)
    ├── globals.css               # Tailwind v4 global styles + @theme tokens
    ├── (auth)/
    │   └── login/page.js         # /login
    ├── onboarding/
    │   ├── profile/page.js       # /onboarding/profile
    │   ├── program/page.js       # /onboarding/program
    │   ├── activity/page.js      # /onboarding/activity
    │   └── goal/page.js          # /onboarding/goal
    ├── dashboard/page.js         # /dashboard
    ├── scan/
    │   ├── page.js               # /scan
    │   ├── result/page.js        # /scan/result
    │   └── body-confirm/page.js  # /scan/body-confirm
    ├── progress/page.js          # /progress
    ├── profile/page.js           # /profile
    └── api/                      # Route handlers (see API section)
```

Shared reusable components → `src/components/`
Utilities/helpers → `src/lib/`
Route-local components → `src/app/[route]/_components/` (underscore prefix = not a route)

---

## Screen Map (9 screens)

| Screen | Route | Notes |
|--------|-------|-------|
| Splash | `/` | Session check, auto-redirect in ≤1.5s |
| Login | `/login` | Google OAuth only, no email/password |
| Onboarding | `/onboarding/*` | 4-step wizard (profile → program → activity → goal) |
| Dashboard | `/dashboard` | Main HQ: macro rings, meal log, water, streak, AI tip |
| Scan | `/scan` | Camera-first; Food or Body mode toggle |
| Food Result | `/scan/result` | Confirm & edit scanned food before logging |
| Body Confirm | `/scan/body-confirm` | Review GPT-4o extracted measurements |
| Progress | `/progress` | Charts: weight, body metrics, macro adherence |
| Profile | `/profile` | Edit profile, change program, export CSV, sign out |

**4-tab navigation:** Home · Scan (FAB) · Progress · Profile

---

## Design Tokens

### Colors

```js
// Brand
accent:        '#D95F2B'   // Terracotta — CTAs, active states, brand
accent-light:  '#FFF0E9'   // Active pill backgrounds, chips

// Background / Surface
bg:            '#F5F3EE'   // Warm cream — app background
bg2:           '#EDEAE2'   // Input fields, hover
surface:       '#FFFFFF'   // Cards
surface2:      '#F9F8F5'   // Nested cards, secondary surface

// Text
text:          '#1A1814'   // Primary
text2:         '#3D3A34'   // Secondary
muted:         '#8A8679'   // Labels, descriptions
muted2:        '#B5B0A6'   // Captions, hints

// Macros (use for rings, bars, charts)
protein:       '#C0392B'   // Crimson
carbs:         '#2471A3'   // Ocean blue
fat:           '#D4882A'   // Amber
fiber:         '#27AE60'   // Emerald (also: success states)
water:         '#1A8EAD'   // Teal

// Feature (scan modes)
food-scan:     '#2D9C7E'   // Sage green
body-scan:     '#7B5EA7'   // Mauve purple
```

### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display | Playfair Display | 900 | Hero titles, section headings, large numbers |
| Heading | Playfair Display | 800 | Screen titles, card headers |
| Body | Plus Jakarta Sans | 400 | Paragraphs, descriptions, AI-generated text |
| Label | Plus Jakarta Sans | 600 | Form labels, metadata, tags |
| Caption | Plus Jakarta Sans | 500 | Hints, timestamps, confidence % |

### Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `rounded` | 5px | Tags, badges |
| `rounded-lg` (sm btn) | 8px | Small buttons |
| `rounded-xl` | 10px | Inputs, list items |
| `rounded-[14px]` | 14px | Cards (default) |
| `rounded-[22px]` | 22px | Panels, large cards |
| `rounded-full` | 50% | FAB (Scan button) |

### Shadows

```
shadow-sm  → cards default, list rows
shadow-md  → card hover, tab bar, modals
shadow-lg  → overlays, dragged items
```

---

## Component Patterns

### Bottom Tab Bar
4 tabs: Home · Progress · Scan (FAB, centered) · Profile.
Scan button is a `rounded-full` terracotta FAB that rises above the bar.

### Macro Ring Summary
SVG concentric arcs: Protein (#C0392B) · Carbs (#2471A3) · Fat (#D4882A). Center shows kcal remaining.

### Scan Mode Toggle
2 cards: Food (sage #2D9C7E) · Body (mauve #7B5EA7). Active card gets colored border + light tinted bg.

### Program Selector (Onboarding step 2)
3 pill cards: 💪 Bulking (+15% cal) · 🔥 Cutting (−20% cal) · ⚖️ Maintain (= TDEE). Single select.

### AI Tip Card (Dashboard inline)
Gradient bg (`accent-light` → `#FEF9F5`), terracotta border. Shows "AI TIP" badge + daily message + 2 clickable meal suggestions. Generated once/day per user, cached.

### Nutrition Result Card
Food name + portion + kcal (Playfair Display 900), then macro progress bars (protein/carbs/fat), confidence badge.

### Toast Notifications
3 variants: `toast-ok` (green left-border), `toast-err` (red), `toast-ai` (terracotta).

### Onboarding Step Indicator
Horizontal dot-dashes: done = terracotta filled, active = terracotta wide (44px), pending = gray.

---

## Component Rules

1. **Server Component by default.** Add `"use client"` only for:
   - `useState` / `useReducer` / `useEffect`
   - Browser APIs (camera, geolocation)
   - Event handlers on interactive elements
   - Third-party client-only libs (ZXing, chart libs)

2. **Async Server Components for data fetching:**
   ```js
   export default async function Dashboard() {
     const data = await fetch('/api/dashboard/today', { cache: 'no-store' });
     // ...
   }
   ```

3. **Images:** always `next/image`. Add `priority` for above-the-fold (dashboard macro ring, login hero).

4. **Internal links:** always `next/link`. Never raw `<a>` for in-app navigation.

5. **File names:** `kebab-case.js`. Exported components: `PascalCase`.

6. **Metadata** (Server Components only):
   ```js
   export const metadata = { title: 'Dashboard | FitScan', description: '...' };
   ```

---

## Tailwind v4 Notes

- **No `tailwind.config.js`** — theme tokens defined in `globals.css` via `@theme { }`.
- Extend with CSS custom properties:
  ```css
  @import "tailwindcss";
  @theme {
    --color-accent: #D95F2B;
    --color-protein: #C0392B;
    /* ... */
  }
  ```
- Light theme only (no `dark:` needed per design spec v1.1).
- Fonts loaded via `next/font/google` in `layout.js`, exposed as CSS variables.

---

## API Routes (22 total)

All routes require NextAuth session except `/api/auth/*`.

```
Auth
  GET/POST  /api/auth/[...nextauth]

Profile
  GET       /api/profile
  POST      /api/profile          ← create + set onboardingDone = true
  PATCH     /api/profile          ← update weight/program/activity

Food
  POST      /api/food/scan        ← image → GPT-4o → nutrition JSON
  POST      /api/food/barcode     ← barcode → Open Food Facts (+ GPT-4o fallback)
  GET       /api/food/search      ← ?q=
  GET/POST  /api/food/log         ← ?date=YYYY-MM-DD
  PATCH     /api/food/log/[id]
  DELETE    /api/food/log/[id]

Body
  POST      /api/body/scan        ← image → GPT-4o → measurement JSON
  GET/POST  /api/body/log         ← ?limit=30
  DELETE    /api/body/log/[id]

AI
  POST      /api/ai/daily-tip     ← cached once/day per user
  POST      /api/ai/weekly-report ← cached once/week

Dashboard & Progress
  GET       /api/dashboard/today
  GET       /api/progress/nutrition  ← ?days=30
  GET       /api/progress/body
  GET       /api/export/csv
```

---

## Data Models (Prisma)

**User**: id, email, name, image, onboardingDone, createdAt
**UserProfile**: userId (FK), age, gender, weightKg, heightCm, program (BULKING/CUTTING/MAINTENANCE), activityLevel, targetWeightKg?, tdee, dailyCalTarget, proteinTargetG, carbTargetG, fatTargetG
**FoodLog**: userId (FK), name, mealType (BREAKFAST/LUNCH/DINNER/SNACK), calories, proteinG, carbG, fatG, fiberG?, sodiumMg?, portionMultiplier, source (BARCODE/GPT_VISION/MANUAL), loggedAt
**BodyMeasurement**: userId (FK), weightKg?, waistCm?, chestCm?, hipsCm?, armsCm?, thighsCm?, neckCm?, bodyFatPct?, bmi?, source (GPT_VISION/MANUAL), measuredAt

---

## Checklist (new component)

- [ ] Server Component by default — added `"use client"` only if needed
- [ ] Data fetching in Server Component (not `useEffect`)
- [ ] `next/image` for all images
- [ ] `next/link` for all internal links
- [ ] Correct macro color used (protein=crimson, carb=ocean, fat=amber)
- [ ] Accent color (#D95F2B) used for CTAs and active states
- [ ] Playfair Display for display/heading text
- [ ] Mobile-first responsive (`sm:`, `md:`, `lg:`)
- [ ] Loading state handled (Suspense / skeleton)
- [ ] Error boundary for client async operations
- [ ] No inline styles — use Tailwind classes

---

## Additional Resources

- Next.js docs: `node_modules/next/dist/docs/`
- Design + component previews: `docs/fitscan-app-instruction.html`
