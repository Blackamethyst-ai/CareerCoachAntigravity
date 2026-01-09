/**
 * Career Intelligence API - Response Embeddings
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    scoreResponseEmbedding,
    scoreResponseSet,
    IDEAL_RESPONSES,
} from '@/lib/career-intelligence/response-embeddings';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, response, skill, questionType, responses } = body;

        switch (action) {
            case 'score-single': {
                if (!response || !skill || !questionType) {
                    return NextResponse.json(
                        { error: 'response, skill, and questionType are required' },
                        { status: 400 }
                    );
                }
                const score = scoreResponseEmbedding(response, skill, questionType);
                return NextResponse.json({ success: true, score });
            }

            case 'score-batch': {
                if (!responses || !Array.isArray(responses)) {
                    return NextResponse.json(
                        { error: 'responses array is required' },
                        { status: 400 }
                    );
                }
                const result = scoreResponseSet(responses);
                return NextResponse.json({ success: true, result });
            }

            case 'get-ideal': {
                if (!skill) {
                    return NextResponse.json({ error: 'skill is required' }, { status: 400 });
                }
                const ideals = IDEAL_RESPONSES.filter(
                    ir => ir.skill.toLowerCase() === skill.toLowerCase()
                );
                return NextResponse.json({ success: true, ideals });
            }

            case 'list-skills': {
                const skills = Array.from(new Set(IDEAL_RESPONSES.map(ir => ir.skill)));
                return NextResponse.json({ success: true, skills });
            }

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Use: score-single, score-batch, get-ideal, list-skills' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Response embedding error:', error);
        return NextResponse.json(
            { error: 'Failed to score response', details: String(error) },
            { status: 500 }
        );
    }
}

export async function GET() {
    const skills = Array.from(new Set(IDEAL_RESPONSES.map(ir => ir.skill)));
    const questionTypes = Array.from(new Set(IDEAL_RESPONSES.map(ir => ir.questionType)));
    return NextResponse.json({ skills, questionTypes });
}
