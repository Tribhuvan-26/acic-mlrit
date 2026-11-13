import type { Metadata, Viewport } from "next";
import { Manrope, Inter, Caveat, Sora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/ui/BackToTop";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { NavbarProvider } from "@/context/NavbarContext";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://acicmlrit.in"),
  title: {
    default: "ACIC MLRIT | Atal Community Innovation Centre",
    template: "%s | ACIC MLRIT",
  },
  description:
    "Atal Community Innovation Centre at MLRIT, supported by Atal Innovation Mission, NITI Aayog. Empowering innovations for Bharath.",
  keywords: ["MLRIT", "ACIC", "Atal Community Innovation Centre", "Atal Innovation Mission", "incubation", "startups", "Hyderabad"],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "ACIC MLRIT | Atal Community Innovation Centre",
    description: "Empowering innovations for Bharath.",
    type: "website",
    url: "https://acicmlrit.in",
    siteName: "ACIC MLRIT",
    images: [{ url: "/og-icon.png", width: 1200, height: 1200, alt: "ACIC MLRIT" }],
  },
  twitter: {
    card: "summary",
    title: "ACIC MLRIT | Atal Community Innovation Centre",
    description: "Empowering innovations for Bharath.",
    images: ["/og-icon.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0B0F",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "ACIC MLRIT | Atal Community Innovation Centre",
  alternateName: "ACIC MLRIT",
  url: "https://acicmlrit.in",
  logo: "https://acicmlrit.in/og-icon.png",
  description:
    "Atal Community Innovation Centre at MLRIT, supported by Atal Innovation Mission, NITI Aayog. Empowering innovations for Bharath.",
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "Marri Laxman Reddy Institute of Technology and Management",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${caveat.variable} ${sora.variable} scroll-smooth`} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <NavbarProvider>
          <LoadingScreen />
          <Navbar />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
        </NavbarProvider>
      </body>
    </html>
  );
}
