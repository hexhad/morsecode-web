/** Links and facts used across the site. Keep in sync with the app. */
export const site = {
  name: "Morse Code",
  url: "https://hexhad.github.io/morsecode-web",
  /** Matches applicationId in the app's build.gradle. */
  play: "https://play.google.com/store/apps/details?id=com.hexhad.morsecode",
  email: "hexhad@gmail.com",
  minAndroid: "Android 7.0",
};

/** Prefixes the GitHub Pages base path onto files in /public. */
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}

/** The rest of the HEXHAD family, as the other product sites list it. */
export const family = [
  { name: "NotchPal", href: "https://notch-pal-nine.vercel.app" },
  { name: "BarQR", href: "https://barqr-site.vercel.app" },
  { name: "Droid Transfer", href: "https://droid-transfer-web.vercel.app" },
  { name: "MirrorMe", href: "https://mirror-me-web.vercel.app" },
  { name: "Splice", href: "https://splice-web-one.vercel.app" },
  { name: "DiskKeeper", href: "https://disk-keeper-web.vercel.app" },
];
