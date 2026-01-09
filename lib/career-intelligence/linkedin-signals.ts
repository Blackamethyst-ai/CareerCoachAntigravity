/**
 * LinkedIn Signal Analyzer
 * Reverse-engineers LinkedIn's STAR system to optimize profile signals
 * 
 * Based on STAR paper insights:
 * - Edge types: interaction edges + attribute edges
 * - Signal categories: member-job, member-skill, member-company, etc.
 * - GNN aggregation: neighbor sampling (up to 100 neighbors)
 */

// ============================================================================
// LINKEDIN EDGE TYPES (from STAR paper)
// ============================================================================

export type LinkedInEdgeType =
    | 'member-job-apply'           // Strongest signal
    | 'member-job-save'
    | 'member-job-click'
    | 'member-job-dismiss'         // Negative signal
    | 'member-skill'               // Skills claimed
    | 'member-company'             // Current/past companies
    | 'member-title'               // Job titles
    | 'member-position-current'    // Current job
    | 'member-position-past'       // Past jobs
    | 'member-recruiter-positive'  // InMail replies
    | 'member-course-complete'     // LinkedIn Learning
    | 'member-connection';         // Network connections

export interface SignalEdge {
    type: LinkedInEdgeType;
    weight: number;               // 0-1, importance in STAR model
    description: string;
    howToOptimize: string;
    detected: boolean;
    count?: number;
}

export interface ProfileSignalAnalysis {
    overallScore: number;         // 0-100
    edgeCoverage: Record<LinkedInEdgeType, SignalEdge>;
    criticalGaps: string[];
    optimizations: ProfileOptimization[];
    estimatedGNNReach: number;    // How many jobs you're connected to
}

export interface ProfileOptimization {
    area: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    action: string;
    impact: string;
    effort: 'easy' | 'medium' | 'hard';
}

// ============================================================================
// EDGE WEIGHTS (inferred from STAR paper)
// ============================================================================

const EDGE_WEIGHTS: Record<LinkedInEdgeType, number> = {
    'member-job-apply': 1.0,               // Applications are training labels
    'member-recruiter-positive': 0.95,     // InMail replies = key business metric
    'member-job-save': 0.7,
    'member-course-complete': 0.6,
    'member-skill': 0.5,
    'member-position-current': 0.5,
    'member-title': 0.45,
    'member-company': 0.45,
    'member-position-past': 0.4,
    'member-job-click': 0.3,
    'member-connection': 0.2,
    'member-job-dismiss': -0.3,            // Negative signal
};

// ============================================================================
// SIGNAL DETECTION FROM PROFILE TEXT
// ============================================================================

/**
 * Analyze a profile for LinkedIn signal strength
 */
