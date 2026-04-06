import type { ClinicInfo } from "../types/clinic";
import { useSectionValue } from "../services/siteContentStore";

export interface SiteHeaderSettings {
  clinicName: string;
  tagline: string;
}

export interface SiteTopBarSettings {
  topLineLeft: string;
  topLineRight: string;
}

export interface HomeSectionSettings {
  heroTitle: string;
  heroTagline: string;
  heroImage: string;
  heroImageAlt: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  bulletPoints: string[];
}

export interface SiteStorySettings {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  stats: Array<{ value: string; label: string }>;
}

export interface AppointmentSectionSettings {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  quote: string;
}

export interface FooterSectionSettings {
  address: string;
  note: string;
  copyrightNote: string;
  socialLinks: Array<{
    platform: "instagram" | "facebook" | "youtube" | "linkedin";
    label: string;
    href: string;
  }>;
}

export interface ContactSectionSettings {
  phone: string;
  whatsapp: string;
  email: string;
}

function normalizeFooterSettings(
  value: Partial<FooterSectionSettings> | null | undefined
): FooterSectionSettings {
  return {
    ...defaultFooterSettings,
    ...(value ?? {}),
    socialLinks:
      value?.socialLinks?.length ? value.socialLinks : defaultFooterSettings.socialLinks
  };
}

export const defaultHeaderSettings: SiteHeaderSettings = {
  clinicName: "True Care Clinic",
  tagline: "Cosmetic, aesthetic, and personalized consultation care"
};

export const defaultTopBarSettings: SiteTopBarSettings = {
  topLineLeft: "Private cosmetic consultations",
  topLineRight: "Mon - Sat | 10:00 AM - 7:00 PM"
};

export const defaultHomeSectionSettings: HomeSectionSettings = {
  heroTitle: "Refined cosmetic care designed around confidence, trust, and natural results.",
  heroTagline: "Aesthetic and cosmetic care shaped around confidence, clarity, and comfort.",
  heroImage:
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
  heroImageAlt: "Premium cosmetic clinic consultation",
  primaryCtaLabel: "Book Consultation",
  secondaryCtaLabel: "Explore Services",
  bulletPoints: [
    "Natural-looking cosmetic enhancement planning",
    "Private consultation-first approach",
    "Modern recovery guidance and patient follow-up"
  ]
};

export const defaultStorySettings: SiteStorySettings = {
  eyebrow: "Welcome to True Care",
  title: "A more considered cosmetic clinic experience, from consultation to recovery.",
  description:
    "Inspired by the structure of leading clinic websites, this section mirrors that trust-building flow with a more elevated visual style: clearer messaging, stronger hierarchy, and a more refined patient-first presentation.",
  highlights: [
    "Natural-looking cosmetic enhancement planning",
    "Private consultation-first approach",
    "Modern recovery guidance and patient follow-up"
  ],
  stats: [
    { value: "12+", label: "Years in aesthetic care" },
    { value: "4.9/5", label: "Average patient satisfaction" },
    { value: "1,500+", label: "Consultations guided" }
  ]
};

export const defaultAppointmentSettings: AppointmentSectionSettings = {
  eyebrow: "Consultation Request",
  title: "Plan your visit with True Care Clinic",
  description:
    "Share your goals, concerns, or preferred treatment area and our team can guide your next steps with a private callback and a clear treatment discussion.",
  bullets: [
    "Personalized consultation guidance",
    "Natural-looking treatment planning",
    "Private follow-up and recovery support"
  ],
  quote:
    "Beautiful results begin with honest guidance, thoughtful planning, and a calm patient experience."
};

export const defaultFooterSettings: FooterSectionSettings = {
  address:
    "Siddharth Nagar, Opp Baidyanath palace Bailey Road, more, near jagdeo path, Patna, Bihar 800014",
  note: "Replace these placeholder links with your real clinic social handles anytime.",
  copyrightNote: "Designed for a premium cosmetic clinic experience.",
  socialLinks: [
    {
      label: "Instagram",
      href: "https://instagram.com/truecareclinic",
      platform: "instagram"
    },
    {
      label: "Facebook",
      href: "https://facebook.com/truecareclinic",
      platform: "facebook"
    },
    {
      label: "YouTube",
      href: "https://youtube.com/@truecareclinic",
      platform: "youtube"
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/company/truecareclinic",
      platform: "linkedin"
    }
  ]
};

