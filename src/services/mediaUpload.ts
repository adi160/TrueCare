import { getSupabaseClient, hasSupabaseConfig } from "../lib/supabaseClient";

export const clinicAssetsBucket = "clinic-assets";

function sanitizeSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getFileExtension(file: File): string {
  const parts = file.name.split(".");
  if (parts.length > 1) {
    return parts.pop()!.toLowerCase();
  }

  if (file.type.includes("/")) {
    return file.type.split("/").pop()!.toLowerCase();
  }

  return "png";
}

function createObjectPath(folder: string, file: File): string {
  const safeFolder = sanitizeSegment(folder) || "uploads";
  const uniqueId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `${safeFolder}/${uniqueId}.${getFileExtension(file)}`;
}

export async function uploadClinicAsset(file: File, folder: string): Promise<string> {
  const client = getSupabaseClient();

  if (!hasSupabaseConfig() || !client) {
    throw new Error("Supabase is not configured for uploads.");
  }

  const objectPath = createObjectPath(folder, file);

  const { error: uploadError } = await client.storage.from(clinicAssetsBucket).upload(objectPath, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: true
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicData } = client.storage.from(clinicAssetsBucket).getPublicUrl(objectPath);
  const publicUrl = publicData.publicUrl;

  if (!publicUrl) {
    throw new Error("Unable to create a public URL for the uploaded file.");
  }

  try {
    await client.from("media_assets").insert({
      bucket: clinicAssetsBucket,
      object_path: objectPath,
      public_url: publicUrl,
      alt_text: null
    });
  } catch {
    // Media metadata is helpful, but the uploaded image itself is the primary output.
  }

  return publicUrl;
}
