# AI Resume System — Claude Brief (Safe to Share)

Use this document when asking Claude for UI/feature changes. **Do not attach `.env.local`, API keys, MongoDB connection strings, or any secrets.**

After Claude gives you updated code or instructions, send that output back to **Cursor** for implementation.

---

## Project overview

| Item | Value |
|------|--------|
| App name | AI Resume System |
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Icons | `lucide-react` |
| Dev command | `npm run dev` → http://localhost:3000 |
| Project folder | `ai-resume-system/` |

**Purpose:** ATS-friendly resume builder — AI resume generation, ATS scoring, skill gap, job prediction, PDF export, profile storage.

---

## DO NOT MODIFY (security & backend secrets)

Claude must **not** change, expose, or document real credentials. These stay server-side only:

| Area | Paths | Why |
|------|--------|-----|
| Environment | `.env.local`, `.env.example` (only placeholders) | API keys, DB URI, auth secret |
| AI client | `src/lib/openrouter.ts` | Calls external AI; uses server env vars |
| Database | `src/lib/mongodb.ts` | MongoDB connection |
| Auth | `src/app/api/auth/[...nextauth]/route.ts` | NextAuth + JWT secret |
| Env variable names | Never show in UI error messages | Prevents leaking setup details |

**Allowed:** Change UI that *calls* public API routes (e.g. `fetch("/api/generate-resume")`).  
**Not allowed:** Put API keys in client components, hardcode tokens, or return secrets in JSON responses.

---

## Public pages (safe to redesign)

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/page.tsx` | Landing — hero, features, link to dashboard |
| `/dashboard` | `src/app/(app)/dashboard/page.tsx` | Stats, quick links, ATS card, job predictions |
| `/resume` | `src/app/(app)/resume/page.tsx` | Main builder: form, preview, generate, ATS, PDF |
| `/job-predictor` | `src/app/(app)/job-predictor/page.tsx` | Role predictions from skills |
| `/profile` | `src/app/(app)/profile/page.tsx` | User profile / sign-in UI |

**App shell:** `src/app/(app)/layout.tsx` + `src/components/Sidebar.tsx` (nav links).

---

## Reusable components (safe to edit)

- `src/components/ResumeForm.tsx` — profile input fields
- `src/components/ResumePreview.tsx` — resume text preview
- `src/components/ATSScoreCard.tsx` — ATS score display
- `src/components/SkillGapCard.tsx` — missing skills
- `src/components/JobPredictionCards.tsx` — predicted roles
- `src/components/TemplatePicker.tsx` — resume template choice
- `src/components/DownloadPDFButton.tsx` — PDF export
- `src/templates/index.ts` — template layouts (`professional`, etc.)

---

## Public API routes (contracts only — no auth headers in docs)

Frontend should only use **relative** paths like `/api/...`. Do not document Bearer tokens or env keys.

### `POST /api/generate-resume`
**Body:**
```json
{
  "profile": {
    "name": "string",
    "email": "string",
    "skills": "string",
    "experience": "string",
    "projects": "string",
    "education": "string",
    "targetRole": "string",
    "jobDescription": "string (optional)"
  },
  "jobDescription": "string (optional)",
  "template": "professional | creative | minimal (see templates)"
}
```
**Success:** `{ "success": true, "resume": "plain text", "source": "ai" }`  
**Failure:** `{ "success": false, "error": "user-safe message" }`

### `POST /api/ats-score`
**Body:** `{ "resume", "jobDescription", "userSkills", "requiredSkills" }`  
**Response:** `{ "atsScore": number, "skillGap": { "required", "userHas", "missing" } | null }`

### `POST /api/skill-gap`
**Body:** `{ "userSkills", "requiredSkills" }` (string or array)

### `POST /api/predict-job`
**Body:** `{ "skills": "comma-separated or array" }`  
**Response:** `{ "predictions": RolePrediction[], "skills": string[] }`

### `POST /api/interview-questions`
**Body:** `{ "role": "string", "resume": "string" }`  
**Response:** `{ "questions": "string" }`

### `GET /api/users`
**Response:** `{ "users_count": number }`

### `POST /api/users` — save user profile (body: profile fields)

### `POST /api/resumes` — save generated resume  
### `GET /api/resumes?email=...` — list resumes

### `POST /api/job-analysis` / `GET /api/job-analysis` — store/list JD analyses

### Auth (do not redesign logic)
- `GET/POST /api/auth/*` — NextAuth (credentials). Sign-in page: `/profile`.

---

## TypeScript types (`src/types/index.ts`)

```ts
UserProfile: name, email, skills, experience, projects, education, targetRole, jobDescription?
RolePrediction: role, matchScore, matchedSkills[], missingSkills[]
SkillGapResult: required[], userHas[], missing[]
```

---

## Design tokens (current)

- Dark landing: `bg-slate-950`, accent `emerald-500`
- App area: `bg-slate-100`, cards white with `border-slate-200`
- Sidebar: `bg-slate-950`, active link `emerald-500/15`
- Fonts: Geist (via `layout.tsx`)

---

## Local state

- `localStorage` key: `ai-resume-state` — predictions, ATS score (dashboard/resume)

---

## How to request changes from Claude

Copy the block below, fill in **your** requirements, and attach this file.

```
I am working on the AI Resume System (Next.js). I attached CLAUDE_BRIEF.md.

RULES:
- Do NOT modify: openrouter.ts, mongodb.ts, auth route, .env files
- Do NOT expose API keys or env variable names in UI
- Only change the files I list, or suggest new component files under src/components/

MY CHANGES:
1. [e.g. Change landing page colors to blue theme]
2. [e.g. Add Urdu language toggle on dashboard]
3. [e.g. Improve mobile layout for /resume]

OUTPUT FORMAT:
- List each file path to create or edit
- Provide full file contents OR clear diff-style instructions
- Mention any new npm packages needed
```

---

## What to send back to Cursor

1. Claude’s full reply (code blocks + file paths)  
2. Which pages you care about most  
3. **Do not** paste `.env.local` or real API keys  

Cursor will implement changes in `ai-resume-system/` and keep security files untouched.

---

## Quick file tree

```
ai-resume-system/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # landing
│   │   ├── (app)/                   # dashboard, resume, job-predictor, profile
│   │   └── api/                     # server routes (see table above)
│   ├── components/
│   ├── lib/                         # ⚠️ mostly server-only — do not expose
│   ├── templates/
│   ├── types/
│   └── utils/
├── .env.example                     # placeholders only
├── CLAUDE_BRIEF.md                  # this file
└── package.json
```

---

*Last updated: May 2026 — for `ai-resume-system` only.*
