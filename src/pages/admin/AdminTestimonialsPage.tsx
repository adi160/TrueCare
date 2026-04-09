import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
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
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { defaultPatientTestimonials, getPatientTestimonials } from "../../data/siteContent";
import { useAdminScrollTop } from "../../hooks/useAdminScrollTop";
import { hydrateSectionValue, saveSectionValue } from "../../services/siteContentStore";
import { validateMaxLength, validateRequiredText } from "../../utils/adminValidation";

const storageKey = "truecare-site-testimonials";

type TestimonialDraft = {
  name: string;
  treatment: string;
  quote: string;
};

export default function AdminTestimonialsPage() {
  useAdminScrollTop();
  const [items, setItems] = useState(getPatientTestimonials());
  const [draft, setDraft] = useState<TestimonialDraft>({
    name: "",
    treatment: "",
    quote: ""
  });
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<(typeof defaultPatientTestimonials)[number] | null>(
    null
  );
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    void hydrateSectionValue(storageKey, defaultPatientTestimonials, storageKey).then((value) => {
      setItems(value);
    });
  }, []);

  const persist = async (nextItems: typeof defaultPatientTestimonials) => {
    await saveSectionValue(storageKey, nextItems, storageKey);
    setItems(nextItems);
  };

  const addItem = () => {
    const validations = [
      validateRequiredText(draft.name, "Patient name"),
      validateMaxLength(draft.name, "Patient name", 60),
      validateRequiredText(draft.treatment, "Treatment"),
      validateMaxLength(draft.treatment, "Treatment", 80),
      validateRequiredText(draft.quote, "Quote"),
      validateMaxLength(draft.quote, "Quote", 180)
    ].filter(Boolean) as string[];

    if (validations.length > 0) {
      setSaveError(validations[0]);
      return;
    }

    setSaveError(null);
    void persist([...items, { ...draft }]);
    setDraft({ name: "", treatment: "", quote: "" });
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const removeItem = (name: string) => {
    void persist(items.filter((item) => item.name !== name));
    setDeleteTarget(null);
  };

  const resetItems = () => {
    void persist(defaultPatientTestimonials);
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
              Testimonials Editor
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Manage the patient review cards shown in the testimonials section.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ borderRadius: 3, border: "1px solid rgba(16,42,67,0.08)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Patient name"
                      value={draft.name}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, name: event.target.value }))
                      }
                      fullWidth
                      inputProps={{ maxLength: 60 }}
                    />
                    <TextField
                      label="Treatment"
                      value={draft.treatment}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, treatment: event.target.value }))
                      }
                      fullWidth
                      inputProps={{ maxLength: 80 }}
                    />
                    <TextField
                      label="Quote"
                      value={draft.quote}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, quote: event.target.value }))
                      }
                      fullWidth
                      multiline
                      minRows={4}
                      inputProps={{ maxLength: 180 }}
                    />

                    <Button variant="contained" onClick={addItem} startIcon={<SaveRoundedIcon />}>
                      Add Testimonial
                    </Button>
                    {saveError ? <Alert severity="error">{saveError}</Alert> : null}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#ffffff", border: "1px solid rgba(31,157,148,0.12)" }}>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  Saved Testimonials
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2.5 }}>
                  {items.length} testimonial{items.length === 1 ? "" : "s"} visible on the site.
                </Typography>

                <Stack spacing={1.5}>
                  {items.map((item) => (
                    <Paper key={item.name} elevation={0} sx={{ p: 1.5, borderRadius: 2, border: "1px solid rgba(16,42,67,0.08)" }}>
                      <Stack direction="row" justifyContent="space-between" spacing={2}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.treatment}
                          </Typography>
                        </Box>
                        <IconButton aria-label={`Remove ${item.name}`} onClick={() => setDeleteTarget(item)} size="small">
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                  <Button variant="outlined" onClick={() => setResetOpen(true)}>
                    Reset Defaults
                  </Button>
                  {savedAt ? <Chip label={`Saved at ${savedAt}`} color="success" variant="outlined" /> : null}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
            <DialogTitle>Delete testimonial?</DialogTitle>
            <DialogContent>
              This will remove <strong>{deleteTarget?.name}</strong> from the saved testimonials.
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  if (deleteTarget) {
                    removeItem(deleteTarget.name);
                  }
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
            <DialogTitle>Reset testimonials?</DialogTitle>
            <DialogContent>
              This will restore the default testimonials and discard any custom entries.
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setResetOpen(false)}>Cancel</Button>
              <Button color="warning" variant="contained" onClick={resetItems}>
                Reset
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </Container>
    </Box>
  );
}
