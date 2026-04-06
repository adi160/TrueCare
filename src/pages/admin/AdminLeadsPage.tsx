import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { AdminLeadEntry } from "../../services/backend";
import { loadAdminLeads, updateConsultationLeadStatus } from "../../services/backend";

const statusOptions: AdminLeadEntry["status"][] = ["new", "contacted", "booked", "rejected"];

function statusLabel(status: AdminLeadEntry["status"]): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function statusColor(status: AdminLeadEntry["status"]): "info" | "warning" | "success" | "default" {
  if (status === "booked") return "success";
  if (status === "contacted") return "warning";
  if (status === "rejected") return "default";
  return "info";
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<AdminLeadEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminLeadEntry["status"]>("all");

  async function refresh(): Promise<void> {
    setLoading(true);
    setError(null);
    const nextLeads = await loadAdminLeads();
    setLeads(nextLeads);
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const filteredLeads = useMemo(() => {
    const search = query.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesSearch =
        !search ||
        lead.fullName.toLowerCase().includes(search) ||
        lead.phoneNumber.toLowerCase().includes(search) ||
        lead.procedure.toLowerCase().includes(search) ||
        lead.referenceId.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [leads, query, statusFilter]);

  const summary = useMemo(() => {
    return statusOptions.reduce(
      (acc, status) => {
        acc[status] = leads.filter((lead) => lead.status === status).length;
        return acc;
      },
      { new: 0, contacted: 0, booked: 0, rejected: 0 } as Record<AdminLeadEntry["status"], number>
    );
  }, [leads]);

  async function handleStatusChange(lead: AdminLeadEntry, nextStatus: AdminLeadEntry["status"]) {
    if (lead.status === nextStatus) {
      return;
    }

    setSavingId(lead.id);
    setError(null);

    const result = await updateConsultationLeadStatus(lead.referenceId, nextStatus);
    if (!result.success) {
      setError(result.message);
      setSavingId(null);
      return;
    }

    setLeads((current) =>
      current.map((item) =>
        item.id === lead.id ? { ...item, status: nextStatus } : item
      )
    );
    setSavingId(null);
  }

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
        <Stack spacing={2.5} sx={{ mb: 4 }}>
          <Button
            component={Link}
            to="/admin"
            variant="text"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ alignSelf: "flex-start", px: 0 }}
          >
            Back to Dashboard
          </Button>
          <Box>
            <Typography variant="h2" sx={{ lineHeight: 1.05, mb: 1 }}>
              Consultation Leads
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 780 }}>
              Review every enquiry from the booking form and move each lead through the booking
              pipeline.
            </Typography>
          </Box>
        </Stack>

        {error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : null}

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Search leads"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            fullWidth
          />
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            >
              <MenuItem value="all">All</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {statusLabel(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={() => void refresh()}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", mb: 3 }}>
          {statusOptions.map((status) => (
            <Chip
              key={status}
              label={`${statusLabel(status)}: ${summary[status]}`}
              color={statusColor(status)}
              variant="outlined"
            />
          ))}
        </Stack>

        <Card sx={{ borderRadius: 3, boxShadow: "0 18px 48px rgba(16,42,67,0.06)" }}>
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ p: 4 }}>
                <Typography color="text.secondary">Loading leads...</Typography>
              </Box>
            ) : filteredLeads.length === 0 ? (
              <Box sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  No leads found
                </Typography>
                <Typography color="text.secondary">
                  Try a different filter or wait for the next booking enquiry.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={0}>
                {filteredLeads.map((lead, index) => (
                  <Paper
                    key={lead.id}
                    elevation={0}
                    sx={{
                      p: 2.25,
                      borderRadius: 0,
                      borderBottom:
                        index === filteredLeads.length - 1
                          ? "none"
                          : "1px solid rgba(16,42,67,0.08)"
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                          <Typography sx={{ fontWeight: 800 }}>{lead.fullName}</Typography>
                          <Chip
                            label={statusLabel(lead.status)}
                            color={statusColor(lead.status)}
                            size="small"
                          />
                        </Stack>
                        <Typography color="text.secondary" sx={{ mb: 0.5 }}>
                          {lead.procedure}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 0.5 }}>
                          {lead.phoneNumber}
                        </Typography>
                        <Typography color="text.secondary" sx={{ wordBreak: "break-word" }}>
                          {lead.message}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Ref: {lead.referenceId} • {lead.source} • {new Date(lead.createdAt).toLocaleString()}
                        </Typography>
                      </Box>

                      <Stack spacing={1.25} sx={{ minWidth: 220 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Status</InputLabel>
                          <Select
                            label="Status"
                            value={lead.status}
                            onChange={(event) =>
                              void handleStatusChange(
                                lead,
                                event.target.value as AdminLeadEntry["status"]
                              )
                            }
                            disabled={savingId === lead.id}
                          >
                            {statusOptions.map((status) => (
                              <MenuItem key={status} value={status}>
                                {statusLabel(status)}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Typography variant="body2" color="text.secondary">
                          Updated: {new Date(lead.updatedAt).toLocaleString()}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
