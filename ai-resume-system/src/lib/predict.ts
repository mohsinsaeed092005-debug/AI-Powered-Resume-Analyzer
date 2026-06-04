const roles = [
  {
    role: "AI Engineer",
    skills: ["python", "ml", "ai", "tensorflow", "pytorch", "nlp"],
  },
  {
    role: "Backend Developer",
    skills: ["nextjs", "mongodb", "nodejs", "api", "rest", "sql"],
  },
  {
    role: "Full Stack Developer",
    skills: ["react", "nextjs", "nodejs", "mongodb", "typescript", "css"],
  },
  {
    role: "Data Scientist",
    skills: ["python", "pandas", "numpy", "ml", "statistics", "sql"],
  },
  {
    role: "DevOps Engineer",
    skills: ["docker", "kubernetes", "aws", "ci/cd", "linux", "git"],
  },
];

export function predictJob(userSkills: string[]) {
  const userSet = new Set(userSkills.map((s) => s.toLowerCase().trim()));

  return roles
    .map(({ role, skills }) => {
      const matchedSkills = skills.filter((s) => userSet.has(s));
      const missingSkills = skills.filter((s) => !userSet.has(s));
      const matchScore = Math.round((matchedSkills.length / skills.length) * 100);

      return { role, matchScore, matchedSkills, missingSkills };
    })
    .filter((p) => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}
