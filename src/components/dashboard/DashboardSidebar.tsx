"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Phone,
  Calendar,
  CreditCard,
  Users,
  Mic,
  BarChart3,
  Plug,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/calls", label: "Calls", icon: Phone },
  { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/contacts", label: "Contacts", icon: Users },
  { href: "/dashboard/voice-agent", label: "Voice Agent", icon: Mic },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/integrations", label: "Integrations", icon: Plug },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({
  userName,
  businessName,
}: {
  userName: string;
  businessName: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col bg-deep-navy text-slate-300">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
        <Image src="/logo.svg" alt="" width={28} height={28} />
        <span className="font-semibold text-white">Reception.ai</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === href
                ? "bg-reception-blue text-white"
                : "hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-white/5 p-3 text-xs">
          <HelpCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Need help setting up your agent?</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-reception-blue text-sm font-medium text-white">
            {userName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{userName}</p>
            <p className="text-xs text-slate-400">{businessName}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
