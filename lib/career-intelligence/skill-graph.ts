/**
 * Skill Graph - GNN-Style Skill Relationships
 * Based on LinkedIn STAR paper's approach to skill embedding and graph construction
 * 
 * Key insight: Skills connect to each other through co-occurrence in:
 * - Job descriptions
 * - Member profiles
 * - Learning courses
 * - Career transitions
 */

import { SkillLevel } from '../interview-prep/types';

// ============================================================================
// SKILL GRAPH TYPES
// ============================================================================

export interface SkillNode {
    id: string;
    name: string;
    category: SkillCategory;
    seniority: 'entry' | 'mid' | 'senior' | 'principal';
    demandScore: number;      // 0-100, how in-demand
    growthRate: number;       // -100 to 100, YoY job posting growth
}

export type SkillCategory =
    | 'programming-language'
    | 'framework'
    | 'cloud'
    | 'database'
    | 'ai-ml'
    | 'devops'
    | 'business-operations'
    | 'gtm'
    | 'management'
    | 'soft-skill';

export interface SkillEdge {
    source: string;
    target: string;
    weight: number;           // 0-1, co-occurrence strength
    edgeType: EdgeType;
    transitionCount?: number; // How many people transitioned via this edge
}

export type EdgeType =
    | 'prerequisite'          // A enables learning B
    | 'complement'            // A and B are often used together  
    | 'substitute'            // A can replace B
    | 'evolution'             // A evolved into B
    | 'adjacent';             // General adjacency

export interface SkillPath {
    skills: string[];
    totalWeight: number;
    pathType: 'learning' | 'career' | 'lateral';
    estimatedTime: string;    // e.g., "3-6 months"
}

// ============================================================================
// SKILL GRAPH DATA
// Based on LinkedIn's skill taxonomy and job market data
// ============================================================================

export const SKILL_NODES: Record<string, SkillNode> = {
    // Programming Languages
    javascript: {
        id: 'javascript',
        name: 'JavaScript',
        category: 'programming-language',
        seniority: 'entry',
        demandScore: 95,
        growthRate: 5,
    },
    typescript: {
        id: 'typescript',
        name: 'TypeScript',
        category: 'programming-language',
        seniority: 'mid',
        demandScore: 92,
        growthRate: 25,
    },
    python: {
        id: 'python',
        name: 'Python',
        category: 'programming-language',
        seniority: 'entry',
        demandScore: 98,
        growthRate: 15,
    },
    sql: {
        id: 'sql',
        name: 'SQL',
        category: 'database',
        seniority: 'entry',
        demandScore: 90,
        growthRate: 3,
    },

    // Frameworks
    react: {
        id: 'react',
        name: 'React',
        category: 'framework',
        seniority: 'mid',
        demandScore: 93,
        growthRate: 8,
    },
    nextjs: {
        id: 'nextjs',
        name: 'Next.js',
        category: 'framework',
        seniority: 'mid',
        demandScore: 85,
        growthRate: 40,
    },
    nodejs: {
        id: 'nodejs',
        name: 'Node.js',
        category: 'framework',
        seniority: 'mid',
        demandScore: 88,
        growthRate: 5,
    },

    // Cloud
    aws: {
        id: 'aws',
        name: 'AWS',
        category: 'cloud',
        seniority: 'mid',
        demandScore: 95,
        growthRate: 10,
    },
    azure: {
        id: 'azure',
        name: 'Azure',
        category: 'cloud',
        seniority: 'mid',
        demandScore: 85,
        growthRate: 15,
    },
    gcp: {
        id: 'gcp',
        name: 'GCP',
        category: 'cloud',
        seniority: 'mid',
        demandScore: 75,
        growthRate: 20,
    },

    // AI/ML
    'machine-learning': {
        id: 'machine-learning',
        name: 'Machine Learning',
        category: 'ai-ml',
        seniority: 'senior',
        demandScore: 90,
        growthRate: 35,
    },
    llm: {
        id: 'llm',
        name: 'LLM/GenAI',
        category: 'ai-ml',
        seniority: 'senior',
        demandScore: 98,
        growthRate: 150,
    },
    pytorch: {
        id: 'pytorch',
        name: 'PyTorch',
        category: 'ai-ml',
        seniority: 'senior',
        demandScore: 85,
        growthRate: 30,
    },

    // Business Operations
    salesforce: {
        id: 'salesforce',
        name: 'Salesforce',
        category: 'business-operations',
        seniority: 'mid',
        demandScore: 80,
        growthRate: 5,
    },
    hubspot: {
        id: 'hubspot',
        name: 'HubSpot',
        category: 'business-operations',
        seniority: 'entry',
        demandScore: 70,
        growthRate: 10,
    },

    // GTM
    'partner-operations': {
        id: 'partner-operations',
        name: 'Partner Operations',
        category: 'gtm',
        seniority: 'mid',
        demandScore: 75,
        growthRate: 15,
    },
    'revenue-operations': {
        id: 'revenue-operations',
        name: 'Revenue Operations',
        category: 'gtm',
        seniority: 'mid',
        demandScore: 82,
        growthRate: 25,
    },
    'deal-registration': {
        id: 'deal-registration',
        name: 'Deal Registration',
        category: 'gtm',
        seniority: 'mid',
        demandScore: 65,
        growthRate: 10,
    },

    // Management
    'program-management': {
        id: 'program-management',
        name: 'Program Management',
        category: 'management',
        seniority: 'senior',
        demandScore: 85,
        growthRate: 8,
    },
    'technical-program-management': {
        id: 'technical-program-management',
        name: 'Technical Program Management',
        category: 'management',
        seniority: 'senior',
        demandScore: 88,
        growthRate: 12,
    },
    'product-management': {
        id: 'product-management',
        name: 'Product Management',
        category: 'management',
        seniority: 'senior',
        demandScore: 90,
        growthRate: 10,
    },
};

