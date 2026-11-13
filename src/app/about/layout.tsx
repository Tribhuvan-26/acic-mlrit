import type { Metadata } from "next";

const description =
  "Atal Community Innovation Centre at MLRIT: vision, objectives, focus areas and makerspace, supported by Atal Innovation Mission, NITI Aayog.";

export const metadata: Metadata = {
  title: "About",
  description,
  openGraph: {
    title: "About | ACIC MLRIT",
    description,
    url: "https://acicmlrit.in/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
