import { useState, useEffect, useCallback } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Upload, Image as ImageIcon } from 'lucide-react';

// Debounce utility function
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

interface InputData {
    text: string;
    image: File | null;
}

export const TokenizerInput = () => {
    const [text, setText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [stats, setStats] = useState<{ tokens: number | null; chars: number }>({ tokens: null, chars: 0 });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const convertImageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleAnalyze = async (inputData: InputData) => {
        const { text, image } = inputData;

        // If both text and image are empty, reset stats
        if (!text.trim() && !image) {
            setStats({ tokens: null, chars: 0 });
            setError(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let totalTokens = 0;

            // Handle text input - call /api
            if (text.trim()) {
                console.log('Making text API call with:', { text });
                const textResponse = await fetch('/api', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text }),
                });

                console.log('Text API response status:', textResponse.status);

                if (!textResponse.ok) {
                    const errorText = await textResponse.text();
                    console.error('Text API error:', errorText);
                    throw new Error(`Text API request failed with status ${textResponse.status}: ${errorText}`);
                }

                const textData = await textResponse.json();
                console.log('Text API response data:', textData);
                const textTokens = textData.input_tokens > 7 ? textData.input_tokens - 7 : 0;
                totalTokens += textTokens;
                console.log('Text tokens calculated:', textTokens);
            }

            // Handle image input - call /api/image
            if (image) {
                console.log('Processing image:', image.name, image.type, image.size);
                const imageBase64 = await convertImageToBase64(image);
                console.log('Image converted to base64, length:', imageBase64.length);

                const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'] as const;
                if (!allowedTypes.includes(image.type as any)) {
                    throw new Error(`Unsupported image type: ${image.type}`);
                }

                const requestPayload = {
                    image: imageBase64,  // base64 string without data URL prefix
                    media_type: image.type as 'image/png' | 'image/jpeg' | 'image/webp'
                };
                console.log('Making image API call with payload:', {
                    ...requestPayload,
                    image: `[base64 data ${imageBase64.length} chars]` // Don't log full base64
                });

                const imageResponse = await fetch('/api/image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestPayload),
                });

                console.log('Image API response status:', imageResponse.status);

                if (!imageResponse.ok) {
                    const errorText = await imageResponse.text();
                    console.error('Image API error:', errorText);
                    throw new Error(`Image API request failed with status ${imageResponse.status}: ${errorText}`);
                }

                const imageData = await imageResponse.json();
                console.log('Image API response data:', imageData);
                const imageTokens = imageData.input_tokens > 7 ? imageData.input_tokens - 7 : 0;
                totalTokens += imageTokens;
                console.log('Image tokens calculated:', imageTokens);
            }

            console.log('Total tokens:', totalTokens);
            setStats({
                tokens: totalTokens,
                chars: text.length,
            });
        } catch (err) {
            console.error("Token counting error:", err);
            setError("Failed to analyze content. Please try again.");
            setStats({ tokens: null, chars: text.length });
        } finally {
            setIsLoading(false);
        }
    };

    // Debounced version of handleAnalyze
    const debouncedHandleAnalyze = useCallback(debounce(handleAnalyze, 500), []);

    useEffect(() => {
        debouncedHandleAnalyze({ text, image });
    }, [text, image, debouncedHandleAnalyze]);

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setError(`Please select a valid image file. Supported formats: ${allowedTypes.join(', ')}`);
                return;
            }

            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                setError('Image file is too large. Please select a file smaller than 10MB.');
                return;
            }

            setImage(file);
            setError(null);

            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);

        const fileInput = document.getElementById('image-input') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <>
            <div className="space-y-4 mb-4">
                {/* Text Input */}
                <div>
                    <label className="block text-sm font-medium mb-2">Text Input</label>
                    <Textarea
                        placeholder="Enter some text"
                        rows={6}
                        className="font-mono"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                {/* Image Input */}
                <div>
                    <label className="block text-sm font-medium mb-2">Image Input</label>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                id="image-input"
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('image-input')?.click()}
                                className="flex items-center gap-2"
                            >
                                <Upload size={16} />
                                Select Image
                            </Button>
                        </div>

                        {image && (
                            <div className="flex items-center gap-2">
                                <ImageIcon size={16} />
                                <span className="text-sm text-gray-600">{image.name}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={removeImage}
                                    className="h-6 w-6 p-0"
                                >
                                    <X size={12} />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="mt-3">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-w-xs max-h-48 rounded-lg border"
                            />
                        </div>
                    )}
                </div>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            <TokenMetrics tokens={stats.tokens ?? 0} chars={stats.chars} hasImage={!!image} />
        </>
    );
};

interface TokenMetricsProps {
    tokens: number;
    chars: number;
    hasImage: boolean;
}

export const TokenMetrics = ({ tokens, chars, hasImage }: TokenMetricsProps) => (
    <div className="flex gap-8">
        <div className="space-y-1">
            <h2 className="leading-none font-black">Tokens</h2>
            <p className="text-4xl font-thin">{tokens}</p>
            {hasImage && (
                <p className="text-sm text-gray-500">includes image tokens</p>
            )}
        </div>
        <div className="space-y-1">
            <h2 className="font-black leading-none">Characters</h2>
            <p className="text-4xl font-thin">{chars}</p>
            <p className="text-sm text-gray-500">text only</p>
        </div>
    </div>
);