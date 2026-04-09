import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminScrollTop } from "../../hooks/useAdminScrollTop";
import {
  bulkUpdateConsultationLeadStatuses,
  loadAdminLeads,
  updateConsultationLeadStatus,
  type AdminLeadEntry
} from "../../services/backend";

const statusOptions: AdminLeadEntry["status"][] = ["new", "contacted", "booked", "rejected"];
const statusFlow: AdminLeadEntry["status"][] = ["new", "contacted", "booked", "rejected"];
const rowsPerPage = 5;

function statusLabel(status: AdminLeadEntry["status"]): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function statusColor(status: AdminLeadEntry["status"]): "info" | "warning" | "success" | "default" {
  if (status === "booked") return "success";
  if (status === "contacted") return "warning";
  if (status === "rejected") return "default";
  return "info";
}

function getForwardStatuses(status: AdminLeadEntry["status"]): AdminLeadEntry["status"][] {
  const index = statusFlow.indexOf(status);
  return index >= 0 ? statusFlow.slice(index + 1) : [];
}

function getBulkActionStatuses(selected: AdminLeadEntry[]): AdminLeadEntry["status"][] {
  if (selected.length === 0) {
    return [];
  }

  return statusFlow.filter((status) =>
    selected.every((lead) => getForwardStatuses(lead.status).includes(status))
  );
}

