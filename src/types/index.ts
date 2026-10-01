export type Role = "super_admin" | "admin" | "project_manager" | "developer" | "designer" | "finance" | "client";
export type ProjectStatus = "Planning" | "Not Started" | "In Progress" | "Internal Review" | "Waiting for Client" | "Changes Requested" | "Approved" | "Completed" | "On Hold" | "Cancelled";
export type TaskStatus = "Not Started" | "In Progress" | "Internal Review" | "Waiting for Client" | "Changes Requested" | "Approved" | "Completed";
export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type ApprovalStatus = "Draft" | "Sent" | "Viewed" | "Awaiting Response" | "Changes Requested" | "Resubmitted" | "Approved" | "Rejected" | "Cancelled" | "Expired";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: "Active" | "Inactive";
  avatar: string;
  clientId?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  type: "Primary" | "Finance" | "Technical" | "Other";
}

export interface Client {
  id: string;
  companyName: string;
  industry: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  status: "Active" | "Lead" | "Paused" | "Archived";
  notes: string;
  contacts: Contact[];
  services: string[];
}

export interface ProjectFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  service: string;
  description: string;
  managerId: string;
  memberIds: string[];
  startDate: string;
  dueDate: string;
  status: ProjectStatus;
  priority: Priority;
  budget: number;
  value: number;
  progress: number;
  files: ProjectFile[];
}

export interface TaskComment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  clientId: string;
  assigneeIds: string[];
  priority: Priority;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  comments: TaskComment[];
  checklist: ChecklistItem[];
  attachments: ProjectFile[];
}

export interface Channel {
  id: string;
  name: string;
  type: "general" | "team" | "project" | "client";
  memberIds: string[];
  projectId?: string;
  clientId?: string;
}

export interface Reaction {
  emoji: string;
  userIds: string[];
}

export interface Message {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  createdAt: string;
  parentId?: string;
  edited?: boolean;
  pinned?: boolean;
  mentions: string[];
  reactions: Reaction[];
}

export interface ApprovalVersion {
  version: number;
  createdAt: string;
  status: ApprovalStatus;
  response?: string;
  comments?: string;
}

export interface Approval {
  id: string;
  clientId: string;
  projectId: string;
  taskId?: string;
  title: string;
  description: string;
  status: ApprovalStatus;
  version: number;
  dueDate: string;
  assignedEmployeeId: string;
  createdAt: string;
  viewedAt?: string;
  attachments: ProjectFile[];
  versions: ApprovalVersion[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "task" | "approval" | "message" | "system";
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AppState {
  users: User[];
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  channels: Channel[];
  messages: Message[];
  approvals: Approval[];
  notifications: Notification[];
}
