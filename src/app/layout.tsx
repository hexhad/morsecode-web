import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  // Origin only: Next adds the base path to metadata image URLs itself.
  metadataBase: new URL(new URL(site.url).origin),
  title: { default: "Morse Code: type it, see it, feel it", template: "%s · Morse Code" },
  description:
    "An Android app that turns any message into Morse code and plays it as vibration, with a liquid highlight that follows every dot and dash. Offline, no ads. By HEXHAD.",
  authors: [{ name: "HEXHAD", url: "https://hexhad.github.io" }],
  creator: "HEXHAD",
  publisher: "HEXHAD",
  openGraph: {
    title: "Morse Code",
    description: "Type a message. See it as Morse. Feel it as vibration.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0d" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
