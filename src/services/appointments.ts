import type {
  AppointmentApiResponse,
  AppointmentSubmission
} from "../types/clinic";

function createReferenceId(): string {
  return `TC-${Date.now().toString().slice(-6)}`;
}

export async function submitAppointmentRequest(
  payload: AppointmentSubmission
): Promise<AppointmentApiResponse> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 800);
  });

  console.info("Appointment request submitted", payload);

  return {
    success: true,
    message: "Your request has been received. Our team will contact you shortly.",
    referenceId: createReferenceId()
  };
}
