// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "0G Alignment Node — License Checker | EasyNode", template: "%s | EasyNode" },
  description:
    "Paste up to 10 EVM addresses and instantly check if they hold the 0G Alignment Node license (NFT) on Arbitrum. Buy and run your 0G node with EasyNode.",
  openGraph: {
    type: "website", url: SITE_URL, siteName: "EasyNode • 0G Alignment License Checker",
    title: "0G Alignment Node — License Checker | EasyNode",
    description: "Check if a wallet holds the 0G Alignment Node license (NFT) on Arbitrum.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "0G Alignment Node License Checker by EasyNode" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "0G Alignment License Checker | EasyNode",
    description: "Check if your wallet holds the 0G Alignment Node license (NFT) on Arbitrum.",
    images: [OG_IMAGE],
  },
  other: { easynode_marketplace: "https://app.easy-node.xyz/" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="topbar-inner">   
            <a
              href="https://app.easy-node.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="topbar-link"
              aria-label="Go to EasyNode marketplace"
            >
              <span className="logo">E</span>
              <span className="topbar-text">
                <strong>EasyNode</strong> <span className="dot">•</span> <span>One-Click Nodes for All</span>
              </span>
            </a>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
