import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { WEEKLY_PULSE_PROMPT, QUICK_AUDIT_PROMPT, SETUP_PROMPT, QUARTERLY_PROMPT } from '@/prompts';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPTS: Record<string, string> = {
    weekly: WEEKLY_PULSE_PROMPT,
    quick_audit: QUICK_AUDIT_PROMPT,
    setup: SETUP_PROMPT,
    quarterly: QUARTERLY_PROMPT,
};

export async function POST(request: NextRequest) {
    try {
        const { messages, sessionType } = await request.json();

        if (!process.env.ANTHROPIC_API_KEY) {
            return NextResponse.json(
                { error: 'ANTHROPIC_API_KEY is not configured' },
                { status: 500 }
            );
        }

        const systemPrompt = sessionType && SYSTEM_PROMPTS[sessionType]
            ? SYSTEM_PROMPTS[sessionType]
            : `You are Career Board, an AI assistant for career governance and accountability.
         Be direct, ask for specifics, and demand receipts (evidence) for claims.
         Push back on vague answers with "Give me one specific example."`;

        const formattedMessages = messages.map((msg: { role: string; content: string }) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
        }));

        const response = await anthropic.messages.create({
            model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: systemPrompt,
            messages: formattedMessages,
        });

        const textContent = response.content.find(block => block.type === 'text');
        const content = textContent && 'text' in textContent ? textContent.text : 'I apologize, I could not generate a response.';

        return NextResponse.json({ content });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat request' },
            { status: 500 }
        );
    }
}
