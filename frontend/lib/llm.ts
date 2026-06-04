// LLM helper for calling Groq or OpenRouter APIs
import { getAppUrl } from "@/lib/env";

const LLM_URL = process.env.GROQ_API_KEY
  ? "https://api.groq.com/openai/v1/chat/completions"
  : (process.env.OPENROUTER_URL || "https://openrouter.ai/api/v1/chat/completions");

const LLM_MODEL = process.env.GROQ_API_KEY
  ? (process.env.GROQ_MODEL || "llama-3.3-70b-versatile")
  : (process.env.OPENROUTER_MODEL || "openai/gpt-4o");

export async function callLLM(messages: any[], maxTokens = 1200): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY or OPENROUTER_API_KEY in environment variables");
  }

  const usingGroq = Boolean(process.env.GROQ_API_KEY);

  const response = await fetch(LLM_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(usingGroq
        ? {}
        : {
            "HTTP-Referer": getAppUrl(),
            "X-Title": "Resume Analyzer",
          }),
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages: messages,
      temperature: 0.2,
      max_tokens: maxTokens
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const choice = data?.choices?.[0];
  return choice?.message?.content || choice?.text || "";
}

export function getLlmModelName(): string {
  return LLM_MODEL;
}