export const SKILL_EDGES: SkillEdge[] = [
    // JavaScript ecosystem
    { source: 'javascript', target: 'typescript', weight: 0.9, edgeType: 'evolution' },
    { source: 'javascript', target: 'react', weight: 0.85, edgeType: 'prerequisite' },
    { source: 'javascript', target: 'nodejs', weight: 0.8, edgeType: 'prerequisite' },
    { source: 'typescript', target: 'react', weight: 0.9, edgeType: 'complement' },
    { source: 'react', target: 'nextjs', weight: 0.85, edgeType: 'evolution' },
    { source: 'typescript', target: 'nextjs', weight: 0.8, edgeType: 'complement' },

    // Python ecosystem
    { source: 'python', target: 'machine-learning', weight: 0.85, edgeType: 'prerequisite' },
    { source: 'python', target: 'pytorch', weight: 0.8, edgeType: 'prerequisite' },
    { source: 'machine-learning', target: 'llm', weight: 0.7, edgeType: 'evolution' },
    { source: 'pytorch', target: 'llm', weight: 0.75, edgeType: 'complement' },

    // Cloud relationships
    { source: 'aws', target: 'azure', weight: 0.6, edgeType: 'substitute' },
    { source: 'aws', target: 'gcp', weight: 0.6, edgeType: 'substitute' },
    { source: 'azure', target: 'gcp', weight: 0.6, edgeType: 'substitute' },
    { source: 'python', target: 'aws', weight: 0.5, edgeType: 'complement' },

    // Business operations
    { source: 'salesforce', target: 'hubspot', weight: 0.5, edgeType: 'substitute' },
    { source: 'salesforce', target: 'partner-operations', weight: 0.7, edgeType: 'complement' },
    { source: 'salesforce', target: 'revenue-operations', weight: 0.75, edgeType: 'complement' },
    { source: 'partner-operations', target: 'deal-registration', weight: 0.85, edgeType: 'complement' },
    { source: 'revenue-operations', target: 'partner-operations', weight: 0.7, edgeType: 'adjacent' },

    // Management paths
    { source: 'program-management', target: 'technical-program-management', weight: 0.8, edgeType: 'evolution' },
    { source: 'technical-program-management', target: 'product-management', weight: 0.6, edgeType: 'adjacent' },
    { source: 'partner-operations', target: 'program-management', weight: 0.65, edgeType: 'adjacent' },

    // Cross-domain bridges
    { source: 'python', target: 'sql', weight: 0.7, edgeType: 'complement' },
    { source: 'sql', target: 'salesforce', weight: 0.5, edgeType: 'adjacent' },
    { source: 'llm', target: 'product-management', weight: 0.4, edgeType: 'adjacent' },
    { source: 'react', target: 'aws', weight: 0.5, edgeType: 'complement' },
];

// ============================================================================
// GRAPH FUNCTIONS
// ============================================================================

/**
 * Build adjacency list from edges
 */
