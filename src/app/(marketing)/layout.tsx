import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reception.ai — AI Receptionist for Your Business",
  description:
    "Turn every call into a booked client. AI phone receptionist that answers calls 24/7, books appointments, and collects deposits through Stripe.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="marketing-shell">
      {children}
    </div>
  );
}
