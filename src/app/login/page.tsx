"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { roleLabel } from "@/lib/utils";
import { Icon } from "@/components/icons";

export default function LoginPage() {
  const { state, currentUser, hydrated, login, loginAs } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("admin@asmiee.demo");
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated && currentUser) router.replace(currentUser.role === "client" ? "/portal" : "/dashboard");
  }, [hydrated, currentUser, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!login(email)) { setError("Demo account not found. Use one of the accounts below."); return; }
    const user = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    router.push(user?.role === "client" ? "/portal" : "/dashboard");
  };

  const quickLogin = (userId: string) => {
    const user = state.users.find((u) => u.id === userId);
    if (!user) return;
    loginAs(user.id);
    router.push(user.role === "client" ? "/portal" : "/dashboard");
  };

  return <main className="login-page">
    <section className="login-visual">
      <div className="login-brand"><div className="brand-mark">A</div><div><strong>ASMIEE</strong><span>OPERATING SYSTEM</span></div></div>
      <div className="login-copy">
        <div className="eyebrow">One connected workspace</div>
        <h1>Run work.<br/>Keep context.</h1>
        <p>Clients, projects, tasks, conversations and approvals — connected in one focused operating system.</p>
        <div className="login-chips"><span className="login-chip">Clients</span><span className="login-chip">Projects</span><span className="login-chip">Kanban</span><span className="login-chip">Workspace</span><span className="login-chip">Approvals</span></div>
      </div>
      <div className="login-foot">Phase 1 interactive frontend · Demo data persists in this browser</div>
    </section>
    <section className="login-side">
      <div className="login-card">
        <div className="eyebrow">Secure workspace</div>
        <h2>Welcome back</h2>
        <p>Use a demo account to preview the role-based experience.</p>
        <form onSubmit={submit}>
          <div className="form-field"><label htmlFor="email">Email</label><input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></div>
          <button className="button button-primary" style={{width:"100%", marginTop:12}} type="submit"><Icon name="arrow" size={15}/> Continue</button>
          {error && <div className="login-error">{error}</div>}
        </form>
        <div className="demo-accounts">
          <h3>Quick demo access</h3>
          <div className="demo-account-grid">{state.users.filter((u) => u.status === "Active").map((u) => <button className="demo-account" key={u.id} onClick={() => quickLogin(u.id)}><strong>{roleLabel(u.role)}</strong><span>{u.email}</span></button>)}</div>
        </div>
      </div>
    </section>
  </main>;
}
