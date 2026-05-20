export type RecommendInput = {
  symptoms?: string;
  urgency?: "low" | "medium" | "high";
  patientType?: "adult" | "child" | "new" | "existing";
  reason?: string;
};

export type DoctorRecommendation = {
  doctorId: string;
  doctorName: string;
  specialty: string;
  rationale: string;
  suggestedServiceId?: string;
};

const SYMPTOM_RULES: Array<{
  keywords: string[];
  specialty: string;
  serviceTag: string;
  rationale: string;
}> = [
  {
    keywords: ["muela", "dolor", "diente", "endodon", "urgent", "pain", "tooth"],
    specialty: "endodontics",
    serviceTag: "urgent",
    rationale:
      "Based on your dental pain symptoms, I recommend an appointment with our endodontist.",
  },
  {
    keywords: ["niño", "niña", "hijo", "pediatr", "child", "kid"],
    specialty: "pediatrics",
    serviceTag: "pediatric",
    rationale: "For pediatric patients, our pediatric dentist is the best fit.",
  },
  {
    keywords: ["limpieza", "profilaxis", "cleaning", "rutina", "checkup"],
    specialty: "general",
    serviceTag: "cleaning",
    rationale: "A dental cleaning with our general dentistry team is the right next step.",
  },
  {
    keywords: ["blanqueamiento", "estética", "whitening", "cosmetic"],
    specialty: "general",
    serviceTag: "cosmetic",
    rationale: "We can schedule a cosmetic consultation with our general dentistry team.",
  },
];

export function recommendDoctor(
  doctors: Array<{
    id: string;
    name: string;
    specialty: string;
  }>,
  services: Array<{
    id: string;
    specialtyTags: string | null;
  }>,
  input: RecommendInput
): DoctorRecommendation | null {
  if (doctors.length === 0) return null;

  const text = `${input.symptoms ?? ""} ${input.reason ?? ""} ${input.patientType ?? ""}`.toLowerCase();

  let matchedSpecialty = "general";
  let rationale =
    "I recommend general dentistry to evaluate your case and refer you if needed.";
  let serviceTag = "consultation";

  if (input.patientType === "child") {
    matchedSpecialty = "pediatrics";
    rationale = "For children, our pediatric dentist provides specialized care.";
    serviceTag = "pediatric";
  } else {
    for (const rule of SYMPTOM_RULES) {
      if (rule.keywords.some((k) => text.includes(k))) {
        matchedSpecialty = rule.specialty;
        rationale = rule.rationale;
        serviceTag = rule.serviceTag;
        break;
      }
    }
  }

  if (input.urgency === "high" && matchedSpecialty === "general") {
    matchedSpecialty = "endodontics";
    rationale =
      "Given the urgency, I'm prioritizing endodontics to relieve your pain as soon as possible.";
    serviceTag = "urgent";
  }

  const doctor =
    doctors.find((d) => d.specialty === matchedSpecialty) ??
    doctors.find((d) => d.specialty === "general") ??
    doctors[0];

  const service = services.find((s) =>
    (s.specialtyTags ?? "").split(",").includes(serviceTag)
  );

  return {
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    rationale,
    suggestedServiceId: service?.id,
  };
}
