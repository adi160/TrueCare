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
import { defaultContactSettings, defaultTopBarSettings, getContactSettings, getTopBarSettings } from "../../data/siteContent";
import type { ContactSectionSettings, SiteTopBarSettings } from "../../data/siteContent";

const topBarStorageKey = "truecare-site-topbar";
const contactStorageKey = "truecare-site-contact";

export default function AdminTopBarPage() {
  const [topBarDraft, setTopBarDraft] = useState<SiteTopBarSettings>(getTopBarSettings());
  const [contactDraft, setContactDraft] = useState<ContactSectionSettings>(getContactSettings());
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedTopBar = window.localStorage.getItem(topBarStorageKey);
      const savedContact = window.localStorage.getItem(contactStorageKey);
      if (savedTopBar) {
        setTopBarDraft((current) => ({ ...current, ...JSON.parse(savedTopBar) }));
      }
      if (savedContact) {
        setContactDraft((current) => ({ ...current, ...JSON.parse(savedContact) }));
      }
    } catch {
      // Keep defaults.
    }
  }, []);

  const saveTopBar = () => {
    window.localStorage.setItem(topBarStorageKey, JSON.stringify(topBarDraft));
    window.localStorage.setItem(contactStorageKey, JSON.stringify(contactDraft));
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const resetTopBar = () => {
    setTopBarDraft(defaultTopBarSettings);
    setContactDraft(defaultContactSettings);
    window.localStorage.removeItem(topBarStorageKey);
    window.localStorage.removeItem(contactStorageKey);
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
              Above Header Editor
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Edit the thin strip above the main header, including the contact numbers shown on the
              right side.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ borderRadius: 3, border: "1px solid rgba(16,42,67,0.08)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Left text"
                      value={topBarDraft.topLineLeft}
                      onChange={(event) =>
                        setTopBarDraft((current) => ({ ...current, topLineLeft: event.target.value }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Right text"
                      value={topBarDraft.topLineRight}
                      onChange={(event) =>
                        setTopBarDraft((current) => ({ ...current, topLineRight: event.target.value }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Phone"
                      value={contactDraft.phone}
                      onChange={(event) =>
                        setContactDraft((current) => ({ ...current, phone: event.target.value }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="WhatsApp"
                      value={contactDraft.whatsapp}
                      onChange={(event) =>
                        setContactDraft((current) => ({ ...current, whatsapp: event.target.value }))
                      }
                      fullWidth
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button variant="contained" onClick={saveTopBar} startIcon={<SaveRoundedIcon />}>
                        Save Above Header
                      </Button>
                      <Button variant="outlined" onClick={resetTopBar}>
                        Reset to Defaults
                      </Button>
                    </Stack>

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
                <Stack spacing={1}>
                  <Typography sx={{ fontWeight: 700 }}>{topBarDraft.topLineLeft}</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{topBarDraft.topLineRight}</Typography>
                  <Typography color="text.secondary">{contactDraft.phone}</Typography>
                  <Typography color="text.secondary">{contactDraft.whatsapp}</Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
