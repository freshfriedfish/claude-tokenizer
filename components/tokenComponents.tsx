import { useState, useEffect, useCallback } from 'react';
import { Textarea } from "@/components/ui/textarea";

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
}

export const TokenizerInput = () => {
    const [text, setText] = useState('');
    const [stats, setStats] = useState<{ tokens: number | null; chars: number }>({ tokens: null, chars: 0 });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async (inputData: InputData) => {
        const { text } = inputData;

        // If text is empty, reset stats
        if (!text.trim()) {
            setStats({ tokens: null, chars: 0 });
            setError(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Handle text input - call /api
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
            console.log('Text tokens calculated:', textTokens);

            console.log('Total tokens:', textTokens);
            setStats({
                tokens: textTokens,
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
        debouncedHandleAnalyze({ text });
    }, [text, debouncedHandleAnalyze]);

    return (
        <>
            <div className="space-y-4 mb-4">
                {/* Text Input */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Text Input</label>
                    <Textarea
                        placeholder="Enter some text"
                        rows={6}
                        className="font-mono"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
            </div>

            {error && <p className="text-destructive mb-4">{error}</p>}
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
            <h2 className="leading-none font-black text-foreground">Tokens</h2>
            <p className="text-4xl font-thin text-foreground">{tokens}</p>
        </div>
        <div className="space-y-1">
            <h2 className="font-black leading-none text-foreground">Characters</h2>
            <p className="text-4xl font-thin text-foreground">{chars}</p>
            <p className="text-sm text-muted-foreground">text only</p>
        </div>
    </div>
);