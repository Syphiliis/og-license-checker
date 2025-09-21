// app/fonts.ts
import localFont from "next/font/local";

export const regola = localFont({
  src: [{ path: "../public/fonts/RegolaPro-Variable.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-regola",
  display: "swap",
});

export const geistMono = localFont({
  src: [{ path: "../public/fonts/GeistMono-Variable.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-geist-mono",
  display: "swap",
});

