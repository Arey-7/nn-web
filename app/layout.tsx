import "./globals.css";
import type { Metadata } from "next";
import { Fraunces, Archivo } from "next/font/google";
import Script from "next/script";
import { Providers, THEME_SCRIPT } from "./providers";
import Navbar from "./sections/navbar";
import Footer from "./sections/footer";
import ThemeButton from "./components/theme-button";
import SmoothScroll from "./lib/smooth-scroll";
import Cursor from "./components/cursor";
import Preloader from "./components/preloader";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Reef Rooster Communications",
    template: "%s — Reef Rooster",
  },
  description:
    "We link brands and causes to the people. An advertising agency in Nairobi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The font variables must live on <html>: Tailwind resolves --font-display
    // against :root, so declaring them any lower leaves that token empty and
    // display type silently falls back to the body sans.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${archivo.variable}`}
    >
      <head>
        <link rel="icon" href="/rr-mark.svg" type="image/svg+xml" />
        <Script id="theme" strategy="beforeInteractive">
          {THEME_SCRIPT}
        </Script>
      </head>
      <body className="grain font-sans bg-paper text-ink">
        <Providers>
          <Preloader />
          <SmoothScroll />
          <Cursor />
          <Navbar />
          <main id="main">{children}</main>
          <ThemeButton />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
