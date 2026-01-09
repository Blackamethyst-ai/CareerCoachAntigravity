/**
 * Response Embedding Scorer
 * SUPER COMBO: Conversational quality + Semantic similarity to ideal responses
 * 
 * Based on:
 * - Stanford/micro1: Conversational quality is 2 SD more important in AI interviews
 * - LinkedIn STAR: Bi-encoder + triplet loss for semantic matching
 */

// ============================================================================
// IDEAL RESPONSE DATABASE
// Gold standard responses for different question types
// ============================================================================

export interface IdealResponse {
    questionType: string;
    skill: string;
    level: 'junior' | 'mid' | 'senior';
    response: string;
    keyElements: string[];
    vocabularySignals: string[];
    depthIndicators: string[];
    redFlags: string[];
}

export const IDEAL_RESPONSES: IdealResponse[] = [
    // React - Experience Probing
    {
        questionType: 'experience-probing',
        skill: 'react',
        level: 'senior',
        response: `I've been working with React for about 5 years now, starting when hooks were first introduced. My most significant project was architecting the frontend for a real-time analytics dashboard at my current company. We had to handle thousands of data points updating every second while maintaining 60fps rendering.

I led a team of 4 developers and made key architectural decisions around state management - we chose Zustand over Redux after benchmarking because of its simpler mental model and better performance for our use case. We implemented custom hooks for data fetching with automatic retry logic and optimistic updates.

The impact was measurable: we reduced initial load time by 40% through code splitting and lazy loading, and user engagement increased by 25% because the dashboard felt more responsive. I also mentored two junior developers on React best practices and conducted internal workshops on performance optimization.`,
        keyElements: [
            'specific time duration',
            'named project with context',
            'team leadership',
            'architectural decisions with rationale',
            'quantified impact',
            'teaching/mentoring experience',
        ],
        vocabularySignals: [
            'architecting', 'benchmarking', 'state management', 'code splitting',
            'lazy loading', 'optimistic updates', 'custom hooks', 'performance optimization',
        ],
        depthIndicators: [
            'explains WHY decisions were made',
            'mentions alternatives considered',
            'provides metrics',
            'shows progression over time',
        ],
        redFlags: [
            'vague timeframes',
            'no specific projects',
            'can\'t explain decisions',
            'no metrics',
        ],
    },

    // React - Problem Solving
    {
        questionType: 'problem-solving',
        skill: 'react',
        level: 'senior',
        response: `When I encounter excessive re-renders, I follow a systematic debugging approach. First, I'd use React DevTools Profiler to identify which components are re-rendering and how often. The flame graph helps me pinpoint the expensive renders.

Once I identify the culprits, I look at three main areas: dependency arrays in useEffect and useMemo, unnecessary prop drilling causing cascading re-renders, and state updates that could be batched.

For a concrete example, I recently fixed a performance issue where our product list was re-rendering on every keystroke in an unrelated search box. The root cause was a context provider too high in the tree. I solved it by splitting the context - separating the frequently-changing search state from the stable product data. This reduced renders by 80% and made the UI feel instant.

I'd also consider React.memo for pure components, but I'm careful because memoization has its own cost. I prefer fixing the architecture first.`,
        keyElements: [
            'systematic approach',
            'specific tools mentioned',
            'multiple areas to investigate',
            'concrete example',
            'trade-off awareness',
        ],
        vocabularySignals: [
            'React DevTools', 'Profiler', 'flame graph', 'dependency arrays',
            'prop drilling', 'context provider', 'React.memo', 'memoization',
        ],
        depthIndicators: [
            'shows debugging methodology',
            'mentions specific tools',
            'provides real example',
            'discusses trade-offs',
        ],
        redFlags: [
            'just says "use React.memo"',
            'no systematic approach',
            'can\'t provide example',
        ],
    },

    // Salesforce - Practical Application
    {
        questionType: 'practical-application',
        skill: 'salesforce',
        level: 'senior',
        response: `I designed and implemented a complete deal registration workflow for our partner ecosystem using Salesforce. The challenge was that we had 500+ partners submitting deals, but the manual review process was causing a 5-day average approval time, leading to partner frustration.

I built a custom object structure with Deal Registration, Partner Account, and Territory mapping objects linked through lookup relationships. The approval process used a combination of Process Builder for simple routing and Apex triggers for complex territory overlap detection.

The key innovation was implementing a scoring algorithm in Apex that auto-approved deals meeting certain criteria - established partners, clear territory, no conflicts - while flagging edge cases for manual review. I also built a partner portal using Experience Cloud so partners could track their deals in real-time.

Results: approval time dropped from 5 days to 4 hours for clean deals, partner satisfaction scores increased 35%, and we processed 2x more deals with the same ops team size.`,
        keyElements: [
            'clear problem statement',
            'technical implementation details',
            'innovation/creative solution',
            'quantified results',
            'scalability consideration',
        ],
        vocabularySignals: [
            'custom objects', 'lookup relationships', 'Process Builder', 'Apex triggers',
            'Experience Cloud', 'approval process', 'partner portal',
        ],
        depthIndicators: [
            'understands Salesforce architecture',
            'can discuss object relationships',
            'knows automation tools',
            'built for scale',
        ],
        redFlags: [
            'only mentions point-and-click',
            'no custom development',
            'can\'t discuss object model',
        ],
    },

    // Partner Operations - Experience Probing
    {
        questionType: 'experience-probing',
        skill: 'partner operations',
        level: 'senior',
        response: `I've spent the last 4 years building and scaling partner operations programs. At my current company, I inherited a partner ecosystem that was essentially just a spreadsheet and transformed it into a fully automated, data-driven operation supporting $200M in partner-influenced revenue.

My approach starts with the operating model - I established clear tier classifications based on performance metrics, not just revenue. I built the entire deal registration system in Salesforce with custom scoring algorithms, and integrated it with Crossbeam for account mapping and overlap detection.

The operational cadence I implemented includes quarterly business reviews, weekly deal desk meetings, and real-time dashboards for territory managers. I also established partner enablement as a core function - creating certification programs, sales playbooks, and co-marketing frameworks.

Key metrics I moved: deal registration volume increased 150%, partner attach rate went from 23% to 41%, and we maintained 98% data accuracy across 50,000+ partner accounts. I currently manage a team of 4 partner ops specialists.`,
        keyElements: [
            'clear progression narrative',
            'operational frameworks',
            'tool expertise',
            'metrics-driven approach',
            'team management',
        ],
        vocabularySignals: [
            'operating model', 'tier classifications', 'deal registration', 'Crossbeam',
            'QBR', 'deal desk', 'partner attach rate', 'enablement', 'certification',
        ],
        depthIndicators: [
            'understands full partner lifecycle',
            'can discuss metrics and KPIs',
            'knows partner tech stack',
            'has built systems from scratch',
        ],
        redFlags: [
            'only tactical experience',
            'no metrics',
            'unfamiliar with partner tools',
        ],
    },

    // Technical Program Management - Problem Solving
    {
        questionType: 'problem-solving',
        skill: 'technical program management',
        level: 'senior',
        response: `When three teams have conflicting priorities, I first work to understand the root cause - usually it's either resource contention, unclear ownership, or misaligned incentives. My approach is structured:

First, I bring the tech leads together to map dependencies explicitly. We create a dependency matrix showing exactly where the conflicts are. Often, just visualizing this reveals solutions - maybe Team A can reorder their work to unblock Team B without impacting their timeline.

If it's a true resource conflict, I escalate with data. I prepare a one-pager showing the business impact of each team's work, the cost of delay, and proposed resolution options. I never just present a problem - I bring at least two viable solutions with trade-offs clearly articulated.

For example, I recently resolved a conflict where Platform, Product, and Data teams all needed the same senior engineer. The solution was a time-boxing approach - 2 weeks with Platform for critical architecture work, then full-time with Product, with Data team getting async support. I documented this in a shared tracker so everyone knew the commitment.

The key is treating it as a optimization problem, not a political one. Data and transparency usually resolve 80% of conflicts.`,
        keyElements: [
            'structured approach',
            'root cause analysis',
            'visualization technique',
            'escalation with data',
            'concrete example',
            'philosophical approach',
        ],
        vocabularySignals: [
            'dependency matrix', 'resource contention', 'time-boxing', 'trade-offs',
            'escalation', 'one-pager', 'async support', 'optimization',
        ],
        depthIndicators: [
            'systematic methodology',
            'conflict resolution skills',
            'stakeholder management',
            'documentation habits',
        ],
        redFlags: [
            'would just escalate',
            'no framework',
            'can\'t provide example',
        ],
    },
];

