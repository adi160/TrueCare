import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  CardMedia,
  Container,
  Grid,
  Button,
  Typography
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useServices } from "../../data/services";

interface ServicesSectionProps {
  onSelectService: (slug: string) => void;
}

export default function ServicesSection({
  onSelectService
}: ServicesSectionProps) {
  const services = useServices();

  return (
    <Box
      id="services"
      sx={{
        py: { xs: 9, md: 12 },
        background:
          "linear-gradient(180deg, #fffdfa 0%, #f7f1e7 100%)",
        borderTop: "1px solid rgba(224,182,111,0.14)",
        borderBottom: "1px solid rgba(224,182,111,0.14)"
      }}
    >
      <Container>
        <Typography
          variant="overline"
          sx={{ color: "primary.main", letterSpacing: "0.18em", fontWeight: 700 }}
        >
          Signature Procedures
        </Typography>
        <Typography variant="h3" sx={{ mt: 1.5, mb: 1 }}>
          Treatment pathways shaped with precision and realistic planning.
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 5, maxWidth: 740 }}>
          Borrowing the specialty-focused feel of the reference site, this section highlights
          core procedures in a cleaner, more premium card layout with better spacing and visual
          hierarchy.
        </Typography>

        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid size={{ xs: 12, md: 4 }} key={service.slug}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid rgba(16,42,67,0.08)",
                  boxShadow: "0 24px 60px rgba(16,42,67,0.08)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <CardActionArea
                  onClick={() => onSelectService(service.slug)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch"
                  }}
                >
                  <CardMedia
                    component="img"
                    height="210"
                    image={service.heroImage}
                    alt={service.name}
                  />
                  <CardContent
                    sx={{
                      p: 2.25,
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      textAlign: "left"
                    }}
                  >
                    <Typography variant="h5" sx={{ mb: 1.5, textAlign: "left" }}>
                      {service.name}
                    </Typography>
                    <Typography color="text.secondary" sx={{ textAlign: "left", lineHeight: 1.7 }}>
                      {service.shortDescription}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions sx={{ px: 3, pb: 3, pt: 0, mt: "auto" }}>
                  <Button
                    variant="outlined"
                    onClick={() => onSelectService(service.slug)}
                    endIcon={<ArrowForwardRoundedIcon fontSize="small" />}
                    sx={{
                      borderRadius: 999,
                      textTransform: "none",
                      px: 1.75,
                      py: 0.75
                    }}
                  >
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
