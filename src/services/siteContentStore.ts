import { useEffect, useSyncExternalStore } from "react";
import { getSupabaseClient, hasSupabaseConfig } from "../lib/supabaseClient";

type Listener = () => void;

const cache = new Map<string, unknown>();
const hydrated = new Set<string>();
const listeners = new Map<string, Set<Listener>>();

function notify(sectionKey: string): void {
  const sectionListeners = listeners.get(sectionKey);
  if (!sectionListeners) {
    return;
  }

  for (const listener of sectionListeners) {
    listener();
  }
}

function setCacheValue<T>(sectionKey: string, value: T): void {
  cache.set(sectionKey, value);
  notify(sectionKey);
}

function readLocalStorage<T>(storageKey?: string): T | null {
  if (!storageKey || typeof window === "undefined") {
    return null;
  }

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return null;
    }

    return JSON.parse(saved) as T;
  } catch {
    return null;
  }
}

function writeLocalStorage<T>(storageKey: string | undefined, value: T): void {
  if (!storageKey || typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Ignore storage failures in browser-private mode.
  }
}

export function getCachedSectionValue<T>(sectionKey: string, fallback: T): T {
  return (cache.get(sectionKey) as T | undefined) ?? fallback;
}

export async function hydrateSectionValue<T>(
  sectionKey: string,
  fallback: T,
  storageKey?: string
): Promise<T> {
  if (hydrated.has(sectionKey)) {
    return getCachedSectionValue(sectionKey, fallback);
  }

  hydrated.add(sectionKey);

  const localValue = readLocalStorage<T>(storageKey);
  let nextValue = localValue ?? fallback;
  setCacheValue(sectionKey, nextValue);

  if (!hasSupabaseConfig()) {
    return nextValue;
  }

  const client = getSupabaseClient();
  if (!client) {
    return nextValue;
  }

  try {
    const { data, error } = await client
      .from("site_sections")
      .select("content")
      .eq("section_key", sectionKey)
      .maybeSingle();

    if (!error && data?.content != null) {
      nextValue = data.content as T;
      setCacheValue(sectionKey, nextValue);
      writeLocalStorage(storageKey, nextValue);
    }
  } catch {
    // Keep the local/default value if the remote fetch fails.
  }

  return nextValue;
}

export async function saveSectionValue<T>(
  sectionKey: string,
  value: T,
  storageKey?: string
): Promise<void> {
  setCacheValue(sectionKey, value);
  writeLocalStorage(storageKey, value);

  if (!hasSupabaseConfig()) {
    return;
  }

  const client = getSupabaseClient();
  if (!client) {
    return;
  }

  await client.from("site_sections").upsert({
    section_key: sectionKey,
    content: value
  });
}

export function subscribeSectionValue(sectionKey: string, listener: Listener): () => void {
  const current = listeners.get(sectionKey) ?? new Set<Listener>();
  current.add(listener);
  listeners.set(sectionKey, current);

  return () => {
    const next = listeners.get(sectionKey);
    if (!next) {
      return;
    }

    next.delete(listener);
    if (next.size === 0) {
      listeners.delete(sectionKey);
    }
  };
}

export function useSectionValue<T>(
  sectionKey: string,
  fallback: T,
  storageKey?: string
): T {
  useEffect(() => {
    void hydrateSectionValue(sectionKey, fallback, storageKey);
  }, [fallback, sectionKey, storageKey]);

  return useSyncExternalStore(
    (listener) => subscribeSectionValue(sectionKey, listener),
    () => getCachedSectionValue(sectionKey, fallback),
    () => fallback
  );
}