// ============================================================================
// SEMANTIC SIMILARITY SCORING
// ============================================================================

/**
 * Calculate word overlap similarity (simple embedding approximation)
 * In production, this would use actual LLM embeddings
 */
function calculateWordOverlap(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().match(/\b\w{3,}\b/g) || []);
    const words2 = new Set(text2.toLowerCase().match(/\b\w{3,}\b/g) || []);

    let overlap = 0;
    words1.forEach(w => {
        if (words2.has(w)) overlap++;
    });

    const union = new Set(Array.from(words1).concat(Array.from(words2))).size;
    return union > 0 ? overlap / union : 0;
}

/**
 * Check for vocabulary signals
 */
function checkVocabularySignals(response: string, signals: string[]): {
    found: string[];
    missing: string[];
    score: number;
} {
    const lowerResponse = response.toLowerCase();
    const found: string[] = [];
    const missing: string[] = [];

    signals.forEach(signal => {
        if (lowerResponse.includes(signal.toLowerCase())) {
            found.push(signal);
        } else {
            missing.push(signal);
        }
    });

    return {
        found,
        missing,
        score: signals.length > 0 ? (found.length / signals.length) * 100 : 0,
    };
}

/**
 * Check for key elements
 */
function checkKeyElements(response: string, elements: string[]): {
    present: string[];
    absent: string[];
    score: number;
} {
    const lowerResponse = response.toLowerCase();
    const present: string[] = [];
    const absent: string[] = [];

    // Element detection patterns
    const elementPatterns: Record<string, RegExp> = {
        'specific time duration': /\d+\s*(year|month|week)s?/i,
        'named project with context': /project|built|created|developed|implemented/i,
        'team leadership': /led|managed|mentored|coordinated|team of \d+/i,
        'architectural decisions with rationale': /because|chose|decided|architecture|design/i,
        'quantified impact': /\d+%|\$[\d,]+|increased|decreased|reduced|improved.*by/i,
        'teaching/mentoring experience': /taught|mentored|trained|workshop|coaching/i,
        'systematic approach': /first|then|finally|approach|methodology|process/i,
        'specific tools mentioned': /devtools|profiler|aws|react|salesforce|jira/i,
        'concrete example': /for example|specifically|instance|case|recently/i,
        'trade-off awareness': /trade-?off|however|although|cost|consideration/i,
        'clear problem statement': /challenge|problem|issue|pain point|needed to/i,
        'technical implementation details': /implemented|built|configured|integrated|api|database/i,
        'innovation/creative solution': /innovative|solution|approach|solved|resolved/i,
        'quantified results': /result|outcome|impact.*\d+|achieved/i,
    };

    elements.forEach(element => {
        const pattern = elementPatterns[element.toLowerCase()];
        if (pattern && pattern.test(lowerResponse)) {
            present.push(element);
        } else if (!pattern && lowerResponse.includes(element.toLowerCase())) {
            present.push(element);
        } else {
            absent.push(element);
        }
    });

    return {
        present,
        absent,
        score: elements.length > 0 ? (present.length / elements.length) * 100 : 0,
    };
}

