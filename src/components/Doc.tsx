import type { ReactNode } from "react";
import { Footer, Nav } from "@/components/Chrome";

/** A plain reading page (privacy, licenses) in the site chrome. */
export function Doc({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <h1 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">{title}</h1>
        {updated && <p className="mt-3 font-mono text-sm text-[var(--muted)]">Last updated {updated}</p>}
        <div className="doc mt-10 grid gap-5 leading-relaxed text-[var(--muted)] [&_a]:text-[var(--mint-text)] [&_a:hover]:underline [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-[var(--fg)] [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-[var(--fg)]">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
