import Link from "next/link";
import { ArrowRight, HandTap, Lock, MoonStars, Waveform } from "@phosphor-icons/react/dist/ssr";
import { PlayBadge } from "@/components/PlayBadge";
import { Footer, Nav } from "@/components/Chrome";
import { MorseDemo } from "@/components/MorseDemo";
import { Reveal } from "@/components/Reveal";
import { ALPHABET } from "@/lib/morse";
import { asset } from "@/lib/site";

function Code({ code, h = 8 }: { code: string; h?: number }) {
  return (
    <span className="flex items-center gap-[4px]" aria-hidden="true">
      {[...code].map((c, i) => (
        <span key={i} className={`pill ${c === "." ? "dot" : "dash"}`} style={{ ["--h" as string]: `${h}px` }} />
      ))}
    </span>
  );
}

function Phone({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[36px] border border-[var(--line-strong)] bg-[var(--bg-raised)] p-[6px] shadow-[0_40px_120px_-40px_rgb(67_224_160/0.35)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(src)} alt={alt} width={640} height={1428} className="block h-auto w-full rounded-[30px]" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero: split, copy left, the real app right. */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: "radial-gradient(55% 60% at 78% 35%, color-mix(in srgb, var(--mint) 18%, transparent), transparent 70%)" }}
          />
          <div className="mx-auto grid min-h-[100dvh] max-w-6xl items-center gap-12 px-6 pb-16 pt-28 md:grid-cols-[1.15fr_0.85fr] md:pt-24">
            <Reveal>
              <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.045em] md:text-7xl">
                Feel every <span className="text-[var(--mint-text)]">dot</span> and dash.
              </h1>
              <p className="mt-6 max-w-[34ch] text-lg leading-relaxed text-[var(--muted)]">
                An Android app that turns any message into Morse code and plays it on your vibration motor.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <PlayBadge height={80} />
                <a href="#try" className="inline-flex h-14 items-center gap-2 rounded-full border border-[var(--line-strong)] px-6 font-medium transition-colors hover:border-[var(--mint)]">
                  Try it here <ArrowRight size={18} weight="bold" />
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="mx-auto w-full max-w-[320px]">
              <Phone src="/shots/type-dark.webp" alt="Morse Code with SOS HEXHAD typed: each letter shown as dots and dashes above the signal waveform" />
            </Reveal>
          </div>
        </section>

        {/* The demo: the web version of the app's main screen. */}
        <section id="try" className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] md:text-5xl">Type it. See it. Hear it.</h2>
            <p className="mt-4 max-w-[60ch] text-[var(--muted)]">
              The same encoder and timing as the app. Your phone vibrates along where the browser allows it; on Android it does, on iPhone you get the tone.
            </p>
          </Reveal>
          <Reveal delay={0.05} className="mt-10">
            <MorseDemo />
          </Reveal>
        </section>

        {/* Features: an asymmetric bento with exactly five cells. */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <h2 className="max-w-[18ch] text-3xl font-semibold tracking-[-0.035em] md:text-5xl">One job, done with care.</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-6">
            <Reveal className="md:col-span-4">
              <article className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--bg-raised)] p-8 md:min-h-[420px] md:flex-row md:gap-8">
                <div className="md:w-1/2">
                  <Waveform size={28} className="text-[var(--mint-text)]" />
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">A highlight that flows</h3>
                  <p className="mt-3 text-[var(--muted)]">
                    A mint blob moves from symbol to symbol in time with the motor. It stretches toward the next dash, then settles into it. Across a line it drops over like a bead of liquid.
                  </p>
                </div>
                <div className="mt-8 md:mt-0 md:w-1/2">
                  <Phone src="/shots/play-dark.webp" alt="Playing HELLO WORLD: a mint highlight flows over the current dash" className="mx-auto max-w-[220px] md:translate-y-10" />
                </div>
              </article>
            </Reveal>
            <Reveal className="md:col-span-2" delay={0.05}>
              <article className="flex h-full flex-col rounded-[28px] border border-[var(--line)] bg-[var(--bg-raised)] p-8">
                <h3 className="text-2xl font-semibold tracking-tight">Real ITU timing</h3>
                <p className="mt-3 text-[var(--muted)]">Measured in units, played as one waveform so it stays exact.</p>
                <dl className="mt-auto grid gap-4 pt-8 text-sm">
                  {[
                    ["Dot", "1 unit", "."],
                    ["Dash", "3 units", "-"],
                    ["Between letters", "3 units", ""],
                    ["Between words", "7 units", ""],
                  ].map(([k, v, c]) => (
                    <div key={k} className="flex items-center justify-between gap-4">
                      <dt className="flex items-center gap-3">{c ? <Code code={c} /> : <span className="h-px w-6 bg-[var(--line-strong)]" />}{k}</dt>
                      <dd className="font-mono text-[var(--muted)]">{v}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </Reveal>
            <Reveal className="md:col-span-2" delay={0.05}>
              <article className="flex h-full flex-col rounded-[28px] bg-[var(--mint)] p-8 text-[var(--on-mint)]">
                <HandTap size={28} />
                <h3 className="mt-5 text-2xl font-semibold tracking-tight">Tap a letter to feel it</h3>
                <p className="mt-3 opacity-80">Learning the code? Touch any letter and feel just that pattern, at the speed you picked.</p>
                <div className="mt-auto flex items-end gap-5 pt-8 font-mono text-sm font-semibold">
                  {["H", "E", "X"].map((ch) => (
                    <span key={ch} className="flex flex-col items-center gap-2">{ch}<Code code={ALPHABET.find(([k]) => k === ch)![1]} /></span>
                  ))}
                </div>
              </article>
            </Reveal>
            <Reveal className="md:col-span-2" delay={0.1}>
              <article className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--bg-raised)] p-8">
                <MoonStars size={28} className="text-[var(--mint-text)]" />
                <h3 className="mt-5 text-2xl font-semibold tracking-tight">Light, dark or yours</h3>
                <p className="mt-3 text-[var(--muted)]">Pick a theme behind the gear, or use your wallpaper colors on Android 12 and later. It switches with a soft crossfade.</p>
                <div className="relative mt-8 h-56">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset("/shots/appearance-light.webp")} alt="" className="absolute left-0 top-0 w-[58%] rounded-2xl border border-[var(--line)]" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset("/shots/appearance-dark.webp")} alt="The Appearance dialog with System, Light and Dark tiles" className="absolute right-0 top-8 w-[58%] rounded-2xl border border-[var(--line)]" />
                </div>
              </article>
            </Reveal>
            <Reveal className="md:col-span-2" delay={0.15}>
              <article className="flex h-full flex-col rounded-[28px] border border-[var(--line)] bg-[var(--bg-raised-2)] p-8">
                <Lock size={28} className="text-[var(--mint-text)]" />
                <h3 className="mt-5 text-2xl font-semibold tracking-tight">Offline and private</h3>
                <p className="mt-3 text-[var(--muted)]">No account, no ads, no analytics, no internet permission. The only thing it asks for is the vibration motor.</p>
                <Link href="/privacy/" className="mt-auto pt-8 text-sm font-medium text-[var(--mint-text)] hover:underline">Read the privacy policy</Link>
              </article>
            </Reveal>
          </div>
        </section>

        {/* Reference: a card grid, not a long list. */}
        <section id="alphabet" className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] md:text-5xl">The alphabet at a glance</h2>
          </Reveal>
          <Reveal delay={0.05} className="mt-10 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-9">
            {ALPHABET.map(([ch, code]) => (
              <div key={ch} className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg-raised)] px-2 py-4" aria-label={`${ch}: ${[...code].map((c) => (c === "." ? "dot" : "dash")).join(", ")}`}>
                <span className="font-mono text-lg font-semibold">{ch}</span>
                <span className="text-[var(--muted)]"><Code code={code} h={6} /></span>
              </div>
            ))}
          </Reveal>
        </section>

        {/* Closing: one action, no duplicate intent. */}
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--bg-raised)] px-8 py-14 md:px-14">
              <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(50% 80% at 100% 0%, color-mix(in srgb, var(--mint) 16%, transparent), transparent 70%)" }} />
              <h2 className="relative max-w-[20ch] text-3xl font-semibold tracking-[-0.035em] md:text-4xl">Feel your first message.</h2>
              <p className="relative mt-4 max-w-[52ch] text-[var(--muted)]">Free, works offline, no account and no ads. All it needs is your phone&apos;s vibration motor.</p>
              <PlayBadge height={80} className="relative mt-8" />
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
