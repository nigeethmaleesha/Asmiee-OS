import type { Priority, Role } from "@/types";

export const uid = (prefix = "id") => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const currency = (value: number) => new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(value);

export const shortDate = (value?: string) => value ? new Intl.DateTimeFormat("en-LK", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "—";

export const dateTime = (value?: string) => value ? new Intl.DateTimeFormat("en-LK", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value)) : "—";

export const roleLabel = (role: Role) => ({
  super_admin: "Super Admin",
  admin: "Admin",
  project_manager: "Project Manager",
  developer: "Developer",
  designer: "Designer",
  finance: "Finance",
  client: "Client",
}[role]);

export const priorityTone = (priority: Priority) => priority === "Urgent" ? "danger" : priority === "High" ? "warning" : priority === "Medium" ? "info" : "neutral";

export const initials = (name: string) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export const safeNumber = (value: FormDataEntryValue | null) => Number(value || 0);
