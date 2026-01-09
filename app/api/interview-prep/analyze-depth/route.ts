/**
 * Interview Prep API - Skill Depth Analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeProfileSkillDepth, predictOverallAIScore } from '@/lib/interview-prep/skill-evaluator';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { profileText, requiredSkills } = body;

        if (!profileText) {
            return NextResponse.json(
                { error: 'Profile text is required' },
                { status: 400 }
            );
        }

        // Analyze skill depth from profile
        const assessments = analyzeProfileSkillDepth(profileText);

        // Calculate overall AI score prediction if required skills provided
        let overallPrediction = null;
        if (requiredSkills && requiredSkills.length > 0) {
            overallPrediction = predictOverallAIScore(assessments, requiredSkills);
        }

        // Generate summary statistics
        const summary = {
            totalSkillsFound: assessments.length,
            averageEvidenceStrength: assessments.length > 0
                ? assessments.reduce((sum, a) => sum + a.evidenceStrength, 0) / assessments.length
                : 0,
            skillsWithGaps: assessments.filter(a => a.gaps.length > 0).length,
            readyForAI: assessments.filter(a =>
                a.predictedAIRating === 'mid-level' || a.predictedAIRating === 'senior'
            ).length,
        };

        // Priority recommendations (skills with lowest evidence strength)
        const prioritySkills = assessments
            .filter(a => a.evidenceStrength < 50)
            .slice(0, 5)
            .map(a => ({
                skill: a.skillName,
                evidenceStrength: a.evidenceStrength,
                predictedRating: a.predictedAIRating,
                topRecommendation: a.recommendations[0] || 'Build more experience',
            }));

        return NextResponse.json({
            success: true,
            assessments,
            overallPrediction,
            summary,
            prioritySkills,
        });
    } catch (error) {
        console.error('Skill analysis error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze skills', details: String(error) },
            { status: 500 }
        );
    }
}
