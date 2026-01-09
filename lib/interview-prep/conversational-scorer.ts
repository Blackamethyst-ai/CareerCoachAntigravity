/**
 * Conversational Scorer
 * Evaluates dialogue quality based on Stanford/micro1 research findings
 * 
 * Key insight: AI interviews score 2 SD higher on conversational quality
 * This module helps candidates achieve that benchmark
 */

import {
    ConversationalScore,
    FillerWordIssue,
    DIMENSION_WEIGHTS,
    PAPER_BENCHMARKS,
} from './types';

// ============================================================================
// FILLER WORD DETECTION
// ============================================================================

const FILLER_WORDS = [
    'um', 'uh', 'like', 'basically', 'actually', 'literally', 'honestly',
    'you know', 'i mean', 'kind of', 'sort of', 'right', 'so yeah',
    'obviously', 'clearly', 'essentially', 'practically', 'anyway',
];

const ROBOTIC_PATTERNS = [
    'as i mentioned before',
    'to answer your question',
    'that is a great question',
    'let me tell you about',
    'in conclusion',
    'firstly secondly thirdly',
];

/**
 * Detect filler words in text
 */
function detectFillerWords(text: string): FillerWordIssue[] {
    const issues: FillerWordIssue[] = [];
    const words = text.toLowerCase().split(/\s+/);

    FILLER_WORDS.forEach(filler => {
        const fillerWords = filler.split(' ');
        let count = 0;
        const positions: number[] = [];

        for (let i = 0; i <= words.length - fillerWords.length; i++) {
            const slice = words.slice(i, i + fillerWords.length).join(' ');
            if (slice === filler) {
                count++;
                positions.push(i);
            }
        }

        if (count > 0) {
            issues.push({ word: filler, count, positions });
        }
    });

    return issues;
}

/**
 * Detect robotic/scripted patterns
 */
function detectRoboticPatterns(text: string): string[] {
    const detected: string[] = [];
    const lowerText = text.toLowerCase();

    ROBOTIC_PATTERNS.forEach(pattern => {
        if (lowerText.includes(pattern)) {
            detected.push(pattern);
        }
    });

    return detected;
}

// ============================================================================
// DIALOGUE FLOW ANALYSIS
// ============================================================================

/**
 * Score dialogue flow (natural conversation)
 */
function scoreDialogueFlow(responses: string[]): number {
    if (responses.length === 0) return 5;

    let score = 7; // Start at good baseline

    responses.forEach(response => {
        const words = response.split(/\s+/).length;

        // Penalize very short responses
        if (words < 20) {
            score -= 0.5;
        }

        // Penalize very long responses
        if (words > 300) {
            score -= 0.3;
        }

        // Check for natural transitions
        const hasTransition = /^(so|well|yes|absolutely|definitely|i think|in my experience)/i.test(response);
        if (hasTransition) {
            score += 0.2;
        }

        // Check for robotic patterns
        const roboticCount = detectRoboticPatterns(response).length;
        score -= roboticCount * 0.5;
    });

    return Math.max(1, Math.min(10, score));
}

/**
 * Score response building (builds on prior answers)
 */
function scoreResponseBuilding(responses: string[]): number {
    if (responses.length < 2) return 7;

    let score = 7;

    // Check for references to prior content
    const referencePhrases = [
        'as i mentioned', 'building on that', 'similar to', 'related to that',
        'going back to', 'to add to what i said', 'another example',
    ];

    for (let i = 1; i < responses.length; i++) {
        const response = responses[i].toLowerCase();
        const hasSelfReference = referencePhrases.some(phrase => response.includes(phrase));

        if (hasSelfReference) {
            score += 0.3;
        }

        // Check if response is completely disconnected (no shared keywords with previous)
        const prevWords = new Set(responses[i - 1].toLowerCase().split(/\s+/));
        const currWords = responses[i].toLowerCase().split(/\s+/);
        const sharedWords = currWords.filter(w => prevWords.has(w) && w.length > 4);

        if (sharedWords.length === 0) {
            score -= 0.3; // Disconnected response
        }
    }

    return Math.max(1, Math.min(10, score));
}

/**
 * Score acknowledgment patterns
 */
