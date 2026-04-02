import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  dashboardPeriods,
  type DashboardLead,
  type DashboardPeriodKey
} from "../data/adminDashboard";
import { useAdminAuth } from "../context/AdminAuthContext";
import { loadDashboardPeriodData, type LiveDashboardData } from "../services/backend";

const periodOrder: DashboardPeriodKey[] = ["daily", "weekly", "monthly"];

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function statusColor(status: DashboardLead["status"]): "success" | "warning" | "info" {
  if (status === "Booked") return "success";
  if (status === "Interested") return "info";
  return "warning";
}

function MetricCard({
  icon,
  label,
  value,
  helper
}: {
  icon: ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid rgba(16,42,67,0.08)",
        boxShadow: "0 18px 48px rgba(16,42,67,0.06)"
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Typography color="text.secondary" sx={{ mb: 0.75, fontWeight: 600 }}>
              {label}
            </Typography>
            <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700, lineHeight: 1.1 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {helper}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(31,157,148,0.1)",
              color: "primary.main"
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ProgressRow({
  label,
  value,
  color = "primary.main"
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <Stack spacing={0.75}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
        <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
          {value}%
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 10,
          borderRadius: 999,
          bgcolor: "rgba(16,42,67,0.08)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            bgcolor: color
          }
        }}
      />
    </Stack>
  );
}