export function buildAdjacencyList(): Map<string, Array<{ skill: string; weight: number; type: EdgeType }>> {
    const adj = new Map<string, Array<{ skill: string; weight: number; type: EdgeType }>>();

    SKILL_EDGES.forEach(edge => {
        // Add forward edge
        if (!adj.has(edge.source)) adj.set(edge.source, []);
        adj.get(edge.source)!.push({ skill: edge.target, weight: edge.weight, type: edge.edgeType });

        // Add reverse edge (for undirected traversal)
        if (!adj.has(edge.target)) adj.set(edge.target, []);
        adj.get(edge.target)!.push({ skill: edge.source, weight: edge.weight, type: edge.edgeType });
    });

    return adj;
}

/**
 * Find adjacent skills (1-hop neighbors)
 */
export function findAdjacentSkills(
    skill: string,
    minWeight: number = 0.5
): Array<{ skill: string; weight: number; type: EdgeType; node: SkillNode | undefined }> {
    const adj = buildAdjacencyList();
    const neighbors = adj.get(skill.toLowerCase()) || [];

    return neighbors
        .filter(n => n.weight >= minWeight)
        .map(n => ({
            ...n,
            node: SKILL_NODES[n.skill],
        }))
        .sort((a, b) => b.weight - a.weight);
}

/**
 * Find skill path between two skills (BFS)
 */
export function findSkillPath(source: string, target: string, maxDepth: number = 4): SkillPath | null {
    const adj = buildAdjacencyList();
    const visited = new Set<string>();
    const queue: Array<{ skill: string; path: string[]; totalWeight: number }> = [];

    queue.push({ skill: source.toLowerCase(), path: [source.toLowerCase()], totalWeight: 1 });
    visited.add(source.toLowerCase());

    while (queue.length > 0) {
        const current = queue.shift()!;

        if (current.skill === target.toLowerCase()) {
            return {
                skills: current.path,
                totalWeight: current.totalWeight,
                pathType: current.path.length <= 2 ? 'learning' : 'career',
                estimatedTime: estimatePathTime(current.path.length),
            };
        }

        if (current.path.length >= maxDepth) continue;

        const neighbors = adj.get(current.skill) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor.skill)) {
                visited.add(neighbor.skill);
                queue.push({
                    skill: neighbor.skill,
                    path: [...current.path, neighbor.skill],
                    totalWeight: current.totalWeight * neighbor.weight,
                });
            }
        }
    }

    return null;
}

function estimatePathTime(pathLength: number): string {
    if (pathLength <= 2) return '1-3 months';
    if (pathLength <= 3) return '3-6 months';
    if (pathLength <= 4) return '6-12 months';
    return '12+ months';
}

/**
 * Find all skills within N hops (like GNN neighbor sampling)
 */
export function sampleNeighbors(
    skills: string[],
    hops: number = 2,
    maxNeighbors: number = 10
): Map<string, { distance: number; weight: number; path: string[] }> {
    const adj = buildAdjacencyList();
    const result = new Map<string, { distance: number; weight: number; path: string[] }>();

    // Initialize with source skills
    skills.forEach(s => {
        result.set(s.toLowerCase(), { distance: 0, weight: 1, path: [s.toLowerCase()] });
    });

    for (let hop = 1; hop <= hops; hop++) {
        const currentLevel = Array.from(result.entries())
            .filter(([, data]) => data.distance === hop - 1);

        for (const [skill, data] of currentLevel) {
            const neighbors = adj.get(skill) || [];

            for (const neighbor of neighbors.slice(0, maxNeighbors)) {
                if (!result.has(neighbor.skill)) {
                    result.set(neighbor.skill, {
                        distance: hop,
                        weight: data.weight * neighbor.weight,
                        path: [...data.path, neighbor.skill],
                    });
                }
            }
        }
    }

    return result;
}

/**
 * Calculate skill coverage for a job
 */
export function calculateSkillCoverage(
    candidateSkills: string[],
    requiredSkills: string[]
): {
    directMatches: string[];
    adjacentMatches: Array<{ required: string; candidate: string; distance: number }>;
    gaps: string[];
    coverageScore: number;
} {
    const candidateSet = new Set(candidateSkills.map(s => s.toLowerCase()));
    const candidateNeighbors = sampleNeighbors(candidateSkills, 2);

    const directMatches: string[] = [];
    const adjacentMatches: Array<{ required: string; candidate: string; distance: number }> = [];
    const gaps: string[] = [];

    for (const required of requiredSkills) {
        const reqLower = required.toLowerCase();

        if (candidateSet.has(reqLower)) {
            directMatches.push(required);
        } else if (candidateNeighbors.has(reqLower)) {
            const data = candidateNeighbors.get(reqLower)!;
            adjacentMatches.push({
                required,
                candidate: data.path[0],
                distance: data.distance,
            });
        } else {
            gaps.push(required);
        }
    }

    // Score: direct = 1.0, adjacent-1-hop = 0.7, adjacent-2-hop = 0.4
    const totalRequired = requiredSkills.length;
    if (totalRequired === 0) return { directMatches, adjacentMatches, gaps, coverageScore: 0 };

    const score =
        (directMatches.length * 1.0 +
            adjacentMatches.filter(a => a.distance === 1).length * 0.7 +
            adjacentMatches.filter(a => a.distance === 2).length * 0.4) / totalRequired;

    return {
        directMatches,
        adjacentMatches,
        gaps,
        coverageScore: Math.min(1, score) * 100,
    };
}

