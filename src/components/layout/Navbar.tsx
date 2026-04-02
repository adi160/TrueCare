import React from "react";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import { clinicInfo, getTopBarSettings } from "../../data/siteContent";
import { getServices } from "../../data/services";

interface NavbarProps {
  onNavigate: (id: string) => void;
  onSelectService: (slug: string) => void;
  onOpenGallery: () => void;
}

const navigationItems: Array<{ id: string; label: string }> = [
  { id: "about", label: "About" },
  { id: "doctor", label: "Doctor" },
  { id: "services", label: "Services" }
];

export default function Navbar({ onNavigate, onSelectService, onOpenGallery }: NavbarProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [servicesAnchorEl, setServicesAnchorEl] = React.useState<null | HTMLElement>(null);
  const servicesMenuOpen = Boolean(servicesAnchorEl);
  const topBarSettings = getTopBarSettings();
  const services = getServices();

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setOpen(false);
  };

  const handleServiceClick = (slug: string) => {
    onSelectService(slug);
    setOpen(false);
    setServicesAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "transparent",
          color: "text.primary"
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            bgcolor: "#113434",
            color: "rgba(255,255,255,0.88)",
            borderBottom: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          <Toolbar
            sx={{
              minHeight: "44px !important",
              px: { md: 4, lg: 6 },
              justifyContent: "space-between"
            }}
          >
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Typography variant="body2">{topBarSettings.topLineLeft}</Typography>
              <Typography variant="body2">{topBarSettings.topLineRight}</Typography>
            </Stack>
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <CallOutlinedIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">{clinicInfo.phone}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <WhatsAppIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">{clinicInfo.whatsapp}</Typography>
              </Stack>
            </Stack>
          </Toolbar>
        </Box>

        <Paper
          elevation={0}
          sx={{
            width: "100%",
            px: { xs: 1.5, md: 4, lg: 6 },
            borderRadius: 0,
            bgcolor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(18px)",
            borderBottom: "1px solid rgba(16,42,67,0.08)",
            boxShadow: "0 18px 45px rgba(16,42,67,0.05)"
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 74, md: 86 }, px: "0 !important" }}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ flexGrow: 1, minWidth: 0 }}
            >
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "primary.main",
                  color: "white",
                  boxShadow: "0 10px 24px rgba(15,118,110,0.28)"
                }}
              >
                <LocalHospitalOutlinedIcon fontSize="small" />
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    lineHeight: 1.1
                  }}
                >
                  {clinicInfo.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {clinicInfo.tagline}
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={0.75}
              sx={{ display: { xs: "none", lg: "flex" }, mr: 2 }}
            >
              <Button
                color="inherit"
                onClick={() => onNavigate("home")}
                sx={{
                  px: 1.75,
                  py: 1,
                  borderRadius: 999,
                  color: "text.secondary",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "rgba(31,157,148,0.1)",
                    color: "primary.main"
                  }
                }}
              >
                Home
              </Button>
              <Button
                key="about"
                color="inherit"
                onClick={() => onNavigate("about")}
                sx={{
                  px: 1.75,
                  py: 1,
                  borderRadius: 999,
                  color: "text.secondary",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "rgba(31,157,148,0.1)",
                    color: "primary.main"
                  }
                }}
              >
                About
              </Button>
              <Button
                key="doctor"
                color="inherit"
                onClick={() => onNavigate("doctor")}
                sx={{
                  px: 1.75,
                  py: 1,
                  borderRadius: 999,
                  color: "text.secondary",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "rgba(31,157,148,0.1)",
                    color: "primary.main"
                  }
                }}
              >
                Doctor
              </Button>
              <Button
                color="inherit"
                onClick={(event) => setServicesAnchorEl(event.currentTarget)}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  px: 1.75,
                  py: 1,
                  borderRadius: 999,
                  color: "text.secondary",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "rgba(31,157,148,0.1)",
                    color: "primary.main"
                  }
                }}
              >
                Services
              </Button>
              <Button
                color="inherit"
                onClick={onOpenGallery}
                sx={{
                  px: 1.75,
                  py: 1,
                  borderRadius: 999,
                  color: "text.secondary",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "rgba(31,157,148,0.1)",
                    color: "primary.main"
                  }
                }}
              >
                Gallery
              </Button>
            </Stack>

            <Stack
              direction="row"
              spacing={1.25}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Button
                variant="contained"
                endIcon={<ChevronRightIcon />}
                onClick={() => onNavigate("appointment")}
                sx={{
                  px: 2.25,
                  py: 1.2,
                  borderRadius: 999,
                  boxShadow: "0 14px 32px rgba(15,118,110,0.24)"
                }}
              >
                Book Consultation
              </Button>
            </Stack>

            <IconButton
              sx={{
                display: { xs: "inline-flex", md: "none" },
                ml: 1,
                border: "1px solid rgba(16,42,67,0.08)",
                bgcolor: "rgba(255,255,255,0.72)"
              }}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Paper>
      </AppBar>

      <Menu
        anchorEl={servicesAnchorEl}
        open={servicesMenuOpen}
        onClose={() => setServicesAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            mt: 1.25,
            minWidth: 220,
            borderRadius: 2,
            border: "1px solid rgba(16,42,67,0.08)",
            boxShadow: "0 20px 50px rgba(16,42,67,0.12)"
          }
        }}
      >
        <MenuItem
          onClick={() => {
            onNavigate("services");
            setServicesAnchorEl(null);
          }}
        >
          View All Services
        </MenuItem>
        <Divider />
        {services.map((service) => (
          <MenuItem key={service.slug} onClick={() => handleServiceClick(service.slug)}>
            {service.name}
          </MenuItem>
        ))}
      </Menu>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 320, p: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <LocalHospitalOutlinedIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700 }}>{clinicInfo.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Expert cosmetic consultation
              </Typography>
            </Box>
          </Stack>

          <Button
            fullWidth
            variant="contained"
            endIcon={<ChevronRightIcon />}
            onClick={() => handleItemClick("appointment")}
            sx={{ mb: 2, py: 1.4, borderRadius: 999 }}
          >
            Book Consultation
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              onOpenGallery();
              setOpen(false);
            }}
            sx={{ mb: 2.5, py: 1.2, borderRadius: 999 }}
          >
            Gallery
          </Button>

          <Divider sx={{ mb: 2 }} />

          <List>
            {navigationItems.map((item) => (
              <ListItemButton
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                sx={{
                  borderRadius: 3,
                  mb: 0.5,
                  py: 1.1
                }}
              >
                <ListItemText
                  primary={item.label}
                  secondary={`Go to ${item.label.toLowerCase()} section`}
                />
              </ListItemButton>
            ))}
            <ListItemButton
              onClick={() => handleItemClick("services")}
              sx={{
                borderRadius: 3,
                mt: 1,
                mb: 0.5,
                py: 1.1
              }}
            >
              <ListItemText
                primary="Services Overview"
                secondary="Go to services section"
              />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                onOpenGallery();
                setOpen(false);
              }}
              sx={{
                borderRadius: 3,
                mb: 0.5,
                py: 1.1
              }}
            >
              <ListItemText primary="Gallery" secondary="Open gallery page" />
            </ListItemButton>
            {services.map((service) => (
              <ListItemButton
                key={service.slug}
                onClick={() => handleServiceClick(service.slug)}
                sx={{
                  borderRadius: 3,
                  ml: 1,
                  mb: 0.5,
                  py: 1
                }}
              >
                <ListItemText
                  primary={service.name}
                  secondary="Open service page"
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
