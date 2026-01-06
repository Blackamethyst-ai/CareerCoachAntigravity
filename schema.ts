/**
 * Career Board Data Schema
 * 
 * Core data models with Zod validation for runtime type safety.
 */

import { z } from 'zod';

// ============================================================================
// ENUMS
// ============================================================================

export const DirectionClassification = z.enum([
  'appreciating',
  'depreciating', 
  'stable',
  'stable_uncertain',
]);
export type DirectionClassification = z.infer<typeof DirectionClassification>;

export const ScarcitySignalType = z.enum([
  'escalated',      // People escalate to me when high-stakes
  'faster_trusted', // Others can do it, but I'm faster/more trusted
  'only_one',       // I'm the only one who can do it reliably
  'unknown',        // Unknown - with reason
]);
export type ScarcitySignalType = z.infer<typeof ScarcitySignalType>;

export const BoardRoleType = z.enum([
  'accountability',
  'market_reality',
  'avoidance',
  'long_term',
  'devils_advocate',
]);
export type BoardRoleType = z.infer<typeof BoardRoleType>;

export const ReceiptType = z.enum([
  'decision', // Approved plan, documented outcome - STRONG
  'artifact', // Shipped doc, merged PR, sent analysis - STRONG
  'calendar', // Meeting held, time blocked - WEAK alone
  'proxy',    // Feedback received, metric moved - MEDIUM
]);
export type ReceiptType = z.infer<typeof ReceiptType>;

export const ReceiptStrength = z.enum(['strong', 'medium', 'weak']);
export type ReceiptStrength = z.infer<typeof ReceiptStrength>;

export const BetResult = z.enum(['happened', 'didnt', 'partial']);
export type BetResult = z.infer<typeof BetResult>;

export const DriftSeverity = z.enum(['low', 'medium', 'high']);
export type DriftSeverity = z.infer<typeof DriftSeverity>;

// ============================================================================
// CORE SCHEMAS
// ============================================================================

// --- Direction Assessment ---

export const DirectionAssessment = z.object({
  aiCheaper: z.object({
    answer: z.boolean().nullable(),
    quote: z.string(), // User's exact words
  }),
  errorCost: z.object({
    trend: z.enum(['rising', 'falling', 'flat']),
    quote: z.string(),
  }),
  trustRequired: z.object({
    answer: z.boolean(),
    quote: z.string(),
  }),
  classification: DirectionClassification,
  reason: z.string(), // One sentence explaining classification
  uncertaintyEvidence: z.string().optional(), // What would clarify if uncertain
});
export type DirectionAssessment = z.infer<typeof DirectionAssessment>;

// --- Scarcity Signal ---

export const ScarcitySignal = z.object({
  type: ScarcitySignalType,
  detail: z.string().optional(), // Required if type is 'unknown'
});
export type ScarcitySignal = z.infer<typeof ScarcitySignal>;

// --- Problem ---

