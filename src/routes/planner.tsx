import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { ToolPage, Panel, Spinner } from "@/components/tool-page";
import { planTasks } from "@/lib/ai.functions";
import { ListChecks } from "lucide-react";

export const Route = createFileRoute("/planner")({
  component: PlannerPage,
  head: () => ({
    meta: [
      { title: "Task Planner · Helix" },
      { name: "description", content: "Turn any goal into a prioritized, ordered task plan with effort estimates." },
    ],
  }),
});

function PlannerPage() {
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const fn = useServerFn(planTasks);
  const m = useMutation({
    mutationFn: () => fn({ data: { goal, deadline: deadline || undefined } }),
  });

  return (
    <AppShell>
      <ToolPage
        eyebrow="03 · Planning"
        title="Task Planner"
        description="Describe a goal — Helix breaks it down into concrete, prioritized tasks with effort estimates and a clear next step."
      >
        <div className="grid lg:grid-cols-5 gap-5">
          <Panel className="lg:col-span-2">
            <div className="space-y-5">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2 block">Goal</span>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Launch a beta of our new pricing page by end of month."
                  rows={6}
                  className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint/50 resize-none"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2 block">
                  Deadline (optional)
                </span>
                <input
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="Friday next week"
                  className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint/50"
                />
              </label>
              <button
                onClick={() => m.mutate()}
                disabled={goal.length < 3 || m.isPending}
                className="mint-glow inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {m.isPending ? <Spinner /> : <ListChecks className="h-4 w-4" />}
                {m.isPending ? "Planning…" : "Build my plan"}
              </button>
              {m.error && <p className="text-sm text-destructive">{(m.error as Error).message}</p>}
            </div>
          </Panel>

          <Panel className="lg:col-span-3 min-h-[480px]">
            {!m.data && !m.isPending && (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-20">
                <ListChecks className="h-6 w-6 text-mint mb-3" />
                <p className="text-sm">Your task plan will appear here.</p>
              </div>
            )}
            {m.isPending && (
              <div className="h-full flex items-center justify-center text-muted-foreground gap-2 py-20">
                <Spinner /> Thinking through the steps…
              </div>
            )}
            {m.data && (
              <article className="prose-helix">
                <ReactMarkdown>{m.data.content}</ReactMarkdown>
              </article>
            )}
          </Panel>
        </div>
      </ToolPage>
    </AppShell>
  );
}
