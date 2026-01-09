/**
 * Career Intelligence API - LinkedIn Signals
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    analyzeProfileSignals,
    estimateLinkedInMatchScore,
} from '@/lib/career-intelligence/linkedin-signals';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, profileText, jobDescription } = body;

        switch (action) {
            case 'analyze-signals': {
                if (!profileText) {
                    return NextResponse.json({ error: 'profileText is required' }, { status: 400 });
                }
                const analysis = analyzeProfileSignals(profileText);
                return NextResponse.json({ success: true, analysis });
            }

            case 'estimate-match': {
                if (!profileText || !jobDescription) {
                    return NextResponse.json({ error: 'profileText and jobDescription are required' }, { status: 400 });
                }
                const estimate = estimateLinkedInMatchScore(profileText, jobDescription);
                return NextResponse.json({ success: true, estimate });
            }

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Use: analyze-signals, estimate-match' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('LinkedIn signals error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze LinkedIn signals', details: String(error) },
            { status: 500 }
        );
    }
}
