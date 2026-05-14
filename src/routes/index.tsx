import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Mail, FileText, ListChecks, MessageSquare, ArrowUpRight, Zap, Shield, Brain } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Helix — AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Helix is an AI-powered workplace assistant that drafts emails, summarizes meetings, plans tasks, and answers questions in seconds.",
      },
      { property: "og:title", content: "Helix — AI Productivity Assistant" },
      {
        property: "og:description",
        content: "Draft emails, summarize meetings, plan tasks, and chat with AI — all in one bento workspace.",
      },
    ],
  }),
});

function Index() {
  return (
    <AppShell>
      <Hero />
      <Bento />
      <HowItWorks />
    </AppShell>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="grid-noise absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 pt-16 md:pt-24 pb-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-mint mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-mint-bright animate-pulse" />
            Now live · Powered by Lovable AI
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[0.95] tracking-tight">
            Your <span className="text-mint">AI co-worker</span> for
            <br />
            everyday workplace tasks.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Helix drafts emails, summarizes meetings, plans projects, and answers your questions — so
            you can spend less time on busywork and more on the work that matters.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="mint-glow inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium hover:opacity-95 transition"
            >
              Start chatting <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium hover:border-mint/60 transition"
            >
              Draft an email
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Email Generator",
    desc: "Tell Helix who, what & tone — get a polished, send-ready email in seconds.",
    span: "md:col-span-3 md:row-span-2",
    accent: true,
  },
  {
    to: "/summary",
    icon: FileText,
    title: "Meeting Summary",
    desc: "Paste a transcript, get TL;DR, decisions, and action items.",
    span: "md:col-span-3",
  },
  {
    to: "/planner",
    icon: ListChecks,
    title: "Task Planner",
    desc: "Turn a fuzzy goal into an ordered, prioritized task list.",
    span: "md:col-span-3",
  },
  {
    to: "/chat",
    icon: MessageSquare,
    title: "AI Chatbot",
    desc: "Free-form research, brainstorming, and Q&A with full conversation memory.",
    span: "md:col-span-6",
  },
] as const;

function Bento() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:auto-rows-[180px]">
        {TOOLS.map(({ to, icon: Icon, title, desc, span, accent }) => (
          <Link
            key={to}
            to={to}
            className={`bento-card group p-6 md:p-7 flex flex-col justify-between ${span} ${accent ? "ring-1 ring-mint/30" : ""}`}
          >
            <div className="flex items-start justify-between">
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                  accent ? "mint-glow" : "bg-surface-2 text-mint border border-border"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-mint group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground max-w-md">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

const PILLARS = [
  {
    icon: Zap,
    title: "Built for speed",
    desc: "Every tool is one click away from your workspace home.",
  },
  {
    icon: Brain,
    title: "Sharp prompt engineering",
    desc: "Each task uses a carefully tuned system prompt — not a generic chat call.",
  },
  {
    icon: Shield,
    title: "Used responsibly",
    desc: "No tracking, no data resold. The AI declines unsafe or unethical requests.",
  },
];

function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="grid md:grid-cols-3 gap-4">
        {PILLARS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bento-card p-6">
            <Icon className="h-5 w-5 text-mint mb-4" />
            <h4 className="font-display text-lg font-semibold mb-1.5">{title}</h4>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
