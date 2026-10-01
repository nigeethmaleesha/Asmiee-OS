import type { Role } from "@/types";

export type Permission =
  | "clients:write" | "projects:write" | "tasks:write" | "messages:write"
  | "approvals:write" | "users:write" | "finance:view" | "portal:view";

const rolePermissions: Record<Role, Permission[]> = {
  super_admin: ["clients:write", "projects:write", "tasks:write", "messages:write", "approvals:write", "users:write", "finance:view"],
  admin: ["clients:write", "projects:write", "tasks:write", "messages:write", "approvals:write", "users:write", "finance:view"],
  project_manager: ["clients:write", "projects:write", "tasks:write", "messages:write", "approvals:write", "finance:view"],
  developer: ["tasks:write", "messages:write", "approvals:write"],
  designer: ["tasks:write", "messages:write", "approvals:write"],
  finance: ["messages:write", "finance:view"],
  client: ["messages:write", "portal:view"],
};

export const can = (role: Role, permission: Permission) => rolePermissions[role].includes(permission);
