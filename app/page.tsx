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
      toast("Updated to fix recent bugs, sorry for the delay!");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>

      <div className="w-full max-w-3xl px-4">
        <h1 className="text-3xl font-bold mb-8 text-foreground">
          Claude Tokenizer
        </h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            The official unofficial tokenizer for Claude
          </h2>
          <p className="text-base text-muted-foreground mb-4 leading-relaxed">
            You can use the tool below to understand how a piece of text might be tokenized by a language model, and the total count of tokens in that piece of text.
          </p>

          <p className="text-base text-muted-foreground leading-relaxed">
            This is the most accurate tokenizer as it is the only one which calls the{" "}
            <a
              href="https://docs.claude.com/en/api/messages-count-tokens"
              target="_blank"
              rel="noopener noreferrer"
            >
              official API.
            </a>
          </p>

        </div>

        <TokenizerInput />
      </div>

    </>
  );
}