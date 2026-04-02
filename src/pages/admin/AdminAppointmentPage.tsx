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
  defaultAppointmentSettings,
  getAppointmentSettings,
  type AppointmentSectionSettings
} from "../../data/siteContent";

const storageKey = "truecare-site-appointment";

export default function AdminAppointmentPage() {
  const [draft, setDraft] = useState<AppointmentSectionSettings>(getAppointmentSettings());
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        setDraft((current) => ({ ...current, ...JSON.parse(saved) }));
      }
    } catch {
      // Keep defaults.
    }
  }, []);

  const bulletsText = useMemo(() => draft.bullets.join("\n"), [draft.bullets]);

  const saveAppointment = () => {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const resetAppointment = () => {
    setDraft(defaultAppointmentSettings);
    window.localStorage.removeItem(storageKey);
    setSavedAt(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
        background: "linear-gradient(180deg, #fff6ea 0%, #f3fbfa 100%)"
      }}
    >
      <Container>
        <Stack spacing={3}>
          <Button component={Link} to="/admin" variant="text" startIcon={<ArrowBackRoundedIcon />}>
            Back to Admin
          </Button>

          <Box>
            <Typography variant="h2" sx={{ mb: 1 }}>
              Appointment Editor
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Edit the consultation callout, supporting points, and quote shown before the booking
              form on the home page.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ borderRadius: 3, border: "1px solid rgba(16,42,67,0.08)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Eyebrow"
                      value={draft.eyebrow}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, eyebrow: event.target.value }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Title"
                      value={draft.title}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, title: event.target.value }))
                      }
                      fullWidth
                      multiline
                      minRows={2}
                    />
                    <TextField
                      label="Description"
                      value={draft.description}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, description: event.target.value }))
                      }
                      fullWidth
                      multiline
                      minRows={3}
                    />
                    <TextField
                      label="Bullets"
                      value={bulletsText}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          bullets: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean)
                        }))
                      }
                      helperText="One bullet per line."
                      fullWidth
                      multiline
                      minRows={4}
                    />
                    <TextField
                      label="Quote"
                      value={draft.quote}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, quote: event.target.value }))
                      }
                      fullWidth
                      multiline
                      minRows={3}
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button variant="contained" onClick={saveAppointment} startIcon={<SaveRoundedIcon />}>
                        Save Appointment
                      </Button>
                      <Button variant="outlined" onClick={resetAppointment}>
                        Reset to Defaults
                      </Button>
                    </Stack>

                    {savedAt ? <Chip label={`Saved at ${savedAt}`} color="success" variant="outlined" /> : null}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#1b6360", color: "white" }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Preview
                </Typography>
                <Stack spacing={1.5}>
                  <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.72)", fontWeight: 700 }}>
                    {draft.eyebrow}
                  </Typography>
                  <Typography sx={{ fontWeight: 800 }}>{draft.title}</Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.7 }}>
                    {draft.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
