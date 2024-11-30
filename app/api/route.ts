import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
    const client = new Anthropic();
    const { text } = await req.json();

    const count = await client.beta.messages.countTokens({
        betas: ["token-counting-2024-11-01"],
        model: 'claude-3-5-sonnet-20241022',
        messages: [{
            role: 'user',
            content: text
        }]
    });

    return Response.json(count);
}