# FitScan — Backend Architecture

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Next.js (App Router) | 16 |
| Database | PostgreSQL | 15+ |
| ORM | Prisma | latest |
| Auth | NextAuth.js v5 | Google OAuth only |
| AI | OpenAI GPT-4o (Vision + Chat) | gpt-4o |
| Barcode | Open Food Facts API | public |
| Hosting | Vercel (recommended) | — |

---

## Authentication

- **Provider:** Google OAuth only (no email/password)
- **Session:** JWT-based via NextAuth.js v5
- **Middleware:** `src/middleware.js` checks session on every request
  - No session → redirect `/login`
  - Session + `onboardingDone === false` → redirect `/onboarding/profile`
  - Session + `onboardingDone === true` → allow access

### Auth Flow

```
User → "Continue with Google" → Google consent screen
     → /api/auth/callback/google → NextAuth upserts User via Prisma
     → JWT session issued → redirect based on onboardingDone flag
```

---

## Database Schema (Prisma)

### User

```prisma
model User {
  id             String        @id @default(cuid())
  email          String        @unique
  name           String?
  image          String?
  onboardingDone Boolean       @default(false)
  createdAt      DateTime      @default(now())
  profile        UserProfile?
  foodLogs       FoodLog[]
  bodyLogs       BodyMeasurement[]
}
```

### UserProfile

```prisma
model UserProfile {
  id              String  @id @default(cuid())
  userId          String  @unique
  user            User    @relation(fields: [userId], references: [id])
  age             Int
  gender          String  // "male" | "female" | "other"
  weightKg        Float
  heightCm        Float
  program         String  // "BULKING" | "CUTTING" | "MAINTENANCE"
  activityLevel   String  // "sedentary" | "lightly_active" | "moderately_active" | "very_active"
  targetWeightKg  Float?
  tdee            Int     // auto-calculated via Mifflin-St Jeor
  dailyCalTarget  Int     // tdee × program modifier
  proteinTargetG  Int     // 30% of dailyCal ÷ 4
  carbTargetG     Int     // 45% of dailyCal ÷ 4
  fatTargetG      Int     // 25% of dailyCal ÷ 9
}
```

### FoodLog

```prisma
model FoodLog {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  name              String
  mealType          String   // "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK"
  calories          Int
  proteinG          Float
  carbG             Float
  fatG              Float
  fiberG            Float?
  sodiumMg          Float?
  portionG          Float    @default(100)
  portionMultiplier Float    @default(1.0)
  source            String   // "GPT_VISION" | "BARCODE" | "MANUAL" | "DATABASE"
  loggedAt          DateTime @default(now())
}
```

### BodyMeasurement

```prisma
model BodyMeasurement {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  weightKg    Float?
  waistCm     Float?
  chestCm     Float?
  hipsCm      Float?
  armsCm      Float?
  thighsCm    Float?
  neckCm      Float?
  bodyFatPct  Float?
  bmi         Float?   // auto-calculated: weightKg / (heightCm/100)^2
  source      String   // "GPT_VISION" | "MANUAL"
  measuredAt  DateTime @default(now())
}
```

---

## TDEE Calculation Logic

Using Mifflin-St Jeor equation:

```
Male:   BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
Female: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
```

Activity multipliers:
| Level | Multiplier |
|-------|-----------|
| sedentary | ×1.2 |
| lightly_active | ×1.375 |
| moderately_active | ×1.55 |
| very_active | ×1.725 |

Program modifiers:
| Program | Modifier |
|---------|----------|
| BULKING | TDEE × 1.15 (+15%) |
| CUTTING | TDEE × 0.80 (−20%) |
| MAINTENANCE | TDEE × 1.00 |

Macro split:
- Protein: 30% of daily calories ÷ 4 (cal/g)
- Carbs: 45% of daily calories ÷ 4 (cal/g)
- Fat: 25% of daily calories ÷ 9 (cal/g)

---

## API Routes

