import { predictJob } from "@/lib/predict";

type ParsedResume = Record<string, unknown>;
type ParserAttempt = {
  endpoint: string;
  headers: Record<string, string>;
};

const COMMON_SKILLS = [
  "python",
  "javascript",
  "typescript",
  "react",
  "nextjs",
  "next.js",
  "nodejs",
  "mongodb",
  "sql",
  "java",
  "c++",
  "c#",
  "html",
  "css",
  "tailwind",
  "ml",
  "ai",
  "machine learning",
  "data science",
  "tensorflow",
  "pytorch",
  "nlp",
  "docker",
  "kubernetes",
  "aws",
  "devops",
  "git",
  "api",
  "rest",
  "fastapi",
  "django",
  "linux",
];

function flattenText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flattenText).join(" ");
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).map(flattenText).join(" ");
  }
  return String(value);
}

function extractSkills(parsed: ParsedResume) {
  const knownSkillValues = [
    parsed.skills,
    parsed.skill,
    parsed.technical_skills,
    parsed.technicalSkills,
    parsed.competencies,
  ];

  const explicit = knownSkillValues
    .flatMap((value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value.map(flattenText);
      return flattenText(value).split(/[,;|]/);
    })
    .map((skill) => skill.trim())
    .filter(Boolean);

  const haystack = flattenText(parsed).toLowerCase();
  const inferred = COMMON_SKILLS.filter((skill) => haystack.includes(skill));
  return Array.from(new Set([...explicit, ...inferred])).slice(0, 24);
}

function extractSummary(parsed: ParsedResume) {
  const name = flattenText(parsed.name || parsed.fullName || parsed.full_name).trim();
  const email = flattenText(parsed.email || parsed.emailAddress || parsed.email_address).trim();
  const experience = flattenText(parsed.experience || parsed.workExperiences || parsed.work_experience)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 450);

  return { name, email, experience };
}

function parserAttempts(apiKey: string): ParserAttempt[] {
  const configuredEndpoint = process.env.CV_PARSE_API_URL;
  const endpoints = [
    configuredEndpoint,
    "https://api.cvparser.ai/v1/parse",
    "https://resumeparser.app/resume/parse",
  ].filter(Boolean) as string[];

  return Array.from(new Set(endpoints)).flatMap((endpoint): ParserAttempt[] => [
    {
      endpoint,
      headers: { Authorization: `Bearer ${apiKey}` },
    },
    {
      endpoint,
      headers: { "X-API-Key": apiKey },
    },
    {
      endpoint,
      headers: { "x-api-key": apiKey },
    },
  ]);
}

async function callParser(file: File, apiKey: string) {
  let lastError = "Resume parser rejected the uploaded file.";

  for (const attempt of parserAttempts(apiKey)) {
    const parserForm = new FormData();
    parserForm.append("file", file, file.name);

    const response = await fetch(attempt.endpoint, {
      method: "POST",
      headers: attempt.headers,
      body: parserForm,
    });

    const parsed = (await response.json().catch(() => ({}))) as ParsedResume;
    if (response.ok) return parsed;

    lastError =
      flattenText(parsed.error || parsed.message || parsed.detail).trim() || lastError;

    if (response.status !== 401 && response.status !== 403 && response.status !== 404) {
      break;
    }
  }

  throw new Error(lastError);
}

async function parseLocally(file: File) {
  const text = await file.text();
  const compactText = text.replace(/\s+/g, " ").trim();
  if (!compactText || compactText.length < 20) return null;

  return {
    resumeText: compactText,
    skills: extractSkills({ resumeText: compactText }),
  };
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.CV_PARSE_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "CV parser API key is missing." }, { status: 500 });
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "Please upload a resume file." }, { status: 400 });
    }

    let parsed: ParsedResume;
    let parserSource = "api";
    try {
      parsed = await callParser(file, apiKey);
    } catch (parserError) {
      const localParsed = await parseLocally(file);
      if (!localParsed) {
        return Response.json(
          {
            error:
              parserError instanceof Error
                ? parserError.message
                : "Resume parsing failed. Check CV_PARSE_API_URL for your provider.",
          },
          { status: 502 }
        );
      }
      parsed = localParsed;
      parserSource = "local-text";
    }

    const skills = extractSkills(parsed);
    const predictions = predictJob(skills);

    return Response.json({
      parsed,
      skills,
      skillsText: skills.join(", "),
      summary: extractSummary(parsed),
      predictions,
      parserSource,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Resume parsing failed." },
      { status: 500 }
    );
  }
}
