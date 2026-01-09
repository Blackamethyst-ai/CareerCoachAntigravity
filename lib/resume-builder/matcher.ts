/**
 * Resume Match Calculator
 * TypeScript port of calculate_match.py
 */

import {
    MatchResult,
    JobDescription,
    MasterProfile,
    DIMENSION_WEIGHTS,
} from './types';

// Common stop words to filter
const STOP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
    'we', 'you', 'your', 'our', 'their', 'this', 'that', 'these', 'those',
    'it', 'its', 'they', 'them', 'he', 'she', 'his', 'her', 'who', 'which',
    'what', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only',
    'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'about',
    'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
    'any', 'etc', 'including', 'ability', 'experience', 'strong', 'excellent',
    'work', 'working', 'team', 'teams', 'role', 'position', 'opportunity'
]);

/**
 * Extract meaningful keywords from text
 */
export function extractKeywords(text: string): Set<string> {
    // Extract words, normalize
    const words = text.toLowerCase().match(/\b[a-zA-Z][a-zA-Z0-9+#.-]*\b/g) || [];

    // Filter stop words and short words
    const keywords = new Set(
        words.filter(w => !STOP_WORDS.has(w) && w.length > 2)
    );

    // Extract multi-word phrases (tool names, concepts)
    const phrases = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g) || [];
    phrases.forEach(p => keywords.add(p.toLowerCase()));

    return keywords;
}

/**
 * Calculate keyword alignment score
 */
export function calculateKeywordMatch(
    profileText: string,
    jobText: string
): { score: number; matched: string[]; missing: string[] } {
    const jobKeywords = extractKeywords(jobText);
    const profileKeywords = extractKeywords(profileText);

    const matched: string[] = [];
    const missing: string[] = [];

    jobKeywords.forEach(keyword => {
        if (profileKeywords.has(keyword)) {
            matched.push(keyword);
        } else {
            missing.push(keyword);
        }
    });

    if (jobKeywords.size === 0) {
        return { score: 0, matched, missing };
    }

    const score = (matched.length / jobKeywords.size) * 100;
    return { score, matched, missing };
}

/**
 * Calculate skills coverage score
 */
export function calculateSkillsMatch(
    profileSkills: string[],
    jobRequirements: string[]
): { score: number; matched: string[]; missing: string[] } {
    const profileSet = new Set(profileSkills.map(s => s.toLowerCase()));
    const requiredSet = new Set(jobRequirements.map(r => r.toLowerCase()));

    const matched: string[] = [];
    const missing: string[] = [];

    requiredSet.forEach(req => {
        // Check for exact match or partial match
        let found = false;
        profileSet.forEach(skill => {
            if (skill.includes(req) || req.includes(skill)) {
                found = true;
            }
        });

        if (found || profileSet.has(req)) {
            matched.push(req);
        } else {
            missing.push(req);
        }
    });

    if (requiredSet.size === 0) {
        return { score: 0, matched, missing };
    }

    const score = (matched.length / requiredSet.size) * 100;
    return { score, matched, missing };
}

/**
 * Classify experience as direct, transferable, or gap
 */
export function classifyExperience(
    profileExperience: string[],
    jobRequirements: string[]
): { direct: string[]; transferable: string[]; gaps: string[] } {
    const direct: string[] = [];
    const transferable: string[] = [];
    const gaps: string[] = [];

    const profileExpText = profileExperience.join(' ').toLowerCase();

    jobRequirements.forEach(req => {
        const reqLower = req.toLowerCase();
        const reqKeywords = reqLower.split(/\s+/).filter(w => w.length > 2);

        if (reqKeywords.length === 0) return;

        // Count how many keywords match
        const matches = reqKeywords.filter(kw => profileExpText.includes(kw)).length;
        const matchRatio = matches / reqKeywords.length;

        if (matchRatio > 0.7) {
            direct.push(req);
        } else if (matchRatio > 0.3) {
            transferable.push(req);
        } else {
            gaps.push(req);
        }
    });

    return { direct, transferable, gaps };
}

/**
 * Calculate composite score from dimension scores
 */
function calculateCompositeScore(result: Partial<MatchResult>): number {
    return (
        (result.keywordScore || 0) * DIMENSION_WEIGHTS.keyword +
        (result.experienceScore || 0) * DIMENSION_WEIGHTS.experience +
        (result.skillsScore || 0) * DIMENSION_WEIGHTS.skills +
        (result.impactScore || 0) * DIMENSION_WEIGHTS.impact +
        (result.recencyScore || 0) * DIMENSION_WEIGHTS.recency +
        (result.cultureScore || 0) * DIMENSION_WEIGHTS.culture
    );
}

/**
 * Determine match tier from score
 */
function determineTier(score: number): MatchResult['matchTier'] {
    if (score >= 75) return 'STRONG_MATCH';
    if (score >= 50) return 'MODERATE_MATCH';
    if (score >= 25) return 'WEAK_MATCH';
    return 'NO_MATCH';
}

/**
 * Generate actionable recommendations based on gaps
 */
function generateRecommendations(result: Partial<MatchResult>): string[] {
    const recs: string[] = [];

    if (result.keywordsMissing && result.keywordsMissing.length > 0) {
        const keywords = result.keywordsMissing.slice(0, 5).join(', ');
        recs.push(`Add keywords to profile: ${keywords}`);
    }

    if (result.skillsMissing && result.skillsMissing.length > 0) {
        const skills = result.skillsMissing.slice(0, 3).join(', ');
        recs.push(`Skills gap - consider: ${skills}`);
    }

    if (result.experienceGaps && result.experienceGaps.length > 0) {
        const gaps = result.experienceGaps.slice(0, 3).join(', ');
        recs.push(`Experience gaps to address: ${gaps}`);
    }

    if (result.overqualified) {
        recs.push('Consider right-sizing experience presentation');
        recs.push('Generate negotiation brief for leverage');
    }

    if (result.underqualified) {
        recs.push('Focus cover letter on transferable skills');
        recs.push('Address gaps proactively');
    }

    if ((result.totalScore || 0) < 50) {
        recs.push('Consider if this role aligns with career goals');
    }

    if ((result.totalScore || 0) >= 75) {
        recs.push('Strong match - prioritize this application');
        recs.push('Tailor resume to emphasize matched keywords');
    }

    return recs;
}

/**
 * Perform comprehensive profile-to-job match analysis
 */
export function analyzeMatch(
    profile: MasterProfile,
    job: JobDescription
): MatchResult {
    const result: Partial<MatchResult> = {};

    // Keyword analysis
    const keywordResult = calculateKeywordMatch(profile.text, job.text);
    result.keywordScore = keywordResult.score;
    result.keywordsMatched = keywordResult.matched;
    result.keywordsMissing = keywordResult.missing;

    // Skills analysis
    if (profile.skills.length > 0 && job.requirements && job.requirements.length > 0) {
        const skillsResult = calculateSkillsMatch(profile.skills, job.requirements);
        result.skillsScore = skillsResult.score;
        result.skillsMatched = skillsResult.matched;
        result.skillsMissing = skillsResult.missing;
    } else {
        result.skillsScore = 50; // Default
        result.skillsMatched = [];
        result.skillsMissing = [];
    }

    // Experience classification
    if (profile.experience.length > 0 && job.requirements && job.requirements.length > 0) {
        const expResult = classifyExperience(profile.experience, job.requirements);
        result.experienceDirect = expResult.direct;
        result.experienceTransferable = expResult.transferable;
        result.experienceGaps = expResult.gaps;

        const totalReqs = job.requirements.length;
        if (totalReqs > 0) {
            const directWeight = expResult.direct.length / totalReqs;
            const transferWeight = (expResult.transferable.length / totalReqs) * 0.6;
            result.experienceScore = (directWeight + transferWeight) * 100;
        }
    } else {
        result.experienceScore = 50;
        result.experienceDirect = [];
        result.experienceTransferable = [];
        result.experienceGaps = [];
    }

    // Impact score (based on presence of numbers/metrics in profile)
    const numbersInProfile = (profile.text.match(/\d+[%$KMB]?/g) || []).length;
    result.impactScore = Math.min(100, numbersInProfile * 5);

    // Recency score (simplified - would need date parsing for full impl)
    result.recencyScore = 70;

    // Culture score (simplified - would need sentiment analysis)
    result.cultureScore = 60;

    // Overqualification check
    if (profile.yearsExperience > 0 && job.yearsRequired && job.yearsRequired > 0) {
        if (profile.yearsExperience > job.yearsRequired * 1.5) {
            result.overqualified = true;
        } else if (profile.yearsExperience < job.yearsRequired * 0.7) {
            result.underqualified = true;
        }
    }
    result.overqualified = result.overqualified || false;
    result.underqualified = result.underqualified || false;

    // Calculate composite
    result.totalScore = calculateCompositeScore(result);
    result.matchTier = determineTier(result.totalScore);

    // Generate recommendations
    result.recommendations = generateRecommendations(result);

    return result as MatchResult;
}

/**
 * Format match result as markdown report
 */
export function formatReport(
    result: MatchResult,
    jobTitle: string = 'Unknown',
    company: string = 'Unknown'
): string {
    const tierEmoji: Record<string, string> = {
        STRONG_MATCH: '✅',
        MODERATE_MATCH: '⚠️',
        WEAK_MATCH: '🟡',
        NO_MATCH: '🚫',
    };

    const report = `# Match Report: ${jobTitle} @ ${company}

## Overall Score: ${result.totalScore.toFixed(1)}% — ${tierEmoji[result.matchTier]} ${result.matchTier.replace('_', ' ')}

### Dimension Breakdown

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Keyword Alignment | ${result.keywordScore.toFixed(1)}% | 25% | ${(result.keywordScore * 0.25).toFixed(1)} |
| Experience Relevance | ${result.experienceScore.toFixed(1)}% | 25% | ${(result.experienceScore * 0.25).toFixed(1)} |
| Skills Coverage | ${result.skillsScore.toFixed(1)}% | 20% | ${(result.skillsScore * 0.20).toFixed(1)} |
| Quantified Impact | ${result.impactScore.toFixed(1)}% | 15% | ${(result.impactScore * 0.15).toFixed(1)} |
| Recency Match | ${result.recencyScore.toFixed(1)}% | 10% | ${(result.recencyScore * 0.10).toFixed(1)} |
| Culture Signals | ${result.cultureScore.toFixed(1)}% | 5% | ${(result.cultureScore * 0.05).toFixed(1)} |

### Experience Classification

**Direct Match (${result.experienceDirect.length}):**
${result.experienceDirect.slice(0, 5).map(exp => `- ${exp}`).join('\n') || '- None identified'}

**Transferable (${result.experienceTransferable.length}):**
${result.experienceTransferable.slice(0, 5).map(exp => `- ${exp}`).join('\n') || '- None identified'}

**Gaps (${result.experienceGaps.length}):**
${result.experienceGaps.slice(0, 5).map(gap => `- ${gap}`).join('\n') || '- None identified'}

### Skills Analysis

**Matched:** ${result.skillsMatched.slice(0, 10).join(', ') || 'None'}

**Missing:** ${result.skillsMissing.slice(0, 10).join(', ') || 'None'}

### Flags

${result.overqualified ? '⚠️ **Overqualified** — Consider negotiation leverage' : ''}
${result.underqualified ? '⚠️ **Underqualified** — Address gaps in cover letter' : ''}

### Recommendations

${result.recommendations.map(rec => `- ${rec}`).join('\n') || '- No specific recommendations'}

---
*Generated: ${new Date().toISOString()}*
`;

    return report;
}
