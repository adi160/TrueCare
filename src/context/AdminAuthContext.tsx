import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient, hasSupabaseConfig } from "../lib/supabaseClient";
import {
  getAdminPermissions,
  isApprovedAdminRole,
  type AdminPermissions
} from "../utils/adminPermissions";

export interface AdminProfile {
  id: string;
  role: "admin" | "manager";
  fullName: string | null;
}

interface AdminAuthContextValue {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: AdminProfile | null;
  isAdmin: boolean;
  permissions: AdminPermissions;
  configReady: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

async function loadAdminProfile(userId: string): Promise<AdminProfile | null> {
  const client = getSupabaseClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("admin_profiles")
    .select("id, role, full_name")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data || !isApprovedAdminRole(data.role)) {
    return null;
  }

  return {
    id: data.id,
    role: data.role === "admin" ? "admin" : "manager",
    fullName: data.full_name ?? null
  };
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const client = getSupabaseClient();
  const configReady = hasSupabaseConfig() && Boolean(client);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const permissions = useMemo(() => getAdminPermissions(profile?.role), [profile?.role]);

  async function syncSession(nextSession: Session | null): Promise<void> {
    setSession(nextSession);

    if (!nextSession?.user) {
      setProfile(null);
      return;
    }

    const nextProfile = await loadAdminProfile(nextSession.user.id);
    setProfile(nextProfile);
  }

  async function refresh(): Promise<void> {
    if (!client) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data } = await client.auth.getSession();
    await syncSession(data.session);
    setLoading(false);
  }

  useEffect(() => {
    void refresh();

    if (!client) {
      return;
    }

    const {
      data: { subscription }
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      void syncSession(nextSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [client]);

  async function signIn(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> {
    if (!client) {
      return {
        success: false,
        message: "Supabase is not configured yet."
      };
    }

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { success: false, message: error.message };
    }

    const nextSession = data.session ?? null;
    await syncSession(nextSession);

    if (!nextSession?.user) {
      return {
        success: false,
        message: "We could not start your admin session."
      };
    }

    const nextProfile = await loadAdminProfile(nextSession.user.id);
    if (!nextProfile) {
      await client.auth.signOut();
      setSession(null);
      setProfile(null);
      return {
        success: false,
        message: "This account is not approved for admin access."
      };
    }

    setProfile(nextProfile);

    return {
      success: true,
      message: "Signed in successfully."
    };
  }

  async function signOut(): Promise<void> {
    if (!client) {
      return;
    }

    await client.auth.signOut();
    setSession(null);
    setProfile(null);
  }

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      loading,
      session,
      user: session?.user ?? null,
      profile,
      isAdmin: Boolean(profile),
      permissions,
      configReady,
      signIn,
      signOut,
      refresh
    }),
    [configReady, loading, permissions, profile, refresh, session]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }

  return context;
}
