/**
 * Skill Depth Evaluator
 * Assesses whether claimed skills can withstand AI interview probing
 */

import {
    SkillLevel,
    SkillNarrative,
    SkillDepthAssessment,
    STARExample,
    ProjectEvidence,
    SKILL_LEVEL_SCORES,
} from './types';

// ============================================================================
// SKILL EXTRACTION FROM PROFILE TEXT
// ============================================================================

/**
 * Extract skills mentioned in a profile with their context
 */
export function extractSkillsWithContext(profileText: string): Map<string, string[]> {
    const skillContextMap = new Map<string, string[]>();

    // Common technical skills to look for
    const technicalSkills = [
        'react', 'javascript', 'typescript', 'python', 'node.js', 'nodejs',
        'aws', 'azure', 'gcp', 'kubernetes', 'docker',
        'salesforce', 'crm', 'hubspot', 'crossbeam',
        'sql', 'postgresql', 'mongodb', 'redis',
        'graphql', 'rest', 'api',
        'machine learning', 'ai', 'llm', 'claude', 'gpt', 'gemini',
        'partner operations', 'gtm', 'revenue operations',
        'program management', 'technical program management',
    ];

    const lines = profileText.split('\n');

    technicalSkills.forEach(skill => {
        const regex = new RegExp(`\\b${skill}\\b`, 'gi');
        const contexts: string[] = [];

        lines.forEach(line => {
            if (regex.test(line)) {
                contexts.push(line.trim());
            }
        });

        if (contexts.length > 0) {
            skillContextMap.set(skill.toLowerCase(), contexts);
        }
    });

    return skillContextMap;
}

/**
 * Extract STAR examples from profile text
 */
export function extractSTARExamples(profileText: string): STARExample[] {
    const examples: STARExample[] = [];

    // Look for achievement patterns with metrics
    const achievementPatterns = [
        /(?:achieved|delivered|reduced|increased|improved|led|managed|built|created|implemented)\s+[^.]+\d+[%$KMB]?[^.]+/gi,
        /\$[\d,]+[KMB]?\s+(?:in|of)\s+[^.]+/gi,
        /\d+%\s+(?:improvement|increase|decrease|reduction)[^.]+/gi,
    ];

    achievementPatterns.forEach(pattern => {
        const matches = profileText.match(pattern) || [];
        matches.forEach(match => {
            // Attempt to structure as STAR
            examples.push({
                situation: 'Extracted from profile',
                task: 'Achievement context',
                action: match.trim(),
                result: match.trim(),
                skillDemonstrated: 'general',
            });
        });
    });

    return examples;
}

/**
 * Extract project evidence from profile text
 */
export function extractProjectEvidence(profileText: string): ProjectEvidence[] {
    const projects: ProjectEvidence[] = [];

    // Look for project-like patterns
    const projectPatterns = [
        /(?:Structura|Agentic Partner Weaver|CRM Connector|Rocket Mortgage)[^.]+/gi,
        /\*\*([^*]+)\*\*[^.]+project[^.]+/gi,
    ];

    projectPatterns.forEach(pattern => {
        const matches = profileText.match(pattern) || [];
        matches.forEach(match => {
            projects.push({
                name: match.slice(0, 50).trim(),
                description: match.trim(),
                role: 'Lead/Owner',
                duration: 'Ongoing',
                outcome: 'Extracted from profile',
            });
        });
    });

    return projects;
}

// ============================================================================
// SKILL DEPTH SCORING
// ============================================================================

/**
 * Calculate depth score for a skill based on evidence
 */
