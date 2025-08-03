import Anthropic from '@anthropic-ai/sdk';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 5 MiB
const ALLOWED_MEDIA_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;
type AllowedMediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

interface ImagePayload {
  image: string;
  media_type: AllowedMediaType;
  text?: string;
}

type ImageBlockParam = {
    type: 'image';
    source: {
        type: 'base64';
        media_type: AllowedMediaType;
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

        const body = (await req.json()) as Partial<ImagePayload>;
        const { image, media_type } = body;

        if (!image) {
            return Response.json(
                { error: 'Missing "image" property (base-64 string).' },
                { status: 400 }
            );
        }

        if (!media_type || !ALLOWED_MEDIA_TYPES.includes(media_type)) {
            return Response.json(
                {
                    error: `Unsupported or missing media_type. Allowed types: ${ALLOWED_MEDIA_TYPES.join(
                        ', '
                    )}`,
                },
                { status: 400 }
            );
        }

        const cleanedBase64 = image.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(cleanedBase64, 'base64');

        if (buffer.length > MAX_IMAGE_BYTES) {
            return Response.json(
                { error: `Image exceeds the ${MAX_IMAGE_BYTES / 1024 / 1024} MiB limit.` },
                { status: 413 }
            );
        }

        const content: ImageBlockParam[] = [
            {
                type: 'image',
                source: {
                type: 'base64',
                media_type,
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
        console.error('Image token-counting error:', error);
        return Response.json({ error: 'Failed to count tokens for image.' }, { status: 500 });
    }
}