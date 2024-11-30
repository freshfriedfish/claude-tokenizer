"use client";

import { TokenizerInput } from "../components/tokenComponents";
import './globals.css';

export default function TokenizerPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-3xl px-4">
        <h1 className="text-4xl font-bold mb-10">Claude Tokenizer</h1>
        <h2 className="text-xl font-bold mb-4">A Tokenizer for Claude 3.5 Sonnet</h2>
        <p>
          Uses Anthropic's official <a href="https://docs.anthropic.com/en/docs/build-with-claude/token-counting">token counting</a> API. This is currently the only online tokenizer utilizing the official API. Beware of currently existing tokenizers, such as <a href="https://lunary.ai/anthropic-tokenizer">this</a> one, which are fake.</p>
        <p className="mb-8">
          You may view the source code <a href="https://google.com">here</a>.</p>
        <TokenizerInput />
      </div>
    </div>
  );
}