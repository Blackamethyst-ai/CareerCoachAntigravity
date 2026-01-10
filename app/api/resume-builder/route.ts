/**
 * Resume Builder API Route
 * Analyzes job descriptions against master profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeMatch, formatReport } from '@/lib/resume-builder/matcher';
import { parseProfile, extractJobRequirements, extractYearsRequired } from '@/lib/resume-builder/profile-parser';
import { JobDescription, Archetype, ChameleonMetrics } from '@/lib/resume-builder/types';
import { SAMPLE_METRICS, CHAMELEON_PROMPTS } from '@/lib/resume-builder/chameleon-data';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { profileText, jobText, jobTitle, company, archetype = 'general' } = body;

        if (!profileText || !jobText) {
            return NextResponse.json(
                { error: 'Profile text and job text are required' },
                { status: 400 }
            );
        }

        // Parse the profile
        const profile = parseProfile(profileText);

        // Build job description object
        const job: JobDescription = {
            title: jobTitle || 'Unknown Position',
            company: company || 'Unknown Company',
            text: jobText,
            requirements: extractJobRequirements(jobText),
            yearsRequired: extractYearsRequired(jobText),
        };

        // Analyze match
        const result = analyzeMatch(profile, job);

        // Chameleon Engine Logic
        let chameleonMetrics: ChameleonMetrics[] = [];

        if (archetype !== 'general') {
            const rules = CHAMELEON_PROMPTS[archetype as keyof typeof CHAMELEON_PROMPTS];

            // Try to use LLM first
            try {
                // Determine which metrics/bullets from the profile are most relevant to "rewrite"
                // For efficiency, we'll pick the top 3 bullet points that contain numbers (proxy for impact metrics)
                // This is a heuristic; in a full app, we might send the whole "Experience" section.
                const metricsToRewrite = profileText
                    .split('\n')
                    .filter((line: string) => line.includes('-') && /\d/.test(line)) // simple bullet with number detection
                    .slice(0, 3);

                if (process.env.ANTHROPIC_API_KEY && metricsToRewrite.length > 0) {
                    const { getStructuredCompletion } = await import('@/lib/anthropic');

                    const systemPrompt = `You are a professional resume rewriter specializing in "The Chameleon" technique.
Your goal is to rewrite resume bullet points to fit a specific cultural archetype: ${archetype.toUpperCase()}.
ARCHETYPE FOCUS: ${rules.focus}
REWRITE RULE: ${rules.rewriteRule}

Return a JSON array of objects with fields: 'original', 'rewritten'.`;

                    const userPrompt = `Rewrite these metrics:\n${metricsToRewrite.join('\n')}`;

                    const response = await getStructuredCompletion<Array<{ original: string, rewritten: string }>>(systemPrompt, userPrompt);

                    if (response && Array.isArray(response)) {
                        chameleonMetrics = response.map(r => ({
                            metric: "Metric Rewriter",
                            original: r.original,
                            rewritten: r.rewritten,
                            archetype: archetype as Archetype
                        }));
                    }
                }
            } catch (err) {
                console.warn("LLM Chameleon generation failed, falling back to samples", err);
            }

            // Fallback to samples if LLM failed or no key
            if (chameleonMetrics.length === 0) {
                SAMPLE_METRICS.forEach(sm => {
                    chameleonMetrics.push({
                        metric: "Metric Rewriter",
                        original: sm.original,
                        rewritten: sm[archetype as keyof typeof sm] || sm.original,
                        archetype: archetype as Archetype
                    });
                });
            }
        }

        // Generate report
        let report = formatReport(result, job.title, job.company);

        // Append Chameleon Insights to Report
        if (chameleonMetrics.length > 0) {
            const rules = CHAMELEON_PROMPTS[archetype as keyof typeof CHAMELEON_PROMPTS];
            report += `\n\n## 🦎 Chameleon Engine: ${archetype.toUpperCase()} Mode\n`;
            report += `**Focus:** ${rules.focus}\n\n`;
            report += `### Narrative Rewrites\n`;
            chameleonMetrics.forEach(m => {
                report += `- **Original:** ${m.original}\n`;
                report += `  **${archetype} Pivot:** "${m.rewritten}"\n\n`;
            });
        }

        return NextResponse.json({
            success: true,
            result,
            report,
            profile: {
                name: profile.name,
                skillsCount: profile.skills.length,
                experienceCount: profile.experience.length,
                yearsExperience: profile.yearsExperience,
            },
            job: {
                title: job.title,
                company: job.company,
                requirementsCount: job.requirements?.length || 0,
                yearsRequired: job.yearsRequired,
            },
            chameleonMetrics,
            archetype
        });
    } catch (error) {
        console.error('Resume builder error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze match', details: String(error) },
            { status: 500 }
        );
    }
}
