import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getTenantFaqs, getTenantBusinessHours } from "@/lib/dashboard-data";
import { VoiceAgentForm } from "./VoiceAgentForm";

export default async function VoiceAgentPage() {
  const session = await getSessionUser();
  if (!session?.tenant) redirect("/login");
  const faqs = await getTenantFaqs(session.tenant.id);
  const hours = await getTenantBusinessHours(session.tenant.id);

  return (
    <VoiceAgentForm
      tenant={session.tenant}
      faqs={faqs}
      hours={hours}
    />
  );
}
