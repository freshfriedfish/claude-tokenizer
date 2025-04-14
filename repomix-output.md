This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# Files

## File: app/api/route.ts
````typescript
import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('missing ANTHROPIC_API_KEY');
}

export async function POST(req: Request) {
    try {
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
        const { text } = await req.json();

        const count = await anthropic.beta.messages.countTokens({
            betas: ["token-counting-2024-11-01"],
            model: 'claude-3-5-sonnet-20241022',
            messages: [{
                role: 'user',
                content: text
            }]
        });

        return Response.json(count);
    } catch (error) {
        console.error('Token counting error:', error);
        return Response.json(
            { error: 'Failed to count tokens' },
            { status: 500 }
        );
    }
}
````

## File: app/globals.css
````css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif;
  }
}

a {
  @apply text-orange-400 hover:text-orange-600
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

@layer base {


  :root {
    --background: 25 0% 95%;
    --foreground: 25 0% 10%;
    --card: 25 0% 90%;
    --card-foreground: 25 0% 15%;
    --popover: 25 0% 95%;
    --popover-foreground: 25 95% 10%;
    --primary: 25 49.7% 66.5%;
    --primary-foreground: 0 0% 0%;
    --secondary: 25 10% 70%;
    --secondary-foreground: 0 0% 0%;
    --muted: -13 10% 85%;
    --muted-foreground: 25 0% 40%;
    --accent: -13 10% 80%;
    --accent-foreground: 25 0% 15%;
    --destructive: 0 50% 50%;
    --destructive-foreground: 25 0% 90%;
    --border: 25 20% 50%;
    --input: 25 20% 50%;
    --ring: 25 49.7% 66.5%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 25 10% 10%;
    --foreground: 25 0% 90%;
    --card: 25 0% 10%;
    --card-foreground: 25 0% 90%;
    --popover: 25 10% 5%;
    --popover-foreground: 25 0% 90%;
    --primary: 25 49.7% 66.5%;
    --primary-foreground: 0 0% 0%;
    --secondary: 25 10% 20%;
    --secondary-foreground: 0 0% 100%;
    --muted: -13 10% 25%;
    --muted-foreground: 25 0% 60%;
    --accent: -13 10% 25%;
    --accent-foreground: 25 0% 90%;
    --destructive: 0 50% 50%;
    --destructive-foreground: 25 0% 90%;
    --border: 25 20% 50%;
    --input: 25 20% 50%;
    --ring: 25 49.7% 66.5%;
    --radius: 0.5rem;
  }
}

@layer base {

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
}
````

## File: app/layout.tsx
````typescript
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react"

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
  description: "A Tokenizer for Claude 3.5 Sonnet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
````

## File: app/page.tsx
````typescript
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
````

## File: components/ui/button.tsx
````typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
````

## File: components/ui/textarea.tsx
````typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
````

## File: components/tokenComponents.tsx
````typescript
import { useState, useEffect, useCallback } from 'react';
import { Textarea } from "@/components/ui/textarea";

// Debounce utility function
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

export const TokenizerInput = () => {
    const [text, setText] = useState('');
    const [stats, setStats] = useState<{ tokens: number | null; chars: number }>({ tokens: null, chars: 0 });
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async (text: string) => {
        if (!text.trim()) {
            setStats({ tokens: null, chars: 0 }); // Reset stats if text is empty
            setError(null); // Clear any previous errors
            return;
        }

        try {
            const response = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            setStats({
                tokens: data.input_tokens > 7 ? data.input_tokens - 7 : 0,
                chars: text.length,
            });
            setError(null); // Clear any previous errors
        } catch (err) {
            console.error("Token counting error:", err);
            setError("Failed to analyze text. Please try again.");
            setStats({ tokens: null, chars: text.length }); // Reset tokens but keep character count
        }
    };

    // Debounced version of handleAnalyze
    const debouncedHandleAnalyze = useCallback(debounce(handleAnalyze, 200), []);

    useEffect(() => {
        debouncedHandleAnalyze(text);
    }, [text, debouncedHandleAnalyze]);

    return (
        <>
            <div className="space-y-4 mb-4">
                <Textarea
                    placeholder="Enter some text"
                    rows={10}
                    className="font-mono"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <TokenMetrics tokens={stats.tokens ?? 0} chars={stats.chars} />
        </>
    );
};

interface TokenMetricsProps {
    tokens: number;
    chars: number;
}

export const TokenMetrics = ({ tokens, chars }: TokenMetricsProps) => (
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
````

## File: lib/utils.ts
````typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
````

## File: .eslintrc.json
````json
{
  "extends": "next",
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  }
}
````

## File: .gitignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
````

## File: components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
````

## File: next.config.mjs
````
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
````

## File: package.json
````json
{
  "name": "shadcn-theming-test",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.32.1",
    "@radix-ui/react-slot": "^1.1.0",
    "@tailwindcss/typography": "^0.5.15",
    "@vercel/analytics": "^1.4.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.462.0",
    "next": "14.2.16",
    "react": "^18",
    "react-dom": "^18",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.16",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
````

## File: postcss.config.mjs
````
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
````

## File: README.md
````markdown
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
````

## File: tailwind.config.ts
````typescript
import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate"), "@tailwindcss/typography"],
};
export default config;
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "baseUrl": ".", // root of the project
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
````
