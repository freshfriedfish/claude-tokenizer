import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('missing ANTHROPIC_API_KEY');
}

export async function POST(req: Request) {
    try {
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
        const { text } = await req.json();

        console.log('Attempting to count tokens for text length:', text?.length);

        const count = await anthropic.beta.messages.countTokens({
            betas: ["token-counting-2024-11-01"],
            model: 'claude-sonnet-4-5',
            messages: [{
                role: 'user',
                content: text
            }]
        });

        console.log('Token count successful:', count);
        return Response.json(count);
    } catch (error) {
        console.error('Token counting error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        // More detailed error for debugging
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : '';
        
        console.error('Error message:', errorMessage);
        console.error('Error stack:', errorStack);
        
        return Response.json(
            { error: 'Failed to count tokens', details: errorMessage },
            { status: 500 }
        );
    }
}