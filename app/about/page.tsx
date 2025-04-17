export default function AboutPage() {
    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">About This Tool</h1>
            <p className="mb-2">
                This application uses Anthropic's official token counting API for accurate token estimates.
            </p>
            <p className="mb-2">
                A tokenizer breaks text into smaller units (tokens) that language models process. Accurate token counting is crucial.
            </p>
            <p className="mb-2">
                Here's how this tool helps:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-bold">Without Accurate Token Counting:</h3>
                    <ul className="list-disc pl-5">
                        <li>❌ Unexpected API Costs</li>
                        <li>❌ Exceeded Rate Limits</li>
                        <li>❌ Suboptimal Prompt Length</li>
                        <li>❌ Wasted Tokens </li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold">With This Token Counter:</h3>
                    <ul className="list-disc pl-5">
                        <li>✅ Predictable API Costs</li>
                        <li>✅ Stay Within Rate Limits</li>
                        <li>✅ Optimize Prompts</li>
                        <li>✅ Save Money</li>
                    </ul>
                </div>
            </div>

            <p className="mt-4 mb-2">
                Supported Models:
            </p>
            <ul className="list-disc pl-5">
                <li>Claude 3.5 Haiku</li>
                <li>Claude 3.5 Sonnet</li>
                <li>Claude 3.7 Sonnet</li>
            </ul>
        </div>
    );
};