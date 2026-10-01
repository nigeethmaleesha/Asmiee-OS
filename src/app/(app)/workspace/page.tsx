"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/context/app-context";
import { can } from "@/lib/permissions";
import { Avatar, Badge, PageHeader } from "@/components/ui";
import { Icon } from "@/components/icons";
import { dateTime } from "@/lib/utils";

export default function WorkspacePage(){
  const {state,currentUser,sendMessage,toggleReaction,togglePinMessage,messageToTask}=useApp();
  const available=useMemo(()=>state.channels.filter((c)=>!currentUser||c.memberIds.includes(currentUser.id)||["super_admin","admin"].includes(currentUser.role)),[state.channels,currentUser]);
  const [channelId,setChannelId]=useState(available[0]?.id||""); const [text,setText]=useState(""); const [replyTo,setReplyTo]=useState<string|null>(null); const [search,setSearch]=useState(""); const endRef=useRef<HTMLDivElement|null>(null);
  useEffect(()=>{if(!available.find((c)=>c.id===channelId)&&available[0])setChannelId(available[0].id)},[available,channelId]);
  const channel=state.channels.find((c)=>c.id===channelId);
  const canWrite=currentUser?can(currentUser.role,"messages:write"):false;
  const roots=useMemo(()=>state.messages.filter((m)=>m.channelId===channelId&&!m.parentId&&(!search||m.content.toLowerCase().includes(search.toLowerCase()))).sort((a,b)=>+new Date(a.createdAt)-+new Date(b.createdAt)),[state.messages,channelId,search]);
  const submit=()=>{if(!text.trim())return;sendMessage(channelId,text,replyTo||undefined);setText("");setReplyTo(null);setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),40);};
  const groups=[{label:"General",types:["general"]},{label:"Teams",types:["team"]},{label:"Projects",types:["project"]},{label:"Clients",types:["client"]}];

  return <>
    <PageHeader eyebrow="Communication" title="Workspace" description="Project context stays beside the conversation that created it."/>
    <section className="card workspace">
      <aside className="channels-panel">{groups.map((g)=>{const chans=available.filter((c)=>g.types.includes(c.type));if(!chans.length)return null;return <div className="channel-group" key={g.label}><h4>{g.label}</h4>{chans.map((c)=><button className={`channel-button ${channelId===c.id?"active":""}`} onClick={()=>{setChannelId(c.id);setReplyTo(null);}} key={c.id}><span>#</span>{c.name}</button>)}</div>})}</aside>
      <div className="chat-panel">
        <div className="chat-head"><div><strong># {channel?.name}</strong><span>{channel?.type} channel · {channel?.memberIds.length||0} members</span></div><label className="search-box" style={{minWidth:190,height:34}}><Icon name="search" size={13}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search channel"/></label></div>
        <div className="messages">{roots.map((m)=>{
          const user=state.users.find((u)=>u.id===m.userId); const replies=state.messages.filter((r)=>r.parentId===m.id).sort((a,b)=>+new Date(a.createdAt)-+new Date(b.createdAt));
          const renderMessage=(msg:typeof m,isReply=false)=>{const u=state.users.find((x)=>x.id===msg.userId);return <div className={`message ${isReply?"thread-reply":""}`} key={msg.id}><Avatar label={u?.avatar||"?"} size="sm"/><div className="message-main"><div className="message-meta"><strong>{u?.name||"Unknown"}</strong><time>{dateTime(msg.createdAt)}</time>{msg.pinned&&<span className="pinned-note">Pinned</span>}</div><p className="message-text">{msg.content}</p>{msg.reactions.length>0&&<div className="reactions">{msg.reactions.map((r)=><button className="reaction" key={r.emoji} onClick={()=>toggleReaction(msg.id,r.emoji)}>{r.emoji} {r.userIds.length}</button>)}</div>}<div className="message-actions"><button onClick={()=>toggleReaction(msg.id,"👍")}>👍 React</button>{!isReply&&<button onClick={()=>setReplyTo(msg.id)}>Reply</button>}<button onClick={()=>togglePinMessage(msg.id)}>{msg.pinned?"Unpin":"Pin"}</button>{!isReply&&channel?.type==="project"&&canWrite&&<button onClick={()=>messageToTask(msg)}>Create task</button>}</div></div></div>};
          return <div key={m.id}>{renderMessage(m)}{replies.map((r)=>renderMessage(r,true))}</div>;
        })}<div ref={endRef}/></div>
        <div className="composer">{replyTo&&<div className="thread-banner"><span>Replying in thread</span><button onClick={()=>setReplyTo(null)}>×</button></div>}<div className="composer-row"><textarea value={text} disabled={!canWrite} placeholder={canWrite?`Message #${channel?.name||"channel"}. Use @FirstName to mention someone.`:"Messaging is read-only for this role."} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit();}}}/><button className="button button-primary" onClick={submit} disabled={!canWrite||!text.trim()}>Send</button></div></div>
      </div>
    </section>
    <div className="muted small" style={{marginTop:8}}>Tip: in project channels, use <Badge tone="purple">Create task</Badge> on a message to convert conversation into tracked work.</div>
  </>;
}
