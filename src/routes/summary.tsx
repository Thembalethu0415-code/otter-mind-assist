import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { ToolPage, Panel, Spinner } from "@/components/tool-page";
import { summarizeMeeting } from "@/lib/ai.functions";
import { FileText, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/summary")({
  component: SummaryPage,
  head: () => ({
    meta: [
      { title: "Meeting Summary · Helix" },
      { name: "description", content: "Turn meeting transcripts into TL;DRs, decisions, and action items instantly." },
    ],
  }),
});

const SAMPLE = `Daniel: Welcome everyone. Quick standup — we need to ship the new onboarding flow by Friday.
Maria: Design is done, but I'm blocked on the welcome video copy.
Sam: I can write the copy by Wednesday.
Daniel: Great. Let's also decide — do we A/B test the pricing page?
Maria: I think yes, but only after launch week.
Daniel: Agreed. Sam will own the copy. Maria will set up the A/B test next week.`;

function SummaryPage() {
  const [transcript, setTranscript] = useState("");
  const [copied, setCopied] = useState(false);
  const fn = useServerFn(summarizeMeeting);
  const m = useMutation({ mutationFn: () => fn({ data: { transcript } }) });

  const onCopy = async () => {
    if (!m.data?.content) return;
    await navigator.clipboard.writeText(m.data.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AppShell>
      <ToolPage
        eyebrow="02 · Knowledge"
        title="Meeting Summary"
        description="Paste a transcript or your raw notes — Helix returns a structured summary with decisions and owner-tagged action items."
      >
        <div className="grid lg:grid-cols-5 gap-5">
          <Panel className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Transcript / notes</span>
                <button
                  onClick={() => setTranscript(SAMPLE)}
                  className="text-xs text-mint hover:underline"
                >
                  Use sample
                </button>
              </div>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste meeting notes here…"
                rows={16}
                className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint/50 resize-none font-mono"
              />
              <button
                onClick={() => m.mutate()}
                disabled={transcript.length < 20 || m.isPending}
                className="mint-glow inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {m.isPending ? <Spinner /> : <FileText className="h-4 w-4" />}
                {m.isPending ? "Summarizing…" : "Summarize"}
              </button>
              {m.error && <p className="text-sm text-destructive">{(m.error as Error).message}</p>}
            </div>
          </Panel>

          <Panel className="lg:col-span-3 min-h-[480px]">
            {!m.data && !m.isPending && (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-20">
                <FileText className="h-6 w-6 text-mint mb-3" />
                <p className="text-sm">Your structured summary will appear here.</p>
              </div>
            )}
            {m.isPending && (
              <div className="h-full flex items-center justify-center text-muted-foreground gap-2 py-20">
                <Spinner /> Reading transcript…
              </div>
            )}
            {m.data && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-mint">Summary</span>
                  <button
                    onClick={onCopy}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <article className="prose-helix">
                  <ReactMarkdown>{m.data.content}</ReactMarkdown>
                </article>
              </div>
            )}
          </Panel>
        </div>
      </ToolPage>
    </AppShell>
  );
}
