# AI Interview Preparation System - Implementation Architecture

## Overview

This document outlines the technical architecture for integrating AI Interview Preparation 
capabilities into CareerCoachAntigravity, based on reverse-engineering insights from the 
Stanford/micro1 research paper "Better Together: Quantifying the Benefits of AI-Assisted Recruitment".

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CareerCoachAntigravity                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │   Career Board   │  │  Resume Builder  │  │ Interview Prep   │ ← NEW    │
│  │   (existing)     │  │   (existing)     │  │    System        │          │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘          │
│           │                     │                     │                     │
│           └─────────────────────┼─────────────────────┘                     │
│                                 ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Shared Data Layer                                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │   │
│  │  │   Master    │  │   Target    │  │    Skill    │  │  Interview │ │   │
│  │  │   Profile   │  │  Criteria   │  │  Narratives │  │   History  │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
CareerCoachAntigravity/
├── app/
│   ├── interview-prep/                    # NEW: Interview Prep Module
│   │   ├── page.tsx                       # Main interview prep page
│   │   ├── simulator/
│   │   │   └── page.tsx                   # AI interview simulator
│   │   ├── skill-depth/
│   │   │   └── page.tsx                   # Skill depth analyzer
│   │   └── gap-analysis/
│   │       └── page.tsx                   # Resume vs AI score gap
│   │
│   ├── api/
│   │   ├── interview-prep/                # NEW: API routes
│   │   │   ├── simulate/route.ts          # Simulation endpoint
│   │   │   ├── analyze-depth/route.ts     # Skill depth analysis
│   │   │   ├── score-gap/route.ts         # Gap calculation
│   │   │   └── conversational/route.ts    # Conversational scoring
│   │
├── lib/
│   ├── interview-prep/                    # NEW: Core logic
│   │   ├── types.ts                       # Type definitions
│   │   ├── skill-evaluator.ts             # Skill depth evaluation
│   │   ├── question-generator.ts          # Dynamic question generation
│   │   ├── conversational-scorer.ts       # Dialogue quality scoring
│   │   ├── gap-analyzer.ts                # Resume vs AI gap
│   │   └── interview-simulator.ts         # Simulation engine
│   │
├── data/
│   ├── interview-prep/                    # NEW: Reference data
│   │   ├── question-bank.json             # Question templates by skill
│   │   ├── skill-rubric.json              # Evaluation criteria
│   │   └── conversational-patterns.json   # Quality patterns
│
└── CareerResumeBuilder/                   # Existing - will integrate
    ├── dico-angelo-master-profile-v3-final.md
    └── ...
```

---

## 🔧 Core Components

### 1. Skill Depth Evaluator

**Purpose**: Assess whether a claimed skill can withstand AI interview probing

**Input**: Skill name + narrative from Master Profile
**Output**: Predicted AI rating (Not Familiar → Junior → Mid → Senior)

```typescript
interface SkillDepthAssessment {
  skillName: string;
  claimedLevel: SkillLevel;
  evidenceStrength: number;           // 0-100
  narrativeDepth: {
    projectCount: number;             // How many projects mentioned
    specificityScore: number;         // How specific are the examples
    recencyScore: number;             // How recent is the experience
    teachingEvidence: boolean;        // Can they teach others?
    architecturalDecisions: boolean;  // Have they made design decisions?
  };
  predictedAIRating: SkillLevel;
  gaps: string[];                     // What's missing for higher rating
  recommendations: string[];          // How to improve articulation
}
```

### 2. Question Generator

**Purpose**: Generate AI interview-style questions for each skill

**Based on paper's three dimensions**:
1. Experience & Knowledge probing
2. Practical Application questions
3. Problem-Solving scenarios

```typescript
interface QuestionBank {
  skill: string;
  questions: {
    experienceProbing: Question[];     // "Tell me about your experience with X"
    practicalApplication: Question[];   // "How did you apply X in project Y?"
    problemSolving: Question[];         // "How would you solve Z using X?"
    followUps: Record<string, Question[]>; // Context-dependent follow-ups
  };
  expectedResponses: {
    junior: ResponsePattern;
    midLevel: ResponsePattern;
    senior: ResponsePattern;
  };
}
```

### 3. Conversational Scorer

**Purpose**: Evaluate dialogue quality (the 2 SD advantage of AI interviews)

**Scoring dimensions (from paper)**:
- Dialogue flow
- Response building
- Acknowledgment patterns

```typescript
interface ConversationalScore {
  dialogueFlow: number;               // 1-10: Natural conversation?
  responseBuilding: number;           // 1-10: Builds on prior answers?
  acknowledgment: number;             // 1-10: Acknowledges questions?
  overallConversational: number;      // Weighted average
  
