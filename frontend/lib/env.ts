/**
 * Shared environment helpers for local dev and Vercel deployment.
 */

export function getMongoUri(): string | undefined {
  return process.env.MONGODB_URI || process.env.MONGO_URI;
}

/** Public app URL for OpenRouter HTTP-Referer and similar headers. */
export function getAppUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    process.env.NEXTAUTH_URL;
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  const port = process.env.PORT || "3001";
  return `http://localhost:${port}`;
}
