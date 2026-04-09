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
import { getRoleDisplayLabel } from "../utils/adminPermissions";

const periodOrder: DashboardPeriodKey[] = ["daily", "weekly", "monthly"];

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function escapeCsvValue(value: string | number): string {
  const text = String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { user, profile, permissions, signOut } = useAdminAuth();
  const logoutLabel = `${profile?.fullName ?? user?.email ?? "Admin"} Sign Out`;
  const roleLabel = getRoleDisplayLabel(profile?.role);
  const [data, setData] = useState<LiveDashboardData>({
    ...dashboardPeriods[period],
    live: false
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  async function refreshDashboardData(): Promise<void> {
    setIsSyncing(true);
    try {
      const nextData = await loadDashboardPeriodData(period);
      setData(nextData);
    } finally {
      setIsSyncing(false);
    }
  }

  useEffect(() => {
    void refreshDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  async function handleExportReport(): Promise<void> {
    setIsExporting(true);

    try {
      const maxTrend = Math.max(...data.trend.map((point) => point.value), 1);
      const maxChannel = Math.max(...data.channels.map((channel) => channel.value), 1);

      const reportHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>True Care Dashboard Report</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f4fbfb;
      --panel: #ffffff;
      --ink: #10353a;
      --muted: #5f7a7e;
      --accent: #1f9d94;
      --accent-soft: rgba(31, 157, 148, 0.12);
      --border: rgba(16, 42, 67, 0.1);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: linear-gradient(180deg, #f8fffe 0%, var(--bg) 100%);
      color: var(--ink);
    }
    .page {
      max-width: 1160px;
      margin: 0 auto;
      padding: 32px 24px 48px;
    }
    .hero {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      margin-bottom: 24px;
    }
    h1 {
      margin: 0 0 8px;
      font-size: 34px;
      line-height: 1.05;
    }
    .subtle {
      color: var(--muted);
      margin: 0;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      padding: 8px 14px;
      border-radius: 999px;
      background: var(--accent-soft);
      color: var(--accent);
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.02em;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin: 24px 0 28px;
    }
    .card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 18px;
      box-shadow: 0 18px 40px rgba(16, 42, 67, 0.06);
    }
    .card-label {
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .card-value {
      font-size: 30px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 8px;
    }
    .card-helper {
      color: var(--muted);
      font-size: 14px;
      line-height: 1.5;
    }
    .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 22px;
      box-shadow: 0 18px 40px rgba(16, 42, 67, 0.06);
      padding: 22px;
      margin-bottom: 20px;
    }
    .panel h2 {
      margin: 0 0 16px;
      font-size: 22px;
    }
    .chart {
      display: grid;
      gap: 12px;
    }
    .bar-row {
      display: grid;
      grid-template-columns: 96px minmax(0, 1fr) 52px;
      gap: 12px;
      align-items: center;
    }
    .bar-label, .bar-value {
      font-size: 14px;
      color: var(--muted);
      font-weight: 600;
    }
    .bar-track {
      height: 12px;
      border-radius: 999px;
      background: rgba(16, 42, 67, 0.08);
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--accent) 0%, #45c9bf 100%);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      overflow: hidden;
      border-radius: 14px;
    }
    th, td {
      text-align: left;
      padding: 12px 14px;
      border-bottom: 1px solid rgba(16, 42, 67, 0.08);
      font-size: 14px;
    }
    th {
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background: rgba(31, 157, 148, 0.04);
    }
    .status {
      display: inline-flex;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(31, 157, 148, 0.1);
      color: var(--accent);
      font-weight: 700;
      font-size: 12px;
    }
    .lead-grid {
      display: grid;
      gap: 12px;
    }
    .lead {
      padding: 14px 16px;
      border: 1px solid rgba(16, 42, 67, 0.08);
      border-radius: 16px;
      background: #fff;
    }
    .lead-top {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    .lead-name {
      font-size: 16px;
      font-weight: 800;
      margin: 0 0 3px;
    }
    .lead-meta {
      margin: 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.5;
    }
    .footer-note {
      margin-top: 18px;
      color: var(--muted);
      font-size: 13px;
    }
    @media (max-width: 900px) {
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .bar-row { grid-template-columns: 72px minmax(0, 1fr) 44px; }
    }
    @media (max-width: 640px) {
      .page { padding: 22px 16px 36px; }
      .grid { grid-template-columns: 1fr; }
      .bar-row { grid-template-columns: 1fr; gap: 6px; }
      .bar-value { justify-self: end; }
      table { display: block; overflow-x: auto; }
    }
  </style>
</head>
<body>
  <main class="page">
    <section class="hero">
      <div>
        <div class="pill">True Care Clinic Report</div>
        <h1>${escapeHtml(data.label)} Dashboard</h1>
        <p class="subtle">Updated ${escapeHtml(data.updated)}. This export captures the selected dashboard snapshot.</p>
      </div>
      <div class="pill">Generated ${escapeHtml(new Date().toLocaleString())}</div>
    </section>

    <section class="grid">
      <article class="card">
        <div class="card-label">Total Visitors</div>
        <div class="card-value">${escapeHtml(data.totalVisitors)}</div>
        <div class="card-helper">All tracked page visits in the selected period.</div>
      </article>
      <article class="card">
        <div class="card-label">Consultation Requests</div>
        <div class="card-value">${escapeHtml(data.consultationRequests)}</div>
        <div class="card-helper">Submitted booking enquiries from the site.</div>
      </article>
      <article class="card">
        <div class="card-label">Confirmed Bookings</div>
        <div class="card-value">${escapeHtml(data.confirmedBookings)}</div>
        <div class="card-helper">Leads marked as booked by the admin team.</div>
      </article>
      <article class="card">
        <div class="card-label">Conversion Rate</div>
        <div class="card-value">${escapeHtml(data.leadCloseRate.toFixed(1))}%</div>
        <div class="card-helper">Confirmed bookings divided by consultation requests.</div>
      </article>
    </section>

    <section class="panel">
      <h2>Traffic Trend</h2>
      <div class="chart">
        ${data.trend
          .map((point) => {
            const width = Math.max(8, Math.round((point.value / maxTrend) * 100));
            return `
              <div class="bar-row">
                <div class="bar-label">${escapeHtml(point.label)}</div>
                <div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div>
                <div class="bar-value">${escapeHtml(point.value)}</div>
              </div>`;
          })
          .join("")}
      </div>
    </section>

    <section class="panel">
      <h2>Traffic Channels</h2>
      <div class="chart">
        ${data.channels
          .map((channel) => {
            const width = Math.max(8, Math.round((channel.value / maxChannel) * 100));
            return `
              <div class="bar-row">
                <div class="bar-label">${escapeHtml(channel.label)}</div>
                <div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div>
                <div class="bar-value">${escapeHtml(channel.value)}</div>
              </div>`;
          })
          .join("")}
      </div>
    </section>

    <section class="panel">
      <h2>Recent Leads</h2>
      <div class="lead-grid">
        ${data.recentLeads
          .map(
            (lead) => `
              <article class="lead">
                <div class="lead-top">
                  <div>
                    <p class="lead-name">${escapeHtml(lead.name)}</p>
                    <p class="lead-meta">${escapeHtml(lead.interest)}</p>
                    <p class="lead-meta">${escapeHtml(lead.source)} • ${escapeHtml(lead.time)}</p>
                  </div>
                  <span class="status">${escapeHtml(lead.status)}</span>
                </div>
              </article>`
          )
          .join("")}
      </div>
    </section>

    <section class="panel">
      <h2>Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Total Visitors</td><td>${escapeHtml(data.totalVisitors)}</td></tr>
          <tr><td>Consultation Requests</td><td>${escapeHtml(data.consultationRequests)}</td></tr>
          <tr><td>Confirmed Bookings</td><td>${escapeHtml(data.confirmedBookings)}</td></tr>
          <tr><td>Lead Close Rate</td><td>${escapeHtml(data.leadCloseRate.toFixed(1))}%</td></tr>
          <tr><td>Visitor To Booking Rate</td><td>${escapeHtml(data.visitorToBookingRate.toFixed(1))}%</td></tr>
        </tbody>
      </table>
    </section>

    <div class="footer-note">
      Generated from the current dashboard snapshot. Open this file in a browser to review the report or print it to PDF.
    </div>
  </main>
</body>
</html>`;

      const blob = new Blob([reportHtml], { type: "text/html;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `truecare-dashboard-${period}-${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }

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
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={`Role: ${roleLabel}`}
                size="small"
                variant="outlined"
                sx={{ borderColor: "rgba(31,157,148,0.24)", color: "primary.main" }}
              />
              <Button variant="text" onClick={() => void signOut()} sx={{ minWidth: 0, px: 0.5 }}>
                {logoutLabel}
              </Button>
            </Stack>
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
              <Button
                variant="outlined"
                startIcon={<RefreshRoundedIcon />}
                onClick={() => void refreshDashboardData()}
                disabled={isSyncing}
              >
                {isSyncing ? "Syncing..." : "Sync Data"}
              </Button>
              <Button
                variant="contained"
                startIcon={<CalendarMonthOutlinedIcon />}
                onClick={() => void handleExportReport()}
                disabled={isExporting}
              >
                {isExporting ? "Exporting..." : "Export Report"}
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
          {permissions.leads ? (
            <Grid size={{ xs: 12, lg: 12 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid rgba(31,157,148,0.12)",
                  background: "linear-gradient(180deg, #f6fffe 0%, #effcf9 100%)",
                  boxShadow: "0 18px 48px rgba(16,42,67,0.06)"
                }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                  spacing={2}
                >
                  <Box>
                    <Typography variant="h5" sx={{ mb: 0.75 }}>
                      Consultation Leads
                    </Typography>
                    <Typography color="text.secondary">
                      Review booking enquiries and update their pipeline status from the lead board.
                    </Typography>
                  </Box>
                  <Button component={Link} to="/admin/leads" variant="contained">
                    Open Leads Board
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ) : null}
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
                  {data.recentLeads.slice(0, 3).map((lead) => (
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
                  {permissions.content ? (
                    <>
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
                    </>
                  ) : (
                    <Grid size={{ xs: 12 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 2.5,
                          border: "1px solid rgba(16,42,67,0.08)",
                          background: "#fff"
                        }}
                      >
                        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Content access restricted</Typography>
                        <Typography color="text.secondary">
                          This role can review leads but does not have content editing access.
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