export function analyzeProfileSignals(profileText: string): ProfileSignalAnalysis {
    const lowerText = profileText.toLowerCase();

    const edgeCoverage: Record<LinkedInEdgeType, SignalEdge> = {
        'member-job-apply': {
            type: 'member-job-apply',
            weight: EDGE_WEIGHTS['member-job-apply'],
            description: 'Job applications submitted',
            howToOptimize: 'Apply to relevant jobs that match your profile',
            detected: false, // Can't detect from profile text
            count: 0,
        },
        'member-job-save': {
            type: 'member-job-save',
            weight: EDGE_WEIGHTS['member-job-save'],
            description: 'Jobs saved for later',
            howToOptimize: 'Save jobs you\'re interested in to signal preferences',
            detected: false,
        },
        'member-job-click': {
            type: 'member-job-click',
            weight: EDGE_WEIGHTS['member-job-click'],
            description: 'Jobs viewed/clicked',
            howToOptimize: 'Click on relevant jobs to train the algorithm',
            detected: false,
        },
        'member-job-dismiss': {
            type: 'member-job-dismiss',
            weight: EDGE_WEIGHTS['member-job-dismiss'],
            description: 'Jobs dismissed (negative)',
            howToOptimize: 'Only dismiss truly irrelevant jobs',
            detected: false,
        },
        'member-skill': {
            type: 'member-skill',
            weight: EDGE_WEIGHTS['member-skill'],
            description: 'Skills listed on profile',
            howToOptimize: 'Add all relevant skills with endorsements',
            detected: detectSkills(lowerText),
            count: countSkillMentions(lowerText),
        },
        'member-company': {
            type: 'member-company',
            weight: EDGE_WEIGHTS['member-company'],
            description: 'Companies worked at',
            howToOptimize: 'List all companies, especially recognizable ones',
            detected: detectCompanies(lowerText),
            count: countCompanyMentions(lowerText),
        },
        'member-title': {
            type: 'member-title',
            weight: EDGE_WEIGHTS['member-title'],
            description: 'Job titles held',
            howToOptimize: 'Use standard, searchable job titles',
            detected: detectTitles(lowerText),
            count: countTitleMentions(lowerText),
        },
        'member-position-current': {
            type: 'member-position-current',
            weight: EDGE_WEIGHTS['member-position-current'],
            description: 'Current position details',
            howToOptimize: 'Current role should be detailed and keyword-rich',
            detected: /present|current|now/.test(lowerText),
        },
        'member-position-past': {
            type: 'member-position-past',
            weight: EDGE_WEIGHTS['member-position-past'],
            description: 'Past positions',
            howToOptimize: 'Include 3-5 past roles with clear progression',
            detected: /previously|former|past/.test(lowerText) || /\d{4}\s*-\s*\d{4}/.test(profileText),
        },
        'member-recruiter-positive': {
            type: 'member-recruiter-positive',
            weight: EDGE_WEIGHTS['member-recruiter-positive'],
            description: 'Positive recruiter interactions',
            howToOptimize: 'Reply to InMails, even with polite declines',
            detected: false,
        },
        'member-course-complete': {
            type: 'member-course-complete',
            weight: EDGE_WEIGHTS['member-course-complete'],
            description: 'LinkedIn Learning courses',
            howToOptimize: 'Complete courses that match target job skills',
            detected: /certificate|certified|course|linkedin learning/.test(lowerText),
        },
        'member-connection': {
            type: 'member-connection',
            weight: EDGE_WEIGHTS['member-connection'],
            description: 'Network connections',
            howToOptimize: 'Connect with people at target companies',
            detected: false, // Can't detect from profile text
        },
    };

    // Calculate overall score
    let totalWeight = 0;
    let earnedWeight = 0;

    Object.values(edgeCoverage).forEach(edge => {
        if (edge.weight > 0) {
            totalWeight += edge.weight;
            if (edge.detected) {
                earnedWeight += edge.weight;
            }
        }
    });

    const overallScore = (earnedWeight / totalWeight) * 100;

    // Identify critical gaps
    const criticalGaps: string[] = [];
    if (!edgeCoverage['member-skill'].detected) {
        criticalGaps.push('No skills detected - add skills to profile');
    }
    if (!edgeCoverage['member-position-current'].detected) {
        criticalGaps.push('No current position detected');
    }
    if ((edgeCoverage['member-skill'].count || 0) < 10) {
        criticalGaps.push('Less than 10 skills - LinkedIn GNN needs more data points');
    }

    // Generate optimizations
    const optimizations = generateOptimizations(edgeCoverage, profileText);

    // Estimate GNN reach (very rough estimate)
    const skillCount = edgeCoverage['member-skill'].count || 0;
    const companyCount = edgeCoverage['member-company'].count || 0;
    const estimatedGNNReach = Math.min(1000000, skillCount * 50000 + companyCount * 100000);

    return {
        overallScore,
        edgeCoverage,
        criticalGaps,
        optimizations,
        estimatedGNNReach,
    };
}

// ============================================================================
// DETECTION HELPERS
// ============================================================================

