import { Alert, Button, Stack, TextField } from "@mui/material";
import { useAppointmentForm } from "../../hooks/useAppointmentForm";
import type { AppointmentSubmission } from "../../types/clinic";

interface LeadCaptureFormProps {
  source: AppointmentSubmission["source"];
  initialProcedure?: string;
  serviceSlug?: string;
  submitLabel?: string;
}

export default function LeadCaptureForm({
  source,
  initialProcedure,
  serviceSlug,
  submitLabel = "Submit Request"
}: LeadCaptureFormProps) {
  const { values, errors, isSubmitting, response, setFieldValue, submit } =
    useAppointmentForm({
      source,
      initialProcedure,
      serviceSlug
    });

  return (
    <Stack
      component="form"
      spacing={2.5}
      onSubmit={async (event) => {
        event.preventDefault();
        await submit();
      }}
    >
      {response ? (
        <Alert severity={response.success ? "success" : "error"}>
          {response.message} Reference: {response.referenceId}
        </Alert>
      ) : null}

      <TextField
        fullWidth
        label="Full Name"
        value={values.fullName}
        onChange={(event) => setFieldValue("fullName", event.target.value)}
        error={Boolean(errors.fullName)}
        helperText={errors.fullName}
        sx={{ bgcolor: "white" }}
      />
      <TextField
        fullWidth
        label="Phone Number"
        value={values.phoneNumber}
        onChange={(event) => setFieldValue("phoneNumber", event.target.value)}
        error={Boolean(errors.phoneNumber)}
        helperText={errors.phoneNumber}
        sx={{ bgcolor: "white" }}
      />
      <TextField
        fullWidth
        label="Preferred Procedure"
        value={values.procedure}
        onChange={(event) => setFieldValue("procedure", event.target.value)}
        error={Boolean(errors.procedure)}
        helperText={errors.procedure}
        sx={{ bgcolor: "white" }}
      />
      <TextField
        fullWidth
        label="Message (Optional)"
        multiline
        minRows={4}
        value={values.message}
        onChange={(event) => setFieldValue("message", event.target.value)}
        error={Boolean(errors.message)}
        helperText={errors.message}
        sx={{ bgcolor: "white" }}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
        sx={{ alignSelf: "flex-start" }}
      >
        {isSubmitting ? "Submitting..." : submitLabel}
      </Button>
    </Stack>
  );
}
