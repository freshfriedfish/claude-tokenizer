import Anthropic from '@anthropic-ai/sdk';

const MAX_PDF_BYTES = 32 * 1024 * 1024; // 32 MiB
const ALLOWED_MEDIA_TYPE = 'application/pdf';

interface PDFPayload {
  pdf: string;
  media_type: string;
  text?: string;
}

type DocumentBlockParam = {
    type: 'document';
    source: {
        type: 'base64';
        media_type: 'application/pdf';
        data: string;
    };
};

export async function POST(req: Request) {
    try {
        if (!req.headers.get('content-type')?.includes('application/json')) {
            return Response.json(
                { error: 'Unsupported content-type. Use application/json.' },
                { status: 415 }
            );
        }

        const body = (await req.json()) as Partial<PDFPayload>;
        const { pdf, media_type } = body;

        if (!pdf) {
            return Response.json(
                { error: 'Missing "pdf" property (base-64 string).' },
                { status: 400 }
            );
        }

        if (!media_type || media_type !== ALLOWED_MEDIA_TYPE) {
            return Response.json(
                {
                    error: `Unsupported or missing media_type. Must be: ${ALLOWED_MEDIA_TYPE}`,
                },
                { status: 400 }
            );
        }

        const cleanedBase64 = pdf.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(cleanedBase64, 'base64');

        if (buffer.length > MAX_PDF_BYTES) {
            return Response.json(
                { error: `PDF exceeds the ${MAX_PDF_BYTES / 1024 / 1024} MiB limit.` },
                { status: 413 }
            );
        }

        const content: DocumentBlockParam[] = [
            {
                type: 'document',
                source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: cleanedBase64,
                },
            },
        ];

        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

        const count = await anthropic.beta.messages.countTokens({
            betas: ['token-counting-2024-11-01'],
            model: 'claude-3-5-sonnet-20241022',
            messages: [
                {
                    role: 'user',
                    content,
                },
            ],
        });

        return Response.json(count);
    } catch (error) {
        console.error('PDF token-counting error:', error);
        return Response.json({ error: 'Failed to count tokens for PDF.' }, { status: 500 });
    }
}
