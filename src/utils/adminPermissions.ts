export type AdminRole = "admin" | "manager";

export type AdminAccessArea = "dashboard" | "content" | "leads" | "media";

export interface AdminPermissions {
  dashboard: boolean;
  content: boolean;
  leads: boolean;
  media: boolean;
}

const rolePermissions: Record<AdminRole, AdminPermissions> = {
  admin: {
    dashboard: true,
    content: true,
    leads: true,
    media: true
  },
  manager: {
    dashboard: true,
    content: false,
    leads: true,
    media: false
  }
};

export function isApprovedAdminRole(role: string | null | undefined): role is AdminRole {
  return role === "admin" || role === "manager";
}

export function getAdminPermissions(role: string | null | undefined): AdminPermissions {
  if (role === "admin") {
    return rolePermissions.admin;
  }

  return rolePermissions.manager;
}

export function getAdminLandingRoute(role: string | null | undefined): string {
  return "/admin";
}

export function getRoleDisplayLabel(role: string | null | undefined): string {
  return role === "admin" ? "Admin" : "Manager";
}

export function canAccessAdminPath(role: string | null | undefined, pathname: string): boolean {
  const permissions = getAdminPermissions(role);

  if (pathname.startsWith("/admin/leads")) {
    return permissions.leads;
  }

  if (pathname.startsWith("/admin/")) {
    return permissions.content;
  }

  return permissions.dashboard;
}

export function getAdminAccessArea(pathname: string): AdminAccessArea {
  if (pathname.startsWith("/admin/leads")) {
    return "leads";
  }

  if (pathname.startsWith("/admin/")) {
    return "content";
  }

  return "dashboard";
}
