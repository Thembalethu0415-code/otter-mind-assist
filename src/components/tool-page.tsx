import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToolPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 max-w-2xl">
        <div className="text-xs uppercase tracking-[0.25em] text-mint mb-3">{eyebrow}</div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold leading-[1.05] mb-3">
          {title}
        </h1>
        <p className="text-muted-foreground text-base">{description}</p>
      </div>
      {children}
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("bento-card p-6 md:p-7", className)}>{children}</div>;
}

export function Spinner() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}
