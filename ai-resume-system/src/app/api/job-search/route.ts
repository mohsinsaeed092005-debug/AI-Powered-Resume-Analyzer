type RemotiveJob = {
  id: number;
  url: string;
  title: string;
  company_name: string;
  candidate_required_location: string;
  salary?: string;
  job_type?: string;
  publication_date?: string;
  description?: string;
  tags?: string[];
};

function splitTerms(value: unknown) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value || "")
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function scoreJob(job: RemotiveJob, terms: string[]) {
  const haystack = [
    job.title,
    job.company_name,
    job.description,
    ...(job.tags || []),
  ]
    .join(" ")
    .toLowerCase();
  const matched = terms.filter((term) => haystack.includes(term.toLowerCase()));
  const roleBoost = /engineer|developer|scientist|analyst|manager|designer/i.test(job.title)
    ? 8
    : 0;
  return {
    score: Math.min(98, Math.round((matched.length / Math.max(terms.length, 1)) * 90 + roleBoost)),
    matched,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const terms = splitTerms(body.skills);
    const roles = splitTerms(body.roles).slice(0, 3);
    const query = roles[0] || terms.slice(0, 3).join(" ") || "software";

    const remotiveRes = await fetch(
      `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}`,
      { next: { revalidate: 900 } }
    );
    const data = await remotiveRes.json();
    const jobs = ((data.jobs || []) as RemotiveJob[])
      .map((job) => {
        const match = scoreJob(job, [...terms, ...roles]);
        return {
          id: String(job.id),
          title: job.title,
          company: job.company_name,
          location: job.candidate_required_location || "Remote",
          source: "Remotive",
          url: job.url,
          salary: job.salary || "",
          jobType: job.job_type || "Remote",
          publishedAt: job.publication_date || "",
          tags: job.tags || [],
          matchScore: match.score,
          matchedSkills: match.matched,
        };
      })
      .filter((job) => job.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 9);

    return Response.json({ jobs, source: "Remotive" });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Job search failed." },
      { status: 500 }
    );
  }
}
