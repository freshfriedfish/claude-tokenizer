"use client";

import { TokenizerInput } from "../components/tokenComponents";
import './globals.css';
import { Roboto } from 'next/font/google';


export default function TokenizerPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900">
      <div className="w-full max-w-3xl px-4">
        <h1 className="bg-gradient-to-r from-white to-black bg-clip-text text-5xl font-bold text-transparent mb-10">Claude-Tokenizer</h1>
        <h2 className="text-xl font-bold mb-4">A Tokenizer for Claude 3.5 Sonnet</h2>
        <p className="mb-8">
          This tool uses Anthropic's newly released <a href="https://docs.anthropic.com/en/docs/build-with-claude/token-counting">token counting api</a> to count the number of tokens in a given text. Beware of <a href="https://lunary.ai/anthropic-tokenizer">existing tokenizers</a> which are not accurate. Explore the source code <a href="https://github.com/freshfriedfish/claude-tokenizer">here</a>.</p>

        <TokenizerInput />
      </div>
      <footer className="mt-10 text-neutral-500 text-sm">
        This website is not affiliated with or endorsed by Anthropic.
      </footer>
    </div>
  );
}