import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminScrollTop } from "../../hooks/useAdminScrollTop";
import { deleteMediaAsset, loadMediaAssets, updateMediaAssetAltText } from "../../services/backend";
import type { MediaAssetRecord } from "../../services/mediaUpload";

function getAssetGroup(asset: MediaAssetRecord): string {
  return asset.objectPath.split("/")[0] || asset.bucket;
}

export default function AdminMediaLibraryPage() {
  useAdminScrollTop();
  const [assets, setAssets] = useState<MediaAssetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [altDrafts, setAltDrafts] = useState<Record<number, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<MediaAssetRecord | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function refresh(): Promise<void> {
    setLoading(true);
    setSaveError(null);
    const nextAssets = await loadMediaAssets();
    setAssets(nextAssets);
    setAltDrafts(
      nextAssets.reduce<Record<number, string>>((acc, asset) => {
        acc[asset.id] = asset.altText ?? "";
        return acc;
      }, {})
    );
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const groups = useMemo(() => {
    const next = new Set<string>();
    assets.forEach((asset) => next.add(getAssetGroup(asset)));
    return ["all", ...Array.from(next).sort()];
  }, [assets]);

  const filteredAssets = useMemo(() => {
    const search = query.trim().toLowerCase();

    return assets.filter((asset) => {
      const matchesGroup = groupFilter === "all" || getAssetGroup(asset) === groupFilter;
      const matchesSearch =
        !search ||
        asset.publicUrl.toLowerCase().includes(search) ||
        asset.objectPath.toLowerCase().includes(search) ||
        (asset.altText ?? "").toLowerCase().includes(search);

      return matchesGroup && matchesSearch;
    });
  }, [assets, groupFilter, query]);

  async function copyValue(value: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      setSaveError(null);
    } catch {
      setSaveError("Copy failed. Please copy the URL manually.");
    }
  }

  async function saveAltText(assetId: number): Promise<void> {
    setSavingId(assetId);
    setSaveError(null);
    const result = await updateMediaAssetAltText(assetId, altDrafts[assetId] ?? "");

    if (!result.success) {
      setSaveError(result.message);
      setSavingId(null);
      return;
    }

    setAssets((current) =>
      current.map((asset) =>
        asset.id === assetId ? { ...asset, altText: (altDrafts[assetId] ?? "").trim() || null } : asset
      )
    );
    setSavingId(null);
  }

  async function confirmDeleteAsset(): Promise<void> {
    if (!deleteTarget) {
      return;
    }

    setDeletingId(deleteTarget.id);
    setSaveError(null);

    const result = await deleteMediaAsset(deleteTarget);
    if (!result.success) {
      setSaveError(result.message);
      setDeletingId(null);
      return;
    }

    setAssets((current) => current.filter((asset) => asset.id !== deleteTarget.id));
    setAltDrafts((current) => {
      const next = { ...current };
      delete next[deleteTarget.id];
      return next;
    });
    setDeleteTarget(null);
    setDeletingId(null);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
        background:
          "radial-gradient(circle at top left, rgba(31,157,148,0.12), transparent 28%), linear-gradient(180deg, #f4fbfb 0%, #ecf6f4 100%)"
      }}
    >
      <Container>
        <Stack spacing={3}>
          <Button component={Link} to="/admin" variant="text" startIcon={<ArrowBackRoundedIcon />}>
            Back to Admin
          </Button>

          <Box>
            <Typography variant="h2" sx={{ mb: 1 }}>
              Media Library
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Browse clinic images that were saved from admin sections, copy URLs, and update alt
              text so the same asset can be reused across sections later.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Search assets"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              fullWidth
            />
            <Button variant="outlined" startIcon={<RefreshRoundedIcon />} onClick={() => void refresh()} disabled={loading}>
              Refresh
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {groups.map((group) => (
              <Chip
                key={group}
                label={group === "all" ? `All: ${assets.length}` : group}
                color={groupFilter === group ? "primary" : "default"}
                variant={groupFilter === group ? "filled" : "outlined"}
                onClick={() => setGroupFilter(group)}
                clickable
              />
            ))}
          </Stack>

          {saveError ? <Alert severity="error">{saveError}</Alert> : null}

          <Grid container spacing={2.5}>
            {loading ? (
              <Grid size={{ xs: 12 }}>
                <Card sx={{ borderRadius: 3, border: "1px solid rgba(16,42,67,0.08)" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography color="text.secondary">Loading media assets...</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : filteredAssets.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Card sx={{ borderRadius: 3, border: "1px solid rgba(16,42,67,0.08)" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      No media assets found
                    </Typography>
                    <Typography color="text.secondary">
                      Upload an image from Home, Doctor, Services, or Gallery to see it here.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              filteredAssets.map((asset) => {
                const group = getAssetGroup(asset);
                return (
                  <Grid key={asset.id} size={{ xs: 12, md: 6, lg: 4 }}>
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                        border: "1px solid rgba(16,42,67,0.08)",
                        boxShadow: "0 18px 48px rgba(16,42,67,0.06)"
                      }}
                    >
                      <CardContent sx={{ p: 2.25 }}>
                        <Stack spacing={1.5}>
                          <Box
                            component="img"
                            src={asset.publicUrl}
                            alt={asset.altText ?? "Uploaded asset"}
                            sx={{
                              width: "100%",
                              height: 180,
                              objectFit: "cover",
                              borderRadius: 2,
                              border: "1px solid rgba(16,42,67,0.08)"
                            }}
                          />
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                            <Chip label={group} size="small" />
                            <Chip label={asset.bucket} size="small" variant="outlined" />
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
                            {asset.objectPath}
                          </Typography>
                          <TextField
                            label="Alt text"
                            value={altDrafts[asset.id] ?? ""}
                            onChange={(event) =>
                              setAltDrafts((current) => ({ ...current, [asset.id]: event.target.value }))
                            }
                            fullWidth
                            size="small"
                            helperText="Save alt text so the asset is ready for reuse later."
                          />
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ flexWrap: "nowrap", overflowX: "auto", pb: 0.25 }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<ContentCopyRoundedIcon />}
                              onClick={() => void copyValue(asset.publicUrl)}
                            >
                              Copy URL
                            </Button>
                            <Button
                              variant="text"
                              size="small"
                              startIcon={<OpenInNewRoundedIcon />}
                              component="a"
                              href={asset.publicUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => void saveAltText(asset.id)}
                              disabled={savingId === asset.id}
                              sx={{ flexShrink: 0, minWidth: "auto" }}
                            >
                              {savingId === asset.id ? "Saving..." : "Save alt text"}
                            </Button>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => setDeleteTarget(asset)}
                              aria-label={`Delete ${asset.altText ?? asset.objectPath}`}
                              sx={{ flexShrink: 0 }}
                            >
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            Added {new Date(asset.createdAt).toLocaleString()}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
        </Stack>
      </Container>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete media asset?</DialogTitle>
        <DialogContent>
          This will remove the file from Supabase Storage and delete the media record from the
          library.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={Boolean(deletingId)}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => void confirmDeleteAsset()}
            disabled={Boolean(deletingId)}
          >
            {deletingId ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
