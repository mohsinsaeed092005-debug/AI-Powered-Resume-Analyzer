export function calculateATS(resume: string, jd: string) {
  const resumeWords = resume.toLowerCase().split(/\s+/);
  const jdWords = jd.toLowerCase().split(/\s+/).filter(Boolean);

  let matched = 0;

  jdWords.forEach((word) => {
    if (word.length > 2 && resumeWords.includes(word)) {
      matched++;
    }
  });

  return jdWords.length > 0
    ? Math.floor((matched / jdWords.length) * 100)
    : 0;
}

export function analyzeSkillGap(
  userSkills: string[],
  requiredSkills: string[]
): { required: string[]; userHas: string[]; missing: string[] } {
  const userSet = new Set(userSkills.map((s) => s.toLowerCase().trim()));

  const userHas = requiredSkills.filter((skill) =>
    userSet.has(skill.toLowerCase().trim())
  );

  const missing = requiredSkills.filter(
    (skill) => !userSet.has(skill.toLowerCase().trim())
  );

  return { required: requiredSkills, userHas, missing };
}