  issues: {
    fillerWords: string[];            // "um", "like", "basically"
    roboticPatterns: string[];        // Scripted-sounding phrases
    disconnectedAnswers: string[];    // Answers that don't connect
  };
  
  improvements: string[];             // Specific recommendations
}
```

### 4. Gap Analyzer

**Purpose**: Compare Resume Score positioning vs AI Score positioning

```typescript
interface ScoreGapAnalysis {
  resumeScore: {
    estimated: number;                // 0-100
    keywordDensity: number;
    credentialWeight: number;
    experienceBreadth: number;
  };
  
  predictedAIScore: {
    overall: number;                  // 0-9 (sum of skill ratings)
    perSkill: Record<string, SkillLevel>;
    conversationalQuality: number;
  };
  
  rankDelta: {
    resumePercentile: number;         // Where you'd rank on resume
    aiPercentile: number;             // Where you'd rank on AI score
    direction: 'benefits-from-ai' | 'harmed-by-ai' | 'neutral';
    magnitude: number;                // How big is the gap
  };
  
  strategy: {
    focusAreas: string[];             // What to improve
    strengthsToLeverage: string[];    // What's already strong
    preparationPriority: string[];    // Ordered list
  };
}
```

### 5. Interview Simulator

**Purpose**: Full AI interview simulation with real-time feedback

```typescript
interface SimulationSession {
  id: string;
  targetRole: string;
  skills: string[];
  
  phases: {
    current: 'intro' | 'technical' | 'behavioral' | 'closing';
    questions: Question[];
    responses: Response[];
    scores: PhaseScore[];
  };
  
  realTimeMetrics: {
    responseTime: number[];           // Per question
    wordCount: number[];              // Answer length
    fillerWordRate: number;           // Per 100 words
    technicalTermUsage: number;       // Relevant terms used
  };
  
