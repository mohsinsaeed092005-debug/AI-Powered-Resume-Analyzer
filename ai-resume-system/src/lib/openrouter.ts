import { getAppUrl } from "@/lib/env";

const OPENROUTER_API_URL =
  process.env.OPENROUTER_URL ||
  "https://openrouter.ai/api/v1/chat/completions";

export async function askAI(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  options?: { maxTokens?: number; temperature?: number }
) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("AI service is not configured. Contact the administrator.");
  }

  const response = await fetch(
    OPENROUTER_API_URL,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": getAppUrl(),
        "X-Title": "AI Resume System",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "openai/gpt-4o",
        messages,
        temperature: options?.temperature ?? 0.4,
        max_tokens: options?.maxTokens ?? 2000,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const msg =
      data?.error?.message ||
      data?.error ||
      `OpenRouter HTTP ${response.status}`;
    throw new Error(String(msg));
  }

  return data;
}

export async function askAIText(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  options?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  const data = await askAI(messages, options);
  const text =
    data.choices?.[0]?.message?.content?.trim() ??
    data.choices?.[0]?.text?.trim() ??
    "";

  if (!text) {
    throw new Error("AI returned empty response");
  }

  return text;
}
