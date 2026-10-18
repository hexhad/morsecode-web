"use client";

import { Play, Stop, SpeakerHigh, SpeakerSlash, Vibrate } from "@phosphor-icons/react";
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { encode, SPEEDS, timeline, type OnStep } from "@/lib/morse";

const MAX = 60;
const BLOB = "absolute left-0 top-0 bg-[var(--mint-text)] opacity-0 will-change-transform";
const PILL = 10; // px, pill height
const PAD = 3; // the blob sits a little proud of the pill it covers

type Box = { l: number; t: number; r: number; b: number };

/**
 * Type a message, see it as Morse, hear it and (on phones that allow it) feel it.
 *
 * The liquid highlight is the same algorithm as the Android app (LiquidIndicator.kt): one
 * clock drives sound, vibration and visuals; during the gap before a symbol the blob travels
 * there and lands as that symbol starts. In a row the leading edge overshoots and the trailing
 * edge follows late; across a wrap a droplet arcs over. An SVG goo filter (blur + alpha
 * threshold) fuses the shapes. Every frame writes straight to the DOM: no React renders.
 */
export function MorseDemo() {
  const [text, setText] = useState("SOS HEXHAD");
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]["id"]>("normal");
  const [sound, setSound] = useState(true);
  const [buzz, setBuzz] = useState(true);
  const canVibrate = useSyncExternalStore(
    noopSubscribe,
    () => "vibrate" in navigator,
    () => false,
  );
  const [playing, setPlaying] = useState(false);

  const letters = useMemo(() => encode(text), [text]);
  const unit = SPEEDS.find((s) => s.id === speed)!.unit;
  const { on, total } = useMemo(() => timeline(letters, unit), [letters, unit]);

  const filterId = useId().replace(/:/g, "");
  const stage = useRef<HTMLDivElement>(null);
  const blobA = useRef<HTMLDivElement>(null);
  const blobB = useRef<HTMLDivElement>(null);
  const blobC = useRef<HTMLDivElement>(null);
  const played = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const boxes = useRef<Box[]>([]);
  const raf = useRef(0);
  const audio = useRef<AudioContext | null>(null);
  const gain = useRef<GainNode | null>(null);
  const reduce = useRef(false);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    reduce.current = mq.matches;
    const onChange = () => (reduce.current = mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /** Pill positions relative to the stage. Measured on play and on resize, never per frame. */
  const measure = useCallback(() => {
    const el = stage.current;
    if (!el) return;
    const o = el.getBoundingClientRect();
    const pills = el.querySelectorAll<HTMLElement>("[data-flat]");
    const out: Box[] = [];
    pills.forEach((p) => {
      const r = p.getBoundingClientRect();
      out[Number(p.dataset.flat)] = { l: r.left - o.left - PAD, t: r.top - o.top - PAD, r: r.right - o.left + PAD, b: r.bottom - o.top + PAD };
    });
    boxes.current = out;
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (stage.current) ro.observe(stage.current);
    return () => ro.disconnect();
  }, [measure, letters]);

  const setActiveLetter = useRef(-1);
  const markLetter = useCallback((i: number) => {
    if (setActiveLetter.current === i || !stage.current) return;
    const cells = stage.current.querySelectorAll<HTMLElement>("[data-letter]");
    if (setActiveLetter.current >= 0) cells[setActiveLetter.current]?.setAttribute("data-active", "false");
    if (i >= 0) cells[i]?.setAttribute("data-active", "true");
    setActiveLetter.current = i;
  }, []);

  const drawFrame = useCallback(
    (t: number, steps: OnStep[], cursor: { i: number }) => {
      const B = boxes.current;
      const n = steps.length;
      if (!n) return;
      while (cursor.i < n - 1 && t >= steps[cursor.i + 1].start) cursor.i++;
      const i = cursor.i;
      const cur = steps[i];
      hide(blobB.current);
      hide(blobC.current);

      if (t <= cur.end || i === n - 1) {
        const a = B[cur.flat];
        if (a && t <= cur.end) place(blobA.current, a.l, a.t, a.r, a.b);
        else hide(blobA.current);
        markLetter(t <= cur.end ? cur.letter : -1);
        return;
      }
      const next = steps[i + 1];
      markLetter(next.letter === cur.letter ? cur.letter : -1);
      const a = B[cur.flat];
      const b = B[next.flat];
      if (!a || !b) return;
      const f = Math.min(1, Math.max(0, (t - cur.end) / (next.start - cur.end)));
      const h = a.b - a.t;

      if (reduce.current) {
        if (f < 0.5) place(blobA.current, a.l, a.t, a.r, a.b, 1 - f * 2);
        else place(blobA.current, b.l, b.t, b.r, b.b, f * 2 - 1);
        return;
      }
      const sameRow = Math.abs(a.t - b.t) < 1;
      if (sameRow && b.l >= a.l && b.l - a.r < 72) {
        const lead = backOut(Math.min(1, f / 0.7));
        const trail = easeInOut(clamp((f - 0.3) / 0.7));
        const right = lerp(a.r, b.r, lead);
        const left = lerp(a.l, b.l, trail);
        const span = Math.max(right - left, h);
        const stretch = clamp((span - Math.max(a.r - a.l, b.r - b.l)) / (Math.abs(b.r - a.l) + 1));
        const thin = h * (1 - 0.35 * stretch);
        const cy = (a.t + a.b) / 2;
        place(blobA.current, left, cy - thin / 2, Math.max(right, left + thin), cy + thin / 2);
      } else {
        const acx = (a.l + a.r) / 2, acy = (a.t + a.b) / 2;
        const bcx = (b.l + b.r) / 2, bcy = (b.t + b.b) / 2;
        const shrink = easeInOut(Math.min(1, f / 0.45));
        const rw = lerp(a.r - a.l, 0, shrink), rh = lerp(h, 0, shrink);
        place(blobA.current, acx - rw / 2, acy - rh / 2, acx + rw / 2, acy + rh / 2);
        const travel = easeInOut(clamp((f - 0.15) / 0.7));
        if (f > 0.1 && f < 0.92) {
          const r = h * 0.42 * (1 - 0.25 * Math.sin(travel * Math.PI));
          const lift = 18 + Math.abs(bcy - acy) * 0.15;
          const x = lerp(acx, bcx, travel);
          const y = lerp(acy, bcy, travel) - lift * 4 * travel * (1 - travel);
          place(blobB.current, x - r, y - r, x + r, y + r);
        }
        const grow = backOut(clamp((f - 0.6) / 0.4));
        if (grow > 0) {
          const gw = Math.max(0, lerp(0, b.r - b.l, grow)), gh = Math.max(0, lerp(0, b.b - b.t, Math.min(grow, 1)));
          place(blobC.current, bcx - gw / 2, bcy - gh / 2, bcx + gw / 2, bcy + gh / 2);
        }
      }
    },
    [markLetter],
  );

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    gain.current?.gain.cancelScheduledValues(0);
    gain.current?.gain.setValueAtTime(0, audio.current?.currentTime ?? 0);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(0);
    hide(blobA.current);
    hide(blobB.current);
    hide(blobC.current);
    markLetter(-1);
    if (played.current) played.current.style.clipPath = "inset(0 100% 0 0)";
    if (head.current) head.current.style.opacity = "0";
    setPlaying(false);
  }, [markLetter]);

  const start = useCallback(() => {
    if (!on.length) return;
    measure();
    const lead = 0.06; // s: schedule audio slightly ahead so all three start together
    if (sound) {
      audio.current ??= new AudioContext();
      const ctx = audio.current;
      void ctx.resume();
      if (!gain.current) {
        const osc = ctx.createOscillator();
        osc.frequency.value = 620;
        gain.current = ctx.createGain();
        gain.current.gain.value = 0;
        osc.connect(gain.current).connect(ctx.destination);
        osc.start();
      }
      const g = gain.current.gain;
      const t0 = ctx.currentTime + lead;
      g.cancelScheduledValues(0);
      g.setValueAtTime(0, ctx.currentTime);
      for (const s of on) {
        // 5 ms ramps: no clicks, no smear
        g.setValueAtTime(0, t0 + s.start / 1000);
        g.linearRampToValueAtTime(0.18, t0 + s.start / 1000 + 0.005);
        g.setValueAtTime(0.18, t0 + s.end / 1000 - 0.005);
        g.linearRampToValueAtTime(0, t0 + s.end / 1000);
      }
    }
    const startAt = performance.now() + lead * 1000;
    if (buzz && canVibrate) {
      const pattern: number[] = [];
      let last = 0;
      for (const s of on) {
        pattern.push(s.start - last, s.end - s.start);
        last = s.end;
      }
      pattern[0] = Math.max(1, pattern[0]);
      setTimeout(() => navigator.vibrate(pattern), lead * 1000);
    }
    setPlaying(true);
    const cursor = { i: 0 };
    const tick = (now: number) => {
      const t = now - startAt;
      if (t >= total + 40) return stop();
      if (t >= 0) {
        drawFrame(t, on, cursor);
        const p = Math.min(1, t / total);
        if (played.current) played.current.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
        if (head.current) {
          head.current.style.opacity = "1";
          head.current.style.left = `${p * 100}%`;
        }
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [on, total, sound, buzz, canVibrate, measure, drawFrame, stop]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  let flat = 0;
  return (
    <div className="rounded-[28px] border border-[var(--line)] bg-[var(--bg-raised)] p-5 sm:p-8">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
        </filter>
      </svg>

      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
        <div className="grid gap-2">
          <label htmlFor="morse-input" className="text-sm font-medium text-[var(--muted)]">
            Message
          </label>
          <input
            id="morse-input"
            value={text}
            maxLength={MAX}
            onChange={(e) => {
              // A new message stops playback, like the app.
              if (playing) stop();
              setText(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && (playing ? stop() : start())}
            className="h-14 w-full rounded-full border border-[var(--line-strong)] bg-[var(--bg)] px-6 text-lg tracking-wide text-[var(--fg)] outline-none transition-colors focus:border-[var(--mint)]"
            placeholder="Try SOS"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="grid gap-2">
          <span className="text-sm font-medium text-[var(--muted)]" id="speed-label">
            Speed
          </span>
          <div role="radiogroup" aria-labelledby="speed-label" className="flex h-14 rounded-full bg-[var(--bg-raised-2)] p-1">
            {SPEEDS.map((s) => (
              <button
                key={s.id}
                role="radio"
                aria-checked={speed === s.id}
                onClick={() => {
                  if (playing) stop();
                  setSpeed(s.id);
                }}
                className={`rounded-full px-5 text-sm font-medium transition-colors duration-150 ${
                  speed === s.id ? "bg-[var(--bg)] text-[var(--fg)] shadow-sm" : "text-[var(--muted)] hover:text-[var(--fg)]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 min-h-[96px] rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-5">
        {letters.length === 0 ? (
          <p className="grid min-h-[56px] place-items-center text-sm text-[var(--muted)]">Your Morse code appears here.</p>
        ) : (
          <div ref={stage} className="relative">
            <div className="flex flex-wrap gap-x-3 gap-y-5">
              {letters.map((l, li) => (
                <div
                  key={li}
                  data-letter={li}
                  data-active="false"
                  className={`flex flex-col items-center gap-2 ${l.startsWord ? "ml-6" : ""}`}
                  aria-label={`${l.char}: ${[...l.code].map((c) => (c === "." ? "dot" : "dash")).join(", ")}`}
                >
                  <span className="letter-label font-mono text-sm font-semibold">{l.char}</span>
                  <span className="flex items-center gap-[5px] text-[var(--fg)]" aria-hidden="true">
                    {[...l.code].map((c, ci) => (
                      <span key={ci} data-flat={flat++} className={`pill ${c === "." ? "dot" : "dash"}`} style={{ ["--h" as string]: `${PILL}px` }} />
                    ))}
                  </span>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0" style={{ filter: `url(#${filterId})` }} aria-hidden="true">
              <div ref={blobA} className={BLOB} />
              <div ref={blobB} className={BLOB} />
              <div ref={blobC} className={BLOB} />
            </div>
          </div>
        )}
      </div>

      <div className="mt-5" aria-hidden="true">
        <div className="mb-2 flex justify-between font-mono text-xs text-[var(--muted)]">
          <span>Signal</span>
          <span>{(total / 1000).toFixed(1)} s</span>
        </div>
        <Waveform on={on} total={total} played={played} head={head} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={playing ? stop : start}
          disabled={!letters.length}
          className="inline-flex h-14 items-center gap-3 rounded-full bg-[var(--mint)] px-8 text-base font-semibold text-[var(--on-mint)] transition-transform duration-150 active:scale-[0.97] disabled:opacity-40"
        >
          {playing ? <Stop size={20} weight="fill" /> : <Play size={20} weight="fill" />}
          {playing ? "Stop" : "Play"}
        </button>
        <Toggle on={sound} onChange={setSound} label={sound ? "Sound on" : "Sound off"} icon={sound ? <SpeakerHigh size={18} /> : <SpeakerSlash size={18} />} />
        {canVibrate && <Toggle on={buzz} onChange={setBuzz} label={buzz ? "Vibration on" : "Vibration off"} icon={<Vibrate size={18} />} />}
      </div>
    </div>
  );
}

function Toggle({ on, onChange, label, icon }: { on: boolean; onChange: (v: boolean) => void; label: string; icon: React.ReactNode }) {
  return (
    <button
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
        on ? "border-[var(--mint-text)] text-[var(--mint-text)]" : "border-[var(--line-strong)] text-[var(--muted)]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/** Bars sized by real durations; a mint copy is revealed by clip-path as the clock runs. */
function Waveform({ on, total, played, head }: { on: OnStep[]; total: number; played: React.RefObject<HTMLDivElement | null>; head: React.RefObject<HTMLDivElement | null> }) {
  const bars = on.map((s) => (
    <span
      key={s.flat}
      className="absolute top-1/2 h-[55%] -translate-y-1/2 rounded-full bg-current"
      style={{ left: `${(s.start / total) * 100}%`, width: `max(2px, ${((s.end - s.start) / total) * 100}%)` }}
    />
  ));
  return (
    <div className="relative h-9">
      <div className="absolute inset-0 text-[color-mix(in_srgb,var(--muted)_40%,transparent)]">{bars}</div>
      <div ref={played} className="absolute inset-0 text-[var(--mint-text)]" style={{ clipPath: "inset(0 100% 0 0)" }}>
        {bars}
      </div>
      <div ref={head} className="absolute top-0 h-full w-[2px] -translate-x-1/2 rounded-full bg-[var(--mint-text)] opacity-0" />
    </div>
  );
}

const noopSubscribe = () => () => {};

function hide(el: HTMLDivElement | null) {
  if (el) el.style.opacity = "0";
}
function place(el: HTMLDivElement | null, l: number, t: number, r: number, b: number, alpha = 1) {
  if (!el) return;
  const w = r - l;
  const h = b - t;
  if (w <= 0.5 || h <= 0.5 || alpha <= 0) return hide(el);
  el.style.opacity = String(Math.min(1, alpha));
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;
  el.style.borderRadius = `${Math.min(w, h) / 2}px`;
  el.style.transform = `translate3d(${l}px, ${t}px, 0)`;
}

const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const backOut = (x: number) => {
  const c1 = 1.2, c3 = c1 + 1, p = x - 1;
  return 1 + c3 * p * p * p + c1 * p * p;
};
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
