import CallIcon from "@mui/icons-material/Call";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Button, Stack } from "@mui/material";
import { clinicInfo } from "../../data/siteContent";

export default function FloatingContactButtons() {
  return (
    <Box
      sx={{
        position: "fixed",
        right: { xs: 16, md: 24 },
        bottom: { xs: 16, md: 24 },
        zIndex: 1200
      }}
    >
      <Stack spacing={1.5}>
        <Button
          component="a"
          href={`https://wa.me/${clinicInfo.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
          variant="contained"
          startIcon={<WhatsAppIcon />}
          sx={{
            justifyContent: "flex-start",
            minWidth: 0,
            px: 2,
            py: 1.2,
            borderRadius: 999,
            bgcolor: "#25D366",
            color: "white",
            boxShadow: "0 18px 36px rgba(37,211,102,0.28)",
            "&:hover": {
              bgcolor: "#1ebe5d"
            }
          }}
        >
          WhatsApp Us
        </Button>

        <Button
          component="a"
          href={`tel:${clinicInfo.phone.replace(/\s/g, "")}`}
          variant="contained"
          startIcon={<CallIcon />}
          sx={{
            justifyContent: "flex-start",
            minWidth: 0,
            px: 2,
            py: 1.2,
            borderRadius: 999,
            bgcolor: "primary.main",
            color: "white",
            boxShadow: "0 18px 36px rgba(31,157,148,0.24)",
            "&:hover": {
              bgcolor: "#18857d"
            }
          }}
        >
          Call Now
        </Button>
      </Stack>
    </Box>
  );
}
