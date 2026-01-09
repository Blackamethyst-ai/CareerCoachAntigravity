/**
 * Resume Builder API Route
 * Analyzes job descriptions against master profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeMatch, formatReport } from '@/lib/resume-builder/matcher';
import { parseProfile, extractJobRequirements, extractYearsRequired } from '@/lib/resume-builder/profile-parser';
import { JobDescription } from '@/lib/resume-builder/types';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { profileText, jobText, jobTitle, company } = body;

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

        // Generate report
        const report = formatReport(result, job.title, job.company);

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
        });
    } catch (error) {
        console.error('Resume builder error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze match', details: String(error) },
            { status: 500 }
        );
    }
}
