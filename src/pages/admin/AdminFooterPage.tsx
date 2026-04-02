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
  defaultFooterSettings,
  getFooterSettings,
  type FooterSectionSettings
} from "../../data/siteContent";

const storageKey = "truecare-site-footer";

export default function AdminFooterPage() {
  const [draft, setDraft] = useState<FooterSectionSettings>(getFooterSettings());
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

  const saveFooter = () => {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const resetFooter = () => {
    setDraft(defaultFooterSettings);
    window.localStorage.removeItem(storageKey);
    setSavedAt(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
        background: "linear-gradient(180deg, #0f2323 0%, #162f2f 100%)"
      }}
    >
      <Container>
        <Stack spacing={3}>
          <Button component={Link} to="/admin" variant="text" startIcon={<ArrowBackRoundedIcon />} sx={{ color: "white" }}>
            Back to Admin
          </Button>

          <Box>
            <Typography variant="h2" sx={{ mb: 1, color: "white" }}>
              Footer Editor
            </Typography>
            <Typography sx={{ maxWidth: 760, color: "rgba(255,255,255,0.72)" }}>
              Update the address line and helper copy shown in the site footer.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ borderRadius: 3, border: "1px solid rgba(255,255,255,0.14)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Address"
                      value={draft.address}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, address: event.target.value }))
                      }
                      fullWidth
                      multiline
                      minRows={3}
                    />
                    <TextField
                      label="Footer note"
                      value={draft.note}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, note: event.target.value }))
                      }
                      fullWidth
                      multiline
                      minRows={2}
                    />
                    <TextField
                      label="Copyright note"
                      value={draft.copyrightNote}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, copyrightNote: event.target.value }))
                      }
                      fullWidth
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button variant="contained" onClick={saveFooter} startIcon={<SaveRoundedIcon />}>
                        Save Footer
                      </Button>
                      <Button variant="outlined" onClick={resetFooter}>
                        Reset to Defaults
                      </Button>
                    </Stack>

                    {savedAt ? <Chip label={`Saved at ${savedAt}`} color="success" variant="outlined" /> : null}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#ffffff", border: "1px solid rgba(255,255,255,0.14)" }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Preview
                </Typography>
                <Stack spacing={1.5}>
                  <Typography sx={{ fontWeight: 800 }}>True Care Clinic</Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {draft.address}
                  </Typography>
                  <Typography color="text.secondary">{draft.note}</Typography>
                  <Typography color="text.secondary">{draft.copyrightNote}</Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
