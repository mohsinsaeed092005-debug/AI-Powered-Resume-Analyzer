/**
 * Shared environment helpers for local dev and Vercel deployment.
 */

export function getMongoUri(): string | undefined {
  return process.env.MONGODB_URI || process.env.MONGO_URI;
}

/** Public app URL for NextAuth, OpenRouter HTTP-Referer, etc. */
export function getAppUrl(): string {
  const explicit = process.env.NEXTAUTH_URL || process.env.APP_URL;
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  const port = process.env.PORT || "3000";
  return `http://localhost:${port}`;
}
