"use client";

import { useEffect } from "react";
import type { ProjectFile } from "@/types";
import { uid } from "@/lib/utils";
import { useApp } from "@/context/app-context";

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "info" | "purple" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Avatar({ label, size = "md" }: { label: string; size?: "sm" | "md" | "lg" }) {
  return <span className={`avatar avatar-${size}`}>{label}</span>;
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return <header className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="page-actions">{actions}</div>}</header>;
}

export function Modal({ open, title, onClose, children, wide = false }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);
  if (!open) return null;
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-label={title}><div className="modal-head"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close">×</button></div><div className="modal-body">{children}</div></section></div>;
}

export function Drawer({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);
  if (!open) return null;
  return <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><aside className="drawer" role="dialog" aria-modal="true"><div className="modal-head"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close">×</button></div><div className="drawer-body">{children}</div></aside></div>;
}

export function ToastStack() {
  const { toasts } = useApp();
  return <div className="toast-stack" aria-live="polite">{toasts.map((toast) => <div key={toast.id} className={`toast toast-${toast.tone ?? "success"}`}>{toast.message}</div>)}</div>;
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return <div className="empty-state"><div className="empty-icon">◎</div><h3>{title}</h3><p>{text}</p>{action}</div>;
}

export function FilePicker({ onFile, label = "Add file" }: { onFile: (file: ProjectFile) => void; label?: string }) {
  const handle = (file?: File) => {
    if (!file) return;
    const base = { id: uid("file"), name: file.name, size: file.size, type: file.type || "application/octet-stream", uploadedAt: new Date().toISOString(), uploadedBy: "demo" };
    if (file.size > 750 * 1024) { onFile(base); return; }
    const reader = new FileReader();
    reader.onload = () => onFile({ ...base, dataUrl: typeof reader.result === "string" ? reader.result : undefined });
    reader.readAsDataURL(file);
  };
  return <label className="button button-secondary file-button">{label}<input type="file" hidden onChange={(e) => { handle(e.target.files?.[0]); e.currentTarget.value = ""; }} /></label>;
}

export function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return <div className="progress"><span style={{ width: `${v}%` }} /></div>;
}
