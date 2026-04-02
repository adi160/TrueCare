import type { AppointmentFormValues } from "../types/clinic";

export const PHONE_REGEX = /^[0-9+\-\s()]{10,20}$/;

export const INITIAL_APPOINTMENT_VALUES: AppointmentFormValues = {
  fullName: "",
  phoneNumber: "",
  procedure: "",
  message: ""
};

export const APPOINTMENT_FIELD_LABELS: Record<keyof AppointmentFormValues, string> = {
  fullName: "Full Name",
  phoneNumber: "Phone Number",
  procedure: "Preferred Procedure",
  message: "Message"
};
