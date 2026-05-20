import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { clinicPath } from "@/lib/routes";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-deep-navy/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Reception.ai" width={32} height={32} />
          <span className="font-semibold text-white">Reception.ai</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#features" className="hover:text-white">
            Features
          </a>
          <a href="#pricing" className="hover:text-white">
            Pricing
          </a>
          <Link href={clinicPath("smilecare")} className="hover:text-white">
            Customer example
          </Link>
          <a href="#integrations" className="hover:text-white">
            Integrations
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Log in
            </Button>
          </Link>
          <a href="#pricing">
            <Button size="sm">Get started →</Button>
          </a>
        </div>
      </div>
    </header>
  );
}
