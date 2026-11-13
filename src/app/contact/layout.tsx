import type { Metadata } from "next";

const description =
  "Get in touch with ACIC MLRIT to join a program, use the makerspace, or partner with us.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  openGraph: {
    title: "Contact | ACIC MLRIT",
    description,
    url: "https://acicmlrit.in/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
