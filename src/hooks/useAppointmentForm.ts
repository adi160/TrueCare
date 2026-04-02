import { useState } from "react";
import { INITIAL_APPOINTMENT_VALUES } from "../constants/forms";
import {
  hasAppointmentErrors,
  type AppointmentFormErrors,
  validateAppointmentForm
} from "../lib/validation";
import { submitAppointmentRequest } from "../services/appointments";
import type {
  AppointmentApiResponse,
  AppointmentFormValues,
  AppointmentSubmission
} from "../types/clinic";

interface UseAppointmentFormOptions {
  source: AppointmentSubmission["source"];
  initialProcedure?: string;
  serviceSlug?: string;
}

export function useAppointmentForm({
  source,
  initialProcedure = "",
  serviceSlug
}: UseAppointmentFormOptions) {
  const [values, setValues] = useState<AppointmentFormValues>({
    ...INITIAL_APPOINTMENT_VALUES,
    procedure: initialProcedure
  });
  const [errors, setErrors] = useState<AppointmentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<AppointmentApiResponse | null>(null);

  const setFieldValue = (field: keyof AppointmentFormValues, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value
    }));

    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const submit = async (): Promise<boolean> => {
    const nextErrors = validateAppointmentForm(values);
    setErrors(nextErrors);
    setResponse(null);

    if (hasAppointmentErrors(nextErrors)) {
      return false;
    }

    setIsSubmitting(true);

    try {
      const apiResponse = await submitAppointmentRequest({
        ...values,
        source,
        serviceSlug
      });

      setResponse(apiResponse);

      if (apiResponse.success) {
        setValues({
          ...INITIAL_APPOINTMENT_VALUES,
          procedure: initialProcedure
        });
      }

      return apiResponse.success;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    response,
    setFieldValue,
    submit
  };
}
