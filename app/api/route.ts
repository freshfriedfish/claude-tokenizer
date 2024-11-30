import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('missing ANTHROPIC_API_KEY');
}

export async function POST(req: Request) {
    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });
    const { text } = await req.json();

    const count = await anthropic.beta.messages.countTokens({
        betas: ["token-counting-2024-11-01"],
        model: 'claude-3-5-sonnet-20241022',
        messages: [{
            role: 'user',
            content: text
        }]
    });

    return Response.json(count);
}