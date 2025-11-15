// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { Badge } from "@/components/ui/badge";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Claude Tokenizer",
  description: "A Tokenizer for Claude family models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark flex flex-col items-center justify-center min-h-screen`}
      >
        <header className="w-full max-w-3xl px-4">
          <div className="flex justify-between items-center pt-4">
            <a href="https://www.shaf.fun/">
              <img
                src="/shafdotfun.png"
                alt="Shaf.fun"
                className="h-8 hover:scale-105"
              />
            </a>
            <div className="flex items-center gap-x-4">
              <a href="/" className="underline">
                Tokenizer
              </a>
              <a href="/about" className="underline">
                About
              </a>
            </div>
          </div>
        </header>
        <hr className="w-1/2 border-neutral-700 my-4" />
        {children}
        <footer className="mt-10 text-neutral-500 text-sm">
          <hr className="w-full border-neutral-700 my-4" />
          This website is not affiliated with or endorsed by Anthropic.
        </footer>
        <Analytics />
      </body></html>
  );
}