function detectSkills(text: string): boolean {
    const skillIndicators = [
        'python', 'javascript', 'react', 'aws', 'azure', 'sql',
        'salesforce', 'leadership', 'management', 'analytics',
        'machine learning', 'data science', 'product', 'marketing',
        'skills:', 'proficient in', 'expertise in', 'experienced with',
    ];
    return skillIndicators.some(s => text.includes(s));
}

function countSkillMentions(text: string): number {
    const skillKeywords = [
        'python', 'javascript', 'typescript', 'react', 'angular', 'vue',
        'node', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php',
        'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'terraform',
        'sql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
        'salesforce', 'hubspot', 'jira', 'confluence', 'notion',
        'machine learning', 'deep learning', 'nlp', 'llm', 'ai',
        'leadership', 'management', 'strategy', 'analytics', 'product',
        'partner', 'revenue', 'operations', 'marketing', 'sales',
    ];

    let count = 0;
    skillKeywords.forEach(skill => {
        if (text.includes(skill)) count++;
    });
    return count;
}

function detectCompanies(text: string): boolean {
    // Look for company patterns
    const companyPatterns = [
        /at\s+[A-Z][a-zA-Z]+/,
        /worked\s+(at|for)\s+/,
        /company.*:/i,
        /\|\s*[A-Z]/,
    ];
    return companyPatterns.some(p => p.test(text));
}

function countCompanyMentions(text: string): number {
    // Count lines that look like company names (rough estimate)
    const lines = text.split('\n');
    let count = 0;
    lines.forEach(line => {
        if (/[A-Z][a-z]+\s*(Inc|LLC|Corp|Company|Technologies|Labs|AI)/.test(line)) {
            count++;
        }
        if (/\|\s*[A-Z]/.test(line)) {
            count++;
        }
    });
    return Math.min(10, count); // Cap at 10
}

function detectTitles(text: string): boolean {
    const titlePatterns = [
        'director', 'manager', 'engineer', 'analyst', 'specialist',
        'coordinator', 'lead', 'senior', 'principal', 'staff',
        'vp', 'vice president', 'chief', 'head of', 'founder',
    ];
    return titlePatterns.some(t => text.includes(t));
}

function countTitleMentions(text: string): number {
    const titlePatterns = [
        'director', 'manager', 'engineer', 'analyst', 'specialist',
        'coordinator', 'lead', 'senior', 'principal', 'staff',
    ];
    let count = 0;
    titlePatterns.forEach(title => {
        const matches = text.match(new RegExp(title, 'gi'));
        if (matches) count += matches.length;
    });
    return Math.min(5, count); // Cap at 5
}

// ============================================================================
// OPTIMIZATION GENERATION
// ============================================================================

