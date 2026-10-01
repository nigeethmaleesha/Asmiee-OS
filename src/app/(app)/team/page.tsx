"use client";

import { useState } from "react";
import { useApp } from "@/context/app-context";
import { can } from "@/lib/permissions";
import { Avatar, Badge, Modal, PageHeader } from "@/components/ui";
import { Icon } from "@/components/icons";
import { roleLabel } from "@/lib/utils";
import type { Role } from "@/types";

const roles: Role[]=["super_admin","admin","project_manager","developer","designer","finance","client"];
const checks=[
  ["Manage clients","clients:write"],["Manage projects","projects:write"],["Manage tasks","tasks:write"],["Send messages","messages:write"],["Manage approvals","approvals:write"],["Manage users","users:write"],["View finance","finance:view"],["Client portal","portal:view"],
] as const;

export default function TeamPage(){
  const {state,currentUser,updateUser,addUser}=useApp(); const [open,setOpen]=useState(false);
  const create=(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();const fd=new FormData(e.currentTarget);addUser({name:String(fd.get("name")),email:String(fd.get("email")),role:String(fd.get("role")) as Role,department:String(fd.get("department")),status:"Active",clientId:String(fd.get("clientId")||"")||undefined});setOpen(false);e.currentTarget.reset();};
  return <>
    <PageHeader eyebrow="Access control" title="Team & roles" description="Manage users and preview the permission model before backend enforcement is connected." actions={<button className="button button-primary" onClick={()=>setOpen(true)}><Icon name="plus" size={15}/> Add user</button>}/>
    <section className="card table-wrap"><table className="table"><thead><tr><th>User</th><th>Department</th><th>Role</th><th>Status</th><th>Assigned work</th></tr></thead><tbody>{state.users.map((u)=>{const taskCount=state.tasks.filter((t)=>t.assigneeIds.includes(u.id)&&t.status!=="Completed").length;return <tr key={u.id}><td><div className="table-title"><Avatar label={u.avatar} size="sm"/><span><strong>{u.name}</strong><small>{u.email}</small></span></div></td><td>{u.department}</td><td><select className="select" style={{minWidth:150}} value={u.role} disabled={u.id===currentUser?.id&&u.role==="super_admin"} onChange={(e)=>updateUser(u.id,{role:e.target.value as Role})}>{roles.map((r)=><option value={r} key={r}>{roleLabel(r)}</option>)}</select></td><td><button className="button button-ghost button-small" onClick={()=>updateUser(u.id,{status:u.status==="Active"?"Inactive":"Active"})}><Badge tone={u.status==="Active"?"success":"neutral"}>{u.status}</Badge></button></td><td>{taskCount} open</td></tr>})}</tbody></table></section>

    <section className="card" style={{marginTop:16}}><div className="card-head"><div><h2>Permission matrix</h2><p>Frontend visibility mirrors the planned RBAC model. Backend authorization must enforce the same rules later.</p></div></div><div className="table-wrap"><table className="table"><thead><tr><th>Capability</th>{roles.map((r)=><th key={r}>{roleLabel(r)}</th>)}</tr></thead><tbody>{checks.map(([label,permission])=><tr key={permission}><td><strong>{label}</strong></td>{roles.map((r)=><td key={r}>{can(r,permission)?<Badge tone="success">Allowed</Badge>:<span className="muted">—</span>}</td>)}</tr>)}</tbody></table></div></section>

    <Modal open={open} onClose={()=>setOpen(false)} title="Add user"><form onSubmit={create}><div className="form-grid"><div className="form-field full"><label>Name</label><input className="input" name="name" required/></div><div className="form-field full"><label>Email</label><input className="input" name="email" type="email" required/></div><div className="form-field"><label>Department</label><input className="input" name="department" required/></div><div className="form-field"><label>Role</label><select className="select" name="role">{roles.map((r)=><option key={r} value={r}>{roleLabel(r)}</option>)}</select></div><div className="form-field full"><label>Client mapping (client role only)</label><select className="select" name="clientId"><option value="">None</option>{state.clients.map((c)=><option value={c.id} key={c.id}>{c.companyName}</option>)}</select></div></div><div className="form-actions"><button className="button button-secondary" type="button" onClick={()=>setOpen(false)}>Cancel</button><button className="button button-primary">Add user</button></div></form></Modal>
  </>;
}
