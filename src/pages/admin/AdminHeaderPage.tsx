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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  defaultHeaderSettings,
  getSiteHeaderSettings,
  type SiteHeaderSettings
} from "../../data/siteContent";
import { hydrateSectionValue, saveSectionValue } from "../../services/siteContentStore";

const storageKey = "truecare-site-header";

export default function AdminHeaderPage() {
  const [draft, setDraft] = useState<SiteHeaderSettings>(getSiteHeaderSettings());
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    void hydrateSectionValue(storageKey, defaultHeaderSettings, storageKey).then((value) => {
      setDraft(value);
    });
  }, []);

  const saveHeader = async () => {
    await saveSectionValue(storageKey, draft, storageKey);
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const resetHeader = async () => {
    setDraft(defaultHeaderSettings);
    await saveSectionValue(storageKey, defaultHeaderSettings, storageKey);
    setSavedAt(null);
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
              Header Editor
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Update the clinic name and the subtitle shown below the clinic name in the main
              header.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ borderRadius: 3, border: "1px solid rgba(16,42,67,0.08)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Clinic name"
                      value={draft.clinicName}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, clinicName: event.target.value }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Subtitle"
                      value={draft.tagline}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, tagline: event.target.value }))
                      }
                      fullWidth
                      multiline
                      minRows={2}
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button variant="contained" onClick={saveHeader} startIcon={<SaveRoundedIcon />}>
                        Save Header
                      </Button>
                      <Button variant="outlined" onClick={resetHeader}>
                        Reset to Defaults
                      </Button>
                    </Stack>

                    {savedAt ? <Chip label={`Saved at ${savedAt}`} color="success" variant="outlined" /> : null}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  border: "1px solid rgba(31,157,148,0.12)"
                }}
              >
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Live Preview
                </Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ pt: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {draft.clinicName}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.7 }}>
                      {draft.tagline}
                    </Typography>
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
