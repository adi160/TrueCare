import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { clinicInfo, getDoctorProfile } from "../../data/siteContent";

interface DoctorSectionProps {
  onViewProfile: () => void;
}

export default function DoctorSection({ onViewProfile }: DoctorSectionProps) {
  const doctorProfile = getDoctorProfile();

  return (
    <Box
      id="doctor"
      sx={{
        py: { xs: 9, md: 12 },
        background: "linear-gradient(180deg, #f2f8ff 0%, #e2eefc 100%)",
        borderTop: "1px solid rgba(107,150,214,0.14)",
        borderBottom: "1px solid rgba(107,150,214,0.14)"
      }}
    >
      <Container>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            bgcolor: "rgba(255,255,255,0.96)",
            borderRadius: 6,
            border: "1px solid rgba(107,150,214,0.18)",
            boxShadow: "0 24px 60px rgba(37,87,158,0.1)"
          }}
        >
          <Grid container spacing={{ xs: 4, md: 5 }} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                component="img"
                src={doctorProfile.image}
                alt={clinicInfo.doctorName}
                sx={{
                  width: "100%",
                  height: { xs: 280, md: 420 },
                  objectFit: "cover",
                  borderRadius: 5
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  letterSpacing: "0.18em",
                  fontWeight: 700,
                  display: "block",
                  mb: 1.25
                }}
              >
                Lead Specialist
              </Typography>

              <Typography
                variant="h3"
                sx={{ mb: 1.25, maxWidth: 680, lineHeight: 1.1 }}
              >
                Meet {clinicInfo.doctorName}
              </Typography>

              <Typography
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  mb: 2
                }}
              >
                {doctorProfile.title}
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 720, lineHeight: 1.8 }}>
                {doctorProfile.summary}
              </Typography>

              <Typography color="text.secondary" sx={{ maxWidth: 720, lineHeight: 1.8 }}>
                The reference site places strong emphasis on doctor credibility. This version does
                the same, but with a more elevated editorial layout, stronger image treatment, and
                clearer content hierarchy for a premium first impression.
              </Typography>
              <Button
                variant="contained"
                onClick={onViewProfile}
                sx={{ mt: 3, borderRadius: 999, px: 2.5 }}
              >
                View Full Profile
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
