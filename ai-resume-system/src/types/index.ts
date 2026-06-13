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

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  source: string;
  url: string;
  salary?: string;
  jobType?: string;
  publishedAt?: string;
  tags: string[];
  matchScore: number;
  matchedSkills: string[];
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
