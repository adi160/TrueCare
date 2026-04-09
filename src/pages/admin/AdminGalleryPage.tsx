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
import type { GalleryItem } from "../../data/gallery";
import ImageUploadField from "../../components/admin/ImageUploadField";
import { useAdminScrollTop } from "../../hooks/useAdminScrollTop";
import { hydrateSectionValue, saveSectionValue } from "../../services/siteContentStore";
import {
  validateRequiredText,
  validateUrl
} from "../../utils/adminValidation";

const storageKey = "truecare-extra-gallery-items";

export default function AdminGalleryPage() {
  useAdminScrollTop();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [draft, setDraft] = useState({
    title: "",
    treatment: "",
    description: "",
    beforeImage: "",
    afterImage: ""
  });

  useEffect(() => {
    void hydrateSectionValue<GalleryItem[]>(storageKey, [], storageKey).then((value) => {
      setGalleryItems(value);
    });
  }, []);

  const persist = async (nextItems: GalleryItem[]) => {
    await saveSectionValue(storageKey, nextItems, storageKey);
    setGalleryItems(nextItems);
  };

  const addGalleryItem = () => {
    const nextItem: GalleryItem = {
      title: draft.title.trim(),
      treatment: draft.treatment.trim(),
      description: draft.description.trim(),
      beforeImage: draft.beforeImage.trim(),
      afterImage: draft.afterImage.trim()
    };

    const validations = [
      validateRequiredText(nextItem.title, "Card title"),
      validateRequiredText(nextItem.treatment, "Treatment name"),
      validateRequiredText(nextItem.description, "Description"),
      validateUrl(nextItem.beforeImage, "Before image URL"),
      validateUrl(nextItem.afterImage, "After image URL")
    ].filter(Boolean) as string[];

    if (validations.length > 0) {
      setSaveError(validations[0]);
      return;
    }

    setSaveError(null);
    void persist([...galleryItems, nextItem]);
    setDraft({
      title: "",
      treatment: "",
      description: "",
      beforeImage: "",
      afterImage: ""
    });
  };

  const removeGalleryItem = (title: string) => {
    void persist(galleryItems.filter((item) => item.title !== title));
    setDeleteTarget(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
        background:
          "radial-gradient(circle at top left, rgba(107,150,214,0.14), transparent 26%), linear-gradient(180deg, #f8fbff 0%, #edf4fb 100%)"
      }}
    >
      <Container>
        <Stack spacing={3}>
          <Button component={Link} to="/admin" variant="text" startIcon={<ArrowBackRoundedIcon />}>
            Back to Admin
          </Button>

          <Box>
            <Typography variant="h2" sx={{ mb: 1 }}>
              Gallery Editor
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Add before and after image pairs here. These entries feed the gallery section on the
              home page and the dedicated gallery page.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ borderRadius: 3, border: "1px solid rgba(16,42,67,0.08)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Card title"
                      value={draft.title}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, title: event.target.value }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Treatment name"
                      value={draft.treatment}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, treatment: event.target.value }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Description"
                      value={draft.description}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, description: event.target.value }))
                      }
                      fullWidth
                      multiline
                      minRows={3}
                    />
                    <ImageUploadField
                      label="Before image URL"
                      folder="gallery/before"
                      value={draft.beforeImage}
                      onChange={(value) =>
                        setDraft((current) => ({ ...current, beforeImage: value }))
                      }
                      previewAlt={`${draft.title || "Gallery"} before`}
                      helperText="Upload the before image or paste its URL."
                    />
                    <ImageUploadField
                      label="After image URL"
                      folder="gallery/after"
                      value={draft.afterImage}
                      onChange={(value) =>
                        setDraft((current) => ({ ...current, afterImage: value }))
                      }
                      previewAlt={`${draft.title || "Gallery"} after`}
                      helperText="Upload the after image or paste its URL."
                    />

                    <Button variant="contained" onClick={addGalleryItem} startIcon={<SaveRoundedIcon />}>
                      Add Gallery Item
                    </Button>
                    {saveError ? <Alert severity="error">{saveError}</Alert> : null}
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
                  border: "1px solid rgba(107,150,214,0.14)"
                }}
              >
                <Typography variant="h5" sx={{ mb: 1 }}>
                  Added Gallery Items
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2.5 }}>
                  {galleryItems.length} custom item{galleryItems.length === 1 ? "" : "s"} saved,
                  ready to appear in the site gallery.
                </Typography>

                <Stack spacing={1.5}>
                  {galleryItems.length === 0 ? (
                    <Chip label="No custom gallery items yet" variant="outlined" />
                  ) : (
                    galleryItems.map((item) => (
                      <Paper
                        key={item.title}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid rgba(16,42,67,0.08)"
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" spacing={2}>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.treatment}
                            </Typography>
                          </Box>
                          <IconButton
                            aria-label={`Remove ${item.title}`}
                            onClick={() => setDeleteTarget(item)}
                            size="small"
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Paper>
                    ))
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
            <DialogTitle>Delete gallery item?</DialogTitle>
            <DialogContent>
              This will remove <strong>{deleteTarget?.title}</strong> from the saved gallery items.
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  if (deleteTarget) {
                    removeGalleryItem(deleteTarget.title);
                  }
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </Container>
    </Box>
  );
}
