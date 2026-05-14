import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/app-shell";
import { chat } from "@/lib/ai.functions";
import { Send, Sparkles, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  head: () => ({
    meta: [
      { title: "AI Chat · Helix" },
      { name: "description", content: "Brainstorm, research, and ask anything with Helix — your AI workplace assistant." },
    ],
  }),
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Explain prompt engineering in 3 bullet points",
  "Draft 5 questions for a product manager interview",
  "Compare Notion AI vs ChatGPT for team use",
  "Give me a 5-minute icebreaker for a team meeting",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fn = useServerFn(chat);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fn({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.content }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-6 py-10 flex flex-col h-[calc(100vh-4rem-1px)]">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-[0.25em] text-mint mb-2">04 · Conversation</div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">Chat with Helix</h1>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto bento-card p-5 md:p-7 space-y-5"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="h-12 w-12 rounded-2xl mint-glow flex items-center justify-center mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl mb-1">How can I help today?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Ask anything — research, drafting, planning, brainstorming.
              </p>
              <div className="grid sm:grid-cols-2 gap-2 max-w-xl w-full">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left text-sm px-4 py-3 rounded-xl border border-border bg-surface-2/60 hover:border-mint/50 hover:bg-surface-2 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <Bubble key={i} msg={m} />
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex h-7 w-7 rounded-full mint-glow items-center justify-center">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="inline-flex gap-1">
                <Dot /> <Dot delay={120} /> <Dot delay={240} />
              </span>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mt-4 flex items-end gap-2 bento-card p-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Message Helix…"
            rows={1}
            className="flex-1 bg-transparent px-3 py-2.5 text-sm focus:outline-none resize-none max-h-40"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="mint-glow h-10 w-10 rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <span
        className={`shrink-0 inline-flex h-8 w-8 rounded-full items-center justify-center ${
          isUser ? "bg-surface-2 border border-border" : "mint-glow"
        }`}
      >
        {isUser ? <UserIcon className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </span>
      <div
        className={`rounded-2xl px-4 py-3 text-sm max-w-[85%] ${
          isUser
            ? "bg-mint text-primary-foreground"
            : "bg-surface-2/70 border border-border"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
        ) : (
          <article className="prose-helix prose-sm">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
