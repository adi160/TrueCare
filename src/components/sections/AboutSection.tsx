import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { useClinicInfo, useStorySettings } from "../../data/siteContent";

export default function AboutSection() {
  const story = useStorySettings();
  const clinicInfo = useClinicInfo();

  return (
    <Box
      sx={{
        py: { xs: 9, md: 12 },
        background:
          "linear-gradient(180deg, #f4fbf8 0%, #e4f5ef 100%)",
        borderTop: "1px solid rgba(31,157,148,0.08)",
        borderBottom: "1px solid rgba(31,157,148,0.08)"
      }}
    >
      <Container id="about">
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="overline"
              sx={{ color: "primary.main", letterSpacing: "0.18em", fontWeight: 700 }}
            >
              {story.eyebrow}
            </Typography>
            <Typography variant="h3" sx={{ mt: 1.5, mb: 2.5 }}>
              {story.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 620 }}>
              {story.description}
            </Typography>

            <Stack spacing={1.5}>
              {story.highlights.map((item) => (
                <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                  <CheckCircleOutlineIcon sx={{ color: "primary.main" }} />
                  <Typography>{item}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: "1px solid rgba(23,57,58,0.12)",
                bgcolor: "rgba(255,255,255,0.96)",
                boxShadow: "0 30px 70px rgba(16,42,67,0.12)"
              }}
            >
              <Typography variant="h5" sx={{ mb: 3 }}>
                Why patients choose {clinicInfo.name}
              </Typography>

              <Grid container spacing={2}>
                {story.stats.map((stat) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
                    <Box
                      sx={{
                        p: 2.25,
                        borderRadius: 2.5,
                        bgcolor: "#f6fffc",
                        border: "1px solid rgba(31,157,148,0.14)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        textAlign: "left",
                        boxShadow: "0 8px 18px rgba(31,157,148,0.08)"
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{ color: "#136f69", mb: 0.9, fontWeight: 800, lineHeight: 1.1 }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        sx={{ color: "#315657", lineHeight: 1.45, fontWeight: 600 }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
