/**
 * Interview Prep API - Question Generation
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    getQuestionsForSkill,
    generateInterviewSequence,
    generateFollowUp,
    getAvailableSkills
} from '@/lib/interview-prep/question-generator';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, skills, skill, difficulty, previousQuestion, responseKeywords } = body;

        switch (action) {
            case 'get-questions': {
                // Get questions for a specific skill
                if (!skill) {
                    return NextResponse.json({ error: 'Skill is required' }, { status: 400 });
                }
                const questions = getQuestionsForSkill(skill, difficulty);
                return NextResponse.json({ success: true, questions });
            }

            case 'generate-sequence': {
                // Generate a full interview question sequence
                if (!skills || !Array.isArray(skills) || skills.length === 0) {
                    return NextResponse.json({ error: 'Skills array is required' }, { status: 400 });
                }
                const sequence = generateInterviewSequence(skills);
                return NextResponse.json({ success: true, sequence });
            }

            case 'follow-up': {
                // Generate a follow-up question
                if (!previousQuestion) {
                    return NextResponse.json({ error: 'Previous question is required' }, { status: 400 });
                }
                const followUp = generateFollowUp(previousQuestion, responseKeywords || []);
                return NextResponse.json({ success: true, followUp });
            }

            case 'list-skills': {
                // List available skills with question banks
                const availableSkills = getAvailableSkills();
                return NextResponse.json({ success: true, skills: availableSkills });
            }

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Use: get-questions, generate-sequence, follow-up, or list-skills' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Question generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate questions', details: String(error) },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Return list of available skills
    const availableSkills = getAvailableSkills();
    return NextResponse.json({ skills: availableSkills });
}