All routes require NextAuth session unless noted. Route handlers live in `src/app/api/`.

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/auth/[...nextauth]` | NextAuth handlers (login, logout, callback) |

### Profile & Onboarding

| Method | Path | Description | Request Body |
|--------|------|-------------|-------------|
| GET | `/api/profile` | Get current user profile + targets | — |
| POST | `/api/profile` | Create profile, calc TDEE, set `onboardingDone=true` | `{ age, gender, weightKg, heightCm, program, activityLevel, targetWeightKg? }` |
| PATCH | `/api/profile` | Update fields, recalculate TDEE + macros | Partial body of same fields |

**Response format:**
```json
{
  "profile": {
    "age": 24,
    "gender": "male",
    "weightKg": 75,
    "heightCm": 178,
    "program": "BULKING",
    "activityLevel": "moderately_active",
    "tdee": 2420,
    "dailyCalTarget": 2783,
    "proteinTargetG": 209,
    "carbTargetG": 313,
    "fatTargetG": 77
  }
}
```

### Food Scan & Logging

| Method | Path | Description | Request Body |
|--------|------|-------------|-------------|
| POST | `/api/food/scan` | Image → GPT-4o Vision → nutrition JSON | `{ image: base64 }` |
| POST | `/api/food/barcode` | Barcode → Open Food Facts (GPT-4o fallback) | `{ barcode: string }` |
| GET | `/api/food/search?q=` | Search internal food database | — |
| GET | `/api/food/log?date=YYYY-MM-DD` | Get food logs for a date | — |
| POST | `/api/food/log` | Create food log entries | `{ items: [...], mealType }` |
| PATCH | `/api/food/log/[id]` | Edit a logged entry | Partial body |
| DELETE | `/api/food/log/[id]` | Delete a food log | — |

**POST `/api/food/scan` — GPT-4o Vision prompt:**

```
System: You are a nutrition analyst. Analyze the food photo and return a JSON array of detected food items with estimated nutrition per item.

Return format:
[
  { "name": "...", "portionG": ..., "kcal": ..., "proteinG": ..., "carbG": ..., "fatG": ..., "confidence": 0-100 }
]

Be specific about portion sizes. If multiple items are visible, list each separately.
```

**POST `/api/food/log` — Request body:**
```json
{
  "mealType": "LUNCH",
  "items": [
    { "name": "White Rice", "portionG": 200, "calories": 260, "proteinG": 5, "carbG": 57, "fatG": 0.6, "source": "GPT_VISION" },
    { "name": "Grilled Chicken", "portionG": 100, "calories": 165, "proteinG": 31, "carbG": 0, "fatG": 3.6, "source": "GPT_VISION" }
  ]
}
```

### Body Measurement

| Method | Path | Description | Request Body |
|--------|------|-------------|-------------|
| POST | `/api/body/scan` | Image → GPT-4o Vision → measurement JSON | `{ image: base64 }` |
| GET | `/api/body/log?limit=30` | Get measurement history | — |
| POST | `/api/body/log` | Save body measurements (auto-calc BMI) | `{ weightKg?, waistCm?, chestCm?, ... }` |
| DELETE | `/api/body/log/[id]` | Delete a measurement | — |

**POST `/api/body/scan` — GPT-4o Vision prompt:**

```
System: You are a body measurement reader. Analyze the photo (tape measure, scale, or written notes) and extract all visible measurements.

Return format:
{ "weightKg": ..., "waistCm": ..., "chestCm": ..., "hipsCm": ..., "armsCm": ..., "thighsCm": ..., "neckCm": ..., "bodyFatPct": ... }

Return null for any field not visible in the photo.
```

### AI Features

| Method | Path | Description | Cache |
|--------|------|-------------|-------|
| POST | `/api/ai/daily-tip` | Generate daily tip + meal suggestions | 1x/day per user |
| POST | `/api/ai/weekly-report` | Generate 7-day insight report | 1x/week per user |

**POST `/api/ai/daily-tip` — GPT-4o prompt context:**

```
System: You are a nutrition coach. Based on the user's profile and today's food logs, provide:
1. A short personalized tip (1-2 sentences)
2. 2-3 meal suggestions to reach their daily target

Context provided: { profile, todayLogs, remainingMacros }
```

**Response:**
```json
{
  "tip": "You're 66g short on protein. A post-workout shake + Greek yogurt would close the gap.",
  "suggestions": [
    { "name": "Chicken rice bowl", "kcal": 580, "proteinG": 42 },
    { "name": "Salmon + sweet potato", "kcal": 640, "proteinG": 48 }
  ],
  "cachedAt": "2026-05-08T00:00:00Z"
}
```

### Dashboard & Progress

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard/today` | Today's totals (calories, macros, water) + streak |
| GET | `/api/progress/nutrition?days=30` | Daily macro totals for chart rendering |
| GET | `/api/progress/body` | All body measurement history |
| GET | `/api/export/csv` | Download all user data as CSV |

