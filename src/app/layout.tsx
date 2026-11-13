import type { Metadata, Viewport } from "next";
import { Manrope, Inter, Caveat } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], weight: ["500"], variable: "--font-caveat", display: "swap" });

const title = "ACIC MLRIT | Atal Community Innovation Centre";
const description =
  "Atal Community Innovation Centre at MLRIT, supported by Atal Innovation Mission, NITI Aayog. Empowering innovations for Bharath.";

export const metadata: Metadata = {
  metadataBase: new URL("https://acic-mlrit.vercel.app"),
  title,
  description,
  keywords: ["MLRIT", "ACIC", "Atal Community Innovation Centre", "Atal Innovation Mission", "incubation", "startups", "Hyderabad"],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: { title, description, type: "website", url: "/", siteName: "ACIC MLRIT" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#e8521a" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
