import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Reception.ai — AI Receptionist That Never Misses a Call",
  description:
    "AI phone receptionist for solo professionals. Books appointments and collects deposits via Stripe and ElevenLabs.",
  openGraph: {
    title: "Reception.ai — Turn missed calls into booked appointments",
    description:
      "AI phone receptionist for solo professionals. Answers every call, books appointments, and collects deposits.",
    url: "/",
    siteName: "Reception.ai",
    images: [
      {
        url: "/og-image.jpg",
        width: 1024,
        height: 576,
        alt: "Reception.ai — AI phone receptionist for solo professionals",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reception.ai — Turn missed calls into booked appointments",
    description:
      "AI phone receptionist for solo professionals. Answers every call, books appointments, and collects deposits.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
