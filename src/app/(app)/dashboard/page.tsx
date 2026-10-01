"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/context/app-context";
import { Badge, PageHeader, ProgressBar, Avatar } from "@/components/ui";
import { Icon } from "@/components/icons";
import { dateTime, shortDate } from "@/lib/utils";

export default function DashboardPage() {
  const { state, currentUser } = useApp();
  const scopedProjects = useMemo(() => {
    if (!currentUser) return [];
    if (["developer", "designer"].includes(currentUser.role)) return state.projects.filter((p) => p.memberIds.includes(currentUser.id));
    return state.projects;
  }, [state.projects, currentUser]);
  const scopedTasks = useMemo(() => {
    if (!currentUser) return [];
    if (["developer", "designer"].includes(currentUser.role)) return state.tasks.filter((t) => t.assigneeIds.includes(currentUser.id));
    return state.tasks;
  }, [state.tasks, currentUser]);
  const activeProjects = scopedProjects.filter((p) => !["Completed", "Cancelled"].includes(p.status));
  const openTasks = scopedTasks.filter((t) => t.status !== "Completed");
  const waiting = scopedTasks.filter((t) => t.status === "Waiting for Client");
  const pendingApprovals = state.approvals.filter((a) => ["Awaiting Response", "Viewed", "Changes Requested", "Resubmitted"].includes(a.status));

  const teamWorkload = state.users.filter((u) => ["project_manager", "developer", "designer"].includes(u.role)).map((u) => ({ user: u, count: state.tasks.filter((t) => t.assigneeIds.includes(u.id) && t.status !== "Completed").length })).sort((a,b) => b.count-a.count);

  const activity = [
    ...state.messages.slice(-4).map((m) => ({ id: `m-${m.id}`, type: "#", title: state.users.find((u) => u.id === m.userId)?.name ?? "Team", text: m.content, date: m.createdAt })),
    ...state.approvals.slice(-3).map((a) => ({ id: `a-${a.id}`, type: "✓", title: a.title, text: `Approval is ${a.status.toLowerCase()}.`, date: a.createdAt })),
  ].sort((a,b) => +new Date(b.date) - +new Date(a.date)).slice(0,6);

  return <>
    <PageHeader eyebrow="Today at Asmiee" title={`Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}${currentUser ? `, ${currentUser.name.split(" ")[0]}` : ""}.`} description="A focused view of work that needs attention." actions={<Link href="/tasks" className="button button-secondary"><Icon name="tasks" size={15}/> Open task board</Link>} />

    <section className="grid grid-4" aria-label="Overview metrics">
      <Link href="/projects" className="card stat-card"><div className="stat-icon"><Icon name="projects" size={16}/></div><span className="stat-label">Active projects</span><span className="stat-value">{activeProjects.length}</span><div className="stat-foot">Across current client work</div></Link>
      <Link href="/tasks" className="card stat-card"><div className="stat-icon"><Icon name="tasks" size={16}/></div><span className="stat-label">Open tasks</span><span className="stat-value">{openTasks.length}</span><div className="stat-foot">{openTasks.filter((t) => t.priority === "Urgent").length} urgent</div></Link>
      <Link href="/tasks" className="card stat-card"><div className="stat-icon"><Icon name="clock" size={16}/></div><span className="stat-label">Waiting for client</span><span className="stat-value">{waiting.length}</span><div className="stat-foot">External blockers visible</div></Link>
      <Link href="/approvals" className="card stat-card"><div className="stat-icon"><Icon name="approval" size={16}/></div><span className="stat-label">Pending approvals</span><span className="stat-value">{pendingApprovals.length}</span><div className="stat-foot">Needs response or resubmission</div></Link>
    </section>

    <section className="dashboard-main">
      <div className="card">
        <div className="card-head"><div><h2>Project pulse</h2><p>Progress and next deadlines</p></div><Link href="/projects" className="button button-ghost button-small">View all</Link></div>
        <div className="card-body grid" style={{gap:12}}>{activeProjects.slice(0,5).map((project) => {
          const client = state.clients.find((c) => c.id === project.clientId);
          return <Link href={`/projects/${project.id}`} key={project.id} className="project-card" style={{border:"1px solid var(--line)", borderRadius:12}}>
            <div className="project-card-top"><div><h3>{project.name}</h3><p>{client?.companyName} · {project.service}</p></div><Badge tone={project.status === "Waiting for Client" ? "warning" : "info"}>{project.status}</Badge></div>
            <div><div className="project-progress-line"><span>Progress</span><strong>{project.progress}%</strong></div><ProgressBar value={project.progress}/></div>
            <div className="project-foot"><div className="avatar-stack">{project.memberIds.slice(0,4).map((id) => { const u = state.users.find((x) => x.id === id); return u ? <Avatar key={id} label={u.avatar} size="sm"/> : null; })}</div><span className="muted small">Due {shortDate(project.dueDate)}</span></div>
          </Link>;
        })}</div>
      </div>

      <div className="grid" style={{alignContent:"start"}}>
        <div className="card">
          <div className="card-head"><div><h3>Team workload</h3><p>Open assigned tasks</p></div></div>
          <div className="card-body">{teamWorkload.map(({user,count}) => <div className="workload-row" key={user.id}><strong>{user.name.split(" ")[0]}</strong><div className="workload-track"><span style={{width:`${Math.min(100, count*20)}%`}}/></div><em>{count}</em></div>)}</div>
        </div>
        <div className="card">
          <div className="card-head"><div><h3>Recent activity</h3><p>Latest team and client signals</p></div></div>
          <div className="card-body">{activity.map((item) => <div className="activity-row" key={item.id}><div className="activity-dot">{item.type}</div><div><strong>{item.title}</strong><p>{item.text}</p></div><time>{dateTime(item.date)}</time></div>)}</div>
        </div>
      </div>
    </section>
  </>;
}
