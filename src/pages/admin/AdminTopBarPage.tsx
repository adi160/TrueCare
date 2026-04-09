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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { defaultContactSettings, defaultTopBarSettings, getContactSettings, getTopBarSettings } from "../../data/siteContent";
import type { ContactSectionSettings, SiteTopBarSettings } from "../../data/siteContent";
import { useAdminScrollTop } from "../../hooks/useAdminScrollTop";
import { hydrateSectionValue, saveSectionValue } from "../../services/siteContentStore";
import {
  validatePhone,
  validateRequiredText
} from "../../utils/adminValidation";

const topBarStorageKey = "truecare-site-topbar";
const contactStorageKey = "truecare-site-contact";

export default function AdminTopBarPage() {
  useAdminScrollTop();
  const [topBarDraft, setTopBarDraft] = useState<SiteTopBarSettings>(getTopBarSettings());
  const [contactDraft, setContactDraft] = useState<ContactSectionSettings>(getContactSettings());
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    void hydrateSectionValue(topBarStorageKey, defaultTopBarSettings, topBarStorageKey).then(
      (value) => {
        setTopBarDraft(value);
      }
    );
    void hydrateSectionValue(contactStorageKey, defaultContactSettings, contactStorageKey).then(
      (value) => {
        setContactDraft(value);
      }
    );
  }, []);

  const saveTopBar = async () => {
    const validations = [
      validateRequiredText(topBarDraft.topLineLeft, "Left text"),
      validateRequiredText(topBarDraft.topLineRight, "Right text"),
      validatePhone(contactDraft.phone, "Phone"),
      validatePhone(contactDraft.whatsapp, "WhatsApp")
    ].filter(Boolean) as string[];

    if (validations.length > 0) {
      setSaveError(validations[0]);
      return;
    }

    setSaveError(null);
    await saveSectionValue(topBarStorageKey, topBarDraft, topBarStorageKey);
    await saveSectionValue(contactStorageKey, contactDraft, contactStorageKey);
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const resetTopBar = async () => {
    setTopBarDraft(defaultTopBarSettings);
    setContactDraft(defaultContactSettings);
    await saveSectionValue(topBarStorageKey, defaultTopBarSettings, topBarStorageKey);
    await saveSectionValue(contactStorageKey, defaultContactSettings, contactStorageKey);
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

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <DialogTitle>Reset above-header settings?</DialogTitle>
        <DialogContent>
          This will restore the top strip text and contact numbers to the default content.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => void resetTopBar()}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