  finalAssessment: {
    technicalQuality: number;
    conversationalQuality: number;
    skillRatings: Record<string, SkillLevel>;
    passLikelihood: number;           // Predicted pass rate
    recommendations: string[];
  };
}
```

---

## 🎯 Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goal**: Core types, skill depth framework, question bank

**Tasks**:
1. Create `lib/interview-prep/types.ts` with all type definitions
2. Build `skill-evaluator.ts` - parse Master Profile for skill depth signals
3. Create initial `question-bank.json` for common tech skills:
   - React, JavaScript, CSS (from paper)
   - Python, TypeScript, AWS (from Dico's profile)
   - GTM Systems, CRM, Partner Operations
4. Define `skill-rubric.json` with Junior/Mid/Senior criteria per skill

**Deliverables**:
- [ ] Type definitions complete
- [ ] Skill parser functional
- [ ] Question bank with 10+ questions per skill
- [ ] Rubric criteria defined

### Phase 2: Analysis Tools (Week 3-4)

**Goal**: Gap analysis, depth assessment visualizations

**Tasks**:
1. Build `gap-analyzer.ts` - compare resume vs AI positioning
2. Create `/interview-prep/skill-depth` page
3. Create `/interview-prep/gap-analysis` page
4. Integrate with existing Master Profile loading
5. Visualize depth assessment per skill

**Deliverables**:
- [ ] Gap analyzer algorithm working
- [ ] Skill depth UI with drill-down
- [ ] Gap visualization dashboard
- [ ] Preparation priority recommendations

### Phase 3: Simulation Engine (Week 5-6)

**Goal**: Interactive AI interview simulator

**Tasks**:
1. Build `question-generator.ts` - dynamic question selection
2. Create `conversational-scorer.ts` - real-time dialogue quality
3. Build `/interview-prep/simulator` page
4. Integrate with chat infrastructure (reuse existing Chat component)
5. Add post-simulation feedback report

**Deliverables**:
- [ ] Question generation working
- [ ] Conversational scoring functional
- [ ] Simulator UI complete
- [ ] Feedback reports generated

### Phase 4: Integration (Week 7-8)

**Goal**: Full integration with Career Board, tracking, optimization

**Tasks**:
1. Add "Interview Prep" session type to Dashboard
2. Connect preparation tracking to receipts system
3. Create preparation progress metrics
4. Add to problem portfolio (if relevant)
5. LinkedIn outcome tracking integration (future)

**Deliverables**:
- [ ] Dashboard integration complete
- [ ] Tracking connected
- [ ] Progress visualization
- [ ] Export/share functionality

---

## 🧪 Key Algorithms

### Resume Score Estimation

Based on paper's description of "keyword-based ML algorithm":

```typescript
function estimateResumeScore(profile: MasterProfile, job: JobDescription): number {
  const keywordMatch = calculateKeywordDensity(profile, job);
  const credentialWeight = scoreCredentials(profile);
  const experienceBreadth = scoreExperienceBreadth(profile, job);
  const recencyBonus = calculateRecencyBonus(profile);
  
  // Weights approximated from paper's observations
  return (
    keywordMatch * 0.40 +
    credentialWeight * 0.25 +
    experienceBreadth * 0.25 +
    recencyBonus * 0.10
  ) * 100;
}
```

### AI Skill Rating Prediction

Based on paper's skill evaluation rubric:

```typescript
function predictSkillRating(
  skill: string, 
  narrative: SkillNarrative
): SkillLevel {
  const scores = {
    projectEvidence: countProjects(narrative) >= 3 ? 3 : countProjects(narrative),
    specificity: scoreSpecificity(narrative),         // 0-3
    recency: scoreRecency(narrative),                  // 0-2
    teachingEvidence: hasTeachingEvidence(narrative) ? 1 : 0,
    architecturalDecisions: hasArchDecisions(narrative) ? 1 : 0,
  };
  
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  
  if (total >= 8) return 'senior';
  if (total >= 5) return 'mid-level';
  if (total >= 2) return 'junior';
  return 'not-familiar';
}
```

### Conversational Quality Score

Based on paper's 3 dimensions:

```typescript
function scoreConversationalQuality(transcript: string[]): ConversationalScore {
  const dialogueFlow = analyzeDialogueFlow(transcript);       // Natural transitions
  const responseBuilding = analyzeResponseBuilding(transcript); // References prior answers
  const acknowledgment = analyzeAcknowledgment(transcript);    // Recognizes questions
  
  // Paper shows AI interviews score 2 SD higher on this
  // Target: mimic high-scoring patterns
  
  return {
    dialogueFlow,
    responseBuilding,
    acknowledgment,
    overall: (dialogueFlow * 0.35 + responseBuilding * 0.40 + acknowledgment * 0.25),
    issues: extractIssues(transcript),
    improvements: generateImprovements(transcript),
  };
}
```

---

## 📊 Data Models

### Skill Narrative (extends Master Profile)

```typescript
interface SkillNarrative {
  skillName: string;
  claimedLevel: 'junior' | 'mid' | 'senior' | 'expert';
  
  evidence: {
    projects: Array<{
      name: string;
      description: string;
      role: string;
      duration: string;
      outcome: string;
    }>;
    
    yearsOfExperience: number;
    
    specificExamples: Array<{
      situation: string;
      task: string;
      action: string;
      result: string;
    }>;
    
    teachingExperience: string[];
    
    architecturalDecisions: Array<{
      context: string;
      decision: string;
      rationale: string;
      outcome: string;
    }>;
  };
  
