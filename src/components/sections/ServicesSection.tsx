import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  CardMedia,
  Container,
  Button,
  IconButton,
  Typography
} from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useEffect, useRef, useState } from "react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useServices } from "../../data/services";

interface ServicesSectionProps {
  onSelectService: (slug: string) => void;
}

export default function ServicesSection({
  onSelectService
}: ServicesSectionProps) {
  const services = useServices();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [firstVisibleIndex, setFirstVisibleIndex] = useState<number | null>(null);
  const [lastVisibleIndex, setLastVisibleIndex] = useState<number | null>(null);

  const updateScrollState = () => {
    const track = trackRef.current;

    if (!track) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      setFirstVisibleIndex(null);
      setLastVisibleIndex(null);
      return;
    }

    const hasOverflow = track.scrollWidth > track.clientWidth + 1;
    setCanScrollLeft(track.scrollLeft > 1);
    setCanScrollRight(hasOverflow && track.scrollLeft + track.clientWidth < track.scrollWidth - 1);

    const firstCard = track.firstElementChild as HTMLElement | null;
    if (!firstCard) {
      setFirstVisibleIndex(null);
      setLastVisibleIndex(null);
      return;
    }

    const computedStyles = window.getComputedStyle(track);
    const gap = Number.parseFloat(computedStyles.columnGap || computedStyles.gap || "0") || 0;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const step = cardWidth + gap;

    if (step <= 0) {
      setFirstVisibleIndex(null);
      setLastVisibleIndex(null);
      return;
    }

    const nextFirstVisibleIndex = Math.min(
      services.length - 1,
      Math.max(0, Math.floor((track.scrollLeft + 1) / step))
    );
    const nextLastVisibleIndex = Math.min(
      services.length - 1,
      Math.max(0, Math.floor((track.scrollLeft + track.clientWidth - 1) / step))
    );
    setFirstVisibleIndex(nextFirstVisibleIndex);
    setLastVisibleIndex(nextLastVisibleIndex);
  };

  useEffect(() => {
    updateScrollState();
    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [services.length]);

  const scrollByCards = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const delta = Math.max(280, track.clientWidth * 0.7);
    track.scrollBy({ left: direction === "left" ? -delta : delta, behavior: "smooth" });
    window.setTimeout(updateScrollState, 250);
  };

  return (
    <Box
      id="services"
      sx={{
        py: { xs: 9, md: 12 },
        background:
          "linear-gradient(180deg, #fffdfa 0%, #f7f1e7 100%)",
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

        <Box
          sx={{
            position: "relative",
            background: "transparent"
          }}
        >
          <Box
            ref={trackRef}
            onScroll={updateScrollState}
            sx={{
              display: "grid",
              gridAutoFlow: "column",
              gridAutoColumns: {
                xs: "calc(100% - 20px)",
                sm: "calc((100% - 24px) / 2)",
                md: "calc((100% - 48px) / 3)",
                lg: "calc((100% - 48px) / 3)"
              },
              gap: 3,
              overflowX: "auto",
              px: 0,
              py: 0,
              pb: 0,
              background: "transparent",
              scrollPaddingInline: 0,
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none"
              }
            }}
          >
          {services.map((service, index) => {
            return (
            <Box
              key={service.slug}
              onMouseEnter={() => setHoveredCardIndex(index)}
              onMouseLeave={() => setHoveredCardIndex((current) => (current === index ? null : current))}
              sx={{
                position: "relative",
                height: "100%",
                width: "100%",
                minWidth: 0,
                "&:hover .service-scroll-arrow": {
                  opacity: 1,
                  pointerEvents: "auto"
                },
                scrollSnapAlign: "start"
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 3,
                  border: "1px solid rgba(16,42,67,0.08)",
                  boxShadow: "0 1px 0 rgba(16,42,67,0.04)",
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
                    sx={{
                      objectFit: "cover",
                      objectPosition: "center"
                    }}
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
                    <Typography
                      color="text.secondary"
                      sx={{
                        textAlign: "left",
                        lineHeight: 1.7,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
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
              {canScrollLeft && hoveredCardIndex === firstVisibleIndex ? (
                <IconButton
                  className="service-scroll-arrow"
                  onClick={() => scrollByCards("left")}
                  aria-label="Scroll services left"
                  sx={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    bgcolor: "#ffffff",
                    border: "1px solid rgba(16,42,67,0.08)",
                    boxShadow: "0 10px 24px rgba(16,42,67,0.12)",
                    opacity: 0,
                    pointerEvents: "none",
                    transition: "opacity 0.18s ease, transform 0.18s ease",
                    "&:hover": { bgcolor: "#f7fbff", transform: "translateY(-50%) scale(1.03)" }
                  }}
                >
                  <ChevronRightRoundedIcon
                    sx={{ transform: "rotate(180deg)" }}
                  />
                </IconButton>
              ) : null}
              {canScrollRight && hoveredCardIndex === lastVisibleIndex ? (
                <IconButton
                  className="service-scroll-arrow"
                  onClick={() => scrollByCards("right")}
                  aria-label="Scroll services right"
                  sx={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    bgcolor: "#ffffff",
                    border: "1px solid rgba(16,42,67,0.08)",
                    boxShadow: "0 10px 24px rgba(16,42,67,0.12)",
                    opacity: 0,
                    pointerEvents: "none",
                    transition: "opacity 0.18s ease, transform 0.18s ease",
                    "&:hover": { bgcolor: "#f7fbff", transform: "translateY(-50%) scale(1.03)" }
                  }}
                >
                  <ChevronRightRoundedIcon />
                </IconButton>
              ) : null}
            </Box>
            );
          })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
