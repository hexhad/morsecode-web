import { asset, site } from "@/lib/site";

/** The official "Get it on Google Play" badge, linking to the store listing. */
export function PlayBadge({ height = 56, className = "" }: { height?: number; className?: string }) {
  return (
    <a href={site.play} target="_blank" rel="noopener" className={`inline-block transition-transform active:scale-[0.97] ${className}`}>
      {/* The badge PNG has built-in padding; the negative margin lines its edge up with other content. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/google-play-badge.png")}
        alt="Get it on Google Play"
        width={Math.round((height * 646) / 250)}
        height={height}
        style={{ height, width: "auto", margin: `-${Math.round(height * 0.12)}px` }}
      />
    </a>
  );
}
