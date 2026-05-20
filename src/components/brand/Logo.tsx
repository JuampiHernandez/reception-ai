import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
  href = "/",
}: {
  className?: string;
  showText?: boolean;
  href?: string;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <Image src="/logo.svg" alt="Reception.ai" width={36} height={36} />
      {showText && (
        <span className="text-lg font-semibold text-white">Reception.ai</span>
      )}
    </Link>
  );
}
