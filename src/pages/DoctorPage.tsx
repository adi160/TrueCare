import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Button, Chip, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { clinicInfo, getDoctorProfile } from "../data/siteContent";

export default function DoctorPage() {
  const doctorProfile = getDoctorProfile();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 12,
        background: "linear-gradient(180deg, #f4fbff 0%, #e8f2fb 100%)"
      }}
    >
      <Container>
        <Button component={Link} to="/" variant="text" sx={{ mb: 3 }}>
          Back to Home
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(107,150,214,0.18)",
            boxShadow: "0 28px 60px rgba(37,87,158,0.1)"
          }}
        >
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="start">
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                component="img"
                src={doctorProfile.image}
                alt={clinicInfo.doctorName}
                sx={{
                  width: "100%",
                  height: { xs: 320, md: 520 },
                  objectFit: "cover",
                  borderRadius: 3
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Chip
                label={doctorProfile.title}
                color="secondary"
                sx={{ mb: 2, fontWeight: 700 }}
              />
              <Typography variant="h2" sx={{ mb: 1.5 }}>
                {clinicInfo.doctorName}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3.5, maxWidth: 760 }}>
                {clinicInfo.doctorBio}
              </Typography>

              <Typography variant="h4" sx={{ mb: 1.5 }}>
                Professional Overview
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3.5, lineHeight: 1.8 }}>
                {doctorProfile.summary}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      bgcolor: "#ffffff",
                      border: "1px solid rgba(107,150,214,0.16)"
                    }}
                  >
                    <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 700 }}>
                      Experience
                    </Typography>
                    <Typography variant="h4">{doctorProfile.experience}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      bgcolor: "#ffffff",
                      border: "1px solid rgba(107,150,214,0.16)"
                    }}
                  >
                    <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 700 }}>
                      Focus
                    </Typography>
                    <Typography color="text.secondary">
                      Facial aesthetics, body contouring, hair restoration, and personalized treatment planning.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    Qualifications
                  </Typography>
                  <Stack spacing={1.5}>
                    {doctorProfile.qualifications.map((item) => (
                      <Stack key={item} direction="row" spacing={1.25} alignItems="flex-start">
                        <CheckCircleOutlineIcon sx={{ color: "primary.main", mt: 0.2 }} />
                        <Typography color="text.secondary">{item}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    Areas of Expertise
                  </Typography>
                  <Stack spacing={1.5}>
                    {doctorProfile.expertise.map((item) => (
                      <Stack key={item} direction="row" spacing={1.25} alignItems="flex-start">
                        <CheckCircleOutlineIcon sx={{ color: "primary.main", mt: 0.2 }} />
                        <Typography color="text.secondary">{item}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Grid>
              </Grid>

              <Typography variant="h4" sx={{ mt: 5, mb: 2 }}>
                Consultation Philosophy
              </Typography>
              <Stack spacing={1.5}>
                {doctorProfile.philosophy.map((item) => (
                  <Stack key={item} direction="row" spacing={1.25} alignItems="flex-start">
                    <CheckCircleOutlineIcon sx={{ color: "primary.main", mt: 0.2 }} />
                    <Typography color="text.secondary">{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
