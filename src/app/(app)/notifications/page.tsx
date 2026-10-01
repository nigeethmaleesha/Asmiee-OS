"use client";

import Link from "next/link";
import { useApp } from "@/context/app-context";
import { PageHeader } from "@/components/ui";
import { Icon } from "@/components/icons";
import { dateTime } from "@/lib/utils";

export default function NotificationsPage(){
  const {state,currentUser,markNotificationRead,markAllNotificationsRead}=useApp();
  const items=currentUser?state.notifications.filter((n)=>n.userId===currentUser.id).sort((a,b)=>+new Date(b.createdAt)-+new Date(a.createdAt)):[];
  const unread=items.filter((n)=>!n.read).length;
  return <>
    <PageHeader eyebrow="Updates" title="Notifications" description={`${unread} unread notification${unread===1?"":"s"}.`} actions={unread?<button className="button button-secondary" onClick={markAllNotificationsRead}><Icon name="check" size={14}/> Mark all read</button>:undefined}/>
    <div className="notification-list">{items.map((n)=><Link href={n.link||"/dashboard"} key={n.id} onClick={()=>markNotificationRead(n.id)} className={`notification-row ${!n.read?"unread":""}`}><div className="notif-symbol">{n.type==="approval"?"✓":n.type==="message"?"#":n.type==="task"?"T":"•"}</div><div><h3>{n.title}</h3><p>{n.message}</p></div><time>{dateTime(n.createdAt)}</time></Link>)}</div>
  </>;
}