function scoreAcknowledgment(responses: string[]): number {
    let score = 7;

    const acknowledgmentStarts = [
        'yes', 'absolutely', 'definitely', 'great question', 'sure',
        'that\'s a good point', 'i understand', 'right',
    ];

    responses.forEach(response => {
        const start = response.toLowerCase().slice(0, 50);
        const hasAcknowledgment = acknowledgmentStarts.some(ack => start.includes(ack));

        if (hasAcknowledgment) {
            score += 0.2;
        }

        // Penalize abrupt starts
        if (/^(no|actually|but)/i.test(response)) {
            score -= 0.3;
        }
    });

    return Math.max(1, Math.min(10, score));
}

/**
 * Score clarity of communication
 */
function scoreClarity(responses: string[]): number {
    let score = 7;

    responses.forEach(response => {
        // Check for clear structure markers
        const hasStructure = /first|second|then|finally|in summary|next/i.test(response);
        if (hasStructure) {
            score += 0.3;
        }

        // Penalize run-on sentences (very long without periods)
        const sentences = response.split(/[.!?]/);
        const avgSentenceLength = response.split(/\s+/).length / Math.max(1, sentences.length);
        if (avgSentenceLength > 40) {
            score -= 0.5;
        }

        // Check for jargon without explanation
        const jargonWithoutContext = /(idk|tbh|fwiw|imo|lol)/i.test(response);
        if (jargonWithoutContext) {
            score -= 0.5;
        }
    });

    return Math.max(1, Math.min(10, score));
}

/**
 * Score engagement level
 */
function scoreEngagement(responses: string[]): number {
    let score = 7;

    responses.forEach(response => {
        // Check for enthusiasm markers
        const hasEnthusiasm = /excited|passionate|love|enjoy|interesting|fascinating/i.test(response);
        if (hasEnthusiasm) {
            score += 0.2;
        }

        // Check for concrete examples (shows engagement)
        const hasExample = /for example|specifically|in one case|i remember when/i.test(response);
        if (hasExample) {
            score += 0.3;
        }

        // Penalize overly brief or dismissive responses
        if (response.split(/\s+/).length < 15) {
            score -= 0.3;
        }
    });

    return Math.max(1, Math.min(10, score));
}

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================

/**
 * Score conversational quality of interview responses
 */
export function scoreConversation(responses: string[]): ConversationalScore {
    const dialogueFlow = scoreDialogueFlow(responses);
    const responseBuilding = scoreResponseBuilding(responses);
    const acknowledgment = scoreAcknowledgment(responses);
    const clarity = scoreClarity(responses);
    const engagement = scoreEngagement(responses);

    // Calculate weighted overall score
    const overallConversational =
        dialogueFlow * DIMENSION_WEIGHTS.dialogueFlow +
        responseBuilding * DIMENSION_WEIGHTS.responseBuilding +
        acknowledgment * DIMENSION_WEIGHTS.acknowledgment +
        clarity * DIMENSION_WEIGHTS.clarity +
        engagement * DIMENSION_WEIGHTS.engagement;

    // Collect all issues
    const allFillerWords: FillerWordIssue[] = [];
    const allRoboticPatterns: string[] = [];
    const disconnectedAnswers: string[] = [];
    const overlyBriefResponses: string[] = [];

    responses.forEach((response, idx) => {
        // Filler words
        const fillers = detectFillerWords(response);
        allFillerWords.push(...fillers);

        // Robotic patterns
        const robotic = detectRoboticPatterns(response);
        allRoboticPatterns.push(...robotic);

        // Brief responses
        if (response.split(/\s+/).length < 20) {
            overlyBriefResponses.push(`Response ${idx + 1}: Only ${response.split(/\s+/).length} words`);
        }
    });

    // Generate improvements
    const improvements = generateImprovements({
        dialogueFlow,
        responseBuilding,
        acknowledgment,
        clarity,
        engagement,
        fillerCount: allFillerWords.reduce((sum, f) => sum + f.count, 0),
        roboticCount: allRoboticPatterns.length,
    });

    return {
        dialogueFlow,
        responseBuilding,
        acknowledgment,
        clarity,
        engagement,
        overallConversational,
        issues: {
            fillerWords: allFillerWords,
            roboticPatterns: allRoboticPatterns,
            disconnectedAnswers,
            overlyBriefResponses,
        },
        improvements,
        comparison: {
            vsAIBenchmark: overallConversational - PAPER_BENCHMARKS.AI_INTERVIEW_CONVERSATIONAL,
            vsHumanBenchmark: overallConversational - PAPER_BENCHMARKS.HUMAN_INTERVIEW_CONVERSATIONAL,
        },
    };
}

