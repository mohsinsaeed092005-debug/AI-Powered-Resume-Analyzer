/** Normalize AI output for clean PDF/text display (ASCII-safe). */
export function sanitizeResumeText(text: string): string {
  return text
    .replace(/\u2013|\u2014/g, "-")
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "-")
    .replace(/[\u2500-\u257F]/g, "-")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
