import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useState, type ChangeEvent } from "react";
import { uploadClinicAsset } from "../../services/mediaUpload";

interface ImageUploadFieldProps {
  label: string;
  folder: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  previewAlt: string;
}

export default function ImageUploadField({
  label,
  folder,
  value,
  onChange,
  helperText,
  previewAlt
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
              height: 180,
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
    </Stack>
  );
}
