import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
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
import { hydrateSectionValue, saveSectionValue } from "../../services/siteContentStore";

const storageKey = "truecare-site-testimonials";

type TestimonialDraft = {
  name: string;
  treatment: string;
  quote: string;
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState(getPatientTestimonials());
  const [draft, setDraft] = useState<TestimonialDraft>({
    name: "",
    treatment: "",
    quote: ""
  });
  const [savedAt, setSavedAt] = useState<string | null>(null);

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
    if (!draft.name.trim() || !draft.treatment.trim() || !draft.quote.trim()) {
      return;
    }

    void persist([...items, { ...draft }]);
    setDraft({ name: "", treatment: "", quote: "" });
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const removeItem = (name: string) => {
    void persist(items.filter((item) => item.name !== name));
  };

  const resetItems = () => {
    void persist(defaultPatientTestimonials);
    setSavedAt(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
        background: "linear-gradient(180deg, #123c3a 0%, #0c2928 100%)"
      }}
    >
      <Container>
        <Stack spacing={3}>
          <Button component={Link} to="/admin" variant="text" startIcon={<ArrowBackRoundedIcon />} sx={{ color: "white" }}>
            Back to Admin
          </Button>

          <Box>
            <Typography variant="h2" sx={{ mb: 1, color: "white" }}>
              Testimonials Editor
            </Typography>
            <Typography sx={{ maxWidth: 760, color: "rgba(255,255,255,0.72)" }}>
              Manage the patient review cards shown in the testimonials section.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ borderRadius: 3, border: "1px solid rgba(255,255,255,0.14)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Patient name"
                      value={draft.name}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, name: event.target.value }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Treatment"
                      value={draft.treatment}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, treatment: event.target.value }))
                      }
                      fullWidth
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
                    />

                    <Button variant="contained" onClick={addItem} startIcon={<SaveRoundedIcon />}>
                      Add Testimonial
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#ffffff", border: "1px solid rgba(255,255,255,0.14)" }}>
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
                        <IconButton aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.name)} size="small">
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                  <Button variant="outlined" onClick={resetItems}>
                    Reset Defaults
                  </Button>
                  {savedAt ? <Chip label={`Saved at ${savedAt}`} color="success" variant="outlined" /> : null}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