/**
 * Suggest skills to learn based on current skills and target
 */
export function suggestLearningPath(
    currentSkills: string[],
    targetSkills: string[]
): Array<{
    skill: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    reason: string;
    prerequisites: string[];
    timeEstimate: string;
}> {
    const suggestions: Array<{
        skill: string;
        priority: 'critical' | 'high' | 'medium' | 'low';
        reason: string;
        prerequisites: string[];
        timeEstimate: string;
    }> = [];

    const currentSet = new Set(currentSkills.map(s => s.toLowerCase()));
    const coverage = calculateSkillCoverage(currentSkills, targetSkills);

    // Critical: Direct gaps with high demand
    for (const gap of coverage.gaps) {
        const gapLower = gap.toLowerCase();
        const node = SKILL_NODES[gapLower];
        const path = findSkillPath(currentSkills[0] || '', gapLower);

        const priority = node?.demandScore && node.demandScore >= 85 ? 'critical' : 'high';

        suggestions.push({
            skill: gap,
            priority,
            reason: `Required skill not covered. Demand score: ${node?.demandScore || 'N/A'}`,
            prerequisites: path?.skills.slice(0, -1).filter(s => !currentSet.has(s)) || [],
            timeEstimate: path?.estimatedTime || '3-6 months',
        });
    }

    // Medium: Adjacent skills could become direct
    for (const adj of coverage.adjacentMatches) {
        if (adj.distance === 2) {
            const pathToSkill = findSkillPath(adj.candidate, adj.required);
            const middleSkill = pathToSkill?.skills[1];

            if (middleSkill && !currentSet.has(middleSkill)) {
                suggestions.push({
                    skill: middleSkill,
                    priority: 'medium',
                    reason: `Bridge skill: connects ${adj.candidate} to ${adj.required}`,
                    prerequisites: [],
                    timeEstimate: '1-3 months',
                });
            }
        }
    }

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // Deduplicate
    const seen = new Set<string>();
    return suggestions.filter(s => {
        if (seen.has(s.skill.toLowerCase())) return false;
        seen.add(s.skill.toLowerCase());
        return true;
    });
}

/**
 * Get skill categories for a list of skills
 */
export function analyzeSkillPortfolio(skills: string[]): {
    categories: Record<SkillCategory, string[]>;
    dominantCategory: SkillCategory;
    categoryBalance: number;
    suggestions: string[];
} {
    const categories: Record<SkillCategory, string[]> = {
        'programming-language': [],
        'framework': [],
        'cloud': [],
        'database': [],
        'ai-ml': [],
        'devops': [],
        'business-operations': [],
        'gtm': [],
        'management': [],
        'soft-skill': [],
    };

    skills.forEach(skill => {
        const node = SKILL_NODES[skill.toLowerCase()];
        if (node) {
            categories[node.category].push(skill);
        }
    });

    // Find dominant category
    const entries = Object.entries(categories) as [SkillCategory, string[]][];
    entries.sort((a, b) => b[1].length - a[1].length);
    const dominantCategory = entries[0][0];

    // Calculate balance (entropy-like measure)
    const total = skills.length || 1;
    const nonEmpty = entries.filter(e => e[1].length > 0).length;
    const categoryBalance = (nonEmpty / 10) * 100;

    // Generate suggestions
    const suggestions: string[] = [];
    if (categoryBalance < 30) {
        suggestions.push('Your skill portfolio is narrowly focused. Consider branching into adjacent categories.');
    }
    if (!categories['ai-ml'].length) {
        suggestions.push('Consider adding AI/ML skills - highest growth area.');
    }
    if (!categories['cloud'].length) {
        suggestions.push('Cloud skills (AWS/Azure/GCP) are expected for most technical roles.');
    }

    return { categories, dominantCategory, categoryBalance, suggestions };
}
