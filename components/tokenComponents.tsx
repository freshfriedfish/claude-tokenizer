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

    const handleAnalyze = async (text: string) => {
        if (!text.trim()) {
            setStats({ tokens: null, chars: 0 }); // Reset stats if text is empty
            setError(null); // Clear any previous errors
            return;
        }

        try {
            const response = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            setStats({
                tokens: data.input_tokens > 7 ? data.input_tokens - 7 : 0,
                chars: text.length,
            });
            setError(null); // Clear any previous errors
        } catch (err) {
            console.error("Token counting error:", err);
            setError("Failed to analyze text. Please try again.");
            setStats({ tokens: null, chars: text.length }); // Reset tokens but keep character count
        }
    };

    // Debounced version of handleAnalyze
    const debouncedHandleAnalyze = useCallback(debounce(handleAnalyze, 200), []);

    useEffect(() => {
        debouncedHandleAnalyze(text);
    }, [text, debouncedHandleAnalyze]);

    return (
        <>
            <div className="space-y-4 mb-4">
                <Textarea
                    placeholder="Enter some text"
                    rows={10}
                    className="font-mono"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <TokenMetrics tokens={stats.tokens ?? 0} chars={stats.chars} />
        </>
    );
};

interface TokenMetricsProps {
    tokens: number;
    chars: number;
}

export const TokenMetrics = ({ tokens, chars }: TokenMetricsProps) => (
    <div className="flex gap-8">
        <div className="space-y-1">
            <h2 className="leading-none font-black">Tokens</h2>
            <p className="text-4xl font-thin">{tokens}</p>
        </div>
        <div className="space-y-1">
            <h2 className="font-black leading-none">Characters</h2>
            <p className="text-4xl font-thin">{chars}</p>
        </div>
    </div>
);