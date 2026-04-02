import {
  APPOINTMENT_FIELD_LABELS,
  PHONE_REGEX
} from "../constants/forms";
import type { AppointmentFormValues } from "../types/clinic";

export type AppointmentFormErrors = Partial<Record<keyof AppointmentFormValues, string>>;

export function validateAppointmentForm(
  values: AppointmentFormValues
): AppointmentFormErrors {
  const errors: AppointmentFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = `${APPOINTMENT_FIELD_LABELS.fullName} is required.`;
  }

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = `${APPOINTMENT_FIELD_LABELS.phoneNumber} is required.`;
  } else if (!PHONE_REGEX.test(values.phoneNumber.trim())) {
    errors.phoneNumber = "Enter a valid phone number.";
  }

  if (!values.procedure.trim()) {
    errors.procedure = `${APPOINTMENT_FIELD_LABELS.procedure} is required.`;
  }

  if (!values.message.trim()) {
    errors.message = `${APPOINTMENT_FIELD_LABELS.message} is required.`;
  } else if (values.message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }

  return errors;
}

export function hasAppointmentErrors(errors: AppointmentFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
