import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { defaultDoctorProfile, getDoctorProfile } from "../../data/siteContent";
import ImageUploadField from "../../components/admin/ImageUploadField";
import { useAdminScrollTop } from "../../hooks/useAdminScrollTop";
import { hydrateSectionValue, saveSectionValue } from "../../services/siteContentStore";
import {
  validateMinimumLines,
  validateRequiredText,
  validateUrl
} from "../../utils/adminValidation";

const storageKey = "truecare-site-doctor";

export default function AdminDoctorPage() {
  useAdminScrollTop();
  const [draft, setDraft] = useState(getDoctorProfile());
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    void hydrateSectionValue(storageKey, defaultDoctorProfile, storageKey).then((value) => {
      setDraft(value);
    });
  }, []);

  const qualificationsText = useMemo(() => draft.qualifications.join("\n"), [draft.qualifications]);
  const expertiseText = useMemo(() => draft.expertise.join("\n"), [draft.expertise]);
  const philosophyText = useMemo(() => draft.philosophy.join("\n"), [draft.philosophy]);

  const saveDoctor = async () => {
    const validations = [
      validateRequiredText(draft.doctorName, "Doctor name"),
      validateRequiredText(draft.doctorBio, "Doctor bio"),
      validateRequiredText(draft.title, "Profile title"),
      validateRequiredText(draft.summary, "Summary"),
      validateUrl(draft.image, "Profile image URL"),
      validateRequiredText(draft.experience, "Experience"),
      validateMinimumLines(draft.qualifications, "Qualifications", 1),
      validateMinimumLines(draft.expertise, "Expertise", 1),
      validateMinimumLines(draft.philosophy, "Philosophy", 1)
    ].filter(Boolean) as string[];

    if (validations.length > 0) {
      setSaveError(validations[0]);
      return;
    }

    setSaveError(null);
    await saveSectionValue(storageKey, draft, storageKey);
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const resetDoctor = async () => {
    setDraft(defaultDoctorProfile);
    await saveSectionValue(storageKey, defaultDoctorProfile, storageKey);
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
          "radial-gradient(circle at top right, rgba(107,150,214,0.14), transparent 26%), linear-gradient(180deg, #f8fbff 0%, #edf4fb 100%)"
      }}
    >
      <Container>
        <Stack spacing={3}>
          <Button component={Link} to="/admin" variant="text" startIcon={<ArrowBackRoundedIcon />}>
            Back to Admin
          </Button>

          <Box>
            <Typography variant="h2" sx={{ mb: 1 }}>
              Doctor Editor
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Update the doctor profile text, image, and expertise blocks used on the home page
              and doctor page.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ borderRadius: 3, border: "1px solid rgba(16,42,67,0.08)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Doctor name"
                      value={draft.doctorName}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, doctorName: event.target.value }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Doctor bio"
                      value={draft.doctorBio}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, doctorBio: event.target.value }))
                      }
                      fullWidth
                      multiline
                      minRows={2}
                    />
                    <TextField
                      label="Profile title"
                      value={draft.title}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, title: event.target.value }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Summary"
                      value={draft.summary}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, summary: event.target.value }))
                      }
                      fullWidth
                      multiline
                      minRows={3}
                    />
                    <ImageUploadField
                      label="Profile image URL"
                      folder="doctor"
                      value={draft.image}
                      onChange={(value) => setDraft((current) => ({ ...current, image: value }))}
                      previewAlt={draft.doctorName}
                      helperText="Upload the doctor image once and the live doctor sections will use it everywhere."
                    />
                    <TextField
                      label="Experience"
                      value={draft.experience}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, experience: event.target.value }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Qualifications"
                      value={qualificationsText}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          qualifications: event.target.value
                            .split("\n")
                            .map((item) => item.trim())
                            .filter(Boolean)
                        }))
                      }
                      helperText="One qualification per line."
                      fullWidth
                      multiline
                      minRows={4}
                    />
                    <TextField
                      label="Expertise"
                      value={expertiseText}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          expertise: event.target.value
                            .split("\n")
                            .map((item) => item.trim())
                            .filter(Boolean)
                        }))
                      }
                      helperText="One expertise item per line."
                      fullWidth
                      multiline
                      minRows={4}
                    />
                    <TextField
                      label="Philosophy"
                      value={philosophyText}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          philosophy: event.target.value
                            .split("\n")
                            .map((item) => item.trim())
                            .filter(Boolean)
                        }))
                      }
                      helperText="One philosophy line per line."
                      fullWidth
                      multiline
                      minRows={4}
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button variant="contained" onClick={saveDoctor} startIcon={<SaveRoundedIcon />}>
                        Save Doctor
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
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#ffffff", border: "1px solid rgba(107,150,214,0.14)" }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Preview
                </Typography>
                <Stack spacing={1.5}>
                  <Typography sx={{ fontWeight: 800 }}>{draft.doctorName}</Typography>
                  <Typography color="text.secondary">{draft.doctorBio}</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{draft.title}</Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {draft.summary}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
            <DialogTitle>Reset doctor profile?</DialogTitle>
            <DialogContent>
              This will restore the default doctor profile and discard your current changes.
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setResetOpen(false)}>Cancel</Button>
              <Button color="warning" variant="contained" onClick={resetDoctor}>
                Reset
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </Container>
    </Box>
  );
}
