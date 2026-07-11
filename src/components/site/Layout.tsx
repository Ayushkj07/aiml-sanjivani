import type { ReactNode } from "react";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-muted-foreground max-w-2xl">{subtitle}</p>}
      </div>
    </div>
  );
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-7xl px-4 py-10 ${className}`}>{children}</section>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">{children}</div>
  );
}

export function Loading() {
  return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
}
