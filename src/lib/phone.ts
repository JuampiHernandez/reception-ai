export const COUNTRY_DIAL_CODES = [
  { code: "AR", label: "Argentina", dial: "54" },
  { code: "US", label: "United States", dial: "1" },
  { code: "CA", label: "Canada", dial: "1" },
  { code: "MX", label: "Mexico", dial: "52" },
  { code: "BR", label: "Brazil", dial: "55" },
  { code: "CL", label: "Chile", dial: "56" },
  { code: "CO", label: "Colombia", dial: "57" },
  { code: "PE", label: "Peru", dial: "51" },
  { code: "UY", label: "Uruguay", dial: "598" },
  { code: "PY", label: "Paraguay", dial: "595" },
  { code: "BO", label: "Bolivia", dial: "591" },
  { code: "EC", label: "Ecuador", dial: "593" },
  { code: "VE", label: "Venezuela", dial: "58" },
  { code: "ES", label: "Spain", dial: "34" },
  { code: "GB", label: "United Kingdom", dial: "44" },
  { code: "FR", label: "France", dial: "33" },
  { code: "DE", label: "Germany", dial: "49" },
  { code: "IT", label: "Italy", dial: "39" },
  { code: "PT", label: "Portugal", dial: "351" },
  { code: "AU", label: "Australia", dial: "61" },
] as const;

const TIMEZONE_DIAL: Record<string, string> = {
  "America/Argentina/Buenos_Aires": "54",
  "America/Mexico_City": "52",
  "America/Sao_Paulo": "55",
  "America/New_York": "1",
  "America/Los_Angeles": "1",
  "America/Chicago": "1",
  "Europe/Madrid": "34",
  "Europe/London": "44",
};

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export function getDefaultDialCode(timezone?: string | null) {
  if (timezone && TIMEZONE_DIAL[timezone]) return TIMEZONE_DIAL[timezone];
  return "54";
}

export function splitPhoneForForm(phone: string, defaultDialCode: string) {
  const digits = normalizePhone(phone);
  if (!digits) return { dialCode: defaultDialCode, local: "" };

  const byLength = [...COUNTRY_DIAL_CODES].sort((a, b) => b.dial.length - a.dial.length);
  for (const country of byLength) {
    if (digits.startsWith(country.dial) && digits.length > country.dial.length + 5) {
      return { dialCode: country.dial, local: digits.slice(country.dial.length) };
    }
  }

  return { dialCode: defaultDialCode, local: digits };
}

/** Build digits-only phone for lookup from country code + local input (any formatting). */
export function formatPhoneForLookup(dialCode: string, local: string) {
  const localDigits = normalizePhone(local);
  if (!localDigits) return "";

  const dialDigits = normalizePhone(dialCode);
  const sorted = [...COUNTRY_DIAL_CODES].sort((a, b) => b.dial.length - a.dial.length);

  for (const { dial } of sorted) {
    if (localDigits.startsWith(dial) && localDigits.length > dial.length + 5) {
      return localDigits;
    }
  }

  const withoutTrunk = localDigits.replace(/^0+/, "");
  return dialDigits + withoutTrunk;
}

export function formatPhoneDisplay(digits: string) {
  const d = normalizePhone(digits);
  if (!d) return "";
  if (d.length <= 4) return `+${d}`;
  return `+${d.slice(0, 2)} ${d.slice(2)}`;
}

const MIN_SUFFIX_MATCH = 8;

export function phonesMatch(query: string, stored: string) {
  const q = normalizePhone(query);
  const s = normalizePhone(stored);
  if (!q || !s) return false;
  if (q === s) return true;

  const shorter = q.length <= s.length ? q : s;
  const longer = q.length <= s.length ? s : q;
  if (shorter.length >= MIN_SUFFIX_MATCH && longer.endsWith(shorter)) return true;

  return false;
}