export default function AdminLeadsPage() {
  useAdminScrollTop();
  const [leads, setLeads] = useState<AdminLeadEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [bulkSavingStatus, setBulkSavingStatus] = useState<AdminLeadEntry["status"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminLeadEntry["status"]>("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  async function refresh(): Promise<void> {
    setQuery("");
    setPage(1);
    setSelectedIds([]);
    setLoading(true);
    setError(null);
    const nextLeads = await loadAdminLeads();
    setLeads(nextLeads);
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => leads.some((lead) => lead.id === id)));
  }, [leads]);

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [query, statusFilter]);

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

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / rowsPerPage));

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredLeads.slice(start, start + rowsPerPage);
  }, [filteredLeads, page]);

  const summary = useMemo(() => {
    return statusOptions.reduce(
      (acc, status) => {
        acc[status] = leads.filter((lead) => lead.status === status).length;
        return acc;
      },
      { new: 0, contacted: 0, booked: 0, rejected: 0 } as Record<AdminLeadEntry["status"], number>
    );
  }, [leads]);

  const selectedVisibleLeads = useMemo(
    () => paginatedLeads.filter((lead) => selectedIds.includes(lead.id)),
    [paginatedLeads, selectedIds]
  );
  const allVisibleSelected = paginatedLeads.length > 0 && selectedVisibleLeads.length === paginatedLeads.length;
  const someVisibleSelected = selectedVisibleLeads.length > 0 && !allVisibleSelected;
  const bulkActionStatuses = useMemo(
    () => getBulkActionStatuses(selectedVisibleLeads),
    [selectedVisibleLeads]
  );

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
      current.map((item) => (item.id === lead.id ? { ...item, status: nextStatus } : item))
    );
    setSavingId(null);
  }

  async function handleBulkStatusChange(nextStatus: AdminLeadEntry["status"]) {
    if (selectedVisibleLeads.length === 0) {
      return;
    }

    setBulkSavingStatus(nextStatus);
    setError(null);

    const result = await bulkUpdateConsultationLeadStatuses(
      selectedVisibleLeads.map((lead) => lead.referenceId),
      nextStatus
    );

    if (!result.success) {
      setError(result.message);
      setBulkSavingStatus(null);
      return;
    }

    const selectedSet = new Set(selectedVisibleLeads.map((lead) => lead.id));
    setLeads((current) =>
      current.map((item) => (selectedSet.has(item.id) ? { ...item, status: nextStatus } : item))
    );
    setSelectedIds([]);
    setBulkSavingStatus(null);
  }

  function toggleLeadSelection(leadId: number) {
    setSelectedIds((current) =>
      current.includes(leadId) ? current.filter((id) => id !== leadId) : [...current, leadId]
    );
  }

  function toggleVisibleSelection() {
    setSelectedIds((current) => {
      if (allVisibleSelected) {
        return current.filter((id) => !paginatedLeads.some((lead) => lead.id === id));
      }

      const next = new Set(current);
      paginatedLeads.forEach((lead) => next.add(lead.id));
      return Array.from(next);
    });
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

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2.5 }}>
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

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 3 }}>
          {(["all", ...statusOptions] as const).map((status) => (
            <Chip
              key={status}
              label={
                status === "all"
                  ? `All: ${leads.length}`
                  : `${statusLabel(status)}: ${summary[status]}`
              }
              color={status === "all" ? "default" : statusColor(status)}
              variant={statusFilter === status ? "filled" : "outlined"}
              onClick={() => setStatusFilter(status)}
              clickable
            />
          ))}
        </Stack>

        <Card sx={{ borderRadius: 3, boxShadow: "0 18px 48px rgba(16,42,67,0.06)" }}>
          <CardContent sx={{ p: 0 }}>
            {filteredLeads.length > 0 ? (
              <Box
                sx={{
                  px: 2.25,
                  py: 1.5,
                  borderBottom: "1px solid rgba(16,42,67,0.08)",
                  bgcolor: "#ffffff"
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allVisibleSelected}
                        indeterminate={someVisibleSelected}
                        onChange={toggleVisibleSelection}
                        icon={<CheckBoxOutlineBlankRoundedIcon />}
                        checkedIcon={<CheckBoxRoundedIcon />}
                      />
                    }
                    label={`Select visible (${paginatedLeads.length})`}
                  />

                  {selectedVisibleLeads.length > 0 ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ flexWrap: "wrap", justifyContent: "flex-end" }}
                    >
                      <Chip label={`${selectedVisibleLeads.length} selected`} color="primary" />
                      {bulkActionStatuses.length > 0 ? (
                        bulkActionStatuses.map((status) => (
                          <Button
                            key={status}
                            variant="outlined"
                            size="small"
                            onClick={() => void handleBulkStatusChange(status)}
                            disabled={Boolean(bulkSavingStatus)}
                          >
                            {bulkSavingStatus === status
                              ? `Updating ${statusLabel(status)}...`
                              : `Mark ${statusLabel(status)}`}
                          </Button>
                        ))
                      ) : (
                        <Chip label="No forward bulk actions" variant="outlined" />
                      )}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Select leads to update several at once
                    </Typography>
                  )}
                </Stack>
              </Box>
            ) : null}

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
                {paginatedLeads.map((lead, index) => (
                  <Paper
                    key={lead.id}
                    elevation={0}
                    sx={{
                      p: 2.25,
                      borderRadius: 0,
                      borderBottom:
                        index === paginatedLeads.length - 1
                          ? "none"
                          : "1px solid rgba(16,42,67,0.08)"
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Stack direction="row" spacing={1.5} sx={{ minWidth: 0, flex: 1 }}>
                        <Checkbox
                          checked={selectedIds.includes(lead.id)}
                          onChange={() => toggleLeadSelection(lead.id)}
                          sx={{ mt: 0.2 }}
                        />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
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
                            Ref: {lead.referenceId} • {lead.source} •{" "}
                            {new Date(lead.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      </Stack>

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
                <Box
                  sx={{
                    px: 2.25,
                    py: 2,
                    borderTop: "1px solid rgba(16,42,67,0.08)",
                    bgcolor: "#ffffff"
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Showing {filteredLeads.length === 0 ? 0 : (page - 1) * rowsPerPage + 1}-
                      {Math.min(page * rowsPerPage, filteredLeads.length)} of {filteredLeads.length}
                    </Typography>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(_, nextPage) => {
                        setPage(nextPage);
                        setSelectedIds([]);
                      }}
                      color="primary"
                      shape="rounded"
                    />
                  </Stack>
                </Box>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
