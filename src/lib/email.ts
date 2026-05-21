type PaymentLinkEmailParams = {
  to: string;
  patientName?: string;
  clinicName: string;
  paymentPageUrl: string;
  depositDisplay: string;
  serviceName?: string;
  slotDisplay?: string;
};

export async function sendPaymentLinkEmail(
  params: PaymentLinkEmailParams
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, reason: "not_configured" };
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "SmileCare <onboarding@resend.dev>";
  const greeting = params.patientName ? `Hi ${params.patientName},` : "Hi,";
  const details = [params.serviceName, params.slotDisplay].filter(Boolean).join(" · ");

  const html = `
    <p>${greeting}</p>
    <p>Your appointment at <strong>${params.clinicName}</strong> is held. Pay your <strong>${params.depositDisplay}</strong> deposit to confirm:</p>
    ${details ? `<p>${details}</p>` : ""}
    <p><a href="${params.paymentPageUrl}" style="display:inline-block;padding:12px 20px;background:#0d9488;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Pay deposit</a></p>
    <p style="color:#64748b;font-size:14px;">Or copy this link: ${params.paymentPageUrl}</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: `Pay your deposit — ${params.clinicName}`,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Resend error:", res.status, body);
    return { sent: false, reason: "send_failed" };
  }

  return { sent: true };
}

type SubscriptionReceiptEmailParams = {
  to: string;
  planName: string;
  priceDisplay: string;
  businessName?: string;
  loginUrl: string;
  tempPassword?: string;
  isNewAccount: boolean;
};

export async function sendSubscriptionReceiptEmail(
  params: SubscriptionReceiptEmailParams
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, reason: "not_configured" };
  }

  const from =
    process.env.RESEND_FROM_EMAIL ?? "Reception.ai <onboarding@resend.dev>";
  const greeting = params.businessName
    ? `Hi ${params.businessName},`
    : "Hi there,";

  const accountBlock = params.isNewAccount && params.tempPassword
    ? `
    <p>Your account is ready. Log in to set up your AI receptionist:</p>
    <ul style="padding-left:20px;">
      <li><strong>Dashboard:</strong> <a href="${params.loginUrl}">${params.loginUrl}</a></li>
      <li><strong>Email:</strong> ${params.to}</li>
      <li><strong>Temporary password:</strong> ${params.tempPassword}</li>
    </ul>
    <p style="color:#64748b;font-size:14px;">Please change your password after your first login.</p>
  `
    : `
    <p>Your subscription is active on your existing account. Log in to your dashboard:</p>
    <p><a href="${params.loginUrl}" style="display:inline-block;padding:12px 20px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Open dashboard</a></p>
  `;

  const html = `
    <p>${greeting}</p>
    <p>Thank you for subscribing to Reception.ai <strong>${params.planName}</strong> (${params.priceDisplay}/month).</p>
    <p>This email confirms your payment. Your subscription is now active.</p>
    ${accountBlock}
    <p style="color:#64748b;font-size:14px;margin-top:24px;">Questions? Reply to this email and we'll help you get started.</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: `Your Reception.ai ${params.planName} receipt`,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Resend subscription receipt error:", res.status, body);
    return { sent: false, reason: "send_failed" };
  }

  return { sent: true };
}
