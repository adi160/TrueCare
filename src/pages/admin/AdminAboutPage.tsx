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
import { defaultStorySettings, getStorySettings, type SiteStorySettings } from "../../data/siteContent";
import { useAdminScrollTop } from "../../hooks/useAdminScrollTop";
import { hydrateSectionValue, saveSectionValue } from "../../services/siteContentStore";
import {
  validateMinimumLines,
  validateRequiredText
} from "../../utils/adminValidation";

const storageKey = "truecare-site-story";

export default function AdminAboutPage() {
  useAdminScrollTop();
  const [draft, setDraft] = useState<SiteStorySettings>(getStorySettings());
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    void hydrateSectionValue(storageKey, defaultStorySettings, storageKey).then((value) => {
      setDraft(value);
    });
  }, []);

  const highlightsText = useMemo(() => draft.highlights.join("\n"), [draft.highlights]);
  const statsText = useMemo(
    () => draft.stats.map((stat) => `${stat.value}|${stat.label}`).join("\n"),
    [draft.stats]
  );

  const saveAbout = async () => {
    const validations = [
      validateRequiredText(draft.eyebrow, "Eyebrow"),
      validateRequiredText(draft.title, "Title"),
      validateRequiredText(draft.description, "Description"),
      validateMinimumLines(draft.highlights, "Highlights", 1),
      validateMinimumLines(
        draft.stats.map((stat) => `${stat.value}|${stat.label}`),
        "Stats",
        1
      )
    ].filter(Boolean) as string[];

    if (validations.length > 0) {
      setSaveError(validations[0]);
      return;
    }

    setSaveError(null);
    await saveSectionValue(storageKey, draft, storageKey);
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const resetAbout = async () => {
    setDraft(defaultStorySettings);
    await saveSectionValue(storageKey, defaultStorySettings, storageKey);
    setSavedAt(null);
    setSaveError(null);
    setResetOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
        background:
          "radial-gradient(circle at top left, rgba(31,157,148,0.12), transparent 28%), linear-gradient(180deg, #f4fbfb 0%, #ecf6f4 100%)"
      }}
    >
      <Container>
        <Stack spacing={3}>
          <Button component={Link} to="/admin" variant="text" startIcon={<ArrowBackRoundedIcon />}>
            Back to Admin
          </Button>

          <Box>
            <Typography variant="h2" sx={{ mb: 1 }}>
              About Editor
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Edit the welcome section, trust-building copy, and the stats shown on the home page.
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
                      label="Highlights"
                      value={highlightsText}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          highlights: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean)
                        }))
                      }
                      helperText="One highlight per line."
                      fullWidth
                      multiline
                      minRows={4}
                    />
                    <TextField
                      label="Stats"
                      value={statsText}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          stats: event.target.value
                            .split("\n")
                            .map((item) => item.trim())
                            .filter(Boolean)
                            .map((item) => {
                              const [value = "", ...rest] = item.split("|");
                              return { value: value.trim(), label: rest.join("|").trim() };
                            })
                            .filter((item) => item.value && item.label)
                        }))
                      }
                      helperText="Use format: value|label. One stat per line."
                      fullWidth
                      multiline
                      minRows={4}
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button variant="contained" onClick={saveAbout} startIcon={<SaveRoundedIcon />}>
                        Save About
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
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#ffffff", border: "1px solid rgba(31,157,148,0.12)" }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Preview
                </Typography>
                <Stack spacing={1.5}>
                  <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 700 }}>
                    {draft.eyebrow}
                  </Typography>
                  <Typography sx={{ fontWeight: 800 }}>{draft.title}</Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {draft.description}
                  </Typography>
                  <Box>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>Highlights</Typography>
                    <Stack spacing={0.75}>
                      {draft.highlights.map((item) => (
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

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <DialogTitle>Reset about section?</DialogTitle>
        <DialogContent>
          This will restore the about copy, highlights, and stats to the default content.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => void resetAbout()}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
