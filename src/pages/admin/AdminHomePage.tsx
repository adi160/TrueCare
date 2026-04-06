import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  defaultHomeSectionSettings,
  getHomeSectionSettings,
  type HomeSectionSettings
} from "../../data/siteContent";
import ImageUploadField from "../../components/admin/ImageUploadField";
import { hydrateSectionValue, saveSectionValue } from "../../services/siteContentStore";

const storageKey = "truecare-site-home";

export default function AdminHomePage() {
  const [draft, setDraft] = useState<HomeSectionSettings>(getHomeSectionSettings());
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    void hydrateSectionValue(storageKey, defaultHomeSectionSettings, storageKey).then((value) => {
      setDraft(value);
    });
  }, []);

  const bulletPointsText = useMemo(() => draft.bulletPoints.join("\n"), [draft.bulletPoints]);

  const saveHome = async () => {
    await saveSectionValue(storageKey, draft, storageKey);
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const resetHome = async () => {
    setDraft(defaultHomeSectionSettings);
    await saveSectionValue(storageKey, defaultHomeSectionSettings, storageKey);
    setSavedAt(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
        background:
          "radial-gradient(circle at top right, rgba(224,182,111,0.14), transparent 26%), linear-gradient(180deg, #fffdfa 0%, #f8f1e6 100%)"
      }}
    >
      <Container>
        <Stack spacing={3}>
          <Button component={Link} to="/admin" variant="text" startIcon={<ArrowBackRoundedIcon />}>
            Back to Admin
          </Button>

          <Box>
            <Typography variant="h2" sx={{ mb: 1 }}>
              Home Section Editor
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Edit the hero heading, supporting text, image, buttons, and bullet points from a
              single page.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ borderRadius: 3, border: "1px solid rgba(16,42,67,0.08)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Hero title"
                      value={draft.heroTitle}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, heroTitle: event.target.value }))
                      }
                      fullWidth
                      multiline
                      minRows={2}
                    />
                    <TextField
                      label="Hero tagline"
                      value={draft.heroTagline}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, heroTagline: event.target.value }))
                      }
                      fullWidth
                      multiline
                      minRows={2}
                    />
                    <ImageUploadField
                      label="Hero image URL"
                      folder="home"
                      value={draft.heroImage}
                      onChange={(value) => setDraft((current) => ({ ...current, heroImage: value }))}
                      previewAlt={draft.heroImageAlt}
                      helperText="Upload a hero image or paste an image URL. The live home section will use this value."
                    />
                    <TextField
                      label="Hero image alt text"
                      value={draft.heroImageAlt}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, heroImageAlt: event.target.value }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Primary button label"
                      value={draft.primaryCtaLabel}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          primaryCtaLabel: event.target.value
                        }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Secondary button label"
                      value={draft.secondaryCtaLabel}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          secondaryCtaLabel: event.target.value
                        }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Bullet points"
                      value={bulletPointsText}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          bulletPoints: event.target.value
                            .split("\n")
                            .map((item) => item.trim())
                            .filter(Boolean)
                        }))
                      }
                      helperText="Enter one bullet point per line."
                      fullWidth
                      multiline
                      minRows={5}
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button variant="contained" onClick={saveHome} startIcon={<SaveRoundedIcon />}>
                        Save Home Section
                      </Button>
                      <Button variant="outlined" onClick={resetHome}>
                        Reset to Defaults
                      </Button>
                    </Stack>

                    {savedAt ? <Chip label={`Saved at ${savedAt}`} color="success" variant="outlined" /> : null}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#ffffff", border: "1px solid rgba(224,182,111,0.14)" }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Preview
                </Typography>
                <Stack spacing={1.5}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {draft.heroTitle}
                  </Typography>
                  <Typography color="text.secondary">{draft.heroTagline}</Typography>
                  <Box
                    component="img"
                    src={draft.heroImage}
                    alt={draft.heroImageAlt}
                    sx={{
                      width: "100%",
                      height: 220,
                      objectFit: "cover",
                      borderRadius: 3
                    }}
                  />
                  <Typography sx={{ fontWeight: 700 }}>{draft.primaryCtaLabel}</Typography>
                  <Typography color="text.secondary">{draft.secondaryCtaLabel}</Typography>
                  <Box>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>Bullet points</Typography>
                    <Stack spacing={0.75}>
                      {draft.bulletPoints.map((item) => (
                        <Typography key={item} variant="body2" color="text.secondary">
                          • {item}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
