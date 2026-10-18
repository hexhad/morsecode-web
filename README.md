# morsecode-web

The website for **Morse Code**, an Android app by [HEXHAD](https://hexhad.github.io) that turns any message into Morse code and plays it as vibration.

Live: **https://hexhad.github.io/morsecode-web/** · Privacy policy: https://hexhad.github.io/morsecode-web/privacy/

Next.js (App Router, static export) + Tailwind CSS 4 + Motion, in the HEXHAD family style: Geist type, Graphite neutrals, one accent (Cell Mint `#43E0A0`), pills for anything pressable and 28px panels. Dark by default, light follows the system.

- `src/components/MorseDemo.tsx`: the in-browser demo. Same encoder and ITU timing as the app; plays a tone with Web Audio and vibrates where the browser allows it. The liquid highlight is the app's algorithm ported to the DOM, fused by an SVG goo filter, driven by one clock with no React renders per frame. Honors `prefers-reduced-motion`.
- `src/app/privacy`: the privacy policy used by the Play listing.
- `src/app/licenses`: fonts and libraries.
- `src/lib/site.ts`: links (the Play listing URL uses the app's `applicationId`, `com.hexhad.morsecode`).

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in out/
```

## Deploy

Pushing to `main` runs `.github/workflows/pages.yml`, which builds with `PAGES_BASE_PATH=/morsecode-web` and publishes `out/` to GitHub Pages. The site also deploys on Vercel with the defaults (no base path).

---

<p align="center">
  <a href="https://hexhad.github.io"><img src=".github/hexhad.svg" width="40" height="40" alt="HEXHAD"></a>
  <br>
  <sub>Built by <a href="https://hexhad.github.io"><b>HEXHAD</b></a> · Made in Sri Lanka</sub>
</p>