/**
 * Check for red flags
 */
function checkRedFlags(response: string, redFlags: string[]): {
    detected: string[];
    score: number; // Higher is worse
} {
    const lowerResponse = response.toLowerCase();
    const detected: string[] = [];

    // Red flag detection patterns
    const flagPatterns: Record<string, RegExp> = {
        'vague timeframes': /some time|a while|recently|in the past/i,
        'no specific projects': /^(?!.*(project|built|created|developed|implemented)).*$/i,
        'can\'t explain decisions': /just|simply|obviously|of course/i,
        'no metrics': /^(?!.*\d+).*$/,
        'only mentions point-and-click': /drag.?and.?drop|no.?code|just click/i,
        'would just escalate': /escalate|manager|ask someone/i,
        'no framework': /^(?!.*(first|then|approach|methodology|process)).*$/i,
    };

    redFlags.forEach(flag => {
        const pattern = flagPatterns[flag.toLowerCase()];
        if (pattern && pattern.test(lowerResponse)) {
            detected.push(flag);
        }
    });

    return {
        detected,
        score: redFlags.length > 0 ? (detected.length / redFlags.length) * 100 : 0,
    };
}

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================

export interface ResponseEmbeddingScore {
    overallScore: number;           // 0-100

    semanticSimilarity: {
        score: number;
        closestIdealResponse?: IdealResponse;
    };

    vocabularyAnalysis: {
        score: number;
        found: string[];
        missing: string[];
    };

    keyElementsAnalysis: {
        score: number;
        present: string[];
        absent: string[];
    };

    redFlagAnalysis: {
        score: number;                // Higher = more red flags (bad)
        detected: string[];
    };

    depthScore: number;             // 0-100

