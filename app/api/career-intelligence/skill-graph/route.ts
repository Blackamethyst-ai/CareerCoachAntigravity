/**
 * Career Intelligence API - Skill Graph
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    findAdjacentSkills,
    findSkillPath,
    calculateSkillCoverage,
    suggestLearningPath,
    analyzeSkillPortfolio,
    SKILL_NODES,
} from '@/lib/career-intelligence/skill-graph';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, skills, skill, targetSkill, targetSkills } = body;

        switch (action) {
            case 'adjacent': {
                if (!skill) {
                    return NextResponse.json({ error: 'Skill is required' }, { status: 400 });
                }
                const adjacent = findAdjacentSkills(skill);
                return NextResponse.json({ success: true, adjacent });
            }

            case 'path': {
                if (!skill || !targetSkill) {
                    return NextResponse.json({ error: 'skill and targetSkill are required' }, { status: 400 });
                }
                const path = findSkillPath(skill, targetSkill);
                return NextResponse.json({ success: true, path });
            }

            case 'coverage': {
                if (!skills || !targetSkills) {
                    return NextResponse.json({ error: 'skills and targetSkills are required' }, { status: 400 });
                }
                const coverage = calculateSkillCoverage(skills, targetSkills);
                return NextResponse.json({ success: true, coverage });
            }

            case 'learning-path': {
                if (!skills || !targetSkills) {
                    return NextResponse.json({ error: 'skills and targetSkills are required' }, { status: 400 });
                }
                const suggestions = suggestLearningPath(skills, targetSkills);
                return NextResponse.json({ success: true, suggestions });
            }

            case 'portfolio': {
                if (!skills) {
                    return NextResponse.json({ error: 'skills are required' }, { status: 400 });
                }
                const analysis = analyzeSkillPortfolio(skills);
                return NextResponse.json({ success: true, analysis });
            }

            case 'list-skills': {
                const skillList = Object.values(SKILL_NODES);
                return NextResponse.json({ success: true, skills: skillList });
            }

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Use: adjacent, path, coverage, learning-path, portfolio, list-skills' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Skill graph error:', error);
        return NextResponse.json(
            { error: 'Failed to process skill graph request', details: String(error) },
            { status: 500 }
        );
    }
}

export async function GET() {
    const skillList = Object.values(SKILL_NODES);
    return NextResponse.json({ skills: skillList });
}