function generateOptimizations(
    edges: Record<LinkedInEdgeType, SignalEdge>,
    profileText: string
): ProfileOptimization[] {
    const optimizations: ProfileOptimization[] = [];

    // Skill optimization
    const skillCount = edges['member-skill'].count || 0;
    if (skillCount < 25) {
        optimizations.push({
            area: 'Skills',
            priority: skillCount < 10 ? 'critical' : 'high',
            action: `Add ${25 - skillCount} more skills to reach optimal coverage`,
            impact: 'LinkedIn GNN samples up to 100 neighbors - more skills = more connections',
            effort: 'easy',
        });
    }

    // Endorsements (implied, can't detect)
    optimizations.push({
        area: 'Skill Endorsements',
        priority: 'medium',
        action: 'Get endorsements for top 5 skills from connections',
        impact: 'Endorsements strengthen skill edges in the graph',
        effort: 'medium',
    });

    // LinkedIn Learning
    if (!edges['member-course-complete'].detected) {
        optimizations.push({
            area: 'LinkedIn Learning',
            priority: 'medium',
            action: 'Complete 3-5 LinkedIn Learning courses in target areas',
            impact: 'Creates member-course edges that connect to job requirements',
            effort: 'medium',
        });
    }

    // Position details
    const wordCount = profileText.split(/\s+/).length;
    if (wordCount < 500) {
        optimizations.push({
            area: 'Profile Depth',
            priority: 'high',
            action: 'Expand profile to 1500+ words for better LLM embedding',
            impact: 'STAR uses E5-Mistral with 1800 token context - use it all',
            effort: 'medium',
        });
    }

    // InMail responsiveness
    optimizations.push({
        area: 'Recruiter Engagement',
        priority: 'high',
        action: 'Reply to ALL InMails (even declines create positive edges)',
        impact: '+2.7% InMail reply rate = key STAR business metric',
        effort: 'easy',
    });

    // Network connections
    optimizations.push({
        area: 'Strategic Connections',
        priority: 'medium',
        action: 'Connect with 10+ people at each target company',
        impact: 'GNN propagates signals through connection edges',
        effort: 'medium',
    });

    // Job application strategy
    optimizations.push({
        area: 'Application Strategy',
        priority: 'high',
        action: 'Apply to jobs matching your profile (even if not perfect)',
        impact: 'Applications are the #1 training signal in STAR (1.0 weight)',
        effort: 'easy',
    });

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    optimizations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return optimizations;
}

// ============================================================================
// LINKEDIN SCORE ESTIMATION
// ============================================================================

/**
 * Estimate how LinkedIn's STAR model would score your profile for a job
 * This is a rough approximation based on paper insights
 */
export function estimateLinkedInMatchScore(
    profileText: string,
    jobDescription: string
): {
    estimatedScore: number;
    breakdown: {
        textualSimilarity: number;
        skillCoverage: number;
        seniorityMatch: number;
        signalStrength: number;
    };
    recommendations: string[];
} {
    const profileLower = profileText.toLowerCase();
    const jobLower = jobDescription.toLowerCase();

    // Textual similarity (LLM embedding approximation)
    const profileWords = new Set(profileLower.match(/\b\w+\b/g) || []);
    const jobWords = jobLower.match(/\b\w+\b/g) || [];
    const overlap = jobWords.filter(w => profileWords.has(w)).length;
    const textualSimilarity = Math.min(100, (overlap / jobWords.length) * 150);

    // Skill coverage
    const profileSignals = analyzeProfileSignals(profileText);
    const skillCoverage = Math.min(100, (profileSignals.edgeCoverage['member-skill'].count || 0) * 4);

    // Seniority match (rough)
    const seniorityKeywords = ['senior', 'lead', 'principal', 'director', 'manager'];
    const profileSeniority = seniorityKeywords.filter(k => profileLower.includes(k)).length;
    const jobSeniority = seniorityKeywords.filter(k => jobLower.includes(k)).length;
    const seniorityMatch = profileSeniority >= jobSeniority ? 100 : (profileSeniority / Math.max(1, jobSeniority)) * 100;

    // Signal strength
    const signalStrength = profileSignals.overallScore;

    // Weighted combination (approximating STAR's approach)
    const estimatedScore =
        textualSimilarity * 0.4 +
        skillCoverage * 0.3 +
        seniorityMatch * 0.15 +
        signalStrength * 0.15;

    // Generate recommendations
    const recommendations: string[] = [];
    if (textualSimilarity < 50) {
        recommendations.push('Add more keywords from the job description to your profile');
    }
    if (skillCoverage < 60) {
        recommendations.push('Add skills mentioned in the job posting to your profile');
    }
    if (seniorityMatch < 80) {
        recommendations.push('Job requires higher seniority signals than your profile shows');
    }
    if (signalStrength < 50) {
        recommendations.push('Increase profile engagement signals (applications, course completions)');
    }

    return {
        estimatedScore,
        breakdown: {
            textualSimilarity,
            skillCoverage,
            seniorityMatch,
            signalStrength,
        },
        recommendations,
    };
}
