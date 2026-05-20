import { addDays, setHours, setMinutes, startOfDay } from "date-fns";

export function generateSlotsForDoctor(
  doctorId: string,
  tenantId: string,
  rules: Array<{ dayOfWeek: number; startTime: string; endTime: string }>,
  daysAhead = 14
): Array<{
  id: string;
  tenantId: string;
  doctorId: string;
  startsAt: Date;
  status: string;
}> {
  const slots: Array<{
    id: string;
    tenantId: string;
    doctorId: string;
    startsAt: Date;
    status: string;
  }> = [];

  const now = new Date();
  for (let d = 1; d <= daysAhead; d++) {
    const day = addDays(startOfDay(now), d);
    const dow = day.getDay();
    const rule = rules.find((r) => r.dayOfWeek === dow);
    if (!rule) continue;

    const [startH, startM] = rule.startTime.split(":").map(Number);
    const [endH] = rule.endTime.split(":").map(Number);

    for (let hour = startH; hour < endH; hour += 2) {
      const slotTime = setMinutes(setHours(day, hour), startM || 0);
      if (slotTime <= now) continue;
      slots.push({
        id: `slot_${doctorId}_${slotTime.getTime()}`,
        tenantId,
        doctorId,
        startsAt: slotTime,
        status: "open",
      });
    }
  }
  return slots;
}
