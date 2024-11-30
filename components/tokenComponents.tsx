import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const TokenizerInput = () => {
    const [text, setText] = useState('');
    const [stats, setStats] = useState({ tokens: 0, chars: 0 });
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        try {
            setError('');
            const response = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            setStats({
                tokens: data.input_tokens,
                chars: text.length
            });
        } catch (err) {
            console.error('Analysis failed:', err);
            setError('Failed to analyze text. Please try again.');
            setStats({ tokens: 0, chars: 0 });
        }
    };

    return (
        <>
            <div className="space-y-4 mb-4">
                <Textarea
                    placeholder="enter some text"
                    rows={10}
                    className="font-mono"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <Button
                    onClick={handleAnalyze}
                    variant="outline"
                >
                    Analyze Text
                </Button>
                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}
            </div>
            <TokenMetrics tokens={stats.tokens} chars={stats.chars} />
        </>
    );
};

export const TokenMetrics = ({ tokens, chars }: { tokens: number, chars: number }) => (
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