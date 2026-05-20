import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      <DashboardSidebar
        userName={session.user.name}
        businessName={session.tenant?.name ?? "Business"}
        tenantSlug={session.tenant?.slug ?? "smilecare"}
      />
      <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