export const Problem = z.object({
  id: z.string(),
  name: z.string(),
  whatBreaks: z.string(), // What goes wrong if not solved well
  scarcitySignals: z.array(ScarcitySignal).min(2).max(2),
  direction: DirectionAssessment,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Problem = z.infer<typeof Problem>;

// --- Portfolio ---

export const Portfolio = z.object({
  id: z.string(),
  problems: z.array(Problem).min(3).max(5),
  risk: z.string(), // One sentence - where most exposed
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastReviewedAt: z.string().datetime().nullable(),
});
export type Portfolio = z.infer<typeof Portfolio>;

// --- Board Role ---

export const BoardRole = z.object({
  id: z.string(),
  type: BoardRoleType,
  anchoredToProblemId: z.string(), // Must reference a Problem.id
  question: z.string(), // Specific question to ask
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type BoardRole = z.infer<typeof BoardRole>;

// --- Receipt ---

export const Receipt = z.object({
  id: z.string(),
  type: ReceiptType,
  strength: ReceiptStrength,
  description: z.string(),
  evidence: z.string(), // URL, file path, or description
  linkedToProblemId: z.string().nullable(),
  linkedToBetId: z.string().nullable(),
  date: z.string().datetime(),
  createdAt: z.string().datetime(),
  verified: z.boolean().default(false),
  verificationMethod: z.string().optional(), // How it was verified
});
export type Receipt = z.infer<typeof Receipt>;

// --- Bet ---

export const Bet = z.object({
  id: z.string(),
  quarter: z.string(), // "Q1 2025"
  prediction: z.string(),
  wrongIf: z.string(), // Falsification criteria
  result: BetResult.nullable(),
  evidence: z.string().nullable(),
  deadline: z.string().datetime(),
  createdAt: z.string().datetime(),
  resolvedAt: z.string().datetime().nullable(),
});
export type Bet = z.infer<typeof Bet>;

// --- Avoided Decision ---

export const AvoidedDecision = z.object({
  id: z.string(),
  what: z.string(), // Specific conversation, risk, or conflict
  whyAvoiding: z.string(), // The discomfort
  cost: z.string(), // What gets worse
  surfacedAt: z.string().datetime(),
  weeksMentioned: z.number().default(1), // How many times mentioned
  lastMentionedAt: z.string().datetime(),
  resolvedAt: z.string().datetime().nullable(),
  resolution: z.string().nullable(),
});
export type AvoidedDecision = z.infer<typeof AvoidedDecision>;

// --- Comfort Work ---

export const ComfortWork = z.object({
  id: z.string(),
  what: z.string(), // What they did
  avoided: z.string(), // The harder thing they avoided
  quarter: z.string(),
  createdAt: z.string().datetime(),
});
export type ComfortWork = z.infer<typeof ComfortWork>;

// --- Drift Alert ---

export const DriftAlert = z.object({
  id: z.string(),
  problemId: z.string(),
  signal: z.string(), // What indicates drift
  suggestedAction: z.string(),
  severity: DriftSeverity,
  createdAt: z.string().datetime(),
  acknowledgedAt: z.string().datetime().nullable(),
  resolvedAt: z.string().datetime().nullable(),
});
export type DriftAlert = z.infer<typeof DriftAlert>;

// --- Weekly Pulse ---

export const WeeklyPulse = z.object({
  id: z.string(),
  weekOf: z.string().datetime(),
  receiptsReported: z.array(z.string()), // Receipt IDs
  avoidedDecisionStatus: z.string().nullable(),
  betEvidence: z.string().nullable(),
  summary: z.string(),
  flags: z.array(z.string()), // Things requiring attention
  createdAt: z.string().datetime(),
});
export type WeeklyPulse = z.infer<typeof WeeklyPulse>;

// --- Quarterly Report ---

export const QuarterlyReport = z.object({
  id: z.string(),
  quarter: z.string(), // "Q1 2025"
  
  lastBet: z.object({
    bet: z.string(),
    wrongIf: z.string(),
    result: BetResult,
    evidence: z.string(),
  }),
  
  commitmentsVsActuals: z.object({
    said: z.array(z.string()),
    did: z.array(z.string()), // Receipt descriptions
    gap: z.array(z.string()),
  }),
  
  avoidedDecision: z.object({
    what: z.string(),
    whyAvoiding: z.string(),
    cost: z.string(),
  }),
  
  comfortWork: z.object({
    what: z.string(),
    avoided: z.string(),
  }),
  
  portfolioCheck: z.array(z.object({
    problemId: z.string(),
    problemName: z.string(),
    previousDirection: DirectionClassification,
    currentDirection: DirectionClassification,
    shift: z.boolean(),
    notes: z.string(),
  })),
  
  boardRoleResponses: z.array(z.object({
    roleType: BoardRoleType,
    question: z.string(),
    response: z.string(),
  })),
  
  nextBet: z.object({
    prediction: z.string(),
    wrongIf: z.string(),
  }),
  
  createdAt: z.string().datetime(),
});
export type QuarterlyReport = z.infer<typeof QuarterlyReport>;

// --- Session ---

export const Session = z.object({
  id: z.string(),
  type: z.enum(['quick_audit', 'setup', 'quarterly', 'weekly_pulse', 'freeform']),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
    timestamp: z.string().datetime(),
  })),
  toolCalls: z.array(z.object({
    tool: z.string(),
    params: z.record(z.any()),
    result: z.any(),
    timestamp: z.string().datetime(),
  })).optional(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
});
export type Session = z.infer<typeof Session>;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate receipt strength based on type
 */
export function getReceiptStrength(type: ReceiptType): ReceiptStrength {
  switch (type) {
    case 'decision':
    case 'artifact':
      return 'strong';
    case 'proxy':
      return 'medium';
    case 'calendar':
      return 'weak';
  }
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get current quarter string
 */
export function getCurrentQuarter(): string {
  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  return `Q${quarter} ${now.getFullYear()}`;
}

/**
 * Calculate days until bet deadline
 */
export function getDaysUntilDeadline(bet: Bet): number {
  const deadline = new Date(bet.deadline);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if an avoided decision is stalled (2+ weeks, no movement)
 */
export function isStalled(decision: AvoidedDecision): boolean {
  return decision.weeksMentioned >= 2 && !decision.resolvedAt;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export const validators = {
  portfolio: (data: unknown) => Portfolio.safeParse(data),
  problem: (data: unknown) => Problem.safeParse(data),
  boardRole: (data: unknown) => BoardRole.safeParse(data),
  receipt: (data: unknown) => Receipt.safeParse(data),
  bet: (data: unknown) => Bet.safeParse(data),
  avoidedDecision: (data: unknown) => AvoidedDecision.safeParse(data),
  quarterlyReport: (data: unknown) => QuarterlyReport.safeParse(data),
  session: (data: unknown) => Session.safeParse(data),
};

export default {
  // Schemas
  DirectionClassification,
  ScarcitySignalType,
  BoardRoleType,
  ReceiptType,
  ReceiptStrength,
  BetResult,
  DriftSeverity,
  DirectionAssessment,
  ScarcitySignal,
  Problem,
  Portfolio,
  BoardRole,
  Receipt,
  Bet,
  AvoidedDecision,
  ComfortWork,
  DriftAlert,
  WeeklyPulse,
  QuarterlyReport,
  Session,
  // Helpers
  getReceiptStrength,
  generateId,
  getCurrentQuarter,
  getDaysUntilDeadline,
  isStalled,
  validators,
};
