import { dashboardPeriods, type DashboardPeriodData, type DashboardPeriodKey } from "../data/adminDashboard";
import { getSupabaseClient, hasSupabaseConfig } from "../lib/supabaseClient";
import type { AppointmentApiResponse, AppointmentSubmission } from "../types/clinic";

export interface VisitorEventPayload {
  eventType: "page_view" | "cta_click" | "form_submit";
  pagePath: string;
  sectionId?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface ConsultationLeadRecord extends AppointmentSubmission {
  referenceId: string;
  status: "new" | "contacted" | "booked" | "rejected";
}

export interface AdminLeadEntry extends ConsultationLeadRecord {
  id: number;
  phoneNumber: string;
  serviceSlug: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LiveDashboardData extends DashboardPeriodData {
  live: boolean;
}

function createReferenceId(): string {
  return `TC-${Date.now().toString().slice(-6)}`;
}

function toDateKey(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function getPeriodRange(period: DashboardPeriodKey): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date(end);

  if (period === "daily") {
    start.setDate(end.getDate() - 1);
  } else if (period === "weekly") {
    start.setDate(end.getDate() - 7);
  } else {
    start.setMonth(end.getMonth() - 1);
  }

  return { start, end };
}

function toIso(value: Date): string {
  return value.toISOString();
}

function bucketLabel(period: DashboardPeriodKey, date: Date): string {
  if (period === "daily") {
    return `${date.getHours()}h`;
  }

  if (period === "weekly") {
    return date.toLocaleDateString(undefined, { weekday: "short" });
  }

  return `W${Math.max(1, Math.ceil(date.getDate() / 7))}`;
}

function aggregateTrend(
  period: DashboardPeriodKey,
  timestamps: string[]
): DashboardPeriodData["trend"] {
  const counts = new Map<string, number>();

  for (const timestamp of timestamps) {
    const label = bucketLabel(period, new Date(timestamp));
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  const sorted = Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b));

  return sorted.map(([label, value]) => ({ label, value }));
}

function aggregateChannels(sources: string[]): DashboardPeriodData["channels"] {
  const counts = new Map<string, number>();

  for (const source of sources) {
    const label = source || "Direct";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));
}

export async function incrementDailyStats(
  client: NonNullable<ReturnType<typeof getSupabaseClient>>,
  dateKey: string,
  visitorDelta = 0,
  consultationDelta = 0,
  bookingDelta = 0
): Promise<void> {
  const { data: existing, error: selectError } = await client
    .from("daily_stats")
    .select("visitor_count, consultation_count, booking_count")
    .eq("stat_date", dateKey)
    .maybeSingle();

  if (selectError) {
    return;
  }

  const nextRow = {
    stat_date: dateKey,
    visitor_count: (existing?.visitor_count ?? 0) + visitorDelta,
    consultation_count: (existing?.consultation_count ?? 0) + consultationDelta,
    booking_count: (existing?.booking_count ?? 0) + bookingDelta
  };

  if (existing) {
    await client.from("daily_stats").update(nextRow).eq("stat_date", dateKey);
    return;
  }

  await client.from("daily_stats").insert(nextRow);
}

export async function recordVisitorEvent(payload: VisitorEventPayload): Promise<void> {
  const client = getSupabaseClient();

  if (!client) {
    return;
  }

  await client.from("visitor_events").insert({
    event_type: payload.eventType,
    page_path: payload.pagePath,
    section_id: payload.sectionId ?? null,
    source: payload.source ?? null,
    metadata: payload.metadata ?? {}
  });

  if (payload.eventType === "page_view") {
    await incrementDailyStats(client, toDateKey(new Date()), 1, 0, 0);
  }
}

export async function submitConsultationLead(
  payload: AppointmentSubmission
): Promise<AppointmentApiResponse> {
  const referenceId = createReferenceId();
  const client = getSupabaseClient();

  if (!client) {
    return {
      success: true,
      message: "Your request has been received. Our team will contact you shortly.",
      referenceId
    };
  }

  const { error } = await client.from("consultation_leads").insert({
    reference_id: referenceId,
    full_name: payload.fullName.trim(),
    phone_number: payload.phoneNumber.trim(),
    procedure: payload.procedure.trim(),
    message: payload.message.trim(),
    source: payload.source,
    service_slug: payload.serviceSlug ?? null,
    status: "new"
  });

  if (error) {
    return {
      success: false,
      message: error.message,
      referenceId
    };
  }

  await incrementDailyStats(client, toDateKey(new Date()), 0, 1, 0);

  return {
    success: true,
    message: "Your request has been received. Our team will contact you shortly.",
    referenceId
  };
}

