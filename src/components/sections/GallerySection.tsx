import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import { getGalleryItems } from "../../data/gallery";

interface GallerySectionProps {
  onViewAll?: () => void;
  showViewAll?: boolean;
}

export default function GallerySection({
  onViewAll,
  showViewAll = true
}: GallerySectionProps) {
  const galleryItems = getGalleryItems();

  return (
    <Box
      id="gallery"
      sx={{
        py: { xs: 9, md: 12 },
        background: "linear-gradient(180deg, #f8fbff 0%, #edf4fb 100%)",
        borderTop: "1px solid rgba(107,150,214,0.12)",
        borderBottom: "1px solid rgba(107,150,214,0.12)"
      }}
    >
      <Container>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          sx={{ mb: 5 }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{ color: "primary.main", letterSpacing: "0.18em", fontWeight: 700 }}
            >
              Gallery
            </Typography>
            <Typography variant="h3" sx={{ mt: 1.5, mb: 1, maxWidth: 740 }}>
              Before and after treatment examples, ready for your clinic photos.
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              This section is designed for before-and-after visuals. Replace the sample images with
              your own treatment photography as the gallery grows.
            </Typography>
          </Box>

          {showViewAll && onViewAll ? (
            <Button
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={onViewAll}
              sx={{ borderRadius: 999, px: 2.5, py: 1.2 }}
            >
              View Full Gallery
            </Button>
          ) : null}
        </Stack>

        <Grid container spacing={3}>
          {galleryItems.map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item.title}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid rgba(37,87,158,0.1)",
                  boxShadow: "0 24px 60px rgba(37,87,158,0.08)",
                  overflow: "hidden"
                }}
              >
                <CardContent sx={{ p: 2.25 }}>
                  <Typography variant="h5" sx={{ mb: 0.75 }}>
                    {item.title}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: { xs: 1.25, sm: "1px" },
                      p: { xs: 0, sm: "1px" },
                      borderRadius: 3,
                      overflow: "hidden",
                      bgcolor: "rgba(16,42,67,0.08)",
                      border: "1px solid rgba(16,42,67,0.08)"
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        minHeight: { xs: 220, sm: 250 },
                        bgcolor: "#113434"
                      }}
                    >
                      <Box
                        component="img"
                        src={item.beforeImage}
                        alt={`${item.treatment} before`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          minHeight: { xs: 220, sm: 250 },
                          objectFit: "cover",
                          display: "block",
                          filter: "saturate(0.95) contrast(1.02)"
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          px: 2,
                          py: 1.1,
                          color: "white",
                          background:
                            "linear-gradient(90deg, rgba(17,52,52,0.96) 0%, rgba(17,52,52,0.75) 72%, rgba(17,52,52,0.15) 100%)",
                          display: "flex",
                          justifyContent: "flex-end"
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: 700, letterSpacing: "0.03em", fontSize: 14 }}
                        >
                          Before
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        minHeight: { xs: 220, sm: 250 },
                        bgcolor: "#1f9d94"
                      }}
                    >
                      <Box
                        component="img"
                        src={item.afterImage}
                        alt={`${item.treatment} after`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          minHeight: { xs: 220, sm: 250 },
                          objectFit: "cover",
                          display: "block",
                          filter: "saturate(1.02) contrast(1.02)"
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          px: 2,
                          py: 1.1,
                          color: "white",
                          background:
                            "linear-gradient(90deg, rgba(31,157,148,0.95) 0%, rgba(31,157,148,0.74) 72%, rgba(31,157,148,0.18) 100%)",
                          display: "flex",
                          justifyContent: "flex-end"
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: 700, letterSpacing: "0.03em", fontSize: 14 }}
                        >
                          After
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
