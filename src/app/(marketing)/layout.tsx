import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reception.ai — AI Receptionist for Your Business",
  description:
    "Sell smarter with AI phone receptionists. Books appointments, answers FAQs, and collects deposits — built for solo professionals and small teams.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
