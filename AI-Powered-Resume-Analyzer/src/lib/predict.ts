import { ROLE_DATABASE, type RoleDefinition } from "./roles";

export interface RolePrediction {
  role: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export function predictRoles(
  userSkills: string[],
  topN = 5
): RolePrediction[] {
  const userSet = new Set(userSkills.map((s) => s.toLowerCase()));

  const predictions: RolePrediction[] = ROLE_DATABASE.map(
    (role: RoleDefinition) => {
      const roleSkills = role.skills.map((s) => s.toLowerCase());
      const matched = roleSkills.filter((s) => userSet.has(s));
      const missing = roleSkills.filter((s) => !userSet.has(s));

      const matchScore =
        roleSkills.length > 0 ? matched.length / roleSkills.length : 0;

      return {
        role: role.title,
        matchScore: Math.round(matchScore * 100),
        matchedSkills: matched,
        missingSkills: missing,
      };
    }
  );

  return predictions
    .filter((p) => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, topN);
}
