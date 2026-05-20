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
    <div className="flex min-h-screen">
      <DashboardSidebar
        userName={session.user.name}
        businessName={session.tenant?.name ?? "Business"}
      />
      <main className="flex-1 overflow-auto bg-cloud-white p-8">{children}</main>
    </div>
  );
}
