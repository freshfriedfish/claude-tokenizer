// app/page.tsx
"use client";

import { useEffect } from "react";
import { TokenizerInput } from "../components/tokenComponents";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function TokenizerPage() {
  useEffect(() => {
    // Small delay to ensure Sonner is ready
    const timer = setTimeout(() => {
      toast("Updated to fix website erroring out. Sorry!");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>

      <div className="w-full max-w-3xl px-4">
        <h1 className="bg-gradient-to-r from-white to-black bg-clip-text text-5xl font-bold text-transparent mb-4 mt-8">
          Claude-Tokenizer
          <Badge className="mx-2 font-black">NEW</Badge>
        </h1>

        <h2 className="text-xl font-bold mb-4">A Tokenizer for Claude 4

        </h2>

        <p className="mb-8">
          This tool uses Anthropic's newly released <a href="https://docs.anthropic.com/en/docs/build-with-claude/token-counting">token counting api</a> to count the number of tokens in a given text. Beware of <a href="https://lunary.ai/anthropic-tokenizer">existing tokenizers</a> which are not accurate. Explore the source code <a href="https://github.com/freshfriedfish/claude-tokenizer">here</a>.</p>

        <TokenizerInput />
      </div>

    </>
  );
}