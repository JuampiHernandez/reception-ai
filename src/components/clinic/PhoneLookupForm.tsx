"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clinicPath } from "@/lib/routes";
import {
  COUNTRY_DIAL_CODES,
  formatPhoneForLookup,
  splitPhoneForForm,
} from "@/lib/phone";

export function PhoneLookupForm({
  slug,
  defaultDialCode = "54",
  initialPhone = "",
  submitLabel = "Find appointment",
  className = "",
  inputClassName = "",
}: {
  slug: string;
  defaultDialCode?: string;
  initialPhone?: string;
  submitLabel?: string;
  className?: string;
  inputClassName?: string;
}) {
  const router = useRouter();
  const initial = useMemo(
    () => splitPhoneForForm(initialPhone, defaultDialCode),
    [initialPhone, defaultDialCode]
  );
  const defaultCountry =
    COUNTRY_DIAL_CODES.find((c) => c.dial === initial.dialCode)?.code ?? "AR";
  const [countryCode, setCountryCode] = useState<string>(defaultCountry);
  const [local, setLocal] = useState(initial.local);
  const dialCode =
    COUNTRY_DIAL_CODES.find((c) => c.code === countryCode)?.dial ?? defaultDialCode;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const full = formatPhoneForLookup(dialCode, local);
    if (!full) return;
    router.push(`${clinicPath(slug, "appointments")}?phone=${encodeURIComponent(full)}`);
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          aria-label="Country code"
          className={`shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-sm text-slate-800 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 ${inputClassName}`}
        >
          {COUNTRY_DIAL_CODES.map(({ code, dial }) => (
            <option key={code} value={code}>
              +{dial} {code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder="11 3415 079340"
          aria-label="Phone number"
          className={`min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 ${inputClassName}`}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Enter your number with or without spaces — area code is optional if it matches your booking.
      </p>
      <Button type="submit" className="mt-3 w-full bg-teal-600 hover:bg-teal-700">
        {submitLabel}
      </Button>
    </form>
  );
}
