import { calculateATS, analyzeSkillGap } from "@/lib/ats";

export async function POST(req: Request) {
  try {
    const { resume, jobDescription, userSkills, requiredSkills } =
      await req.json();

    const atsScore = calculateATS(resume || "", jobDescription || "");

    let skillGap = null;
    if (userSkills && requiredSkills) {
      const userList = Array.isArray(userSkills)
        ? userSkills
        : String(userSkills).split(",").map((s: string) => s.trim());
      const requiredList = Array.isArray(requiredSkills)
        ? requiredSkills
        : String(requiredSkills).split(",").map((s: string) => s.trim());
      skillGap = analyzeSkillGap(userList, requiredList);
    }

    return Response.json({ atsScore, skillGap });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "ATS scoring failed" },
      { status: 500 }
    );
  }
}
