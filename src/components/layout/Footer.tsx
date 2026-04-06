import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import {
  useClinicInfo,
  useContactSettings,
  useFooterSettings,
  footerLinks
} from "../../data/siteContent";

interface FooterProps {
  onNavigate: (id: string) => void;
}

const socialIconMap = {
  instagram: InstagramIcon,
  facebook: FacebookRoundedIcon,
  youtube: YouTubeIcon,
  linkedin: LinkedInIcon
};

export default function Footer({ onNavigate }: FooterProps) {
  const footerSettings = useFooterSettings();
  const clinicContact = useContactSettings();
  const clinic = useClinicInfo();
  const clinicContactDetails = [
    { label: "Phone", value: clinic.phone },
    { label: "WhatsApp", value: clinic.whatsapp },
    { label: "Email", value: clinicContact.email },
    { label: "Location", value: "Patna, Bihar" }
  ];

  return (
    <Box component="footer" sx={{ bgcolor: "#0f2323", color: "white", pt: 8, pb: 3 }}>
      <Container>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 5, md: 8 }}
          alignItems="flex-start"
          justifyContent="space-between"
          sx={{ mb: 5 }}
        >
          <Box sx={{ maxWidth: 360, width: "100%" }}>
            <Typography variant="h4" sx={{ mb: 1.5, color: "white" }}>
              {clinic.name}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.8 }}>
              {footerSettings.address}
            </Typography>
            <Button
              component="a"
              href="https://www.google.com/maps/dir//True+Care+Plastic+%26+Cosmetic+Surgery+Clinic,+Siddharth+Nagar,+Opp+Baidyanath+palace+Bailey+Road,+more,+near+jagdeo+path,+Patna,+Bihar+800014/@25.2039739,85.5097216,15z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x39ed57b795567d03:0xcb006a41e91ed9b5!2m2!1d85.073942!2d25.6051209?entry=ttu&g_ep=EgoyMDI2MDMzMC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noreferrer"
              variant="outlined"
              startIcon={<LocationOnOutlinedIcon />}
              sx={{
                mt: 2,
                borderColor: "rgba(255,255,255,0.18)",
                color: "white",
                borderRadius: 999,
                px: 2.2,
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.32)",
                  bgcolor: "rgba(255,255,255,0.06)"
                }
              }}
            >
              Get Direction
            </Button>
            <Typography sx={{ mt: 2.25, color: "rgba(255,255,255,0.78)" }}>{clinic.phone}</Typography>
            <Typography sx={{ mt: 0.75, color: "rgba(255,255,255,0.78)" }}>
              {clinicContact.email}
            </Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 4, md: 8 }}
              alignItems="flex-start"
              justifyContent={{ xs: "flex-start", md: "space-between" }}
            >
              <Box sx={{ pt: { xs: 0.5, md: 1 }, minWidth: { md: 150 } }}>
                <Typography sx={{ fontWeight: 700, mb: 2 }}>Quick Links</Typography>
                <Stack spacing={1.25}>
                  {footerLinks.map((item) => (
                    <Button
                      key={item.id}
                      component="button"
                      variant="text"
                      onClick={() => onNavigate(item.id)}
                      sx={{
                        color: "rgba(255,255,255,0.72)",
                        justifyContent: "flex-start",
                        px: 0,
                        py: 0,
                        minWidth: 0,
                        textAlign: "left",
                        fontWeight: 500,
                        textTransform: "none",
                        "&:hover": {
                          color: "white"
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ pt: { xs: 0.5, md: 1 }, minWidth: { md: 220 } }}>
                <Typography sx={{ fontWeight: 700, mb: 2 }}>Contact</Typography>
                <Stack spacing={1.25}>
                  {clinicContactDetails.map((item) => (
                    <Typography key={item.label} sx={{ color: "rgba(255,255,255,0.72)" }}>
                      {item.label}: {item.value}
                    </Typography>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ minWidth: { md: 220 } }}>
                <Typography sx={{ fontWeight: 700, mb: 2 }}>Follow Us</Typography>
                <Stack direction="row" spacing={1}>
                  {footerSettings.socialLinks.map((item) => {
                    const Icon = socialIconMap[item.platform];

                    return (
                      <IconButton
                        key={item.label}
                        component="a"
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={item.label}
                        sx={{
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.14)",
                          borderRadius: 2,
                          bgcolor: "rgba(255,255,255,0.04)",
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.1)"
                          }
                        }}
                      >
                        <Icon fontSize="small" />
                      </IconButton>
                    );
                  })}
                </Stack>
                <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.58)", maxWidth: 240 }}>
                  {footerSettings.note}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          justifyContent="space-between"
        >
            <Typography sx={{ color: "rgba(255,255,255,0.58)" }}>
            Copyright © {new Date().getFullYear()} {clinic.name}. All rights reserved.
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.58)" }}>
            {footerSettings.copyrightNote}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