/**
 * Generate improvement recommendations
 */
function generateImprovements(metrics: {
    dialogueFlow: number;
    responseBuilding: number;
    acknowledgment: number;
    clarity: number;
    engagement: number;
    fillerCount: number;
    roboticCount: number;
}): string[] {
    const improvements: string[] = [];

    if (metrics.fillerCount > 5) {
        improvements.push(`Reduce filler words (detected ${metrics.fillerCount}). Try pausing briefly instead of saying "um" or "like".`);
    }

    if (metrics.roboticCount > 0) {
        improvements.push('Your responses contain scripted-sounding phrases. Aim for more natural language.');
    }

    if (metrics.dialogueFlow < 7) {
        improvements.push('Work on conversational flow. Use natural transitions like "In my experience..." or "Building on that..."');
    }

    if (metrics.responseBuilding < 7) {
        improvements.push('Try referencing previous points to build a coherent narrative. Say "As I mentioned earlier..." or "Related to that..."');
    }

    if (metrics.acknowledgment < 7) {
        improvements.push('Acknowledge the question before diving in. A brief "Great question..." or "Yes, absolutely..." helps.');
    }

    if (metrics.clarity < 7) {
        improvements.push('Structure your answers more clearly. Use markers like "First... Second... Finally..."');
    }

    if (metrics.engagement < 7) {
        improvements.push('Show more enthusiasm. Include phrases like "What I found interesting was..." or "I was excited to discover..."');
    }

    // Add benchmark comparison advice
    const targetConversational = PAPER_BENCHMARKS.AI_INTERVIEW_CONVERSATIONAL;
    const currentEstimate =
        metrics.dialogueFlow * DIMENSION_WEIGHTS.dialogueFlow +
        metrics.responseBuilding * DIMENSION_WEIGHTS.responseBuilding +
        metrics.acknowledgment * DIMENSION_WEIGHTS.acknowledgment +
        metrics.clarity * DIMENSION_WEIGHTS.clarity +
        metrics.engagement * DIMENSION_WEIGHTS.engagement;

    if (currentEstimate < targetConversational) {
        improvements.unshift(`Your conversational score (${currentEstimate.toFixed(1)}) is below the AI interview benchmark (${targetConversational}). Focus on the improvements below.`);
    } else {
        improvements.unshift(`Great! Your conversational score (${currentEstimate.toFixed(1)}) meets the AI interview benchmark (${targetConversational}).`);
    }

    return improvements;
}

/**
 * Quick score for a single response
 */
export function scoreQuickResponse(response: string): {
    score: number;
    fillers: number;
    wordCount: number;
    issues: string[];
} {
    const fillers = detectFillerWords(response);
    const fillerCount = fillers.reduce((sum, f) => sum + f.count, 0);
    const robotic = detectRoboticPatterns(response);
    const wordCount = response.split(/\s+/).length;

    const issues: string[] = [];
    let score = 8;

    // Filler penalty
    if (fillerCount > 0) {
        score -= fillerCount * 0.3;
        issues.push(`${fillerCount} filler word(s) detected`);
    }

    // Robotic penalty
    if (robotic.length > 0) {
        score -= robotic.length * 0.5;
        issues.push('Scripted-sounding phrases detected');
    }

    // Length checks
    if (wordCount < 20) {
        score -= 1;
        issues.push('Response too brief - aim for 50-150 words');
    } else if (wordCount > 250) {
        score -= 0.5;
        issues.push('Response quite long - consider being more concise');
    }

    return {
        score: Math.max(1, Math.min(10, score)),
        fillers: fillerCount,
        wordCount,
        issues,
    };
}

/**
 * Calculate filler word rate per 100 words
 */
export function calculateFillerRate(text: string): number {
    const wordCount = text.split(/\s+/).length;
    if (wordCount === 0) return 0;

    const fillers = detectFillerWords(text);
    const fillerCount = fillers.reduce((sum, f) => sum + f.count, 0);

    return (fillerCount / wordCount) * 100;
}