export function calculateSkillDepthScore(
    skill: string,
    contexts: string[],
    profileText: string
): SkillDepthAssessment {
    const scores = {
        projectCount: 0,
        specificityScore: 0,
        recencyScore: 0,
        teachingEvidence: false,
        architecturalDecisions: false,
        quantifiedImpact: false,
    };

    // Count project mentions
    const projectKeywords = ['project', 'built', 'created', 'implemented', 'led', 'architected'];
    contexts.forEach(ctx => {
        if (projectKeywords.some(kw => ctx.toLowerCase().includes(kw))) {
            scores.projectCount++;
        }
    });

    // Check for specificity (numbers, percentages, concrete details)
    const hasMetrics = contexts.some(ctx => /\d+[%$KMB]?/.test(ctx));
    const hasSpecificTools = contexts.some(ctx =>
        /(deployed|integrated|configured|optimized)/i.test(ctx)
    );
    scores.specificityScore = (hasMetrics ? 5 : 0) + (hasSpecificTools ? 5 : 0);

    // Check for recency (mentions of recent years)
    const recentYears = ['2024', '2025', '2023', 'present', 'current'];
    scores.recencyScore = contexts.some(ctx =>
        recentYears.some(y => ctx.toLowerCase().includes(y))
    ) ? 10 : 5;

    // Check for teaching evidence
    const teachingKeywords = ['taught', 'mentored', 'trained', 'facilitated', 'workshop'];
    scores.teachingEvidence = contexts.some(ctx =>
        teachingKeywords.some(kw => ctx.toLowerCase().includes(kw))
    );

    // Check for architectural decisions
    const archKeywords = ['architected', 'designed', 'led', 'system', 'framework', 'architecture'];
    scores.architecturalDecisions = contexts.some(ctx =>
        archKeywords.some(kw => ctx.toLowerCase().includes(kw))
    );

    // Check for quantified impact
    scores.quantifiedImpact = hasMetrics;

    // Calculate overall evidence strength
    const evidenceStrength = Math.min(100,
        scores.projectCount * 15 +
        scores.specificityScore * 3 +
        scores.recencyScore * 2 +
        (scores.teachingEvidence ? 15 : 0) +
        (scores.architecturalDecisions ? 15 : 0) +
        (scores.quantifiedImpact ? 10 : 0)
    );

    // Predict AI rating
    const predictedRating = predictAIRating(evidenceStrength, scores);

    // Generate gaps and recommendations
    const { gaps, recommendations } = generateGapsAndRecommendations(skill, scores, evidenceStrength);

    return {
        skillName: skill,
        claimedLevel: 'mid-level', // Default claim
        evidenceStrength,
        narrativeDepth: scores,
        predictedAIRating: predictedRating,
        confidence: Math.min(95, 50 + contexts.length * 10),
        gaps,
        recommendations,
    };
}

/**
 * Predict what AI rating this skill would receive
 */
function predictAIRating(
    evidenceStrength: number,
    scores: SkillDepthAssessment['narrativeDepth']
): SkillLevel {
    // Based on paper's rubric:
    // Senior: Deep expertise, teaches others, architectural decisions
    // Mid: Solid experience, independent work
    // Junior: Basic understanding, limited application
    // Not Familiar: Cannot discuss, no practical experience

    if (
        evidenceStrength >= 75 &&
        scores.teachingEvidence &&
        scores.architecturalDecisions &&
        scores.projectCount >= 3
    ) {
        return 'senior';
    }

    if (
        evidenceStrength >= 50 &&
        scores.projectCount >= 2 &&
        scores.specificityScore >= 5
    ) {
        return 'mid-level';
    }

    if (
        evidenceStrength >= 25 &&
        scores.projectCount >= 1
    ) {
        return 'junior';
    }

    return 'not-familiar';
}

/**
 * Generate gaps and recommendations for skill improvement
 */