export const defaultContactSettings: ContactSectionSettings = {
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  email: "care@truecareclinic.com"
};

export function getSiteHeaderSettings(): SiteHeaderSettings {
  if (typeof window === "undefined") {
    return defaultHeaderSettings;
  }

  try {
    const saved = window.localStorage.getItem("truecare-site-header");

    if (!saved) {
      return defaultHeaderSettings;
    }

    return { ...defaultHeaderSettings, ...JSON.parse(saved) };
  } catch {
    return defaultHeaderSettings;
  }
}

export function useSiteHeaderSettings(): SiteHeaderSettings {
  return useSectionValue("truecare-site-header", defaultHeaderSettings, "truecare-site-header");
}

export function getTopBarSettings(): SiteTopBarSettings {
  if (typeof window === "undefined") {
    return defaultTopBarSettings;
  }

  try {
    const saved = window.localStorage.getItem("truecare-site-topbar");

    if (!saved) {
      return defaultTopBarSettings;
    }

    return { ...defaultTopBarSettings, ...JSON.parse(saved) };
  } catch {
    return defaultTopBarSettings;
  }
}

export function useTopBarSettings(): SiteTopBarSettings {
  return useSectionValue("truecare-site-topbar", defaultTopBarSettings, "truecare-site-topbar");
}

export function getHomeSectionSettings(): HomeSectionSettings {
  if (typeof window === "undefined") {
    return defaultHomeSectionSettings;
  }

  try {
    const saved = window.localStorage.getItem("truecare-site-home");

    if (!saved) {
      return defaultHomeSectionSettings;
    }

    return { ...defaultHomeSectionSettings, ...JSON.parse(saved) };
  } catch {
    return defaultHomeSectionSettings;
  }
}

export function useHomeSectionSettings(): HomeSectionSettings {
  return useSectionValue("truecare-site-home", defaultHomeSectionSettings, "truecare-site-home");
}

export function getStorySettings(): SiteStorySettings {
  if (typeof window === "undefined") {
    return defaultStorySettings;
  }

  try {
    const saved = window.localStorage.getItem("truecare-site-story");

    if (!saved) {
      return defaultStorySettings;
    }

    return { ...defaultStorySettings, ...JSON.parse(saved) };
  } catch {
    return defaultStorySettings;
  }
}

export function useStorySettings(): SiteStorySettings {
  return useSectionValue("truecare-site-story", defaultStorySettings, "truecare-site-story");
}

export function getAppointmentSettings(): AppointmentSectionSettings {
  if (typeof window === "undefined") {
    return defaultAppointmentSettings;
  }

  try {
    const saved = window.localStorage.getItem("truecare-site-appointment");

    if (!saved) {
      return defaultAppointmentSettings;
    }

    return { ...defaultAppointmentSettings, ...JSON.parse(saved) };
  } catch {
    return defaultAppointmentSettings;
  }
}

export function useAppointmentSettings(): AppointmentSectionSettings {
  return useSectionValue(
    "truecare-site-appointment",
    defaultAppointmentSettings,
    "truecare-site-appointment"
  );
}

export function getFooterSettings(): FooterSectionSettings {
  if (typeof window === "undefined") {
    return defaultFooterSettings;
  }

  try {
    const saved = window.localStorage.getItem("truecare-site-footer");

    if (!saved) {
      return defaultFooterSettings;
    }

    return normalizeFooterSettings(JSON.parse(saved));
  } catch {
    return defaultFooterSettings;
  }
}

export function useFooterSettings(): FooterSectionSettings {
  const footer = useSectionValue<FooterSectionSettings>(
    "truecare-site-footer",
    defaultFooterSettings,
    "truecare-site-footer"
  );

  return normalizeFooterSettings(footer);
}

export function getContactSettings(): ContactSectionSettings {
  if (typeof window === "undefined") {
    return defaultContactSettings;
  }

  try {
    const saved = window.localStorage.getItem("truecare-site-contact");

    if (!saved) {
      return defaultContactSettings;
    }

    return { ...defaultContactSettings, ...JSON.parse(saved) };
  } catch {
    return defaultContactSettings;
  }
}

export function useContactSettings(): ContactSectionSettings {
  return useSectionValue("truecare-site-contact", defaultContactSettings, "truecare-site-contact");
}

