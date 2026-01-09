/**
 * Interview Prep System - Type Definitions
 * Based on reverse-engineering insights from Stanford/micro1 research
 */

// ============================================================================
// SKILL LEVELS (matches AI Recruiter rating system)
// ============================================================================

export type SkillLevel = 'not-familiar' | 'junior' | 'mid-level' | 'senior';

export const SKILL_LEVEL_SCORES: Record<SkillLevel, number> = {
    'not-familiar': 0,
    'junior': 1,
    'mid-level': 2,
    'senior': 3,
};

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
    'not-familiar': 'Not Familiar',
    'junior': 'Junior',
    'mid-level': 'Mid-Level',
    'senior': 'Senior',
};

// ============================================================================
// SKILL DEPTH ASSESSMENT
// ============================================================================

export interface SkillNarrative {
    skillName: string;
    claimedLevel: SkillLevel;

    evidence: {
        projects: ProjectEvidence[];
        yearsOfExperience: number;
        starExamples: STARExample[];
        teachingExperience: string[];
        architecturalDecisions: ArchitecturalDecision[];
    };

    articulation: {
        preparedResponse: string;
        keyPoints: string[];
        followUpReadiness: Record<string, string>;
    };
}

export interface ProjectEvidence {
    name: string;
    description: string;
    role: string;
    duration: string;
    outcome: string;
    metricsAchieved?: string[];
}

export interface STARExample {
    situation: string;
    task: string;
    action: string;
    result: string;
    skillDemonstrated: string;
}

export interface ArchitecturalDecision {
    context: string;
    decision: string;
    rationale: string;
    outcome: string;
    alternativesConsidered?: string[];
}

export interface SkillDepthAssessment {
    skillName: string;
    claimedLevel: SkillLevel;

    evidenceStrength: number; // 0-100

    narrativeDepth: {
        projectCount: number;
        specificityScore: number;    // 0-10
        recencyScore: number;        // 0-10
        teachingEvidence: boolean;
        architecturalDecisions: boolean;
        quantifiedImpact: boolean;
    };

    predictedAIRating: SkillLevel;
    confidence: number;            // 0-100

    gaps: string[];
    recommendations: string[];
}

// ============================================================================
// QUESTION GENERATION
// ============================================================================

export type QuestionType = 'experience-probing' | 'practical-application' | 'problem-solving' | 'follow-up';

export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    skill: string;
    difficulty: 'junior' | 'mid' | 'senior';
    followUpTriggers?: string[];   // Keywords that trigger follow-ups
    expectedElements?: string[];    // What a good answer should contain
    redFlags?: string[];           // Signs of weak understanding
}

export interface QuestionBank {
    skill: string;
    category: string;              // e.g., "frontend", "backend", "systems"

    questions: {
        experienceProbing: Question[];
        practicalApplication: Question[];
        problemSolving: Question[];
    };

    followUps: Record<string, Question[]>;

    expectedResponses: {
        junior: ResponsePattern;
        midLevel: ResponsePattern;
        senior: ResponsePattern;
    };
}

export interface ResponsePattern {
    keyElements: string[];
    vocabularyExpected: string[];
    depthIndicators: string[];
    commonMistakes: string[];
}

// ============================================================================
// CONVERSATIONAL SCORING
// ============================================================================

export interface ConversationalScore {
    dialogueFlow: number;          // 1-10: Natural conversation?
    responseBuilding: number;      // 1-10: Builds on prior answers?
    acknowledgment: number;        // 1-10: Acknowledges questions?
    clarity: number;               // 1-10: Clear communication?
    engagement: number;            // 1-10: Active engagement?

    overallConversational: number; // Weighted average

    issues: {
        fillerWords: FillerWordIssue[];
        roboticPatterns: string[];
        disconnectedAnswers: string[];
        overlyBriefResponses: string[];
    };

    improvements: string[];

    comparison: {
        vsAIBenchmark: number;       // Paper shows AI interviews score 7.8/10
        vsHumanBenchmark: number;    // Paper shows human interviews score 5.4/10
    };
}

export interface FillerWordIssue {
    word: string;
    count: number;
    positions: number[];           // Word positions in response
}

// ============================================================================
// GAP ANALYSIS
// ============================================================================

export interface ScoreGapAnalysis {
    resumeScore: {
        estimated: number;           // 0-100
        breakdown: {
            keywordDensity: number;
            credentialWeight: number;
            experienceBreadth: number;
            recencyBonus: number;
        };
    };

    predictedAIScore: {
        overall: number;             // 0-9 (sum of skill ratings, max 3 skills * 3 pts)
        perSkill: Record<string, {
            rating: SkillLevel;
            score: number;
            confidence: number;
        }>;
        conversationalQuality: number;
        softSkillsRating: SkillLevel;
    };