function ContentLinkCard({
  title,
  description,
  to,
  accent
}: {
  title: string;
  description: string;
  to: string;
  accent: "primary" | "secondary" | "warning";
}) {
  const accentStyles = {
    primary: {
      border: "1px solid rgba(31,157,148,0.12)",
      background: "linear-gradient(180deg, #f6fffe 0%, #effcf9 100%)"
    },
    secondary: {
      border: "1px solid rgba(224,182,111,0.15)",
      background: "linear-gradient(180deg, #fffdf8 0%, #fff7eb 100%)"
    },
    warning: {
      border: "1px solid rgba(16,42,67,0.08)",
      background: "linear-gradient(180deg, #ffffff 0%, #f6f9fb 100%)"
    }
  }[accent];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
        borderRadius: 2.5,
        height: "100%",
        ...accentStyles
      }}
    >
      <Stack spacing={1.5} sx={{ height: "100%" }}>
        <Box>
          <Typography sx={{ fontWeight: 800, mb: 0.75 }}>{title}</Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {description}
          </Typography>
        </Box>
        <Button
          component={Link}
          to={to}
          variant="contained"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{ alignSelf: "flex-start", borderRadius: 999 }}
        >
          Go to
        </Button>
      </Stack>
    </Paper>
  );
}

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<DashboardPeriodKey>("weekly");
  const { user, profile, signOut } = useAdminAuth();
  const logoutLabel = `${profile?.fullName ?? user?.email ?? "Admin"} Sign Out`;
  const [data, setData] = useState<LiveDashboardData>({
    ...dashboardPeriods[period],
    live: false
  });

  useEffect(() => {
    let active = true;

    void loadDashboardPeriodData(period).then((nextData) => {
      if (active) {
        setData(nextData);
      }
    });

    return () => {
      active = false;
    };
  }, [period]);

  const maxTrend = useMemo(
    () => Math.max(...data.trend.map((item) => item.value), 1),
    [data.trend]
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(31,157,148,0.12), transparent 30%), radial-gradient(circle at top right, rgba(224,182,111,0.12), transparent 24%), linear-gradient(180deg, #f4fbfb 0%, #ecf6f4 100%)",
        py: { xs: 3, md: 5 }
      }}
    >
      <Container>
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
            <Button
              component={Link}
              to="/"
              variant="text"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{ px: 0 }}
            >
              Back to Site
            </Button>
            <Button variant="text" onClick={() => void signOut()} sx={{ minWidth: 0, px: 0.5 }}>
              {logoutLabel}
            </Button>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h2" sx={{ lineHeight: 1.05, mb: 1 }}>
                Admin Dashboard
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
                Track visitor volume, consultation intent, and real booking conversion across
                daily, weekly, and monthly views.
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" }, flexShrink: 0 }}
            >
              <Button variant="outlined" startIcon={<RefreshRoundedIcon />}>
                Sync Data
              </Button>
              <Button variant="contained" startIcon={<CalendarMonthOutlinedIcon />}>
                Export Report
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: 1,
            borderRadius: 999,
            display: "inline-flex",
            border: "1px solid rgba(16,42,67,0.08)",
            bgcolor: "rgba(255,255,255,0.82)"
          }}
        >
          <ToggleButtonGroup
            exclusive
            value={period}
            onChange={(_, nextValue) => nextValue && setPeriod(nextValue)}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                border: 0,
                borderRadius: 999,
                px: 2.2,
                py: 0.8,
                textTransform: "none",
                fontWeight: 600
              }
            }}
          >
            {periodOrder.map((item) => (
              <ToggleButton key={item} value={item}>
                {dashboardPeriods[item].label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <MetricCard
              icon={<PeopleOutlineIcon />}
              label="Site Visitors"
              value={formatCount(data.totalVisitors)}
              helper={data.updated}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <MetricCard
              icon={<QueryStatsOutlinedIcon />}
              label="Consultation Intent"
              value={formatCount(data.consultationRequests)}
              helper="Visitors who showed booking interest"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <MetricCard
              icon={<EventAvailableOutlinedIcon />}
              label="Real Bookings"
              value={formatCount(data.confirmedBookings)}
              helper="Confirmed consultancy appointments"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <MetricCard
              icon={<TrendingUpRoundedIcon />}
              label="Lead Close Rate"
              value={`${data.leadCloseRate.toFixed(1)}%`}
              helper={`${data.visitorToBookingRate.toFixed(2)}% visitor-to-booking`}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(16,42,67,0.08)",
                boxShadow: "0 18px 48px rgba(16,42,67,0.06)",
                mb: 3
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={1}
                  sx={{ mb: 3 }}
                >
                  <Box>
                    <Typography variant="h4" sx={{ mb: 0.75 }}>
                      Traffic Trend
                    </Typography>
                  <Typography color="text.secondary">
                    Site visitors for the selected period
                  </Typography>
                </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      icon={<CheckCircleOutlineIcon />}
                      label={`${data.label} overview`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={data.live ? "Live Supabase" : "Demo fallback"}
                      color={data.live ? "success" : "default"}
                      variant="outlined"
                    />
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="end"
                  sx={{
                    height: { xs: 220, md: 260 },
                    mb: 2.5,
                    px: 1
                  }}
                >
                  {data.trend.map((item) => {
                    const barHeight = (item.value / maxTrend) * 100;

                    return (
                      <Box
                        key={item.label}
                        sx={{
                          flex: 1,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "end",
                          alignItems: "center",
                          gap: 1
                        }}
                      >
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "primary.main" }}>
                          {item.value}
                        </Typography>
                        <Box
                          sx={{
                            width: "100%",
                            maxWidth: 60,
                            height: `${barHeight}%`,
                            minHeight: 24,
                            borderRadius: 2,
                            background:
                              "linear-gradient(180deg, rgba(31,157,148,0.92) 0%, rgba(224,182,111,0.92) 100%)",
                            boxShadow: "0 16px 24px rgba(31,157,148,0.15)"
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.25,
                        borderRadius: 2.5,
                        bgcolor: "#f7fffd",
                        border: "1px solid rgba(31,157,148,0.12)"
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Funnel</Typography>
                      <Stack spacing={1.5}>
                        <ProgressRow label="Visitors" value={100} />
                        <ProgressRow label="Consultation intent" value={Math.round((data.consultationRequests / data.totalVisitors) * 100)} />
                        <ProgressRow label="Real bookings" value={Math.round((data.confirmedBookings / data.totalVisitors) * 100)} />
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.25,
                        borderRadius: 2.5,
                        bgcolor: "#fffdfa",
                        border: "1px solid rgba(224,182,111,0.14)",
                        height: "100%"
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, mb: 2 }}>Booking Mix</Typography>
                      <Stack spacing={1.75}>
                        {data.channels.map((item) => (
                          <ProgressRow key={item.label} label={item.label} value={item.value} />
                        ))}
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(16,42,67,0.08)",
                boxShadow: "0 18px 48px rgba(16,42,67,0.06)",
                mb: 3
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Current Booking Status
                </Typography>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography color="text.secondary">Interested</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{data.consultationRequests}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography color="text.secondary">Confirmed</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{data.confirmedBookings}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography color="text.secondary">Pending follow-up</Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      {Math.max(data.consultationRequests - data.confirmedBookings, 0)}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(16,42,67,0.08)",
                boxShadow: "0 18px 48px rgba(16,42,67,0.06)",
                mb: 3
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Recent Leads
                </Typography>
                <Stack spacing={1.5}>
                  {data.recentLeads.map((lead) => (
                    <Paper
                      key={`${lead.name}-${lead.time}`}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2.25,
                        border: "1px solid rgba(16,42,67,0.08)",
                        bgcolor: "#ffffff"
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" spacing={2}>
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>{lead.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {lead.interest}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {lead.source} • {lead.time}
                          </Typography>
                        </Box>
                        <Chip label={lead.status} color={statusColor(lead.status)} size="small" />
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>

          </Grid>

          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(16,42,67,0.08)",
                boxShadow: "0 18px 48px rgba(16,42,67,0.06)"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                  spacing={1}
                  sx={{ mb: 2 }}
                >
                  <Box>
                    <Typography variant="h5">Consultation Pipeline</Typography>
                    <Typography color="text.secondary">
                      Site visits, interest, and booking outcomes for the selected period
                    </Typography>
                  </Box>
                  <Typography color="text.secondary">
                    {period.charAt(0).toUpperCase() + period.slice(1)} view
                  </Typography>
                </Stack>

                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Share</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Site Visitors</TableCell>
                      <TableCell align="right">{formatCount(data.totalVisitors)}</TableCell>
                      <TableCell align="right">100%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Consultation Interest</TableCell>
                      <TableCell align="right">{formatCount(data.consultationRequests)}</TableCell>
                      <TableCell align="right">
                        {((data.consultationRequests / data.totalVisitors) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Confirmed Bookings</TableCell>
                      <TableCell align="right">{formatCount(data.confirmedBookings)}</TableCell>
                      <TableCell align="right">
                        {((data.confirmedBookings / data.totalVisitors) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(16,42,67,0.08)",
                boxShadow: "0 18px 48px rgba(16,42,67,0.06)"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                  spacing={1}
                  sx={{ mb: 2.5 }}
                >
                  <Box>
                    <Typography variant="h5" sx={{ mb: 0.75 }}>
                      Manage Site Content
                    </Typography>
                    <Typography color="text.secondary">
                      Open each content area in its own page so the layout stays clean and the
                      editing tools are easier to use.
                    </Typography>
                  </Box>
                  <Typography color="text.secondary">Separate admin pages</Typography>
                </Stack>

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <ContentLinkCard
                      title="Above Header"
                      description="Edit the thin top strip's details shown above the header."
                      to="/admin/above-header"
                      accent="warning"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <ContentLinkCard
                      title="Header"
                      description="Edit the clinic name and subtitle shown in the main header."
                      to="/admin/header"
                      accent="secondary"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <ContentLinkCard
                      title="Home Section"
                      description="Edit the hero copy, hero image, and bullet points used on the home page."
                      to="/admin/home"
                      accent="primary"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <ContentLinkCard
                      title="Services Library"
                      description="Add new services with images, descriptions, and detail copy for the site."
                      to="/admin/services"
                      accent="secondary"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <ContentLinkCard
                      title="Gallery Library"
                      description="Add before and after treatment cards with image pairs for the gallery."
                      to="/admin/gallery"
                      accent="warning"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <ContentLinkCard
                      title="Testimonials"
                      description="Manage patient quotes and review cards in the testimonials section."
                      to="/admin/testimonials"
                      accent="primary"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <ContentLinkCard
                      title="Appointment Block"
                      description="Edit the consultation callout, bullets, and quote before the booking form."
                      to="/admin/appointment"
                      accent="warning"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <ContentLinkCard
                      title="Contact Info"
                      description="Edit the phone, WhatsApp, and email used in the top strip and floating buttons."
                      to="/admin/contact"
                      accent="primary"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <ContentLinkCard
                      title="About Section"
                      description="Update the welcome text, highlights, and clinic stats that introduce the brand."
                      to="/admin/about"
                      accent="warning"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <ContentLinkCard
                      title="Doctor Profile"
                      description="Edit the doctor bio, image, qualifications, and expertise sections."
                      to="/admin/doctor"
                      accent="secondary"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <ContentLinkCard
                      title="Footer"
                      description="Update the footer address and support copy shown across the site."
                      to="/admin/footer"
                      accent="secondary"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
