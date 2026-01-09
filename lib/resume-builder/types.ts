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
  summaryArchetypes?: SummaryArchetype[];
}

export interface SummaryArchetype {
  name: string;
  type: 'technical' | 'operations' | 'strategy' | 'frontier';
  content: string;
}

export interface MatchReport {
  jobTitle: string;
  company: string;
  result: MatchResult;
  generatedAt: string;
  selectedArchetype?: string;
  tailoredSummary?: string;
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
