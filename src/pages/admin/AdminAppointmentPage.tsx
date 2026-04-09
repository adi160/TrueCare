import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { useAdminScrollTop } from "../../hooks/useAdminScrollTop";
import { hydrateSectionValue, saveSectionValue } from "../../services/siteContentStore";
import {
  validateMinimumLines,
  validateRequiredText
} from "../../utils/adminValidation";

const storageKey = "truecare-site-appointment";

export default function AdminAppointmentPage() {
  useAdminScrollTop();
  const [draft, setDraft] = useState<AppointmentSectionSettings>(getAppointmentSettings());
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    void hydrateSectionValue(storageKey, defaultAppointmentSettings, storageKey).then((value) => {
      setDraft(value);
    });
  }, []);

  const bulletsText = useMemo(() => draft.bullets.join("\n"), [draft.bullets]);

  const saveAppointment = async () => {
    const validations = [
      validateRequiredText(draft.eyebrow, "Eyebrow"),
      validateRequiredText(draft.title, "Title"),
      validateRequiredText(draft.description, "Description"),
      validateMinimumLines(draft.bullets, "Bullets", 1),
      validateRequiredText(draft.quote, "Quote")
    ].filter(Boolean) as string[];

    if (validations.length > 0) {
      setSaveError(validations[0]);
      return;
    }

    setSaveError(null);
    await saveSectionValue(storageKey, draft, storageKey);
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const resetAppointment = async () => {
    setDraft(defaultAppointmentSettings);
    await saveSectionValue(storageKey, defaultAppointmentSettings, storageKey);
    setSavedAt(null);
    setSaveError(null);
    setResetOpen(false);
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
                      <Button variant="outlined" onClick={() => setResetOpen(true)}>
                        Reset to Defaults
                      </Button>
                    </Stack>

                    {saveError ? <Alert severity="error">{saveError}</Alert> : null}
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

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <DialogTitle>Reset appointment section?</DialogTitle>
        <DialogContent>
          This will restore the appointment callout, bullets, and quote to the default content.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => void resetAppointment()}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
