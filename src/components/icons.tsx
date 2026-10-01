export type IconName = "dashboard" | "clients" | "projects" | "tasks" | "chat" | "approval" | "bell" | "team" | "portal" | "logout" | "menu" | "plus" | "arrow" | "check" | "search" | "dots" | "file" | "clock" | "calendar" | "money" | "spark" | "reset";

const paths: Record<IconName, React.ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  clients: <><circle cx="9" cy="8" r="4"/><path d="M2.5 21a6.5 6.5 0 0 1 13 0"/><path d="M16 3.5a4 4 0 0 1 0 7.5"/><path d="M18 14a6 6 0 0 1 3.5 5.5"/></>,
  projects: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 5V3h8v2M3 10h18"/></>,
  tasks: <><path d="m4 6 2 2 4-4M4 13l2 2 4-4M4 20l2 2 4-4M13 6h8M13 13h8M13 20h8"/></>,
  chat: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 9h8M8 13h5"/></>,
  approval: <><path d="M9 3h6l1 2h3a2 2 0 0 1 2 2v14H3V7a2 2 0 0 1 2-2h3z"/><path d="m8 13 3 3 5-6"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  team: <><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="3"/><path d="M2 21a6 6 0 0 1 12 0M13 21a5 5 0 0 1 9 0"/></>,
  portal: <><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12h8M13 7l5 5-5 5"/></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  plus: <path d="M12 5v14M5 12h14"/>,
  arrow: <path d="m9 18 6-6-6-6"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  dots: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  file: <><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>,
  money: <><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M7 9H5v6h2M17 9h2v6h-2"/></>,
  spark: <><path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></>,
  reset: <><path d="M4 4v6h6"/><path d="M5 10a8 8 0 1 1 2 8"/></>,
};

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
