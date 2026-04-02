export type DashboardPeriodKey = "daily" | "weekly" | "monthly";

export interface DashboardTrendPoint {
  label: string;
  value: number;
}

export interface DashboardChannelPoint {
  label: string;
  value: number;
}

export interface DashboardLead {
  name: string;
  interest: string;
  source: string;
  status: "Booked" | "Interested" | "Follow-up";
  time: string;
}

export interface DashboardPeriodData {
  label: string;
  updated: string;
  totalVisitors: number;
  consultationRequests: number;
  confirmedBookings: number;
  leadCloseRate: number;
  visitorToBookingRate: number;
  trend: DashboardTrendPoint[];
  channels: DashboardChannelPoint[];
  recentLeads: DashboardLead[];
}

export const dashboardPeriods: Record<DashboardPeriodKey, DashboardPeriodData> = {
  daily: {
    label: "Daily",
    updated: "Updated 12 mins ago",
    totalVisitors: 238,
    consultationRequests: 34,
    confirmedBookings: 12,
    leadCloseRate: 35.3,
    visitorToBookingRate: 5.0,
    trend: [
      { label: "8am", value: 14 },
      { label: "10am", value: 28 },
      { label: "12pm", value: 31 },
      { label: "2pm", value: 42 },
      { label: "4pm", value: 56 },
      { label: "6pm", value: 48 },
      { label: "8pm", value: 19 }
    ],
    channels: [
      { label: "Organic Search", value: 38 },
      { label: "Instagram", value: 24 },
      { label: "Direct", value: 18 },
      { label: "WhatsApp", value: 12 },
      { label: "Referrals", value: 8 }
    ],
    recentLeads: [
      {
        name: "Ananya S.",
        interest: "Rhinoplasty consultation",
        source: "Organic Search",
        status: "Booked",
        time: "9:10 AM"
      },
      {
        name: "Karan M.",
        interest: "Hair transplant enquiry",
        source: "WhatsApp",
        status: "Interested",
        time: "10:42 AM"
      },
      {
        name: "Mira P.",
        interest: "Face lift discussion",
        source: "Instagram",
        status: "Follow-up",
        time: "12:15 PM"
      },
      {
        name: "Rohit T.",
        interest: "Liposuction planning",
        source: "Direct",
        status: "Booked",
        time: "2:30 PM"
      }
    ]
  },
  weekly: {
    label: "Weekly",
    updated: "Updated 18 mins ago",
    totalVisitors: 1420,
    consultationRequests: 187,
    confirmedBookings: 76,
    leadCloseRate: 40.6,
    visitorToBookingRate: 5.35,
    trend: [
      { label: "Mon", value: 180 },
      { label: "Tue", value: 212 },
      { label: "Wed", value: 196 },
      { label: "Thu", value: 264 },
      { label: "Fri", value: 320 },
      { label: "Sat", value: 278 },
      { label: "Sun", value: 170 }
    ],
    channels: [
      { label: "Organic Search", value: 41 },
      { label: "Instagram", value: 22 },
      { label: "Direct", value: 16 },
      { label: "WhatsApp", value: 13 },
      { label: "Referrals", value: 8 }
    ],
    recentLeads: [
      {
        name: "Priya K.",
        interest: "Face lift consultation",
        source: "Organic Search",
        status: "Booked",
        time: "Yesterday"
      },
      {
        name: "Sahil R.",
        interest: "Liposuction enquiry",
        source: "Instagram",
        status: "Interested",
        time: "Yesterday"
      },
      {
        name: "Nisha A.",
        interest: "Hair transplant review",
        source: "WhatsApp",
        status: "Follow-up",
        time: "2 days ago"
      },
      {
        name: "Arjun V.",
        interest: "Rhinoplasty planning",
        source: "Direct",
        status: "Booked",
        time: "3 days ago"
      }
    ]
  },
  monthly: {
    label: "Monthly",
    updated: "Updated 22 mins ago",
    totalVisitors: 5860,
    consultationRequests: 712,
    confirmedBookings: 284,
    leadCloseRate: 39.9,
    visitorToBookingRate: 4.84,
    trend: [
      { label: "W1", value: 1180 },
      { label: "W2", value: 1320 },
      { label: "W3", value: 1540 },
      { label: "W4", value: 1720 },
      { label: "W5", value: 1580 }
    ],
    channels: [
      { label: "Organic Search", value: 43 },
      { label: "Instagram", value: 21 },
      { label: "Direct", value: 15 },
      { label: "WhatsApp", value: 12 },
      { label: "Referrals", value: 9 }
    ],
    recentLeads: [
      {
        name: "Meera J.",
        interest: "Body consultation",
        source: "Organic Search",
        status: "Booked",
        time: "This week"
      },
      {
        name: "Dev S.",
        interest: "Hairline review",
        source: "Instagram",
        status: "Interested",
        time: "This week"
      },
      {
        name: "Tanya B.",
        interest: "Facial harmony planning",
        source: "WhatsApp",
        status: "Follow-up",
        time: "Last week"
      },
      {
        name: "Imran Q.",
        interest: "Clinic consultation",
        source: "Direct",
        status: "Booked",
        time: "Last week"
      }
    ]
  }
};
