export type TranscriptMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
  eventId?: number;
};

export type PaymentLinkCard = {
  url: string;
  label: string;
};