    rankDelta: {
        resumePercentile: number;
        aiPercentile: number;
        direction: 'benefits-from-ai' | 'harmed-by-ai' | 'neutral';
        magnitude: number;
    };

    strategy: {
        focusAreas: PrioritizedArea[];
        strengthsToLeverage: string[];
        preparationPriority: string[];
    };
}

export interface PrioritizedArea {
    area: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    currentScore: number;
    targetScore: number;
    actionItems: string[];
}

// ============================================================================
// INTERVIEW SIMULATION
// ============================================================================

export interface SimulationSession {
    id: string;
    createdAt: Date;
    targetRole: string;
    targetCompany: string;
    skillsFocused: string[];

    status: 'in-progress' | 'completed' | 'abandoned';

    phases: SimulationPhase[];
    currentPhaseIndex: number;

    exchanges: InterviewExchange[];

    realTimeMetrics: {
        responseTimes: number[];
        wordCounts: number[];
        fillerWordRate: number;
        technicalTermUsage: number;
        averageConfidence: number;
    };

    finalAssessment?: SimulationAssessment;
}

export interface SimulationPhase {
    name: 'intro' | 'technical' | 'behavioral' | 'problem-solving' | 'closing';
    status: 'pending' | 'in-progress' | 'completed';
    startTime?: Date;
    endTime?: Date;
    questionsAsked: number;
}

export interface InterviewExchange {
    id: string;
    timestamp: Date;
    phaseIndex: number;

    question: {
        id: string;
        text: string;
        type: QuestionType;
        skill?: string;
    };

    response: {
        text: string;
        responseTimeMs: number;
        wordCount: number;
    };

    score: {
        technical: number;           // 1-10
        conversational: number;      // 1-10
        overall: number;
    };

    feedback: string[];
    strengthsShown: string[];
    areasToImprove: string[];
}

export interface SimulationAssessment {
    technicalQuality: number;      // 1-10
    conversationalQuality: number; // 1-10
    overallScore: number;          // 0-100

    predictedPassRate: number;     // 0-100, based on paper's 54% baseline

    skillRatings: Record<string, SkillLevel>;

    strengthsDemonstrated: string[];
    areasToImprove: string[];

    recommendations: string[];

    comparisonToBaselines: {
        vsFirstSession?: number;
        vsAverageCandidate: number;
        vsPaperBenchmark: number;    // Paper's 54% pass rate
    };
}

// ============================================================================
// PREPARATION TRACKING
// ============================================================================

export interface PreparationProgress {
    userId: string;

    skillNarratives: {
        total: number;
        prepared: number;
        coverage: number;            // 0-100%
    };

    simulationSessions: {
        total: number;
        completed: number;
        averageScore: number;
        trend: 'improving' | 'stable' | 'declining';
    };

    conversationalQuality: {
        current: number;
        target: number;              // 7.8 = AI benchmark
        trend: 'improving' | 'stable' | 'declining';
    };

    milestones: {
        allSkillsNarrated: boolean;
        tenSimulationsCompleted: boolean;
        conversationalAboveBenchmark: boolean;
        noSkillGaps: boolean;
    };

    readinessScore: number;        // 0-100, overall preparation level
}

// ============================================================================
// CONSTANTS (from paper)
// ============================================================================

export const PAPER_BENCHMARKS = {
    // Pass rates from paper
    TRADITIONAL_PASS_RATE: 0.34,
    AI_PIPELINE_PASS_RATE: 0.54,

    // Conversational quality benchmarks (1-10 scale)
    AI_INTERVIEW_CONVERSATIONAL: 7.8,
    HUMAN_INTERVIEW_CONVERSATIONAL: 5.41,

    // Technical quality benchmarks (1-10 scale)
    AI_INTERVIEW_TECHNICAL: 8.37,
    HUMAN_INTERVIEW_TECHNICAL: 7.85,

    // Skill misrepresentation rates
    ONE_SKILL_MISREPORT: 0.213,
    TWO_SKILL_MISREPORT: 0.124,
    THREE_SKILL_MISREPORT: 0.075,

    // AI interview completion rate
    AI_INTERVIEW_COMPLETION: 0.24,

    // LinkedIn new job rate
    AI_PIPELINE_NEW_JOB: 0.23,
    TRADITIONAL_NEW_JOB: 0.18,
} as const;

export const DIMENSION_WEIGHTS = {
    // For conversational scoring (from paper's implied weights)
    dialogueFlow: 0.25,
    responseBuilding: 0.30,
    acknowledgment: 0.20,
    clarity: 0.15,
    engagement: 0.10,
} as const;

export const PASS_CRITERIA = {
    // From paper's micro1 pass thresholds
    minSkillLevel: 'mid-level' as SkillLevel,
    minProctoringScore: 70,
    minSoftSkillsLevel: 'mid-level' as SkillLevel,
    minYearsExperience: 2,
} as const;
