import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import GallerySection from "../components/sections/GallerySection";
import { useTrackPageView } from "../hooks/useTrackPageView";

export default function GalleryPage() {
  useTrackPageView("gallery");

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <Container sx={{ pt: 12, pb: 3 }}>
        <Button component={Link} to="/" variant="text" sx={{ mb: 2 }}>
          Back to Home
        </Button>
        <Typography variant="h2" sx={{ mb: 1.5 }}>
          Gallery
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
          A dedicated page for before-and-after treatment visuals. This is the best place to
          showcase patient results in a clear, organized format.
        </Typography>
      </Container>
      <GallerySection showViewAll={false} />
    </Box>
  );
}
