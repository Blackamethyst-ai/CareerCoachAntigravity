/**
 * Resume Builder Type Definitions
 */

export interface MatchResult {
  // Dimension scores (0-100)
  keywordScore: number;
  experienceScore: number;
  skillsScore: number;
  impactScore: number;
  recencyScore: number;
  cultureScore: number;

  // Composite
  totalScore: number;
  matchTier: 'STRONG_MATCH' | 'MODERATE_MATCH' | 'WEAK_MATCH' | 'NO_MATCH';

  // Details
  keywordsMatched: string[];
  keywordsMissing: string[];
  skillsMatched: string[];
  skillsMissing: string[];
  experienceDirect: string[];
  experienceTransferable: string[];
  experienceGaps: string[];

  // Flags
  overqualified: boolean;
  underqualified: boolean;

  // Recommendations
  recommendations: string[];
}

export interface JobDescription {
  title: string;
  company: string;
  text: string;
  requirements?: string[];
  yearsRequired?: number;
  location?: string;
  remote?: boolean;
}

export interface MasterProfile {
  name: string;
  text: string;
  skills: string[];
  experience: string[];
  yearsExperience: number;
  certifications?: string[];
  // New: Chameleon Engine
  chameleonValues?: {
    speed?: string;
    safety?: string;
    ecosystem?: string;
    creative?: string;
  }
}

export type Archetype = 'speed' | 'safety' | 'ecosystem' | 'creative' | 'general';

export interface ChameleonMetrics {
  metric: string;
  original: string;
  rewritten: string;
  archetype: Archetype;
}

export interface MatchReport {
  jobTitle: string;
  company: string;
  result: MatchResult;
  generatedAt: string;

  // Chameleon Engine Output
  chameleonMetrics?: ChameleonMetrics[];
  selectedArchetype?: Archetype;
}

export interface ScoreDimension {
  name: string;
  score: number;
  weight: number;
  weighted: number;
  description: string;
}

export const DIMENSION_WEIGHTS = {
  keyword: 0.25,
  experience: 0.25,
  skills: 0.20,
  impact: 0.15,
  recency: 0.10,
  culture: 0.05,
} as const;

export const MATCH_TIERS = {
  STRONG_MATCH: { min: 75, label: 'Strong Match', color: 'success', emoji: '✅' },
  MODERATE_MATCH: { min: 50, label: 'Moderate Match', color: 'warning', emoji: '⚠️' },
  WEAK_MATCH: { min: 25, label: 'Weak Match', color: 'orange', emoji: '🟡' },
  NO_MATCH: { min: 0, label: 'No Match', color: 'destructive', emoji: '🚫' },
} as const;

export interface AnalysisResponse {
  success: boolean;
  result: MatchResult;
  report: string;
  profile: {
    name: string;
    skillsCount: number;
    experienceCount: number;
    yearsExperience: number;
  };
  job: {
    title: string;
    company: string;
    requirementsCount: number;
    yearsRequired?: number;
  };
  // Chameleon additions
  chameleonMetrics?: ChameleonMetrics[];
  archetype?: Archetype;
}
