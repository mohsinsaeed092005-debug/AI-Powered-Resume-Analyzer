# Security audit

Last audit: repository prepared for public GitHub and Vercel deployment.

## Scan results

| Check | Status |
|-------|--------|
| Hardcoded OpenRouter / Groq keys in `.ts`, `.tsx`, `.py`, `.bat` | **None found** |
| Hardcoded MongoDB credentials in source | **None found** (localhost default only, no user/password) |
| API keys in `.env.example` files | **Placeholders only** |
| `.env` / `.env.local` gitignored | **Yes** |
| Git history with committed secrets | **No commits yet** on root repo |

## Local files with real secrets (do not commit)

These files may exist on your machine and must stay **out of Git**:

- `.env` (repo root)
- `frontend/.env`
- `ai-resume-system/.env.local`

They are listed in `.gitignore`. Before every push, run:

```powershell
powershell -File scripts/check-secrets.ps1
git status
```

`git status` must **not** show `.env`, `.env.local`, or files containing API keys.

## If keys were ever shared

Rotate immediately:

1. [OpenRouter](https://openrouter.ai/) — revoke old key, create new one  
2. [Groq](https://console.groq.com/) — if `GROQ_API_KEY` was exposed  
3. MongoDB Atlas — rotate DB user password if connection string leaked  
4. `NEXTAUTH_SECRET` — generate a new random value for production  

Put new values only in Vercel Environment Variables and local `.env.local` files.

## Production (Vercel)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for required environment variables. Never paste live keys into GitHub Issues, chat, or screenshots.
