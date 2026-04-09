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
import {
  defaultFooterSettings,
  getFooterSettings,
  type FooterSectionSettings
} from "../../data/siteContent";
import { useAdminScrollTop } from "../../hooks/useAdminScrollTop";
import { hydrateSectionValue, saveSectionValue } from "../../services/siteContentStore";
import { validateRequiredText, validateUrl } from "../../utils/adminValidation";

const storageKey = "truecare-site-footer";

function normalizeFooterDraft(value: FooterSectionSettings): FooterSectionSettings {
  return {
    ...defaultFooterSettings,
    ...value,
    socialLinks: value.socialLinks?.length ? value.socialLinks : defaultFooterSettings.socialLinks
  };
}

export default function AdminFooterPage() {
  useAdminScrollTop();
  const [draft, setDraft] = useState<FooterSectionSettings>(
    normalizeFooterDraft(getFooterSettings())
  );
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    void hydrateSectionValue(storageKey, defaultFooterSettings, storageKey).then((value) => {
      setDraft(normalizeFooterDraft(value));
    });
  }, []);

  const saveFooter = async () => {
    const nextDraft = normalizeFooterDraft(draft);
    const socialErrors = nextDraft.socialLinks
      .map((item) => validateUrl(item.href, `${item.label} link`, true))
      .filter(Boolean) as string[];
    const validations = [
      validateRequiredText(nextDraft.address, "Address"),
      validateRequiredText(nextDraft.note, "Footer note"),
      validateRequiredText(nextDraft.copyrightNote, "Copyright note"),
      ...socialErrors
    ].filter(Boolean) as string[];

    if (validations.length > 0) {
      setSaveError(validations[0]);
      return;
    }

    setSaveError(null);
    await saveSectionValue(storageKey, nextDraft, storageKey);
    setDraft(nextDraft);
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const resetFooter = async () => {
    setDraft(defaultFooterSettings);
    await saveSectionValue(storageKey, defaultFooterSettings, storageKey);
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
              Footer Editor
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Update the address line and helper copy shown in the site footer.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ borderRadius: 3, border: "1px solid rgba(16,42,67,0.08)" }}>
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

                    <TextField
                      label="Instagram link"
                      value={
                        normalizeFooterDraft(draft).socialLinks.find(
                          (item) => item.platform === "instagram"
                        )?.href ?? ""
                      }
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          socialLinks: normalizeFooterDraft(current).socialLinks.map((item) =>
                            item.platform === "instagram"
                              ? { ...item, href: event.target.value }
                              : item
                          )
                        }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Facebook link"
                      value={
                        normalizeFooterDraft(draft).socialLinks.find(
                          (item) => item.platform === "facebook"
                        )?.href ?? ""
                      }
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          socialLinks: normalizeFooterDraft(current).socialLinks.map((item) =>
                            item.platform === "facebook"
                              ? { ...item, href: event.target.value }
                              : item
                          )
                        }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="YouTube link"
                      value={
                        normalizeFooterDraft(draft).socialLinks.find(
                          (item) => item.platform === "youtube"
                        )?.href ?? ""
                      }
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          socialLinks: normalizeFooterDraft(current).socialLinks.map((item) =>
                            item.platform === "youtube"
                              ? { ...item, href: event.target.value }
                              : item
                          )
                        }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="LinkedIn link"
                      value={
                        normalizeFooterDraft(draft).socialLinks.find(
                          (item) => item.platform === "linkedin"
                        )?.href ?? ""
                      }
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          socialLinks: normalizeFooterDraft(current).socialLinks.map((item) =>
                            item.platform === "linkedin"
                              ? { ...item, href: event.target.value }
                              : item
                          )
                        }))
                      }
                      fullWidth
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button variant="contained" onClick={saveFooter} startIcon={<SaveRoundedIcon />}>
                        Save Footer
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
                  Preview
                </Typography>
                <Stack spacing={1.5}>
                  <Typography sx={{ fontWeight: 800 }}>True Care Clinic</Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {draft.address}
                  </Typography>
                  <Typography color="text.secondary">{draft.note}</Typography>
                    <Typography color="text.secondary">{draft.copyrightNote}</Typography>
                  <Box>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>Social Links</Typography>
                    <Stack spacing={0.5}>
                      {normalizeFooterDraft(draft).socialLinks.map((item) => (
                        <Typography key={item.platform} color="text.secondary" variant="body2">
                          {item.label}: {item.href}
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
        <DialogTitle>Reset footer?</DialogTitle>
        <DialogContent>
          This will restore the footer address, note, copyright text, and social links to the
          default content.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => void resetFooter()}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
