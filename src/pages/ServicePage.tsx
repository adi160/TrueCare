import { Box, Button, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import LeadCaptureForm from "../components/forms/LeadCaptureForm";
import { getServiceBySlug } from "../data/services";

interface ServiceRouteParams {
  slug?: string;
}

export default function ServicePage() {
  const { slug } = useParams<ServiceRouteParams>();
  const service = getServiceBySlug(slug);

  if (!service) {
    return (
      <Container sx={{ py: 12 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Service not found
        </Typography>
        <Button component={Link} to="/" variant="contained">
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 12 }}>
      <Button component={Link} to="/" variant="text" sx={{ mb: 3 }}>
        Back to Home
      </Button>

      <Typography variant="h2" sx={{ mb: 2 }}>
        {service.name}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 760 }}>
        {service.details}
      </Typography>

      <Box
        component="img"
        src={service.heroImage}
        alt={service.name}
        sx={{ width: "100%", borderRadius: 4, maxHeight: 480, objectFit: "cover", mb: 5 }}
      />

      <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap" sx={{ mb: 5 }}>
        {service.benefits.map((benefit) => (
          <Chip key={benefit} label={benefit} color="primary" variant="outlined" />
        ))}
      </Stack>

      <Paper
        elevation={0}
        sx={{
          maxWidth: 720,
          mx: "auto",
          p: { xs: 3, md: 4 },
          textAlign: "center",
          borderRadius: 3,
          bgcolor: "#ffffff",
          border: "1px solid rgba(23,57,58,0.12)",
          boxShadow: "0 22px 48px rgba(23,57,58,0.08)"
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Book consultation
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 520, mx: "auto" }}>
          Share your treatment goals and our team will contact you with the next steps.
        </Typography>
        <LeadCaptureForm
          source="service-page"
          initialProcedure={service.name}
          serviceSlug={service.slug}
          submitLabel="Submit Consultation"
        />
      </Paper>
    </Container>
  );
}
