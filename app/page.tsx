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
        <h1 className="text-3xl font-bold mb-8">
          Claude Tokenizer
        </h1>
        <h2 className="text-lg font-bold mb-4">The Official Unofficial Tokenizer for Claude

        </h2>

        <div className="mb-8">
          <p>
            The first and only tokenizer that actually uses the official API.
          </p>
        </div>

        <TokenizerInput />
      </div>

    </>
  );
}