function generateGapsAndRecommendations(
    skill: string,
    scores: SkillDepthAssessment['narrativeDepth'],
    evidenceStrength: number
): { gaps: string[]; recommendations: string[] } {
    const gaps: string[] = [];
    const recommendations: string[] = [];

    if (scores.projectCount < 2) {
        gaps.push(`Only ${scores.projectCount} project(s) demonstrating ${skill}`);
        recommendations.push(`Prepare 2-3 specific project examples using ${skill}`);
    }

    if (scores.specificityScore < 5) {
        gaps.push('Lack of specific, concrete details');
        recommendations.push('Add metrics, timelines, and specific outcomes to examples');
    }

    if (!scores.teachingEvidence) {
        gaps.push('No evidence of teaching or mentoring with this skill');
        recommendations.push('Prepare an example of explaining/teaching this skill to others');
    }

    if (!scores.architecturalDecisions) {
        gaps.push('No evidence of architectural or design decisions');
        recommendations.push('Prepare an example of a design decision you made and its rationale');
    }

    if (!scores.quantifiedImpact) {
        gaps.push('No quantified impact metrics');
        recommendations.push('Add specific numbers: time saved, revenue impact, team size, etc.');
    }

    if (evidenceStrength < 50) {
        recommendations.unshift(`Priority: Build stronger evidence base for ${skill}`);
    }

    return { gaps, recommendations };
}

// ============================================================================
// FULL PROFILE SKILL ANALYSIS
// ============================================================================

/**
 * Analyze all skills in a profile and return depth assessments
 */
export function analyzeProfileSkillDepth(profileText: string): SkillDepthAssessment[] {
    const skillContexts = extractSkillsWithContext(profileText);
    const assessments: SkillDepthAssessment[] = [];

    skillContexts.forEach((contexts, skill) => {
        const assessment = calculateSkillDepthScore(skill, contexts, profileText);
        assessments.push(assessment);
    });

    // Sort by evidence strength (weakest first = highest priority)
    assessments.sort((a, b) => a.evidenceStrength - b.evidenceStrength);

    return assessments;
}

/**
 * Calculate overall AI Score prediction (0-9 for 3 skills)
 */
export function predictOverallAIScore(
    assessments: SkillDepthAssessment[],
    requiredSkills: string[]
): {
    total: number;
    perSkill: Record<string, { rating: SkillLevel; score: number }>;
    passLikelihood: number;
} {
    const perSkill: Record<string, { rating: SkillLevel; score: number }> = {};
    let total = 0;
    let passableSkills = 0;

    requiredSkills.forEach(skill => {
        const assessment = assessments.find(a =>
            a.skillName.toLowerCase() === skill.toLowerCase()
        );

        if (assessment) {
            const score = SKILL_LEVEL_SCORES[assessment.predictedAIRating];
            perSkill[skill] = {
                rating: assessment.predictedAIRating,
                score,
            };
            total += score;

            if (score >= SKILL_LEVEL_SCORES['mid-level']) {
                passableSkills++;
            }
        } else {
            perSkill[skill] = {
                rating: 'not-familiar',
                score: 0,
            };
        }
    });

    // Pass likelihood based on paper's criteria
    // All skills must be mid-level or higher
    const passLikelihood = (passableSkills / requiredSkills.length) * 100;

    return { total, perSkill, passLikelihood };
}

/**
 * Compare resume score estimate vs AI score prediction
 */
export function calculateScoreGap(
    resumeScore: number,
    aiScore: number,
    maxResumeScore: number = 100,
    maxAIScore: number = 9
): {
    direction: 'benefits-from-ai' | 'harmed-by-ai' | 'neutral';
    magnitude: number;
    resumePercentile: number;
    aiPercentile: number;
} {
    const resumePercentile = (resumeScore / maxResumeScore) * 100;
    const aiPercentile = (aiScore / maxAIScore) * 100;

    const delta = aiPercentile - resumePercentile;

    let direction: 'benefits-from-ai' | 'harmed-by-ai' | 'neutral';
    if (delta > 10) {
        direction = 'benefits-from-ai';
    } else if (delta < -10) {
        direction = 'harmed-by-ai';
    } else {
        direction = 'neutral';
    }

    return {
        direction,
        magnitude: Math.abs(delta),
        resumePercentile,
        aiPercentile,
    };
}
