# Deployment guide (GitHub + Vercel)

This repository is configured so **secrets stay in environment variables**, not in source code. Never commit `.env` or `.env.local` files.

## Before you push to GitHub

1. Copy each app’s `.env.example` to `.env.local` (or root `.env` for Python) and fill in real values **only on your machine**.
2. Run the secret scan: `powershell -File scripts/check-secrets.ps1` (must print **PASSED**).
3. Confirm `.env` files are ignored: `git status` must **not** list `.env`, `.env.local`, or API keys.
3. Use **one** Git repository at the project root (`M:\AI-Powered-Resume-Analyzer`). Do not keep a nested `.git` folder inside `ai-resume-system` (that would upload as an empty submodule on GitHub).
4. If you ever committed secrets in the past, rotate those API keys and remove them from Git history before making the repo public.

## Which app to deploy for your teacher (main product)

| App | Folder | Vercel root directory | Live URL path |
|-----|--------|----------------------|---------------|
| **AI Resume System** (use this) | `ai-resume-system` | `ai-resume-system` | `/resume` |
| Developer testing UI (optional) | `frontend` | `frontend` | `/resume-analyzer` |

The Python `backend/` folder is for **local** FastAPI/ML use; it is not required for the Next.js apps on Vercel.

---

## Vercel: AI Resume System (`ai-resume-system`)

1. Import the GitHub repo in [Vercel](https://vercel.com).
2. Set **Root Directory** to `ai-resume-system`.
3. Add these **Environment Variables** (Production + Preview):

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes (for save/history) | MongoDB Atlas connection string — **not** `localhost` |
| `OPENROUTER_API_KEY` | Yes (for AI features) | From [OpenRouter](https://openrouter.ai/) |
| `OPENROUTER_MODEL` | No | Default: `openai/gpt-4o` |
| `OPENROUTER_URL` | No | Default: OpenRouter chat completions URL |
| `NEXTAUTH_SECRET` | Yes | Long random string (e.g. `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Yes | Your Vercel URL, e.g. `https://your-project.vercel.app` |

After the first deploy, set `NEXTAUTH_URL` to the exact production URL and **Redeploy**.

`VERCEL_URL` is set automatically by Vercel; the app uses it for OpenRouter `HTTP-Referer` when `NEXTAUTH_URL` is missing.

**Share with your teacher:** `https://<your-project>.vercel.app/resume`

---

## Vercel: Developer testing UI (`frontend`) — optional

1. Create a **second** Vercel project from the same repo.
2. Set **Root Directory** to `frontend`.
3. Add environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` or `MONGO_URI` | For DB APIs | MongoDB Atlas URI |
| `OPENROUTER_API_KEY` | For AI routes | OpenRouter key |
| `OPENROUTER_MODEL` | No | Default: `openai/gpt-4o` |
| `GROQ_API_KEY` | No | If set, Groq is used instead of OpenRouter |
| `GROQ_MODEL` | No | Default: `llama-3.3-70b-versatile` |
| `NEXT_PUBLIC_APP_URL` | No | e.g. `https://your-frontend.vercel.app` |

**Testing URL:** `https://<your-frontend-project>.vercel.app/resume-analyzer`

---

## Local development

- Main app: copy `ai-resume-system/.env.example` → `ai-resume-system/.env.local`
- Testing UI: copy `frontend/.env.example` → `frontend/.env.local`
- Python backend: copy `.env.example` → `.env` at repo root

Use the provided `.bat` starters on Windows, or:

```bash
cd ai-resume-system && npm run dev    # port 3003 locally
cd frontend && set PORT=3001&& npm run dev
```

---

## Security checklist

- [ ] No `.env` / `.env.local` in `git status`
- [ ] API keys only in Vercel Environment Variables (or local `.env`)
- [ ] MongoDB Atlas network access configured for cloud (not `127.0.0.1`)
- [ ] `NEXTAUTH_URL` matches the deployed domain
- [ ] Old keys rotated if they were ever pasted in chat or committed by mistake
