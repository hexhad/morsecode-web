import type { Metadata } from "next";
import { Doc } from "@/components/Doc";

export const metadata: Metadata = { title: "Licenses", description: "Open-source software and fonts used by Morse Code and this website." };

const rows = [
  ["Geist and Geist Mono", "Typefaces in the app and on this site", "Vercel, with basement.studio", "SIL Open Font License 1.1", "https://openfontlicense.org/open-font-license-official-text/"],
  ["Phosphor Icons", "Icons on this site", "Phosphor Icons", "MIT", "https://opensource.org/license/mit"],
  ["Material icon: settings", "Gear glyph in the app", "Google LLC", "Apache License 2.0", "https://www.apache.org/licenses/LICENSE-2.0"],
  ["AndroidX, Jetpack Compose, Kotlin", "App runtime", "The Android Open Source Project, JetBrains", "Apache License 2.0", "https://www.apache.org/licenses/LICENSE-2.0"],
  ["Next.js, React, Motion, Tailwind CSS", "This website", "Vercel, Meta, Motion, Tailwind Labs", "MIT", "https://opensource.org/license/mit"],
];

export default function Licenses() {
  return (
    <Doc title="Licenses">
      <p>Morse Code and this website are built on open-source work. The app ships the full license texts too: Settings, then Open-source licenses.</p>
      <div className="grid gap-3">
        {rows.map(([name, use, by, lic, href]) => (
          <div key={name} className="rounded-2xl border border-[var(--line)] bg-[var(--bg-raised)] p-5">
            <div className="font-semibold text-[var(--fg)]">{name}</div>
            <div className="mt-1 text-sm">{use}. Copyright {by}.</div>
            <a href={href} target="_blank" rel="noopener" className="mt-3 inline-block rounded-full bg-[var(--mint)] px-3 py-1 font-mono text-xs font-semibold !text-[var(--on-mint)]">{lic}</a>
          </div>
        ))}
      </div>
    </Doc>
  );
}
