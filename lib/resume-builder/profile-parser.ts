/**
 * Profile Parser
 * Extracts structured data from Master Profile markdown
 */

import { MasterProfile, SummaryArchetype } from './types';

/**
 * Extract skills from profile text
 */
export function extractSkills(text: string): string[] {
    const skills: string[] = [];

    // Common skill patterns
    const skillPatterns = [
        // Technical skills
        /(?:python|javascript|typescript|react|node\.?js|sql|aws|azure|gcp|kubernetes|docker)/gi,
        // AI/ML
        /(?:machine learning|deep learning|nlp|computer vision|pytorch|tensorflow|claude|gemini|gpt|llm)/gi,
        // Tools
        /(?:salesforce|hubspot|jira|confluence|notion|figma|github|gitlab)/gi,
        // Business
        /(?:partner\s+operations|gtm|revenue\s+operations|crm|deal\s+registration)/gi,
    ];

    skillPatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
            matches.forEach(m => {
                const normalized = m.toLowerCase().trim();
                if (!skills.includes(normalized)) {
                    skills.push(normalized);
                }
            });
        }
    });

    // Extract from skills section if present
    const skillsSectionMatch = text.match(/## SKILLS INVENTORY[\s\S]*?(?=##|$)/i);
    if (skillsSectionMatch) {
        const sectionText = skillsSectionMatch[0];
        // Extract bullet points
        const bulletMatches = sectionText.match(/[-•]\s*([^\n]+)/g);
        if (bulletMatches) {
            bulletMatches.forEach(bullet => {
                const skill = bullet.replace(/^[-•]\s*/, '').trim().toLowerCase();
                if (skill.length > 2 && skill.length < 50 && !skills.includes(skill)) {
                    skills.push(skill);
                }
            });
        }
    }

    return skills;
}

/**
 * Extract experience descriptions from profile
 */
export function extractExperience(text: string): string[] {
    const experience: string[] = [];

    // Find experience section
    const expSectionMatch = text.match(/## PROFESSIONAL EXPERIENCE[\s\S]*?(?=## EDUCATION|## CERTIFICATIONS|$)/i);
    if (expSectionMatch) {
        const sectionText = expSectionMatch[0];

        // Extract achievement bullets (lines starting with - that contain metrics)
        const bulletMatches = sectionText.match(/[-•]\s*[^-\n][^\n]+/g);
        if (bulletMatches) {
            bulletMatches.forEach(bullet => {
                const cleaned = bullet.replace(/^[-•]\s*/, '').trim();
                if (cleaned.length > 20) {
                    experience.push(cleaned);
                }
            });
        }
    }

    return experience;
}

/**
 * Extract summary archetypes from profile
 */
export function extractArchetypes(text: string): SummaryArchetype[] {
    const archetypes: SummaryArchetype[] = [];

    // Find summary archetypes section
    const archetypeSection = text.match(/## PROFESSIONAL SUMMARY ARCHETYPES[\s\S]*?(?=## PROFESSIONAL EXPERIENCE|$)/i);
    if (!archetypeSection) return archetypes;

    const sectionText = archetypeSection[0];

    // Match each archetype
    const archetypePatterns = [
        { name: 'Architect-Operator Hybrid', type: 'technical' as const },
        { name: 'Systems Convergence Specialist', type: 'operations' as const },
        { name: 'Frontier AI Builder', type: 'frontier' as const },
        { name: 'Technical Program Manager', type: 'strategy' as const },
    ];

    archetypePatterns.forEach(({ name, type }) => {
        const pattern = new RegExp(`### Archetype [A-D]: ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?>([^<]+)`, 'i');
        const match = sectionText.match(pattern);
        if (match) {
            archetypes.push({
                name,
                type,
                content: match[1].trim(),
            });
        }
    });

    return archetypes;
}

/**
 * Calculate years of experience from profile
 */
export function calculateYearsExperience(text: string): number {
    // Look for date ranges
    const dateRanges = text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[-–]\s*(?:Present|\d{4})/gi);

    if (!dateRanges) return 0;

    let totalMonths = 0;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    dateRanges.forEach(range => {
        const parts = range.split(/[-–]/);
        if (parts.length !== 2) return;

        const startMatch = parts[0].match(/(\w+)\s+(\d{4})/);
        const endMatch = parts[1].match(/(\w+)\s+(\d{4})|Present/i);

        if (!startMatch) return;

        const startYear = parseInt(startMatch[2]);
        const startMonth = getMonthNumber(startMatch[1]);

        let endYear = currentYear;
        let endMonth = currentMonth;

        if (endMatch && !parts[1].toLowerCase().includes('present')) {
            endYear = parseInt(endMatch[2]);
            endMonth = getMonthNumber(endMatch[1]);
        }

        const months = (endYear - startYear) * 12 + (endMonth - startMonth);
        totalMonths += Math.max(0, months);
    });

    return Math.round(totalMonths / 12);
}

function getMonthNumber(monthStr: string): number {
    const months: Record<string, number> = {
        jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
        jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
    };
    return months[monthStr.toLowerCase().slice(0, 3)] || 1;
}

/**
 * Parse a complete Master Profile from markdown
 */
export function parseProfile(text: string, name: string = 'Unknown'): MasterProfile {
    // Try to extract name from profile
    const nameMatch = text.match(/# Master Profile:\s*([^\n]+)/i);
    const extractedName = nameMatch ? nameMatch[1].trim() : name;

    return {
        name: extractedName,
        text,
        skills: extractSkills(text),
        experience: extractExperience(text),
        yearsExperience: calculateYearsExperience(text),
        summaryArchetypes: extractArchetypes(text),
    };
}

/**
 * Extract requirements from job description
 */
export function extractJobRequirements(jobText: string): string[] {
    const requirements: string[] = [];

    // Look for requirements/qualifications sections
    const reqSections = jobText.match(/(?:requirements|qualifications|what you.?ll need|must have|required)[\s\S]*?(?=\n\n|benefits|about us|$)/gi);

    if (reqSections) {
        reqSections.forEach(section => {
            // Extract bullet points
            const bullets = section.match(/[-•*]\s*[^\n]+/g);
            if (bullets) {
                bullets.forEach(bullet => {
                    const cleaned = bullet.replace(/^[-•*]\s*/, '').trim();
                    if (cleaned.length > 10 && cleaned.length < 200) {
                        requirements.push(cleaned);
                    }
                });
            }
        });
    }

    // Also extract numbered items
    const numbered = jobText.match(/\d+\.\s+[^\n]+/g);
    if (numbered) {
        numbered.forEach(item => {
            const cleaned = item.replace(/^\d+\.\s+/, '').trim();
            if (cleaned.length > 10 && cleaned.length < 200 && !requirements.includes(cleaned)) {
                requirements.push(cleaned);
            }
        });
    }

    return requirements;
}

/**
 * Extract years required from job description
 */
export function extractYearsRequired(jobText: string): number | undefined {
    const yearPatterns = [
        /(\d+)\+?\s*years?\s*(?:of\s+)?experience/i,
        /minimum\s+(?:of\s+)?(\d+)\s*years?/i,
        /at\s+least\s+(\d+)\s*years?/i,
    ];

    for (const pattern of yearPatterns) {
        const match = jobText.match(pattern);
        if (match) {
            return parseInt(match[1]);
        }
    }

    return undefined;
}
