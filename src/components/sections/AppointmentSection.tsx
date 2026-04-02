import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import LeadCaptureForm from "../forms/LeadCaptureForm";
import { getAppointmentSettings } from "../../data/siteContent";

export default function AppointmentSection() {
  const appointment = getAppointmentSettings();

  return (
    <Box
      id="appointment"
      sx={{
        py: { xs: 9, md: 12 },
        background: "linear-gradient(180deg, #fff6ea 0%, #f3fbfa 100%)",
        borderTop: "1px solid rgba(224,182,111,0.16)",
        borderBottom: "1px solid rgba(31,157,148,0.08)"
      }}
    >
      <Container>
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(31,157,148,0.22), rgba(224,182,111,0.24))",
            border: "1px solid rgba(23,57,58,0.12)",
            boxShadow: "0 26px 60px rgba(23,57,58,0.1)"
          }}
        >
          <Grid container>
            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{
                p: { xs: 2.5, md: 4 },
                bgcolor: "#1b6360",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)"
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -60,
                  left: -40,
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  background: "rgba(224,182,111,0.18)"
                }}
              />

              <Typography
                variant="overline"
                sx={{
                  color: "rgba(255,255,255,0.72)",
                  letterSpacing: "0.18em",
                  fontWeight: 700,
                  position: "relative"
                }}
              >
                {appointment.eyebrow}
              </Typography>

              <Box sx={{ position: "relative", zIndex: 1, mt: 1.5 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>
                  {appointment.title}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.82)", mb: 3.5, lineHeight: 1.8 }}>
                  {appointment.description}
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 4 }}>
                  {appointment.bullets.map((item) => (
                    <Stack key={item} direction="row" spacing={1.25} alignItems="center">
                      <CheckCircleOutlineIcon sx={{ color: "#f6d18d" }} />
                      <Typography sx={{ color: "rgba(255,255,255,0.94)" }}>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              <Paper
                elevation={0}
                sx={{
                  position: "relative",
                  zIndex: 1,
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 14px 30px rgba(0,0,0,0.12)"
                }}
              >
                <FormatQuoteIcon sx={{ color: "#f6d18d", mb: 1 }} />
                <Typography sx={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.75, mb: 2 }}>
                  {appointment.quote}
                </Typography>
              </Paper>
            </Grid>

            <Grid
              size={{ xs: 12, md: 7 }}
              sx={{
                p: { xs: 2.5, md: 4 },
                bgcolor: "rgba(255,255,255,0.72)"
              }}
            >
              <Typography variant="h4" sx={{ mb: 1 }}>
                Book an appointment
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                A polished consultation form with typed validation and a backend-ready submission flow.
              </Typography>

              <LeadCaptureForm source="homepage" />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
