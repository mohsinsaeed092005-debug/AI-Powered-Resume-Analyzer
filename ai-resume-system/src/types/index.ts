export interface UserProfile {
  name: string;
  email: string;
  skills: string;
  experience: string;
  projects: string;
  education: string;
  targetRole: string;
  jobDescription?: string;
}

export interface RolePrediction {
  role: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface SkillGapResult {
  required: string[];
  userHas: string[];
  missing: string[];
}

export interface SavedResume {
  _id?: string;
  email: string;
  profile: UserProfile;
  generatedContent?: string;
  atsScore?: number;
  createdAt: Date;
}