export const clinicInfo: ClinicInfo = {
  get name() {
    return getSiteHeaderSettings().clinicName;
  },
  get tagline() {
    return getSiteHeaderSettings().tagline;
  },
  get phone() {
    return getContactSettings().phone;
  },
  get whatsapp() {
    return getContactSettings().whatsapp;
  },
  get doctorName() {
    return getDoctorProfile().doctorName;
  },
  get doctorBio() {
    return getDoctorProfile().doctorBio;
  }
};

export function useClinicInfo(): ClinicInfo {
  const header = useSiteHeaderSettings();
  const contact = useContactSettings();
  const doctor = useDoctorProfile();

  return {
    name: header.clinicName,
    tagline: header.tagline,
    phone: contact.phone,
    whatsapp: contact.whatsapp,
    doctorName: doctor.doctorName,
    doctorBio: doctor.doctorBio
  };
}

export const defaultPatientTestimonials: Array<{
  name: string;
  treatment: string;
  quote: string;
}> = [
  {
    name: "Riya S.",
    treatment: "Rhinoplasty Consultation",
    quote:
      "The entire process felt calm, respectful, and very clearly explained. The clinic experience felt refined from the first call to follow-up."
  },
  {
    name: "Neha K.",
    treatment: "Liposuction Planning",
    quote:
      "I appreciated how realistic and professional the doctor was. Nothing felt rushed, and the guidance gave me confidence in every step."
  },
  {
    name: "Aman P.",
    treatment: "Hair Restoration",
    quote:
      "The consultation experience felt premium and personal. I left with a clear treatment plan and realistic expectations."
  }
];

export function getPatientTestimonials(): Array<{
  name: string;
  treatment: string;
  quote: string;
}> {
  if (typeof window === "undefined") {
    return defaultPatientTestimonials;
  }

  try {
    const saved = window.localStorage.getItem("truecare-site-testimonials");

    if (!saved) {
      return defaultPatientTestimonials;
    }

    return JSON.parse(saved) as Array<{ name: string; treatment: string; quote: string }>;
  } catch {
    return defaultPatientTestimonials;
  }
}

export function usePatientTestimonials(): Array<{
  name: string;
  treatment: string;
  quote: string;
}> {
  return useSectionValue(
    "truecare-site-testimonials",
    defaultPatientTestimonials,
    "truecare-site-testimonials"
  );
}

export function getClinicContactDetails(): Array<{ label: string; value: string }> {
  const contactSettings = getContactSettings();

  return [
    { label: "Phone", value: clinicInfo.phone },
    { label: "WhatsApp", value: clinicInfo.whatsapp },
    { label: "Email", value: contactSettings.email },
    { label: "Location", value: "Patna, Bihar" }
  ];
}

export const footerLinks: Array<{ id: string; label: string }> = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "doctor", label: "Doctor" },
  { id: "appointment", label: "Consultation" }
];

export const defaultDoctorProfile = {
  doctorName: "Dr. Aanya Mehra",
  doctorBio:
    "Board-certified cosmetic specialist focused on natural-looking enhancements, patient education, and thoughtful treatment planning.",
  title: "Lead Cosmetic and Aesthetic Specialist",
  summary:
    "Dr. Aanya Mehra leads True Care Clinic with a consultation-first philosophy focused on natural balance, patient comfort, and clear treatment planning.",
  image:
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80",
  experience: "12+ years",
  qualifications: [
    "MBBS, MS in General Surgery",
    "Advanced fellowship in Cosmetic and Aesthetic Procedures",
    "Focused practice in facial aesthetics, body contouring, and hair restoration"
  ],
  expertise: [
    "Rhinoplasty and facial harmony procedures",
    "Liposuction and contour-focused treatment planning",
    "Hair transplant consultation and restoration design",
    "Personalized pre-procedure and recovery guidance"
  ],
  philosophy: [
    "Every treatment begins with listening, not selling.",
    "Natural-looking results should complement the patient, never overpower them.",
    "Clear expectations and honest planning are central to patient trust."
  ]
};

export function getDoctorProfile() {
  if (typeof window === "undefined") {
    return defaultDoctorProfile;
  }

  try {
    const saved = window.localStorage.getItem("truecare-site-doctor");

    if (!saved) {
      return defaultDoctorProfile;
    }

    return { ...defaultDoctorProfile, ...JSON.parse(saved) };
  } catch {
    return defaultDoctorProfile;
  }
}

export function useDoctorProfile() {
  return useSectionValue("truecare-site-doctor", defaultDoctorProfile, "truecare-site-doctor");
}
