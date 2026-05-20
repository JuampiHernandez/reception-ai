import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#industries", label: "Industries" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#integrations", label: "Integrations" },
];

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-deep-navy/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="Reception.ai" width={32} height={32} />
          <span className="font-semibold text-white">Reception.ai</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="transition-colors hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Log in
            </Button>
          </Link>
          <a href="#pricing">
            <Button variant="gradient" size="sm">
              Get started →
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
