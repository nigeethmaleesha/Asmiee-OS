/**
 * Backend handoff contract.
 * The Phase 1 UI currently uses the browser-backed demo repository.
 * A Node/NestJS backend can implement these resource routes without changing page structure.
 */
export const API_ENDPOINTS = {
  auth: "/api/auth",
  users: "/api/users",
  clients: "/api/clients",
  projects: "/api/projects",
  tasks: "/api/tasks",
  channels: "/api/channels",
  messages: "/api/messages",
  approvals: "/api/approvals",
  notifications: "/api/notifications",
  files: "/api/files",
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    credentials: "include",
  });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json() as Promise<T>;
}
