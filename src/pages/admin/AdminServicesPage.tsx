import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Box,
  Button,
  ButtonBase,
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
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Service } from "../../types/clinic";
import ImageUploadField from "../../components/admin/ImageUploadField";
import { hydrateSectionValue, saveSectionValue } from "../../services/siteContentStore";

const storageKey = "truecare-extra-services";

function createServiceSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    heroImage: "",
    details: "",
    benefitsText: ""
  });
  useEffect(() => {
    void hydrateSectionValue<Service[]>(storageKey, [], storageKey).then((value) => {
      setServices(value);
    });
  }, []);

  const shortDescriptionWords = useMemo(
    () => draft.shortDescription.trim().split(/\s+/).filter(Boolean),
    [draft.shortDescription]
  );
  const shortDescriptionError =
    draft.shortDescription.trim().length > 0 &&
    (shortDescriptionWords.length < 8 ||
      shortDescriptionWords.length > 10 ||
      draft.shortDescription.trim().length > 110);

  const persist = async (nextServices: Service[]) => {
    await saveSectionValue(storageKey, nextServices, storageKey);
    setServices(nextServices);
  };

  const resetDraft = () => {
    setEditingSlug(null);
    setDraft({
      name: "",
      slug: "",
      shortDescription: "",
      heroImage: "",
      details: "",
      benefitsText: ""
    });
  };

  const loadServiceIntoForm = (service: Service) => {
    setEditingSlug(service.slug);
    setDraft({
      name: service.name,
      slug: service.slug,
      shortDescription: service.shortDescription,
      heroImage: service.heroImage,
      details: service.details,
      benefitsText: service.benefits.join(", ")
    });
  };

  const saveService = () => {
    const nextService: Service = {
      slug: draft.slug || createServiceSlug(draft.name),
      name: draft.name.trim(),
      shortDescription: draft.shortDescription.trim(),
      heroImage: draft.heroImage.trim(),
      details: draft.details.trim(),
      benefits: draft.benefitsText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    };

    if (!nextService.name || !nextService.slug || !nextService.heroImage) {
      return;
    }

    if (
      nextService.shortDescription.split(/\s+/).filter(Boolean).length < 8 ||
      nextService.shortDescription.split(/\s+/).filter(Boolean).length > 10 ||
      nextService.shortDescription.length > 110
    ) {
      return;
    }

    const duplicate = services.find(
      (service) => service.slug === nextService.slug && service.slug !== editingSlug
    );

    if (duplicate) {
      return;
    }

    const nextServices = editingSlug
      ? services.map((service) => (service.slug === editingSlug ? nextService : service))
      : [...services, nextService];

    void persist(nextServices);
    resetDraft();
  };

  const removeService = (slug: string) => {
    void persist(services.filter((service) => service.slug !== slug));
    if (editingSlug === slug) {
      resetDraft();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
        background:
          "radial-gradient(circle at top right, rgba(224,182,111,0.14), transparent 26%), linear-gradient(180deg, #fffdfa 0%, #f8f1e6 100%)"
      }}
    >
      <Container>
        <Stack spacing={3}>
          <Button component={Link} to="/admin" variant="text" startIcon={<ArrowBackRoundedIcon />}>
            Back to Admin
          </Button>

          <Box>
            <Typography variant="h2" sx={{ mb: 1 }}>
              Services Editor
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Add extra service cards from here. The site reads these entries automatically and
              shows them alongside the built-in services.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ borderRadius: 3, border: "1px solid rgba(16,42,67,0.08)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    {editingSlug ? (
                      <Chip
                        label="Editing existing service"
                        color="secondary"
                        variant="outlined"
                        sx={{ alignSelf: "flex-start" }}
                      />
                    ) : null}
                    <TextField
                      label="Service name"
                      value={draft.name}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, name: event.target.value }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Slug"
                      value={draft.slug}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, slug: event.target.value }))
                      }
                      helperText="Leave blank to auto-generate from the name."
                      fullWidth
                    />
                    <TextField
                      label="Short description"
                      value={draft.shortDescription}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, shortDescription: event.target.value }))
                      }
                      error={shortDescriptionError}
                      helperText={
                        shortDescriptionError
                          ? "Use 8-10 words and keep it under about 110 characters."
                          : `${shortDescriptionWords.length} / 8-10 words. Keep it short enough for two lines.`
                      }
                      fullWidth
                      multiline
                      minRows={2}
                      inputProps={{ maxLength: 110 }}
                    />
                    <ImageUploadField
                      label="Hero image URL"
                      folder="services"
                      value={draft.heroImage}
                      onChange={(value) => setDraft((current) => ({ ...current, heroImage: value }))}
                      previewAlt={draft.name || "Service image"}
                      helperText="Upload a service image or paste a URL. This image will appear on the service card and page."
                    />
                    <TextField
                      label="Details"
                      value={draft.details}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, details: event.target.value }))
                      }
                      fullWidth
                      multiline
                      minRows={4}
                    />
                    <TextField
                      label="Benefits"
                      value={draft.benefitsText}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, benefitsText: event.target.value }))
                      }
                      helperText="Separate each benefit with a comma."
                      fullWidth
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button variant="contained" onClick={saveService} startIcon={<SaveRoundedIcon />}>
                        {editingSlug ? "Save Changes" : "Add Service"}
                      </Button>
                      {editingSlug ? (
                        <Button variant="outlined" onClick={resetDraft}>
                          Cancel Edit
                        </Button>
                      ) : null}
                    </Stack>
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
                  border: "1px solid rgba(224,182,111,0.14)"
                }}
              >
                <Typography variant="h5" sx={{ mb: 1 }}>
                  Added Services
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2.5 }}>
                  {services.length} custom item{services.length === 1 ? "" : "s"} saved, in addition
                  to the built-in services on the live site.
                </Typography>

                <Stack spacing={1.5}>
                  {services.length === 0 ? (
                    <Chip label="No custom services yet" variant="outlined" />
                  ) : (
                    services.map((service) => (
                      <ButtonBase
                        key={service.slug}
                        onClick={() => loadServiceIntoForm(service)}
                        sx={{ width: "100%", borderRadius: 2, textAlign: "left" }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            width: "100%",
                            p: 1.5,
                            borderRadius: 2,
                            border:
                              editingSlug === service.slug
                                ? "1px solid rgba(31,157,148,0.35)"
                                : "1px solid rgba(16,42,67,0.08)",
                            bgcolor:
                              editingSlug === service.slug
                                ? "rgba(31,157,148,0.06)"
                                : "#ffffff"
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" spacing={2}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontWeight: 700 }}>{service.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {service.slug}
                              </Typography>
                            </Box>
                            <IconButton
                              aria-label={`Remove ${service.name}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                removeService(service.slug);
                              }}
                              size="small"
                            >
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Paper>
                      </ButtonBase>
                    ))
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
