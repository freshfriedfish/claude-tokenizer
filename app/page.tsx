"use client";

import { TokenizerInput } from "../components/tokenComponents";
import './globals.css';
import { Roboto } from 'next/font/google';
import { Badge } from "@/components/ui/badge"


export default function TokenizerPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900">
      <header>
        <div className="w-full max-w-3xl px-4 flex justify-between items-center pt-4">
          <a href="/">
            <img src="/shafdotfun.png" alt="Shaf.fun" className="h-8 " />
          </a>
          <a href="/about" className="text-neutral-300 hover:text-white underline">about</a>
        </div>
      </header>
      <hr className="w-1/2 border-neutral-700 my-4" />
      <div className="w-full max-w-3xl px-4">
        <h1 className="bg-gradient-to-r from-white to-black bg-clip-text text-5xl font-bold text-transparent mb-10">Claude-Tokenizer <Badge className="font-extrabold">NEW</Badge></h1>
        <h2 className="text-xl font-bold mb-4">A Tokenizer for Claude 3.5 Sonnet</h2>

        <p className="mb-8">
          This tool uses Anthropic's newly released <a href="https://docs.anthropic.com/en/docs/build-with-claude/token-counting">token counting api</a> to count the number of tokens in a given text. Beware of <a href="https://lunary.ai/anthropic-tokenizer">existing tokenizers</a> which are not accurate. Explore the source code <a href="https://github.com/freshfriedfish/claude-tokenizer">here</a>.</p>

        <TokenizerInput />
      </div>
      <footer className="mt-10 text-neutral-500 text-sm">
        <hr className="w-full border-neutral-700 my-4" />
        This website is not affiliated with or endorsed by Anthropic.
      </footer>
    </div>
  );
}