    recommendations: string[];

    comparisonToIdeal: {
        yourLength: number;
        idealLength: number;
        yourVocabDensity: number;
        idealVocabDensity: number;
    };
}

/**
 * Score a response against ideal responses for semantic similarity
 */
export function scoreResponseEmbedding(
    response: string,
    skill: string,
    questionType: string
): ResponseEmbeddingScore {
    // Find matching ideal responses
    const matchingIdeals = IDEAL_RESPONSES.filter(ir =>
        ir.skill.toLowerCase() === skill.toLowerCase() &&
        ir.questionType === questionType
    );

    // If no specific match, use any response for that skill
    const idealsToCheck = matchingIdeals.length > 0
        ? matchingIdeals
        : IDEAL_RESPONSES.filter(ir => ir.skill.toLowerCase() === skill.toLowerCase());

    // Use first ideal as primary comparison (in production, would compare to all)
    const ideal = idealsToCheck[0];

    if (!ideal) {
        // No ideal response found - do basic analysis
        return {
            overallScore: 50,
            semanticSimilarity: { score: 0 },
            vocabularyAnalysis: { score: 0, found: [], missing: [] },
            keyElementsAnalysis: { score: 0, present: [], absent: [] },
            redFlagAnalysis: { score: 0, detected: [] },
            depthScore: calculateBasicDepth(response),
            recommendations: ['No ideal response available for comparison'],
            comparisonToIdeal: {
                yourLength: response.length,
                idealLength: 0,
                yourVocabDensity: 0,
                idealVocabDensity: 0,
            },
        };
    }

    // Calculate semantic similarity
    const semanticScore = calculateWordOverlap(response, ideal.response) * 100;

    // Vocabulary analysis
    const vocabAnalysis = checkVocabularySignals(response, ideal.vocabularySignals);

    // Key elements analysis
    const elementsAnalysis = checkKeyElements(response, ideal.keyElements);

    // Red flag analysis
    const redFlagAnalysis = checkRedFlags(response, ideal.redFlags);

    // Depth score
    const depthScore = calculateDepthScore(response, ideal);

    // Overall score (weighted)
    const overallScore =
        semanticScore * 0.2 +
        vocabAnalysis.score * 0.25 +
        elementsAnalysis.score * 0.3 +
        (100 - redFlagAnalysis.score) * 0.1 +
        depthScore * 0.15;

    // Generate recommendations
    const recommendations = generateRecommendations(
        vocabAnalysis,
        elementsAnalysis,
        redFlagAnalysis,
        response,
        ideal
    );

    // Calculate comparison metrics
    const yourWords = response.match(/\b\w{4,}\b/g) || [];
    const idealWords = ideal.response.match(/\b\w{4,}\b/g) || [];
    const yourTechWords = yourWords.filter(w =>
        ideal.vocabularySignals.some(s => w.toLowerCase().includes(s.toLowerCase()))
    );
    const idealTechWords = idealWords.filter(w =>
        ideal.vocabularySignals.some(s => w.toLowerCase().includes(s.toLowerCase()))
    );

    return {
        overallScore,
        semanticSimilarity: {
            score: semanticScore,
            closestIdealResponse: ideal,
        },
        vocabularyAnalysis: {
            score: vocabAnalysis.score,
            found: vocabAnalysis.found,
            missing: vocabAnalysis.missing,
        },
        keyElementsAnalysis: {
            score: elementsAnalysis.score,
            present: elementsAnalysis.present,
            absent: elementsAnalysis.absent,
        },
        redFlagAnalysis: {
            score: redFlagAnalysis.score,
            detected: redFlagAnalysis.detected,
        },
        depthScore,
        recommendations,
        comparisonToIdeal: {
            yourLength: response.length,
            idealLength: ideal.response.length,
            yourVocabDensity: yourWords.length > 0 ? (yourTechWords.length / yourWords.length) * 100 : 0,
            idealVocabDensity: idealWords.length > 0 ? (idealTechWords.length / idealWords.length) * 100 : 0,
        },
    };
}

function calculateBasicDepth(response: string): number {
    const words = response.split(/\s+/).length;
    const hasNumbers = /\d+/.test(response);
    const hasExamples = /example|specifically|instance/i.test(response);
    const hasStructure = /first|then|finally/i.test(response);

    let score = Math.min(40, words / 5); // Up to 40 points for length
    if (hasNumbers) score += 20;
    if (hasExamples) score += 20;
    if (hasStructure) score += 20;

    return Math.min(100, score);
}

