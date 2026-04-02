import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { getPatientTestimonials } from "../../data/siteContent";

export default function TestimonialsSection() {
  const patientTestimonials = getPatientTestimonials();

  return (
    <Box
      sx={{
        py: { xs: 9, md: 12 },
        background: "linear-gradient(180deg, #123c3a 0%, #0c2928 100%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}
    >
      <Container>
        <Typography
          variant="overline"
          sx={{ color: "rgba(255,255,255,0.72)", letterSpacing: "0.18em", fontWeight: 700 }}
        >
          Patient Experience
        </Typography>
        <Typography variant="h3" sx={{ mt: 1.5, mb: 5, color: "white", maxWidth: 760 }}>
          Trust is built through calm communication, clear treatment planning, and respectful care.
        </Typography>

        <Grid container spacing={3}>
          {patientTestimonials.map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item.name}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  height: "100%",
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.22)",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "left",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.18)"
                }}
              >
                <FormatQuoteIcon sx={{ fontSize: 34, color: "#dcb26a", mb: 1.5 }} />
                <Typography sx={{ mb: 3, color: "rgba(255,255,255,0.86)", lineHeight: 1.8 }}>
                  {item.quote}
                </Typography>
                <Box sx={{ mt: "auto" }}>
                  <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)" }}>
                    {item.treatment}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
