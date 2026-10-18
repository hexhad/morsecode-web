import Link from "next/link";
import { GooglePlayLogo } from "@phosphor-icons/react/dist/ssr";
import { MadeByHexhad } from "@/components/Hexhad";
import { asset, family, site } from "@/lib/site";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-3 z-40 flex justify-center px-4">
      <div className="flex h-14 w-full max-w-5xl items-center justify-between rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] pl-3 pr-2 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/app-icon.png")} alt="" width={30} height={30} className="rounded-[8px]" />
          Morse Code
        </Link>
        <nav className="flex items-center gap-1 text-sm text-[var(--muted)]" aria-label="Main">
          <Link href="/#try" className="hidden rounded-full px-3 py-2 transition-colors hover:text-[var(--fg)] sm:block">Try it</Link>
          <Link href="/#features" className="hidden rounded-full px-3 py-2 transition-colors hover:text-[var(--fg)] sm:block">Features</Link>
          <Link href="/#alphabet" className="hidden rounded-full px-3 py-2 transition-colors hover:text-[var(--fg)] md:block">Alphabet</Link>
          <a href={site.play} target="_blank" rel="noopener" className="ml-1 inline-flex h-10 items-center gap-2 rounded-full bg-[var(--fg)] px-4 font-medium text-[var(--bg)] transition-transform active:scale-[0.97]">
            <GooglePlayLogo size={18} weight="fill" />
            Google Play
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="grid content-start gap-4">
          <div className="flex items-center gap-3 font-semibold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/app-icon.png")} alt="" width={36} height={36} className="rounded-[10px]" />
            Morse Code
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)]">
            Type a message, see it as Morse, feel it as vibration. Free on Google Play.
          </p>
          <MadeByHexhad className="text-sm text-[var(--muted)]" />
        </div>
        <div className="grid content-start gap-2 text-sm">
          <span className="mb-1 text-[var(--faint)]">The app</span>
          <a className="text-[var(--muted)] hover:text-[var(--fg)]" href={site.play} target="_blank" rel="noopener">Google Play</a>
          <Link className="text-[var(--muted)] hover:text-[var(--fg)]" href="/privacy/">Privacy policy</Link>
          <Link className="text-[var(--muted)] hover:text-[var(--fg)]" href="/licenses/">Licenses</Link>
          <a className="text-[var(--muted)] hover:text-[var(--fg)]" href={`mailto:${site.email}`}>Contact</a>
        </div>
        <div className="grid content-start gap-2 text-sm">
          <span className="mb-1 text-[var(--faint)]">More from HEXHAD</span>
          {family.map((f) => (
            <a key={f.name} className="text-[var(--muted)] hover:text-[var(--fg)]" href={f.href} target="_blank" rel="noopener">{f.name}</a>
          ))}
        </div>
      </div>
      <p className="pb-10 text-center text-xs text-[var(--faint)]">&copy; 2026 HEXHAD. Made in Sri Lanka.</p>
    </footer>
  );
}