export async function loadAdminLeads(): Promise<AdminLeadEntry[]> {
  const client = getSupabaseClient();

  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from("consultation_leads")
    .select(
      "id, reference_id, full_name, phone_number, procedure, message, source, service_slug, status, created_at, updated_at"
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    referenceId: row.reference_id,
    fullName: row.full_name,
    phoneNumber: row.phone_number,
    procedure: row.procedure,
    message: row.message,
    source: row.source,
    serviceSlug: row.service_slug ?? null,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export async function updateConsultationLeadStatus(
  referenceId: string,
  nextStatus: ConsultationLeadRecord["status"]
): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();

  if (!client) {
    return {
      success: false,
      message: "Supabase is not configured."
    };
  }

  const { data: currentLead, error: loadError } = await client
    .from("consultation_leads")
    .select("status, created_at")
    .eq("reference_id", referenceId)
    .maybeSingle();

  if (loadError || !currentLead) {
    return {
      success: false,
      message: "Lead not found."
    };
  }

  const { error } = await client
    .from("consultation_leads")
    .update({ status: nextStatus })
    .eq("reference_id", referenceId);

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }

  const oldBooked = currentLead.status === "booked" ? 1 : 0;
  const newBooked = nextStatus === "booked" ? 1 : 0;
  const bookingDelta = newBooked - oldBooked;

  if (bookingDelta !== 0) {
    await incrementDailyStats(client, toDateKey(new Date()), 0, 0, bookingDelta);
  }

  return {
    success: true,
    message: "Lead status updated."
  };
}

export async function loadDashboardPeriodData(
  period: DashboardPeriodKey
): Promise<LiveDashboardData> {
  if (!hasSupabaseConfig()) {
    return { ...dashboardPeriods[period], live: false };
  }

  const client = getSupabaseClient();
  if (!client) {
    return { ...dashboardPeriods[period], live: false };
  }

  try {
    const { start, end } = getPeriodRange(period);
    const startIso = toIso(start);
    const endIso = toIso(end);
    const startDateKey = toDateKey(start);
    const endDateKey = toDateKey(end);

    const [visitorsResult, dailyStatsResult, leadsResult] = await Promise.all([
      client
        .from("visitor_events")
        .select("created_at")
        .gte("created_at", startIso)
        .lte("created_at", endIso),
      client
        .from("daily_stats")
        .select("stat_date, visitor_count, consultation_count, booking_count")
        .gte("stat_date", startDateKey)
        .lte("stat_date", endDateKey),
      client
        .from("consultation_leads")
        .select("created_at, full_name, procedure, source, status")
        .gte("created_at", startIso)
        .lte("created_at", endIso)
        .order("created_at", { ascending: false })
        .limit(6)
    ]);

    const visitorTimestamps = (visitorsResult.data ?? []).map((row) => row.created_at);
    const dailyStats = dailyStatsResult.data ?? [];
    const leads = leadsResult.data ?? [];

    const totalVisitors = dailyStats.length
      ? dailyStats.reduce((sum, row) => sum + (row.visitor_count ?? 0), 0)
      : visitorTimestamps.length;
    const consultationRequests = dailyStats.length
      ? dailyStats.reduce((sum, row) => sum + (row.consultation_count ?? 0), 0)
      : leads.length;
    const confirmedBookings = dailyStats.length
      ? dailyStats.reduce((sum, row) => sum + (row.booking_count ?? 0), 0)
      : leads.filter((lead) => lead.status === "booked").length;
    const leadCloseRate = consultationRequests
      ? (confirmedBookings / consultationRequests) * 100
      : 0;
    const visitorToBookingRate = totalVisitors
      ? (confirmedBookings / totalVisitors) * 100
      : 0;

    const trend = aggregateTrend(period, visitorTimestamps);
    const channels = aggregateChannels(leads.map((lead) => lead.source ?? "Direct"));

    return {
      live: true,
      label: dashboardPeriods[period].label,
      updated: "Live Supabase data",
      totalVisitors,
      consultationRequests,
      confirmedBookings,
      leadCloseRate,
      visitorToBookingRate,
      trend: trend.length > 0 ? trend : [],
      channels: channels.length > 0 ? channels : [],
      recentLeads:
        leads.length > 0
          ? leads.map((lead) => ({
              name: lead.full_name,
              interest: lead.procedure,
              source: lead.source ?? "Direct",
              status:
                lead.status === "booked"
                  ? "Booked"
                  : lead.status === "contacted"
                    ? "Interested"
                    : "Follow-up",
              time: new Date(lead.created_at).toLocaleDateString()
            }))
          : dashboardPeriods[period].recentLeads
    };
  } catch {
    return { ...dashboardPeriods[period], live: false };
  }
}
