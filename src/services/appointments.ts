import type { AppointmentApiResponse, AppointmentSubmission } from "../types/clinic";
import { submitConsultationLead } from "./backend";

export async function submitAppointmentRequest(
  payload: AppointmentSubmission
): Promise<AppointmentApiResponse> {
  return submitConsultationLead(payload);
}
