/**
 * Interview Prep API - Conversational Scoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { scoreConversation, scoreQuickResponse, calculateFillerRate } from '@/lib/interview-prep/conversational-scorer';
import { PAPER_BENCHMARKS } from '@/lib/interview-prep/types';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { responses, singleResponse } = body;

        // Score a single response (for real-time feedback)
        if (singleResponse) {
            const quickScore = scoreQuickResponse(singleResponse);
            return NextResponse.json({
                success: true,
                type: 'quick',
                ...quickScore,
            });
        }

        // Score multiple responses (for full session analysis)
        if (responses && Array.isArray(responses) && responses.length > 0) {
            const score = scoreConversation(responses);

            // Add interpretation
            const interpretation = {
                meetsAIBenchmark: score.overallConversational >= PAPER_BENCHMARKS.AI_INTERVIEW_CONVERSATIONAL,
                beatsHumanBenchmark: score.overallConversational >= PAPER_BENCHMARKS.HUMAN_INTERVIEW_CONVERSATIONAL,
                percentileEstimate: estimatePercentile(score.overallConversational),
            };

            return NextResponse.json({
                success: true,
                type: 'full',
                score,
                interpretation,
                benchmarks: {
                    aiInterview: PAPER_BENCHMARKS.AI_INTERVIEW_CONVERSATIONAL,
                    humanInterview: PAPER_BENCHMARKS.HUMAN_INTERVIEW_CONVERSATIONAL,
                },
            });
        }

        return NextResponse.json(
            { error: 'Either responses array or singleResponse string is required' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Conversational scoring error:', error);
        return NextResponse.json(
            { error: 'Failed to score conversation', details: String(error) },
            { status: 500 }
        );
    }
}

/**
 * Estimate percentile based on score distribution
 * Based on paper's benchmarks: AI=7.8 (high), Human=5.4 (average)
 */
function estimatePercentile(score: number): number {
    // Rough percentile mapping
    if (score >= 9) return 95;
    if (score >= 8.5) return 90;
    if (score >= 8) return 80;
    if (score >= 7.5) return 70;
    if (score >= 7) return 60;
    if (score >= 6.5) return 50;
    if (score >= 6) return 40;
    if (score >= 5.5) return 30;
    if (score >= 5) return 20;
    return 10;
}
