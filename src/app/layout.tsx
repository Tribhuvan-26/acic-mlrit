import type { Metadata, Viewport } from "next";
import { Manrope, Inter, Caveat, Instrument_Serif } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap", preload: false });
const caveat = Caveat({ subsets: ["latin"], weight: ["500"], variable: "--font-caveat", display: "swap" });

const title = "ACIC-MLR Institute of Technology Foundation | Atal Community Innovation Centre";
const description =
  "Atal Community Innovation Centre at MLRIT, supported by Atal Innovation Mission, NITI Aayog. Empowering innovations for Bharath.";

export const metadata: Metadata = {
  metadataBase: new URL("https://acic-mlrit.vercel.app"),
  title,
  description,
  keywords: ["MLRIT", "ACIC", "Atal Community Innovation Centre", "Atal Innovation Mission", "incubation", "startups", "Hyderabad"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title,
    description,
    type: "website",
    url: "/",
    siteName: "ACIC-MLR Institute of Technology Foundation",
    locale: "en_IN",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "ACIC-MLR Institute of Technology Foundation" },
      { url: "/og-icon.png", width: 1200, height: 1200, alt: "ACIC logo" },
    ],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#e8521a" };

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ACIC-MLR Institute of Technology Foundation",
  alternateName: "Atal Community Innovation Centre, MLRIT",
  url: "https://acic-mlrit.vercel.app",
  logo: "https://acic-mlrit.vercel.app/android-chrome-512x512.png",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${caveat.variable} ${serif.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
