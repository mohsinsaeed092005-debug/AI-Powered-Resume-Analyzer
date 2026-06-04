import { analyzeSkillGap } from "@/lib/ats";

export async function POST(req: Request) {
  try {
    const { userSkills, requiredSkills } = await req.json();

    const userList = Array.isArray(userSkills)
      ? userSkills
      : String(userSkills || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);

    const requiredList = Array.isArray(requiredSkills)
      ? requiredSkills
      : String(requiredSkills || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);

    const result = analyzeSkillGap(userList, requiredList);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Skill gap analysis failed" },
      { status: 500 }
    );
  }
}