**GET `/api/dashboard/today` — Response:**
```json
{
  "calories": { "consumed": 941, "target": 2783, "remaining": 1842 },
  "protein": { "consumed": 94, "target": 160 },
  "carbs": { "consumed": 210, "target": 300 },
  "fat": { "consumed": 48, "target": 80 },
  "water": { "consumed": 1.8, "target": 2.5 },
  "streak": 12,
  "meals": [
    { "id": "...", "mealType": "BREAKFAST", "name": "Oatmeal + Banana", "calories": 320, "proteinG": 12, "loggedAt": "..." }
  ]
}
```

---

## File Structure (Backend)

```
src/
├── app/
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/route.js     # NextAuth config
│       ├── profile/
│       │   └── route.js                   # GET, POST, PATCH
│       ├── food/
│       │   ├── scan/route.js              # POST (GPT-4o Vision)
│       │   ├── barcode/route.js           # POST (Open Food Facts)
│       │   ├── search/route.js            # GET (?q=)
│       │   └── log/
│       │       ├── route.js               # GET, POST
│       │       └── [id]/route.js          # PATCH, DELETE
│       ├── body/
│       │   ├── scan/route.js              # POST (GPT-4o Vision)
│       │   └── log/
│       │       ├── route.js               # GET, POST
│       │       └── [id]/route.js          # DELETE
│       ├── ai/
│       │   ├── daily-tip/route.js         # POST
│       │   └── weekly-report/route.js     # POST
│       ├── dashboard/
│       │   └── today/route.js             # GET
│       ├── progress/
│       │   ├── nutrition/route.js         # GET
│       │   └── body/route.js              # GET
│       └── export/
│           └── csv/route.js               # GET
├── lib/
│   ├── prisma.js                          # Prisma client singleton
│   ├── auth.js                            # NextAuth config export
│   ├── openai.js                          # OpenAI client wrapper
│   ├── tdee.js                            # TDEE + macro calculation
│   ├── food-database.js                   # Static food nutrition DB
│   └── utils.js                           # Shared helpers
└── middleware.js                          # Auth redirect logic
```

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/fitscan"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="random-secret-32-chars"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# OpenAI
OPENAI_API_KEY="sk-..."
```

---

## Key Implementation Notes

### Food Scan Flow (Backend)

1. Client sends base64 image to `POST /api/food/scan`
2. Server sends image to GPT-4o Vision with structured prompt
3. GPT-4o returns JSON array of detected food items
4. Server returns array to client for review/edit
5. Client confirms → sends to `POST /api/food/log` with `source: "GPT_VISION"`

### Manual Food Log Flow

1. Client uses local food database for search + auto-fill (no API call needed)
2. Client sends final items to `POST /api/food/log` with `source: "DATABASE"` or `"MANUAL"`

### Barcode Flow

1. Client detects barcode via ZXing (client-side)
2. Sends barcode string to `POST /api/food/barcode`
3. Server queries Open Food Facts API
4. If found → return nutrition data
5. If not found → fallback to GPT-4o Vision with product photo

### Caching Strategy

| Data | Cache | Invalidation |
|------|-------|-------------|
| AI daily tip | 1x per user per day | New day (midnight) |
| AI weekly report | 1x per user per week | Monday 00:00 |
| Dashboard today | No cache (real-time) | — |
| Progress charts | 5 min client-side | On new log entry |

### Error Handling

All API routes return consistent error format:
```json
{
  "error": "Brief error message",
  "code": "UNAUTHORIZED | VALIDATION | NOT_FOUND | AI_ERROR | INTERNAL"
}
```

HTTP status codes:
- 200 — Success
- 201 — Created
- 400 — Validation error
- 401 — Unauthorized (no session)
- 404 — Not found
- 500 — Internal server error

---

## Deployment Checklist

- [ ] Set up PostgreSQL instance (e.g., Neon, Supabase, Railway)
- [ ] Run `npx prisma migrate deploy`
- [ ] Configure Google OAuth credentials (authorized redirect URIs)
- [ ] Set `OPENAI_API_KEY` with GPT-4o access
- [ ] Set `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- [ ] Deploy to Vercel with environment variables
- [ ] Verify middleware auth redirects work
- [ ] Test food scan with real photos
