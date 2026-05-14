import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-3-flash-preview";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function callGateway(messages: ChatMessage[], model = DEFAULT_MODEL): Promise<string> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace → Usage.");
    const text = await res.text();
    console.error("AI gateway error", res.status, text);
    throw new Error("The AI service is temporarily unavailable.");
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

/* ---------------- Email generation ---------------- */
export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        recipient: z.string().min(1).max(200),
        purpose: z.string().min(1).max(2000),
        tone: z.enum(["professional", "friendly", "concise", "persuasive", "apologetic"]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const system =
      "You are an expert workplace communicator. Write polished, ready-to-send emails. " +
      "Output ONLY the email — start with 'Subject:' on the first line, then a blank line, then the body. " +
      "No markdown headings, no preamble, no explanations.";
    const user = `Recipient: ${data.recipient}\nTone: ${data.tone}\nPurpose / context:\n${data.purpose}`;
    const content = await callGateway([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    return { content };
  });

/* ---------------- Meeting summary ---------------- */
export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ transcript: z.string().min(20).max(50000) }).parse(d),
  )
  .handler(async ({ data }) => {
    const system =
      "You summarize meetings for busy professionals. Return clean Markdown with EXACTLY these sections: " +
      "## TL;DR (2 sentences), ## Key Decisions (bullet list), ## Action Items (bullet list — each item: **Owner** — task — *due*), " +
      "## Open Questions (bullet list). If a section has nothing, write '_None_'.";
    const content = await callGateway([
      { role: "system", content: system },
      { role: "user", content: `Meeting transcript / notes:\n\n${data.transcript}` },
    ]);
    return { content };
  });

/* ---------------- Task planner ---------------- */
export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        goal: z.string().min(3).max(1000),
        deadline: z.string().max(100).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const system =
      "You are a senior project planner. Break the user's goal into a concrete, ordered task list in Markdown. " +
      "Use a numbered list. For each task include: **Title** — one-line description — *Estimated effort* (e.g. 30m, 2h, 1d) — *Priority* (High/Med/Low). " +
      "End with a short '## Suggested next step' section pointing at the very first action.";
    const user = data.deadline ? `Goal: ${data.goal}\nDeadline: ${data.deadline}` : `Goal: ${data.goal}`;
    const content = await callGateway([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    return { content };
  });

/* ---------------- Chat ---------------- */
const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

export const chat = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ messages: z.array(ChatMessageSchema).min(1).max(40) }).parse(d),
  )
  .handler(async ({ data }) => {
    const system =
      "You are Helix, a friendly and capable AI productivity assistant. Be concise, structured, and use Markdown when helpful. " +
      "Decline unsafe or unethical requests politely.";
    const content = await callGateway([
      { role: "system", content: system },
      ...data.messages,
    ]);
    return { content };
  });
