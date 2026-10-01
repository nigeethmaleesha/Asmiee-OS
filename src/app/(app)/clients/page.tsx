"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useApp } from "@/context/app-context";
import { can } from "@/lib/permissions";
import { Badge, Modal, PageHeader, Avatar } from "@/components/ui";
import { Icon } from "@/components/icons";

export default function ClientsPage() {
  const { state, currentUser, addClient } = useApp();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [open, setOpen] = useState(false);
  const canWrite = currentUser ? can(currentUser.role, "clients:write") : false;
  const clients = useMemo(() => {
    const allowedClientIds = currentUser && ["developer", "designer"].includes(currentUser.role)
      ? new Set(state.projects.filter((p) => p.memberIds.includes(currentUser.id)).map((p) => p.clientId))
      : null;
    return state.clients.filter((client) => {
      if (allowedClientIds && !allowedClientIds.has(client.id)) return false;
      const q = query.toLowerCase();
      const matches = client.companyName.toLowerCase().includes(q) || client.email.toLowerCase().includes(q) || client.industry.toLowerCase().includes(q);
      return matches && (status === "All" || client.status === status);
    });
  }, [state.clients, state.projects, currentUser, query, status]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const fd = new FormData(e.currentTarget);
    addClient({ companyName: String(fd.get("companyName")), industry: String(fd.get("industry")), email: String(fd.get("email")), phone: String(fd.get("phone")), website: String(fd.get("website")), address: String(fd.get("address")), status: "Active", notes: String(fd.get("notes")), services: String(fd.get("services")).split(",").map((s) => s.trim()).filter(Boolean) });
    setOpen(false); e.currentTarget.reset();
  };

  return <>
    <PageHeader eyebrow="CRM" title="Clients" description="One profile for every relationship, service and project." actions={canWrite ? <button className="button button-primary" onClick={() => setOpen(true)}><Icon name="plus" size={15}/> New client</button> : undefined}/>
    <div className="toolbar"><div className="toolbar-left"><label className="search-box"><Icon name="search" size={15}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search clients…" aria-label="Search clients"/></label><select className="select" style={{width:150}} value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option><option>Active</option><option>Lead</option><option>Paused</option><option>Archived</option></select></div><div className="muted small">{clients.length} client{clients.length === 1 ? "" : "s"}</div></div>
    <div className="card table-wrap"><table className="table"><thead><tr><th>Client</th><th>Status</th><th>Services</th><th>Projects</th><th>Primary contact</th><th></th></tr></thead><tbody>{clients.map((client) => {
      const projects = state.projects.filter((p) => p.clientId === client.id);
      const primary = client.contacts.find((c) => c.type === "Primary") ?? client.contacts[0];
      return <tr key={client.id}><td><Link href={`/clients/${client.id}`} className="table-title"><Avatar label={client.companyName.slice(0,2).toUpperCase()} size="sm"/><span><strong>{client.companyName}</strong><small>{client.industry}</small></span></Link></td><td><Badge tone={client.status === "Active" ? "success" : client.status === "Lead" ? "purple" : "neutral"}>{client.status}</Badge></td><td><div className="service-chips">{client.services.slice(0,2).map((s) => <span className="service-chip" key={s}>{s}</span>)}{client.services.length > 2 && <span className="service-chip">+{client.services.length-2}</span>}</div></td><td>{projects.length}</td><td>{primary ? <><strong style={{display:"block",fontSize:10}}>{primary.name}</strong><span className="muted" style={{fontSize:9}}>{primary.email}</span></> : <span className="muted">—</span>}</td><td><Link className="icon-button" href={`/clients/${client.id}`} aria-label={`Open ${client.companyName}`}><Icon name="arrow" size={15}/></Link></td></tr>;
    })}</tbody></table></div>

    <Modal open={open} onClose={() => setOpen(false)} title="Create client" wide><form onSubmit={submit}><div className="form-grid"><div className="form-field"><label>Company name</label><input className="input" name="companyName" required/></div><div className="form-field"><label>Industry</label><input className="input" name="industry" required/></div><div className="form-field"><label>Email</label><input className="input" name="email" type="email" required/></div><div className="form-field"><label>Phone</label><input className="input" name="phone"/></div><div className="form-field"><label>Website</label><input className="input" name="website" placeholder="example.com"/></div><div className="form-field"><label>Address</label><input className="input" name="address"/></div><div className="form-field full"><label>Services</label><input className="input" name="services" placeholder="Website Development, SEO"/><span className="form-help">Separate service names with commas.</span></div><div className="form-field full"><label>Notes</label><textarea className="textarea" name="notes"/></div></div><div className="form-actions"><button type="button" className="button button-secondary" onClick={() => setOpen(false)}>Cancel</button><button className="button button-primary" type="submit">Create client</button></div></form></Modal>
  </>;
}
