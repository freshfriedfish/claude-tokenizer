import Anthropic from '@anthropic-ai/sdk';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MiB
const ALLOWED_MEDIA_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;
type AllowedMediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

interface ImagePayload {
  image: string;
  media_type: AllowedMediaType;
  text?: string;
}