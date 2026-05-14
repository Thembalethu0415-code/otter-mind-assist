import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { ToolPage, Panel, Spinner } from "@/components/tool-page";
import { generateEmail } from "@/lib/ai.functions";
import { Copy, Check, Send } from "lucide-react";

export const Route = createFileRoute("/email")({
  component: EmailPage,
  head: () => ({
    meta: [
      { title: "Email Generator · Helix" },
      { name: "description", content: "Draft polished, send-ready workplace emails in seconds with AI." },
    ],
  }),
});

const TONES = ["professional", "friendly", "concise", "persuasive", "apologetic"] as const;

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("professional");
  const [copied, setCopied] = useState(false);

  const fn = useServerFn(generateEmail);
  const m = useMutation({
    mutationFn: () => fn({ data: { recipient, purpose, tone } }),
  });

  const onCopy = async () => {
    if (!m.data?.content) return;
    await navigator.clipboard.writeText(m.data.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AppShell>
      <ToolPage
        eyebrow="01 · Communication"
        title="Email Generator"
        description="Tell Helix who you're writing to, what you need to say, and the tone — get back a clean, ready-to-send draft."
      >
        <div className="grid lg:grid-cols-2 gap-5">
          <Panel>
            <div className="space-y-5">
              <Field label="Recipient">
                <input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="My manager Sarah"
                  className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint/50"
                />
              </Field>
              <Field label="Purpose / context">
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="I need to ask for a 2-day extension on the Q4 report because we're waiting on data from finance."
                  rows={6}
                  className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint/50 resize-none"
                />
              </Field>
              <Field label="Tone">
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition capitalize ${
                        tone === t
                          ? "mint-glow border-transparent"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              <button
                onClick={() => m.mutate()}
                disabled={!recipient || !purpose || m.isPending}
                className="mint-glow inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {m.isPending ? <Spinner /> : <Send className="h-4 w-4" />}
                {m.isPending ? "Drafting…" : "Generate email"}
              </button>

              {m.error && (
                <p className="text-sm text-destructive">{(m.error as Error).message}</p>
              )}
            </div>
          </Panel>

          <Panel className="min-h-[420px] relative">
            {!m.data && !m.isPending && (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-16">
                <div className="h-12 w-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-3">
                  <Send className="h-5 w-5 text-mint" />
                </div>
                <p className="text-sm">Your draft will appear here.</p>
              </div>
            )}
            {m.isPending && (
              <div className="h-full flex items-center justify-center text-muted-foreground gap-2 py-16">
                <Spinner /> Composing…
              </div>
            )}
            {m.data && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-mint">Draft</span>
                  <button
                    onClick={onCopy}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-surface-2/60 border border-border rounded-xl p-5">
                  {m.data.content}
                </pre>
              </div>
            )}
          </Panel>
        </div>
      </ToolPage>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2 block">{label}</span>
      {children}
    </label>
  );
}
