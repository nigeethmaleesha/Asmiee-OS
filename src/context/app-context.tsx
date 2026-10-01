"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { initialState } from "@/data/mock";
import { demoRepository } from "@/services/demo-repository";
import type { Approval, AppState, Client, Message, Project, ProjectFile, Role, Task, TaskStatus, User } from "@/types";
import { uid } from "@/lib/utils";

interface Toast { id: string; message: string; tone?: "success" | "info" | "warning"; }

interface AppContextValue {
  state: AppState;
  hydrated: boolean;
  currentUser: User | null;
  toasts: Toast[];
  login: (email: string) => boolean;
  loginAs: (userId: string) => void;
  logout: () => void;
  resetDemo: () => Promise<void>;
  addClient: (input: Omit<Client, "id" | "contacts"> & { contacts?: Client["contacts"] }) => string;
  updateClient: (clientId: string, patch: Partial<Client>) => void;
  addProject: (input: Omit<Project, "id" | "files">) => string;
  updateProject: (projectId: string, patch: Partial<Project>) => void;
  addTask: (input: Omit<Task, "id" | "comments" | "checklist" | "attachments"> & Partial<Pick<Task, "comments" | "checklist" | "attachments">>) => string;
  updateTask: (taskId: string, patch: Partial<Task>) => void;
  moveTask: (taskId: string, status: TaskStatus) => void;
  addTaskComment: (taskId: string, text: string) => void;
  addChecklistItem: (taskId: string, text: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  addTaskAttachment: (taskId: string, file: ProjectFile) => void;
  addProjectAttachment: (projectId: string, file: ProjectFile) => void;
  sendMessage: (channelId: string, content: string, parentId?: string) => void;
  toggleReaction: (messageId: string, emoji: string) => void;
  togglePinMessage: (messageId: string) => void;
  messageToTask: (message: Message) => string | null;
  createApproval: (input: Omit<Approval, "id" | "version" | "createdAt" | "versions" | "attachments"> & Partial<Pick<Approval, "attachments">>) => string;
  sendApproval: (approvalId: string) => void;
  markApprovalViewed: (approvalId: string) => void;
  respondApproval: (approvalId: string, action: "Approved" | "Changes Requested", comments: string) => void;
  askApprovalQuestion: (approvalId: string, question: string) => void;
  resubmitApproval: (approvalId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  updateUser: (userId: string, patch: Partial<Pick<User, "role" | "status" | "department">>) => void;
  addUser: (input: Omit<User, "id" | "avatar">) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = uid("toast");
    setToasts((items) => [...items, { id, message, tone }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 2800);
  }, []);

  useEffect(() => {
    let active = true;
    demoRepository.load().then((data) => {
      if (!active) return;
      setState(data);
      setCurrentUserId(demoRepository.getSessionUser());
      setHydrated(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (hydrated) demoRepository.save(state);
  }, [state, hydrated]);

  const currentUser = useMemo(() => state.users.find((u) => u.id === currentUserId) ?? null, [state.users, currentUserId]);

  const login = (email: string) => {
    const user = state.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.status === "Active");
    if (!user) return false;
    setCurrentUserId(user.id);
    demoRepository.setSessionUser(user.id);
    toast(`Welcome back, ${user.name.split(" ")[0]}.`);
    return true;
  };

  const loginAs = (userId: string) => {
    const user = state.users.find((u) => u.id === userId);
    if (!user) return;
    setCurrentUserId(userId);
    demoRepository.setSessionUser(userId);
    toast(`Demo role switched to ${user.name}.`, "info");
  };

  const logout = () => {
    setCurrentUserId(null);
    demoRepository.setSessionUser(null);
  };

  const resetDemo = async () => {
    await demoRepository.reset();
    setState(initialState);
    toast("Demo data reset.", "info");
  };

  const addNotification = (draft: Omit<AppState["notifications"][number], "id" | "createdAt" | "read">) => {
    setState((s) => ({ ...s, notifications: [{ ...draft, id: uid("n"), createdAt: new Date().toISOString(), read: false }, ...s.notifications] }));
  };

  const addClient: AppContextValue["addClient"] = (input) => {
    const id = uid("c");
    setState((s) => ({ ...s, clients: [{ ...input, id, contacts: input.contacts ?? [] }, ...s.clients] }));
    toast("Client created.");
    return id;
  };

  const updateClient = (clientId: string, patch: Partial<Client>) => {
    setState((s) => ({ ...s, clients: s.clients.map((c) => c.id === clientId ? { ...c, ...patch } : c) }));
    toast("Client updated.");
  };

  const addProject: AppContextValue["addProject"] = (input) => {
    const id = uid("p");
    setState((s) => ({ ...s, projects: [{ ...input, id, files: [] }, ...s.projects] }));
    toast("Project created.");
    return id;
  };

  const updateProject = (projectId: string, patch: Partial<Project>) => {
    setState((s) => ({ ...s, projects: s.projects.map((p) => p.id === projectId ? { ...p, ...patch } : p) }));
    toast("Project updated.");
  };

  const addTask: AppContextValue["addTask"] = (input) => {
    const id = uid("t");
    const task: Task = { ...input, id, comments: input.comments ?? [], checklist: input.checklist ?? [], attachments: input.attachments ?? [] };
    setState((s) => ({ ...s, tasks: [task, ...s.tasks] }));
    if (currentUser) {
      input.assigneeIds.filter((id) => id !== currentUser.id).forEach((userId) => addNotification({ userId, title: "New task assigned", message: task.title, type: "task", link: "/tasks" }));
    }
    toast("Task created.");
    return id;
  };

  const updateTask = (taskId: string, patch: Partial<Task>) => {
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => t.id === taskId ? { ...t, ...patch } : t) }));
    toast("Task updated.");
  };

  const moveTask = (taskId: string, status: TaskStatus) => {
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => t.id === taskId ? { ...t, status } : t) }));
  };

  const addTaskComment = (taskId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => t.id === taskId ? { ...t, comments: [...t.comments, { id: uid("cm"), userId: currentUser.id, text: text.trim(), createdAt: new Date().toISOString() }] } : t) }));
  };

  const addChecklistItem = (taskId: string, text: string) => {
    if (!text.trim()) return;
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => t.id === taskId ? { ...t, checklist: [...t.checklist, { id: uid("cl"), text: text.trim(), done: false }] } : t) }));
  };

  const toggleChecklistItem = (taskId: string, itemId: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => t.id === taskId ? { ...t, checklist: t.checklist.map((item) => item.id === itemId ? { ...item, done: !item.done } : item) } : t) }));
  };

  const addTaskAttachment = (taskId: string, file: ProjectFile) => {
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => t.id === taskId ? { ...t, attachments: [...t.attachments, file] } : t) }));
    toast("Attachment added.");
  };

  const addProjectAttachment = (projectId: string, file: ProjectFile) => {
    setState((s) => ({ ...s, projects: s.projects.map((p) => p.id === projectId ? { ...p, files: [...p.files, file] } : p) }));
    toast("Project file added.");
  };

  const sendMessage = (channelId: string, content: string, parentId?: string) => {
    if (!currentUser || !content.trim()) return;
    const mentionIds = state.users.filter((u) => content.toLowerCase().includes(`@${u.name.split(" ")[0].toLowerCase()}`)).map((u) => u.id);
    const message: Message = { id: uid("m"), channelId, userId: currentUser.id, content: content.trim(), createdAt: new Date().toISOString(), parentId, mentions: mentionIds, reactions: [] };
    setState((s) => ({ ...s, messages: [...s.messages, message] }));
    mentionIds.filter((id) => id !== currentUser.id).forEach((userId) => addNotification({ userId, title: "You were mentioned", message: content.trim().slice(0, 90), type: "message", link: "/workspace" }));
  };

  const toggleReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return;
    setState((s) => ({ ...s, messages: s.messages.map((m) => {
      if (m.id !== messageId) return m;
      const found = m.reactions.find((r) => r.emoji === emoji);
      if (!found) return { ...m, reactions: [...m.reactions, { emoji, userIds: [currentUser.id] }] };
      const has = found.userIds.includes(currentUser.id);
      const reactions = m.reactions.map((r) => r.emoji === emoji ? { ...r, userIds: has ? r.userIds.filter((id) => id !== currentUser.id) : [...r.userIds, currentUser.id] } : r).filter((r) => r.userIds.length > 0);
      return { ...m, reactions };
    }) }));
  };

  const togglePinMessage = (messageId: string) => {
    setState((s) => ({ ...s, messages: s.messages.map((m) => m.id === messageId ? { ...m, pinned: !m.pinned } : m) }));
  };

  const messageToTask = (message: Message) => {
    const channel = state.channels.find((c) => c.id === message.channelId);
    if (!channel?.projectId || !channel.clientId) {
      toast("Create Task is available in project channels.", "warning");
      return null;
    }
    const id = addTask({ title: message.content.length > 64 ? `${message.content.slice(0, 61)}...` : message.content, description: `Created from #${channel.name} message.`, projectId: channel.projectId, clientId: channel.clientId, assigneeIds: currentUser ? [currentUser.id] : [], priority: "Medium", status: "Not Started", startDate: new Date().toISOString().slice(0, 10), dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), estimatedHours: 1, actualHours: 0, tags: ["from-message"] });
    toast("Message converted to task.");
    return id;
  };

  const createApproval: AppContextValue["createApproval"] = (input) => {
    const id = uid("a");
    const createdAt = new Date().toISOString();
    const approval: Approval = { ...input, id, version: 1, createdAt, attachments: input.attachments ?? [], versions: [{ version: 1, createdAt, status: input.status }] };
    setState((s) => ({ ...s, approvals: [approval, ...s.approvals] }));
    toast("Approval draft created.");
    return id;
  };

  const sendApproval = (approvalId: string) => {
    const approval = state.approvals.find((a) => a.id === approvalId);
    if (!approval) return;
    setState((s) => ({ ...s, approvals: s.approvals.map((a) => a.id === approvalId ? { ...a, status: "Awaiting Response", versions: a.versions.map((v) => v.version === a.version ? { ...v, status: "Awaiting Response" } : v) } : a) }));
    state.users.filter((u) => u.role === "client" && u.clientId === approval.clientId).forEach((u) => addNotification({ userId: u.id, title: "Approval requested", message: approval.title, type: "approval", link: "/portal" }));
    toast("Approval sent. Demo email notification created.");
  };


  const markApprovalViewed = (approvalId: string) => {
    setState((s) => ({ ...s, approvals: s.approvals.map((a) => a.id === approvalId ? { ...a, viewedAt: a.viewedAt ?? new Date().toISOString(), status: a.status === "Awaiting Response" ? "Viewed" : a.status, versions: a.versions.map((v) => v.version === a.version && v.status === "Awaiting Response" ? { ...v, status: "Viewed" } : v) } : a) }));
  };

  const respondApproval = (approvalId: string, action: "Approved" | "Changes Requested", comments: string) => {
    const approval = state.approvals.find((a) => a.id === approvalId);
    if (!approval || !currentUser) return;
    setState((s) => ({
      ...s,
      approvals: s.approvals.map((a) => a.id === approvalId ? { ...a, status: action, viewedAt: a.viewedAt ?? new Date().toISOString(), versions: a.versions.map((v) => v.version === a.version ? { ...v, status: action, response: action, comments } : v) } : a),
      tasks: approval.taskId ? s.tasks.map((t) => t.id === approval.taskId ? { ...t, status: action === "Approved" ? "Approved" : "Changes Requested" } : t) : s.tasks,
    }));
    addNotification({ userId: approval.assignedEmployeeId, title: `Client ${action.toLowerCase()}`, message: approval.title, type: "approval", link: "/approvals" });
    toast(action === "Approved" ? "Approval confirmed." : "Changes requested.");
  };


  const askApprovalQuestion = (approvalId: string, question: string) => {
    const approval = state.approvals.find((a) => a.id === approvalId);
    if (!approval || !currentUser || !question.trim()) return;
    const clientChannel = state.channels.find((c) => c.type === "client" && c.clientId === approval.clientId);
    if (clientChannel) {
      const message: Message = { id: uid("m"), channelId: clientChannel.id, userId: currentUser.id, content: `Approval question — ${approval.title}: ${question.trim()}`, createdAt: new Date().toISOString(), mentions: [approval.assignedEmployeeId], reactions: [] };
      setState((s) => ({ ...s, messages: [...s.messages, message] }));
    }
    addNotification({ userId: approval.assignedEmployeeId, title: "Client asked a question", message: `${approval.title}: ${question.trim().slice(0, 90)}`, type: "approval", link: "/approvals" });
    toast("Question sent to the assigned employee.", "info");
  };

  const resubmitApproval = (approvalId: string) => {
    setState((s) => ({ ...s, approvals: s.approvals.map((a) => {
      if (a.id !== approvalId) return a;
      const version = a.version + 1;
      return { ...a, version, status: "Resubmitted", createdAt: new Date().toISOString(), versions: [...a.versions, { version, createdAt: new Date().toISOString(), status: "Resubmitted" }] };
    }) }));
    toast("New approval version created.");
  };

  const markNotificationRead = (notificationId: string) => setState((s) => ({ ...s, notifications: s.notifications.map((n) => n.id === notificationId ? { ...n, read: true } : n) }));
  const markAllNotificationsRead = () => setState((s) => ({ ...s, notifications: s.notifications.map((n) => currentUser && n.userId === currentUser.id ? { ...n, read: true } : n) }));

  const updateUser = (userId: string, patch: Partial<Pick<User, "role" | "status" | "department">>) => {
    setState((s) => ({ ...s, users: s.users.map((u) => u.id === userId ? { ...u, ...patch } : u) }));
    toast("User permissions updated.");
  };

  const addUser: AppContextValue["addUser"] = (input) => {
    const id = uid("u");
    const avatar = input.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
    setState((s) => ({ ...s, users: [...s.users, { ...input, id, avatar }] }));
    toast("User added.");
    return id;
  };

  const value: AppContextValue = {
    state, hydrated, currentUser, toasts, login, loginAs, logout, resetDemo,
    addClient, updateClient, addProject, updateProject, addTask, updateTask, moveTask,
    addTaskComment, addChecklistItem, toggleChecklistItem, addTaskAttachment, addProjectAttachment,
    sendMessage, toggleReaction, togglePinMessage, messageToTask,
    createApproval, sendApproval, markApprovalViewed, respondApproval, askApprovalQuestion, resubmitApproval,
    markNotificationRead, markAllNotificationsRead, updateUser, addUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used within AppProvider");
  return value;
}
