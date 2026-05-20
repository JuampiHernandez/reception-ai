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
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clinicPath } from "@/lib/routes";

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
  tenantSlug,
}: {
  userName: string;
  businessName: string;
  tenantSlug: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-5">
        <Image src="/logo.svg" alt="" width={28} height={28} />
        <div>
          <span className="font-semibold text-slate-900">Reception.ai</span>
          <p className="text-[10px] text-slate-500">Practice dashboard</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-teal-50 text-teal-800"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Icon className={cn("h-4 w-4", pathname === href ? "text-teal-600" : "")} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-4">
        <Link
          href={clinicPath(tenantSlug)}
          target="_blank"
          className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2.5 text-sm font-medium text-teal-800 transition hover:bg-teal-100"
        >
          <ExternalLink className="h-4 w-4" />
          View patient site
        </Link>
        <div className="mb-3 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
          <span>Need help setting up your agent?</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-medium text-white">
            {userName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">{userName}</p>
            <p className="truncate text-xs text-slate-500">{businessName}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
