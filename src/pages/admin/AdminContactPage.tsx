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
import { defaultContactSettings, getContactSettings, type ContactSectionSettings } from "../../data/siteContent";
import { useAdminScrollTop } from "../../hooks/useAdminScrollTop";
import { hydrateSectionValue, saveSectionValue } from "../../services/siteContentStore";
import {
  validateMaxLength,
  validateEmail,
  validatePhone
} from "../../utils/adminValidation";

const storageKey = "truecare-site-contact";

export default function AdminContactPage() {
  useAdminScrollTop();
  const [draft, setDraft] = useState<ContactSectionSettings>(getContactSettings());
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    void hydrateSectionValue(storageKey, defaultContactSettings, storageKey).then((value) => {
      setDraft(value);
    });
  }, []);

  const saveContact = async () => {
    const validations = [
      validatePhone(draft.phone, "Phone"),
      validateMaxLength(draft.phone, "Phone", 40),
      validatePhone(draft.whatsapp, "WhatsApp"),
      validateMaxLength(draft.whatsapp, "WhatsApp", 40),
      validateEmail(draft.email),
      validateMaxLength(draft.email, "Email", 80)
    ].filter(Boolean) as string[];

    if (validations.length > 0) {
      setSaveError(validations[0]);
      return;
    }

    setSaveError(null);
    await saveSectionValue(storageKey, draft, storageKey);
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const resetContact = async () => {
    setDraft(defaultContactSettings);
    await saveSectionValue(storageKey, defaultContactSettings, storageKey);
    setSavedAt(null);
    setSaveError(null);
    setResetOpen(false);
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
                      inputProps={{ maxLength: 40 }}
                    />
                    <TextField
                      label="WhatsApp"
                      value={draft.whatsapp}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, whatsapp: event.target.value }))
                      }
                      fullWidth
                      inputProps={{ maxLength: 40 }}
                    />
                    <TextField
                      label="Email"
                      value={draft.email}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, email: event.target.value }))
                      }
                      fullWidth
                      inputProps={{ maxLength: 80 }}
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button variant="contained" onClick={saveContact} startIcon={<SaveRoundedIcon />}>
                        Save Contact
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

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <DialogTitle>Reset contact info?</DialogTitle>
        <DialogContent>
          This will restore the phone, WhatsApp, and email values to the default content.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => void resetContact()}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
