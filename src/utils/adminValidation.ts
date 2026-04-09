export function validateRequiredText(value: string, label: string): string | null {
  if (value.trim()) {
    return null;
  }

  return `${label} is required.`;
}

export function validateMinimumLines(
  value: string[],
  label: string,
  minimum = 1
): string | null {
  if (value.filter(Boolean).length >= minimum) {
    return null;
  }

  return `${label} needs at least ${minimum} item${minimum === 1 ? "" : "s"}.`;
}

export function validateUrl(value: string, label: string, allowBlank = false): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return allowBlank ? null : `${label} is required.`;
  }

  try {
    // Keep the rule simple and predictable for admin input.
    // Relative paths are not accepted here; uploads should return public URLs.
    const parsed = new URL(trimmed);
    if (!parsed.protocol.startsWith("http")) {
      return `${label} must start with http:// or https://`;
    }
  } catch {
    return `${label} must be a valid URL.`;
  }

  return null;
}

export function validateEmail(value: string, label = "Email"): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return `${label} is required.`;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmed)) {
    return `${label} must be a valid email address.`;
  }

  return null;
}

export function validatePhone(value: string, label: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return `${label} is required.`;
  }

  const phonePattern = /^[+()\-\s0-9]{7,}$/;
  if (!phonePattern.test(trimmed)) {
    return `${label} must look like a valid phone number.`;
  }

  return null;
}
