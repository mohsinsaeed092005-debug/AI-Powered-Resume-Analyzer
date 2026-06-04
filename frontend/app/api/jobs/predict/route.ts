import { NextResponse } from "next/server";
import { tryInsert } from "../../../../lib/db";
import { SKILL_CANDIDATES, ROLE_SKILL_DATASET } from "../../../../lib/constants";
import { computeCosineSimilarity } from "../../../../lib/tfidf";

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function userProfileTerms(user: any): string[] {
  const profileText = normalizeText(
    [
      ...(user.skills || []),
      ...(user.education || []),
      ...(user.experience || []),
      ...(user.projects || []),
      ...(user.certifications || []),
      user.target_role || "",
    ].join(" ")
  ).toLowerCase();

  const terms = new Set<string>((user.skills || []).map((s: string) => s.toLowerCase()));
  
  SKILL_CANDIDATES.forEach((candidate) => {
    if (profileText.includes(candidate.toLowerCase())) {
      terms.add(candidate.toLowerCase());
    }
  });

  return Array.from(terms).sort();
}

export async function POST(req: Request) {
  try {
    const user = await req.json();
    const { name, email, target_role } = user;

    const profileText = normalizeText(
      [
        ...(user.skills || []),
        ...(user.education || []),
        ...(user.experience || []),
        ...(user.projects || []),
        ...(user.certifications || []),
        target_role || "",
      ].join(" ")
    );

    if (!profileText.trim()) {
      return NextResponse.json({ error: "Add skills, experience, projects, or a target role first." }, { status: 400 });
    }

    const userTerms = userProfileTerms(user);
    const predictions: any[] = [];

    // Compute semantic match score for each role in ROLE_SKILL_DATASET
    Object.entries(ROLE_SKILL_DATASET).forEach(([role, roleSkills]) => {
      const matchedSkills = roleSkills.filter((s) => userTerms.includes(s.toLowerCase())).sort();
      const missingSkills = roleSkills.filter((s) => !userTerms.includes(s.toLowerCase())).sort();

      const skillScore = roleSkills.length > 0 ? matchedSkills.length / roleSkills.length : 0;
      
      // Calculate text-based similarity
      const roleText = roleSkills.join(" ");
      const semanticScore = computeCosineSimilarity(profileText, roleText);

      // Final score: 65% skills intersection, 35% text similarity
      const finalScore = Math.round(((skillScore * 0.65) + (semanticScore * 0.35)) * 10000) / 100;

      predictions.push({
        role,
        score: finalScore,
        match_label: `${finalScore}% Match`,
        matched_skills: matchedSkills,
        missing_skills: missingSkills.slice(0, 5),
      });
    });

    predictions.sort((a, b) => b.score - a.score);

    const result = {
      candidate: { name, email, target_role },
      extracted_skills: userTerms,
      best_roles: predictions.slice(0, 3),
      all_predictions: predictions,
    };

    const analysisId = await tryInsert("job_descriptions", result);

    return NextResponse.json({
      ...result,
      analysis_id: analysisId,
      stored: !!analysisId
    });
  } catch (error) {
    console.error("Error in /api/jobs/predict:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
