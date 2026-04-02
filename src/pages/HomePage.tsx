import { Box } from "@mui/material";
import FloatingContactButtons from "../components/layout/FloatingContactButtons";
import { useNavigate } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import AboutSection from "../components/sections/AboutSection";
import AppointmentSection from "../components/sections/AppointmentSection";
import DoctorSection from "../components/sections/DoctorSection";
import GallerySection from "../components/sections/GallerySection";
import HeroSection from "../components/sections/HeroSection";
import ServicesSection from "../components/sections/ServicesSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";

function scrollToSection(id: string): void {
  if (id === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const element = document.getElementById(id);

  if (element) {
    const rect = element.getBoundingClientRect();
    const targetTop = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;

    window.scrollTo({
      top: Math.max(0, Math.min(targetTop, maxScrollTop)),
      behavior: "smooth"
    });
  }
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: "background.default" }}>
      <Navbar
        onNavigate={scrollToSection}
        onSelectService={(slug: string) => navigate(`/service/${slug}`)}
        onOpenGallery={() => navigate("/gallery")}
      />
      <HeroSection
        onPrimaryAction={() => scrollToSection("appointment")}
        onSecondaryAction={() => scrollToSection("services")}
      />
      <AboutSection />
      <ServicesSection onSelectService={(slug: string) => navigate(`/service/${slug}`)} />
      <GallerySection onViewAll={() => navigate("/gallery")} />
      <DoctorSection onViewProfile={() => navigate("/doctor")} />
      <TestimonialsSection />
      <AppointmentSection />
      <Footer onNavigate={scrollToSection} />
      <FloatingContactButtons />
    </Box>
  );
}
