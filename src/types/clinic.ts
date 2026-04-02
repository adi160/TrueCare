export interface ClinicInfo {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  doctorName: string;
  doctorBio: string;
}

export interface Service {
  slug: string;
  name: string;
  shortDescription: string;
  heroImage: string;
  details: string;
  benefits: string[];
}

export interface AppointmentFormValues {
  fullName: string;
  phoneNumber: string;
  procedure: string;
  message: string;
}

export interface AppointmentSubmission extends AppointmentFormValues {
  source: "homepage" | "service-page";
  serviceSlug?: string;
}

export interface AppointmentApiResponse {
  success: boolean;
  message: string;
  referenceId: string;
}
