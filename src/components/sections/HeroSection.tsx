import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Button, Chip, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useClinicInfo, useHomeSectionSettings, useStorySettings } from "../../data/siteContent";

interface HeroSectionProps {
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
}

const MotionBox = motion.create(Box);

export default function HeroSection({
  onPrimaryAction,
  onSecondaryAction
}: HeroSectionProps) {
  const home = useHomeSectionSettings();
  const story = useStorySettings();
  const clinicInfo = useClinicInfo();
  const bulletPoints = home.bulletPoints.length > 0 ? home.bulletPoints : story.highlights;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background:
          "radial-gradient(circle at top left, rgba(31,157,148,0.22), transparent 30%), radial-gradient(circle at bottom right, rgba(224,182,111,0.2), transparent 24%), linear-gradient(180deg, #f1fcfb 0%, #dff3ef 100%)",
        borderBottom: "1px solid rgba(31,157,148,0.1)"
      }}
    >
      <Container sx={{ pt: { xs: 18, md: 22 }, pb: { xs: 8, md: 10 } }}>
        <MotionBox
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          sx={{ width: "100%" }}
        >
          <Grid container spacing={{ xs: 5, md: 7 }} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="Cosmetic and Aesthetic Surgery"
                color="secondary"
                sx={{ mb: 3, px: 1, height: 34, fontWeight: 700 }}
              />
              <Typography variant="h2" sx={{ mb: 2.5, maxWidth: 760 }}>
                {home.heroTitle}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 680 }}>
                {home.heroTagline}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  size="large"
                  variant="contained"
                  endIcon={<ArrowOutwardIcon />}
                  onClick={onPrimaryAction}
                  sx={{ px: 3, py: 1.5, borderRadius: 999 }}
                >
                  {home.primaryCtaLabel}
                </Button>
                <Button
                  size="large"
                  variant="outlined"
                  onClick={onSecondaryAction}
                  sx={{ px: 3, py: 1.5, borderRadius: 999 }}
                >
                  {home.secondaryCtaLabel}
                </Button>
              </Stack>

              <Stack spacing={1.5} sx={{ mb: 4 }}>
                {bulletPoints.map((item) => (
                  <Stack key={item} direction="row" spacing={1.2} alignItems="center">
                    <CheckCircleOutlineIcon sx={{ color: "primary.main" }} />
                    <Typography>{item}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <PhoneIcon color="primary" />
                  <Typography>{clinicInfo.phone}</Typography>
                </Stack>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <WhatsAppIcon color="primary" />
                  <Typography>{clinicInfo.whatsapp}</Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(23,57,58,0.12)",
                  boxShadow: "0 34px 80px rgba(16,42,67,0.14)"
                }}
              >
                <Box
                  component="img"
                  src={home.heroImage}
                  alt={home.heroImageAlt}
                  sx={{
                    width: "100%",
                    height: { xs: 320, md: 500 },
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: 2.5,
                    mb: 2.5
                  }}
                />

                <Grid container spacing={2}>
                  {story.stats.map((stat) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2.5,
                          bgcolor: "#f7fffd",
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
                          variant="h5"
                          sx={{ color: "#136f69", mb: 0.75, fontWeight: 800, lineHeight: 1.1 }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="body2"
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
        </MotionBox>
      </Container>
    </Box>
  );
}
