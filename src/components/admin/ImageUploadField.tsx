import {
  Box,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { loadMediaAssets, type LiveMediaAsset } from "../../services/backend";
import { uploadClinicAsset } from "../../services/mediaUpload";

interface ImageUploadFieldProps {
  label: string;
  folder: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  previewAlt: string;
  previewHeight?: number;
}

type PickerAsset = LiveMediaAsset;

function getAssetGroup(asset: PickerAsset): string {
  return asset.objectPath.split("/")[0] || asset.bucket;
}

export default function ImageUploadField({
  label,
  folder,
  value,
  onChange,
  helperText,
  previewAlt,
  previewHeight = 180
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerAssets, setPickerAssets] = useState<PickerAsset[]>([]);

  async function openPicker(): Promise<void> {
    setPickerOpen(true);
    setPickerError(null);

    if (pickerAssets.length > 0) {
      return;
    }

    setPickerLoading(true);
    try {
      const assets = await loadMediaAssets(48);
      setPickerAssets(assets);
    } catch (pickerLoadError) {
      setPickerError(pickerLoadError instanceof Error ? pickerLoadError.message : "Failed to load media assets.");
    } finally {
      setPickerLoading(false);
    }
  }

  const pickerGroups = useMemo(() => {
    const next = new Set<string>();
    pickerAssets.forEach((asset) => next.add(getAssetGroup(asset)));
    return ["all", ...Array.from(next).sort()];
  }, [pickerAssets]);

  const [pickerGroup, setPickerGroup] = useState("all");

  useEffect(() => {
    if (!pickerOpen) {
      setPickerSearch("");
      setPickerGroup("all");
    }
  }, [pickerOpen]);

  const filteredPickerAssets = useMemo(() => {
    const search = pickerSearch.trim().toLowerCase();

    return pickerAssets.filter((asset) => {
      const matchesGroup = pickerGroup === "all" || getAssetGroup(asset) === pickerGroup;
      const matchesSearch =
        !search ||
        asset.publicUrl.toLowerCase().includes(search) ||
        asset.objectPath.toLowerCase().includes(search) ||
        (asset.altText ?? "").toLowerCase().includes(search);

      return matchesGroup && matchesSearch;
    });
  }, [pickerAssets, pickerGroup, pickerSearch]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      event.target.value = "";
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const publicUrl = await uploadClinicAsset(file, folder);
      onChange(publicUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <Stack spacing={1.5}>
      <TextField
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        fullWidth
      />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems="flex-start">
        <Button component="label" variant="outlined" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Image"}
          <input hidden accept="image/*" type="file" onChange={handleFileChange} />
        </Button>
        <Button variant="text" onClick={() => void openPicker()} disabled={uploading}>
          Pick from Media Library
        </Button>
        {value ? (
          <Button variant="text" onClick={() => onChange("")} disabled={uploading}>
            Clear Image
          </Button>
        ) : null}
      </Stack>

      {helperText ? (
        <Typography variant="body2" color="text.secondary">
          {helperText}
        </Typography>
      ) : null}
      <Typography variant="body2" color="text.secondary">
        The file previews right away, but it is only added to the media library after you save the
        section.
      </Typography>
      <Chip
        label="Live crop preview"
        size="small"
        variant="outlined"
        sx={{ alignSelf: "flex-start", borderColor: "rgba(31,157,148,0.22)", color: "text.secondary" }}
      />
      <Typography variant="body2" color="text.secondary">
        What you see below is the frame that will be saved and shown on the live site.
      </Typography>

      {error ? (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      ) : null}

      {value ? (
        <Paper
          elevation={0}
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid rgba(16,42,67,0.08)"
          }}
        >
          <Box
            component="img"
            src={value}
            alt={previewAlt}
            sx={{
              width: "100%",
              display: "block",
              height: previewHeight,
              objectFit: "cover",
              borderRadius: 1.5
            }}
          />
        </Paper>
      ) : null}

      {uploading ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            Uploading to Supabase Storage...
          </Typography>
        </Stack>
      ) : null}

      <Dialog open={pickerOpen} onClose={() => setPickerOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>Pick from Media Library</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Search media"
              value={pickerSearch}
              onChange={(event) => setPickerSearch(event.target.value)}
              fullWidth
              size="small"
            />

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {pickerGroups.map((group) => (
                <Chip
                  key={group}
                  label={group === "all" ? `All: ${pickerAssets.length}` : group}
                  color={pickerGroup === group ? "primary" : "default"}
                  variant={pickerGroup === group ? "filled" : "outlined"}
                  onClick={() => setPickerGroup(group)}
                  clickable
                />
              ))}
            </Stack>

            {pickerError ? (
              <Typography color="error">{pickerError}</Typography>
            ) : null}

            {pickerLoading ? (
              <Typography color="text.secondary">Loading media assets...</Typography>
            ) : (
              <Grid container spacing={1.5}>
                {filteredPickerAssets.length === 0 ? (
                  <Grid size={{ xs: 12 }}>
                    <Typography color="text.secondary">
                      No matching media assets found.
                    </Typography>
                  </Grid>
                ) : (
                  filteredPickerAssets.map((asset) => (
                    <Grid key={asset.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          border: "1px solid rgba(16,42,67,0.08)"
                        }}
                      >
                        <Stack spacing={1}>
                          <Box
                            component="img"
                            src={asset.publicUrl}
                            alt={asset.altText ?? "Media asset"}
                            sx={{
                              width: "100%",
                              height: 140,
                              objectFit: "cover",
                              borderRadius: 1.5
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {asset.altText || asset.objectPath}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getAssetGroup(asset)} • {asset.bucket}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              onChange(asset.publicUrl);
                              setPickerOpen(false);
                            }}
                          >
                            Use this image
                          </Button>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))
                )}
              </Grid>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPickerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
