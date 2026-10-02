"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/context/app-context";
import { can } from "@/lib/permissions";
import { roleLabel } from "@/lib/utils";
import { Avatar, ToastStack } from "@/components/ui";
import { Icon, type IconName } from "@/components/icons";

const SIDEBAR_KEY = "asmiee-os-sidebar-collapsed";

const items: { href: string; label: string; icon: IconName; permission?: Parameters<typeof can>[1] }[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/clients", label: "Clients", icon: "clients" },
  { href: "/projects", label: "Projects", icon: "projects" },
  { href: "/tasks", label: "Tasks", icon: "tasks" },
  { href: "/workspace", label: "Workspace", icon: "chat" },
  { href: "/approvals", label: "Approvals", icon: "approval" },
  { href: "/team", label: "Team & Roles", icon: "team", permission: "users:write" },
  { href: "/portal", label: "Client Portal", icon: "portal" },
];

const labels: Record<string, string> = {
  dashboard: "Dashboard", clients: "Clients", projects: "Projects", tasks: "Tasks", workspace: "Workspace", approvals: "Approvals", team: "Team & Roles", portal: "Client Portal", notifications: "Notifications",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { hydrated, currentUser, state, logout, loginAs, resetDemo, markNotificationRead } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_KEY);
    setSidebarCollapsed(stored === "true");
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    if (!hydrated) return;
    if (!currentUser) router.replace("/login");
    else if (currentUser.role === "client" && !pathname.startsWith("/portal") && !pathname.startsWith("/notifications")) router.replace("/portal");
    else if (pathname.startsWith("/team") && !can(currentUser.role, "users:write")) router.replace("/dashboard");
  }, [hydrated, currentUser, pathname, router]);

  const unread = useMemo(() => currentUser ? state.notifications.filter((n) => n.userId === currentUser.id && !n.read) : [], [state.notifications, currentUser]);
  const recent = useMemo(() => currentUser ? state.notifications.filter((n) => n.userId === currentUser.id).slice(0, 5) : [], [state.notifications, currentUser]);

  if (!hydrated || !currentUser) return <div className="loading-screen"><div className="brand-mark">A</div><span>Loading workspace…</span></div>;

  const visibleItems = currentUser.role === "client"
    ? items.filter((item) => item.href === "/portal")
    : items.filter((item) => !item.permission || can(currentUser.role, item.permission));

  const segment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  const pageTitle = labels[segment] ?? "Asmiee OS";

  return <div className={`app-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
    <aside className={`sidebar ${sidebarCollapsed && !mobileOpen ? "is-collapsed" : ""} ${mobileOpen ? "sidebar-open" : ""}`}>
      <button
        className="sidebar-toggle"
        type="button"
        onClick={() => setSidebarCollapsed((value) => !value)}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <Icon name={sidebarCollapsed ? "chevronRight" : "chevronLeft"} size={16}/>
      </button>

      <div className="sidebar-brand">
        <div className="brand-mark">A</div>
        <div className="sidebar-brand-copy"><strong>ASMIEE</strong><span>OPERATING SYSTEM</span></div>
        <button className="mobile-close" onClick={() => setMobileOpen(false)}>×</button>
      </div>

      <nav className="nav-list" aria-label="Main navigation">
        <div className="nav-label">Workspace</div>
        {visibleItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
          const pendingApprovals = state.approvals.filter((a) => ["Awaiting Response", "Viewed", "Changes Requested", "Resubmitted"].includes(a.status)).length;
          return <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${active ? "active" : ""}`}
            onClick={() => setMobileOpen(false)}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <Icon name={item.icon}/>
            <span className="nav-item-label">{item.label}</span>
            {item.href === "/approvals" && pendingApprovals > 0 && <span className="nav-count">{pendingApprovals}</span>}
          </Link>;
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="demo-panel">
          <span>Demo workspace</span>
          <button onClick={resetDemo} title={sidebarCollapsed ? "Reset demo data" : undefined}><Icon name="reset" size={15}/><span className="demo-reset-label">Reset data</span></button>
        </div>
        <div className="user-card">
          <Avatar label={currentUser.avatar}/>
          <div className="user-meta"><strong>{currentUser.name}</strong><span>{roleLabel(currentUser.role)}</span></div>
          <button className="icon-button dark" onClick={() => { logout(); router.replace("/login"); }} aria-label="Log out" title="Log out"><Icon name="logout" size={17}/></button>
        </div>
      </div>
    </aside>

    {mobileOpen && <button className="sidebar-overlay" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}

    <main className="main-area">
      <header className="topbar">
        <div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Icon name="menu"/></button><div><span className="topbar-kicker">ASMIEE OS</span><strong>{pageTitle}</strong></div></div>
        <div className="topbar-actions">
          {currentUser.role !== "client" && <label className="role-switch"><span>View as</span><select value={currentUser.id} onChange={(e) => { loginAs(e.target.value); const next = state.users.find((u) => u.id === e.target.value); if (next?.role === "client") router.push("/portal"); }} aria-label="Switch demo user">{state.users.filter((u) => u.status === "Active").map((u) => <option key={u.id} value={u.id}>{u.name} · {roleLabel(u.role)}</option>)}</select></label>}
          <div className="notification-wrap"><button className="icon-button notification-button" onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications"><Icon name="bell"/>{unread.length > 0 && <span className="notification-dot">{unread.length}</span>}</button>{notifOpen && <div className="notification-popover"><div className="popover-head"><strong>Notifications</strong><Link href="/notifications" onClick={() => setNotifOpen(false)}>View all</Link></div>{recent.length === 0 ? <p className="muted small">No notifications yet.</p> : recent.map((n) => <Link href={n.link || "/notifications"} key={n.id} className={`popover-notification ${!n.read ? "unread" : ""}`} onClick={() => { markNotificationRead(n.id); setNotifOpen(false); }}><span className="notif-symbol">{n.type === "approval" ? "✓" : n.type === "message" ? "#" : "•"}</span><span><strong>{n.title}</strong><small>{n.message}</small></span></Link>)}</div>}</div>
        </div>
      </header>
      <div className="content-shell">{children}</div>
    </main>
    <ToastStack />
  </div>;
}