  articulation: {
    preparedResponse: string;         // Full narrative
    keyPoints: string[];              // Bullet points
    followUpReadiness: Record<string, string>; // Anticipated follow-ups
  };
}
```

### Interview Session (for simulator)

```typescript
interface InterviewSession {
  id: string;
  createdAt: Date;
  targetRole: string;
  targetCompany: string;
  
  skillsFocused: string[];
  
  exchanges: Array<{
    questionId: string;
    question: string;
    questionType: 'experience' | 'application' | 'problem-solving';
    response: string;
    responseTimeMs: number;
    score: {
      technical: number;
      conversational: number;
      overall: number;
    };
    feedback: string[];
  }>;
  
  overallAssessment: {
    technicalQuality: number;
    conversationalQuality: number;
    predictedPassRate: number;
    strengthsDemo: string[];
    areasToImprove: string[];
  };
  
  comparisonToBaseline: {
    vsFirstSession: number;           // Improvement over time
    vsAverageCandidate: number;       // vs paper's benchmarks
  };
}
```

---

## 🔗 Integration Points

### With Existing Resume Builder

```typescript
// In resume-builder/page.tsx, add:
import { predictAIScore } from '@/lib/interview-prep/skill-evaluator';

// After match analysis, show:
const aiPrediction = predictAIScore(profile, job);
const gap = resumeScore - aiPrediction;

// Display gap warning if significant
if (Math.abs(gap) > 15) {
  showGapWarning(gap);
}
```

### With Career Board Sessions

```typescript
// In prompts.ts, add new session type:
export const INTERVIEW_PREP_PROMPT = `
You are conducting an AI interview simulation. Follow these principles:

1. Ask ONE question at a time, wait for response
2. Start with experience probing, then practical application, then problem-solving
3. Build on previous answers - don't ask disconnected questions
4. Probe for depth, not just surface familiarity
5. Score each response on technical accuracy AND conversational quality

Target skills: {{skills}}
Target role: {{role}}

Begin with an introduction, then proceed to technical assessment.
`;
```

### With Master Profile

```typescript
// Extract skill narratives from existing profile
function extractSkillNarratives(profileText: string): SkillNarrative[] {
  // Parse SKILLS INVENTORY section
  // Parse PROFESSIONAL EXPERIENCE for evidence
  // Parse KEY METRICS SUMMARY for quantified impact
  // Return structured narratives per skill
}
```

---

## 📈 Success Metrics

### Preparation Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Skill narratives prepared | 100% of claimed skills | Parsed from Master Profile |
| Simulation sessions | 10+ before real interview | Session count |
| Conversational score | >7/10 average | Scorer output |
| Technical score | >7/10 average | Scorer output |

### Outcome Metrics
| Metric | Baseline (paper) | Target |
|--------|------------------|--------|
| AI interview pass rate | 54% | 70%+ |
| Final interview pass rate | 54% (AI pipeline) | 65%+ |
| Skill depth consistency | 79% (no misrepresent) | 100% |

---

## 🚨 Risk Mitigation

### Over-preparation Risk
**Risk**: Sounding too rehearsed, losing conversational quality
**Mitigation**: 
- Conversational scorer penalizes robotic responses
- Encourage variation in practice
- Focus on understanding, not memorization

### Skill Inflation Prevention
**Risk**: Accidentally claiming skills you can't demonstrate
**Mitigation**:
- Skill depth assessor flags gaps before interviews
- "Honest assessment mode" - conservative skill ratings
- Prepare "learning trajectory" narratives for gaps

### AI Aversion Among Target Companies
**Risk**: Some companies don't use AI interviews
**Mitigation**:
- Skills transfer to human interviews too
- Structured prep helps regardless of interviewer
- Conversational quality matters everywhere

---

*Architecture document created: 2026-01-08*
*Implementation target: 8 weeks*
