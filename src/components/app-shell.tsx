import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, MessageSquare, Sparkles, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/email", label: "Email", icon: Mail },
  { to: "/summary", label: "Summary", icon: FileText },
  { to: "/planner", label: "Planner", icon: ListChecks },
  { to: "/chat", label: "Chat", icon: MessageSquare },
] as const;

export function AppShell({ children }: { children?: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/60 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl mint-glow">
              <Sparkles className="h-5 w-5" strokeWidth={2.5} />
              <span className="absolute inset-0 rounded-xl blur-lg opacity-50 mint-glow -z-10" />
            </span>
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold tracking-tight">Helix</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">AI Workplace OS</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 rounded-full border border-border bg-surface/60 p-1">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors",
                    active
                      ? "bg-mint text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View on GitHub →
          </a>
        </div>
      </header>

      <main className="flex-1">{children ?? <Outlet />}</main>

      <footer className="border-t border-border mt-20">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Helix · An AI Productivity Assistant</div>
          <div>Built with Lovable AI · Use responsibly.</div>
        </div>
      </footer>
    </div>
  );
}
