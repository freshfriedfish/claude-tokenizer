import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const TokenizerInput = () => {
    const [text, setText] = useState('');
    const [stats, setStats] = useState<{ tokens: number | null, chars: number }>({ tokens: null, chars: 0 });

    const handleAnalyze = async () => {
        const response = await fetch('/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        const data = await response.json();
        setStats({
            tokens: data.input_tokens > 7 ? data.input_tokens - 7 : 0,
            chars: text.length
        });
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
            </div>
            <TokenMetrics tokens={stats.tokens ?? 0} chars={stats.chars} />
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