function calculateDepthScore(response: string, ideal: IdealResponse): number {
    let score = 0;
    const lowerResponse = response.toLowerCase();

    ideal.depthIndicators.forEach(indicator => {
        const patterns: Record<string, RegExp> = {
            'explains WHY decisions were made': /because|reason|rationale|chose.*because/i,
            'mentions alternatives considered': /alternative|instead of|rather than|compared to/i,
            'provides metrics': /\d+%|\d+ (user|customer|team|project)/i,
            'shows progression over time': /started|evolved|grew|progression|over \d+/i,
            'shows debugging methodology': /debug|investigate|identified|root cause/i,
            'mentions specific tools': /devtools|profiler|postman|datadog|splunk/i,
            'provides real example': /example|specifically|instance|recently|case/i,
            'discusses trade-offs': /trade-?off|however|although|consideration|cost/i,
        };

        const pattern = patterns[indicator.toLowerCase()];
        if (pattern && pattern.test(lowerResponse)) {
            score += 25; // Each indicator is worth 25 points
        }
    });

    return Math.min(100, score);
}

function generateRecommendations(
    vocab: { score: number; found: string[]; missing: string[] },
    elements: { score: number; present: string[]; absent: string[] },
    redFlags: { score: number; detected: string[] },
    response: string,
    ideal: IdealResponse
): string[] {
    const recommendations: string[] = [];

    // Response length
    const wordCount = response.split(/\s+/).length;
    const idealWordCount = ideal.response.split(/\s+/).length;

    if (wordCount < idealWordCount * 0.5) {
        recommendations.push(`Your response is ${wordCount} words. Aim for ${idealWordCount - 50} to ${idealWordCount + 50} words for this type of question.`);
    }

    // Missing vocabulary
    if (vocab.missing.length > 0 && vocab.missing.length <= 5) {
        recommendations.push(`Include these technical terms: ${vocab.missing.slice(0, 3).join(', ')}`);
    }

    // Missing elements
    if (elements.absent.length > 0) {
        const priority = elements.absent.slice(0, 2);
        priority.forEach(element => {
            recommendations.push(`Add: ${element}`);
        });
    }

    // Red flags
    if (redFlags.detected.length > 0) {
        redFlags.detected.forEach(flag => {
            recommendations.push(`Avoid: ${flag}`);
        });
    }

    // Structural suggestions
    if (!/first|then|finally/i.test(response)) {
        recommendations.push('Structure your response with clear progression (First... Then... Finally...)');
    }

    if (!/\d+/.test(response)) {
        recommendations.push('Add quantified metrics or specific numbers to strengthen your answer');
    }

    if (!/example|specifically|instance/i.test(response)) {
        recommendations.push('Include a specific example to demonstrate depth');
    }

    return recommendations.slice(0, 5); // Max 5 recommendations
}

// ============================================================================
// BATCH SCORING
// ============================================================================

/**
 * Score multiple responses and return aggregate analysis
 */
export function scoreResponseSet(
    responses: Array<{ skill: string; questionType: string; response: string }>
): {
    averageScore: number;
    scores: ResponseEmbeddingScore[];
    strengthAreas: string[];
    improvementAreas: string[];
    overallReadiness: 'ready' | 'needs-work' | 'not-ready';
} {
    const scores = responses.map(r =>
        scoreResponseEmbedding(r.response, r.skill, r.questionType)
    );

    const averageScore = scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length;

    // Identify strength areas (score > 70)
    const strengthAreas = scores
        .filter(s => s.overallScore >= 70)
        .filter(s => s.semanticSimilarity.closestIdealResponse)
        .map(s => s.semanticSimilarity.closestIdealResponse!.skill);

    // Identify improvement areas (score < 50)
    const improvementAreas = scores
        .filter(s => s.overallScore < 50)
        .filter(s => s.semanticSimilarity.closestIdealResponse)
        .map(s => s.semanticSimilarity.closestIdealResponse!.skill);

    // Determine overall readiness
    let overallReadiness: 'ready' | 'needs-work' | 'not-ready';
    if (averageScore >= 70 && improvementAreas.length === 0) {
        overallReadiness = 'ready';
    } else if (averageScore >= 50) {
        overallReadiness = 'needs-work';
    } else {
        overallReadiness = 'not-ready';
    }

    return {
        averageScore,
        scores,
        strengthAreas: Array.from(new Set(strengthAreas)),
        improvementAreas: Array.from(new Set(improvementAreas)),
        overallReadiness,
    };
}
