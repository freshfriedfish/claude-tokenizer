export default function AboutPage() {
    return (
        <div className="container mx-auto p-4 max-w-2xl lg:max-w-3xl">
            <h1 className="text-2xl font-bold mb-4 text-foreground">About This Tool</h1>
            <p className="mb-2 text-foreground">
                This application uses Anthropic's official token counting API for accurate token estimates.
            </p>
            <p className="mb-2 text-foreground">
                A tokenizer breaks text into smaller units (tokens) that language models process. Accurate token counting is crucial.
            </p>
            <p className="mb-2 text-foreground">
                Here's how this tool helps:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-bold text-foreground">Without Accurate Token Counting:</h3>
                    <ul className="list-disc pl-5 text-foreground">
                        <li>❌ Unexpected API Costs</li>
                        <li>❌ Exceeded Rate Limits</li>
                        <li>❌ Suboptimal Prompt Length</li>
                        <li>❌ Wasted Tokens </li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-foreground">With This Token Counter:</h3>
                    <ul className="list-disc pl-5 text-foreground">
                        <li>✅ Predictable API Costs</li>
                        <li>✅ Stay Within Rate Limits</li>
                        <li>✅ Optimize Prompts</li>
                        <li>✅ Save Money</li>
                    </ul>
                </div>
            </div>

            <p className="mt-4 mb-2 text-foreground">
                Supported Models:
            </p>
            <ul className="list-disc pl-5 text-foreground">
                <li>Claude Opus 4</li>
                <li>Claude Sonnet 4</li>
                <li>Claude Sonnet 3.7</li>
                <li>Claude Sonnet 3.5</li>
                <li>Claude Haiku 3.5</li>
                <li>Claude Haiku 3</li>
                <li>Claude Opus 3</li>
            </ul>
        </div>
    );
};