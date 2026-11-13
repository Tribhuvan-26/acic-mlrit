import type { Metadata } from "next";

const description =
  "ACIC-MLRIT programs: Pre-Incubation, Incubation, Grassroots Innovation Program, Innovation Yatra, Community Innovator Fellowship and Liftoff Accelerator.";

export const metadata: Metadata = {
  title: "Programs",
  description,
  openGraph: {
    title: "Programs | ACIC MLRIT",
    description,
    url: "https://acicmlrit.in/programs",
  },
};

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
