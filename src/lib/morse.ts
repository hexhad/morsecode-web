/** Same table and ITU timing as the Android app (MorseCodec.kt). */
const TABLE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..",
  J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
  "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--", "/": "-..-.",
  "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-",
  "+": ".-.-.", "-": "-....-", '"': ".-..-.", "@": ".--.-.",
};

// Letters first, then digits (object keys would put the digits first).
export const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"].map((k) => [k, TABLE[k]] as const);

export type Letter = { char: string; code: string; startsWord: boolean };

/** Case-insensitive. Whitespace becomes a word break; unsupported characters are skipped. */
export function encode(text: string): Letter[] {
  const out: Letter[] = [];
  let pendingBreak = false;
  for (const raw of text) {
    if (/\s/.test(raw)) {
      pendingBreak = out.length > 0;
      continue;
    }
    const ch = raw.toUpperCase();
    const code = TABLE[ch];
    if (!code) continue;
    out.push({ char: ch, code, startsWord: pendingBreak });
    pendingBreak = false;
  }
  return out;
}

/** One "on" symbol with its start/end in ms and its flat index. */
export type OnStep = { start: number; end: number; letter: number; symbol: number; flat: number };

/** dot 1 unit, dash 3, gap inside a letter 1, between letters 3, between words 7. */
export function timeline(letters: Letter[], unitMs: number) {
  const on: OnStep[] = [];
  let t = 0;
  let flat = 0;
  letters.forEach((l, li) => {
    if (li > 0) t += (l.startsWord ? 7 : 3) * unitMs;
    [...l.code].forEach((s, si) => {
      if (si > 0) t += unitMs;
      const d = (s === "." ? 1 : 3) * unitMs;
      on.push({ start: t, end: t + d, letter: li, symbol: si, flat: flat++ });
      t += d;
    });
  });
  return { on, total: t };
}

export const SPEEDS = [
  { id: "slow", label: "Slow", unit: 160 },
  { id: "normal", label: "Normal", unit: 100 },
  { id: "fast", label: "Fast", unit: 70 },
] as const;
