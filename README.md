How Helix was built
Stack

Framework: TanStack Start v1 (React 19 + Vite 7, file-based routing in src/routes/)
Styling: Tailwind CSS v4 via src/styles.css (native @import, theme tokens in oklch)
Fonts: @fontsource/space-grotesk (display) + @fontsource/dm-sans (body) — your "Modern Tech" pairing
Icons: lucide-react
Backend: Lovable Cloud (Supabase under the hood) — wired but no tables needed yet
AI: Lovable AI Gateway, model google/gemini-3-flash-preview, called from TanStack server functions (createServerFn) — no API key in the client
Design system (src/styles.css)

Palette: Neon Mint — deep navy bg oklch(0.18 0.04 240), mint oklch(0.78 0.15 165), neon oklch(0.92 0.16 160), forest accent
Custom utilities: .bento-card (gradient surface + hover lift + mint glow), .mint-glow, .grid-noise (faint mint grid background), .prose-helix (markdown styling for AI output)
Radial mint/forest gradients fixed on body
Routes (src/routes/)

/ — Hero + bento grid (Email spans 3×2, Summary, Planner, Chat spans 6) + 3 pillars (Speed, Prompt engineering, Responsible use). SEO meta + OG tags set per-route.
/email — Email Generator (recipient, purpose, tone)
/summary — Meeting Summary (transcript → TL;DR / Decisions / Actions / Questions)
/planner — Task Planner (goal + optional deadline → ordered task list)
/chat — Conversational chatbot with full message history
__root.tsx — sets site title/meta, wraps in QueryClientProvider
Server functions (src/lib/ai.functions.ts)

generateEmail, summarizeMeeting, planTasks, chat — each with Zod input validation and a hand-tuned system prompt (the "prompt engineering" deliverable from the brief)
All call https://ai.gateway.lovable.dev/v1/chat/completions with LOVABLE_API_KEY (server-side only)
Handles 429 (rate limit) and 402 (credits) with friendly errors
Shared UI

src/components/app-shell.tsx — sticky blurred header, pill nav with active state, footer
src/components/tool-page.tsx — ToolPage, Panel, Spinner for consistent tool layouts
shadcn/ui primitives available in src/components/ui/
Project meta

Live preview: https://id-preview--e1f4b735-5a15-435e-9a15-c68958daeb89.lovable.app
Published: https://otter-mind-assist.lovable.app
Want me to add anything next — auth, saved history, export to PDF, or safety guardrails on the chatbot?

