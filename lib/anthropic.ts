import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('Missing ANTHROPIC_API_KEY environment variable. AI features may not work.');
}

export const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key',
});

// Helper for structured outputs (until easier access)
export async function getStructuredCompletion<T>(
    systemPrompt: string,
    userPrompt: string
): Promise<T | null> {
    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
        });

        const content = msg.content[0].type === 'text' ? msg.content[0].text : '';

        // simple JSON extraction attempt
        const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as T;
        }
        return null;
    } catch (e) {
        console.error("Anthropic API Error:", e);
        return null;
    }
}
