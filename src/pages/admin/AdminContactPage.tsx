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
import { defaultContactSettings, getContactSettings, type ContactSectionSettings } from "../../data/siteContent";

const storageKey = "truecare-site-contact";

export default function AdminContactPage() {
  const [draft, setDraft] = useState<ContactSectionSettings>(getContactSettings());
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

  const saveContact = () => {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const resetContact = () => {
    setDraft(defaultContactSettings);
    window.localStorage.removeItem(storageKey);
    setSavedAt(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
        background: "linear-gradient(180deg, #f4fbfb 0%, #ecf6f4 100%)"
      }}
    >
      <Container>
        <Stack spacing={3}>
          <Button component={Link} to="/admin" variant="text" startIcon={<ArrowBackRoundedIcon />}>
            Back to Admin
          </Button>

          <Box>
            <Typography variant="h2" sx={{ mb: 1 }}>
              Contact Editor
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Update phone, WhatsApp, and email values used in the header, hero, and floating
              contact buttons.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ borderRadius: 3, border: "1px solid rgba(16,42,67,0.08)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Phone"
                      value={draft.phone}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, phone: event.target.value }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="WhatsApp"
                      value={draft.whatsapp}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, whatsapp: event.target.value }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      value={draft.email}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, email: event.target.value }))
                      }
                      fullWidth
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button variant="contained" onClick={saveContact} startIcon={<SaveRoundedIcon />}>
                        Save Contact
                      </Button>
                      <Button variant="outlined" onClick={resetContact}>
                        Reset to Defaults
                      </Button>
                    </Stack>

                    {savedAt ? <Chip label={`Saved at ${savedAt}`} color="success" variant="outlined" /> : null}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#ffffff", border: "1px solid rgba(16,42,67,0.08)" }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Preview
                </Typography>
                <Stack spacing={1.5}>
                  <Typography sx={{ fontWeight: 800 }}>{draft.phone}</Typography>
                  <Typography sx={{ fontWeight: 800 }}>{draft.whatsapp}</Typography>
                  <Typography color="text.secondary">{draft.email}</Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
