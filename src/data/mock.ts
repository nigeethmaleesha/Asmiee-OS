import type { AppState } from "@/types";

const now = new Date("2026-10-01T09:00:00.000Z").toISOString();

export const initialState: AppState = {
  users: [
    { id: "u1", name: "Buddhila Perera", email: "admin@asmiee.demo", role: "super_admin", department: "Management", status: "Active", avatar: "BP" },
    { id: "u2", name: "Maya Silva", email: "pm@asmiee.demo", role: "project_manager", department: "Management", status: "Active", avatar: "MS" },
    { id: "u3", name: "Dishan Fernando", email: "developer@asmiee.demo", role: "developer", department: "Development", status: "Active", avatar: "DF" },
    { id: "u4", name: "Nadee Jay", email: "designer@asmiee.demo", role: "designer", department: "Design", status: "Active", avatar: "NJ" },
    { id: "u5", name: "Anu Sen", email: "finance@asmiee.demo", role: "finance", department: "Finance", status: "Active", avatar: "AS" },
    { id: "u6", name: "Aura Living", email: "client@asmiee.demo", role: "client", department: "Client", status: "Active", avatar: "AL", clientId: "c1" },
  ],
  clients: [
    {
      id: "c1", companyName: "Aura Living", industry: "Home & Living", email: "hello@auraliving.demo", phone: "+94 77 123 4567", website: "auralivingonline.com", address: "Colombo, Sri Lanka", status: "Active", notes: "Premium home-living brand.",
      contacts: [
        { id: "ct1", name: "Amaya Perera", email: "amaya@auraliving.demo", phone: "+94 77 100 2000", position: "Founder", type: "Primary" },
        { id: "ct2", name: "Kavindu Sen", email: "finance@auraliving.demo", phone: "+94 77 100 2001", position: "Finance", type: "Finance" },
      ],
      services: ["Website Development", "SEO", "Hosting", "Maintenance"],
    },
    {
      id: "c2", companyName: "AdventureLK", industry: "Travel", email: "team@adventurelk.demo", phone: "+94 76 555 9000", website: "adventurelk.demo", address: "Kandy, Sri Lanka", status: "Active", notes: "Adventure travel platform.",
      contacts: [{ id: "ct3", name: "Ravin K", email: "ravin@adventurelk.demo", phone: "+94 76 555 9001", position: "Director", type: "Primary" }],
      services: ["Web Application", "Support"],
    },
    {
      id: "c3", companyName: "Northstar Studio", industry: "Creative", email: "hello@northstar.demo", phone: "+94 71 222 3400", website: "northstar.demo", address: "Galle, Sri Lanka", status: "Lead", notes: "New brand and website enquiry.",
      contacts: [{ id: "ct4", name: "Sam Wick", email: "sam@northstar.demo", phone: "+94 71 222 3401", position: "Creative Director", type: "Primary" }],
      services: ["Branding"],
    },
  ],
  projects: [
    { id: "p1", name: "Aura Living Website", clientId: "c1", service: "Website Development", description: "New ecommerce website and client portal integration.", managerId: "u2", memberIds: ["u2", "u3", "u4"], startDate: "2026-09-01", dueDate: "2026-10-20", status: "In Progress", priority: "High", budget: 180000, value: 260000, progress: 72, files: [] },
    { id: "p2", name: "AdventureLK POS", clientId: "c2", service: "Web Application", description: "POS improvements and mobile checkout fixes.", managerId: "u2", memberIds: ["u2", "u3"], startDate: "2026-09-15", dueDate: "2026-10-15", status: "Waiting for Client", priority: "Urgent", budget: 120000, value: 185000, progress: 58, files: [] },
    { id: "p3", name: "Aura SEO Retainer", clientId: "c1", service: "SEO", description: "Monthly SEO optimisation and reporting.", managerId: "u2", memberIds: ["u2", "u3"], startDate: "2026-09-01", dueDate: "2026-12-31", status: "In Progress", priority: "Medium", budget: 35000, value: 60000, progress: 41, files: [] },
  ],
  tasks: [
    { id: "t1", title: "Finish homepage responsive pass", description: "Complete tablet and mobile refinements and verify interaction states.", projectId: "p1", clientId: "c1", assigneeIds: ["u3", "u4"], priority: "High", status: "In Progress", startDate: "2026-09-28", dueDate: "2026-10-03", estimatedHours: 8, actualHours: 5.5, tags: ["frontend", "responsive"], comments: [{ id: "cm1", userId: "u2", text: "Please include the final mobile review before internal approval.", createdAt: now }], checklist: [{ id: "cl1", text: "Tablet layout", done: true }, { id: "cl2", text: "Mobile layout", done: false }, { id: "cl3", text: "Cross-browser review", done: false }], attachments: [] },
    { id: "t2", title: "Homepage content approval", description: "Client review of homepage headings and product value proposition.", projectId: "p1", clientId: "c1", assigneeIds: ["u2"], priority: "High", status: "Waiting for Client", startDate: "2026-09-29", dueDate: "2026-10-02", estimatedHours: 2, actualHours: 1, tags: ["approval"], comments: [], checklist: [], attachments: [] },
    { id: "t3", title: "Fix mobile checkout", description: "Resolve mobile checkout spacing and submit confirmation issue.", projectId: "p2", clientId: "c2", assigneeIds: ["u3"], priority: "Urgent", status: "Internal Review", startDate: "2026-09-30", dueDate: "2026-10-02", estimatedHours: 6, actualHours: 4.2, tags: ["checkout", "bug"], comments: [], checklist: [{ id: "cl4", text: "Reproduce issue", done: true }, { id: "cl5", text: "Patch", done: true }, { id: "cl6", text: "QA on mobile", done: false }], attachments: [] },
    { id: "t4", title: "October SEO content plan", description: "Prepare keyword-led article and page optimisation plan.", projectId: "p3", clientId: "c1", assigneeIds: ["u2"], priority: "Medium", status: "Not Started", startDate: "2026-10-01", dueDate: "2026-10-08", estimatedHours: 5, actualHours: 0, tags: ["seo"], comments: [], checklist: [], attachments: [] },
    { id: "t5", title: "Client-requested hero revision", description: "Apply approved hero changes from the latest review.", projectId: "p1", clientId: "c1", assigneeIds: ["u4"], priority: "Medium", status: "Changes Requested", startDate: "2026-10-01", dueDate: "2026-10-04", estimatedHours: 3, actualHours: 0.5, tags: ["design"], comments: [], checklist: [], attachments: [] },
    { id: "t6", title: "Navigation component", description: "Reusable responsive navigation completed and approved.", projectId: "p1", clientId: "c1", assigneeIds: ["u3"], priority: "Medium", status: "Completed", startDate: "2026-09-20", dueDate: "2026-09-25", estimatedHours: 5, actualHours: 4.5, tags: ["frontend"], comments: [], checklist: [], attachments: [] },
  ],
  channels: [
    { id: "ch1", name: "general", type: "general", memberIds: ["u1", "u2", "u3", "u4", "u5"] },
    { id: "ch2", name: "developers", type: "team", memberIds: ["u1", "u2", "u3"] },
    { id: "ch3", name: "project-aura-living", type: "project", memberIds: ["u1", "u2", "u3", "u4"], projectId: "p1", clientId: "c1" },
    { id: "ch4", name: "client-aura-living", type: "client", memberIds: ["u1", "u2", "u6"], clientId: "c1" },
    { id: "ch5", name: "project-adventurelk", type: "project", memberIds: ["u1", "u2", "u3"], projectId: "p2", clientId: "c2" },
  ],
  messages: [
    { id: "m1", channelId: "ch1", userId: "u1", content: "Good morning team — please keep client blockers visible today.", createdAt: "2026-10-01T04:15:00.000Z", mentions: [], reactions: [{ emoji: "👍", userIds: ["u2", "u3"] }] },
    { id: "m2", channelId: "ch3", userId: "u3", content: "Homepage responsive pass is nearly ready for internal review.", createdAt: "2026-10-01T05:10:00.000Z", mentions: ["u2"], reactions: [] },
    { id: "m3", channelId: "ch3", userId: "u2", content: "Nice. Please confirm the mobile checkout-style spacing is consistent before handoff.", createdAt: "2026-10-01T05:20:00.000Z", parentId: "m2", mentions: ["u3"], reactions: [] },
    { id: "m4", channelId: "ch5", userId: "u3", content: "Need to fix the mobile checkout on AdventureLK before client review.", createdAt: "2026-10-01T06:00:00.000Z", mentions: [], reactions: [] },
    { id: "m5", channelId: "ch4", userId: "u6", content: "We have reviewed the homepage content. One hero wording change is requested.", createdAt: "2026-10-01T06:40:00.000Z", mentions: [], reactions: [] },
  ],
  approvals: [
    { id: "a1", clientId: "c1", projectId: "p1", taskId: "t2", title: "Homepage Content Confirmation", description: "Please review the proposed homepage headings and product messaging.", status: "Awaiting Response", version: 2, dueDate: "2026-10-02", assignedEmployeeId: "u2", createdAt: "2026-09-29T07:00:00.000Z", viewedAt: "2026-09-30T05:20:00.000Z", attachments: [], versions: [{ version: 1, createdAt: "2026-09-27T06:00:00.000Z", status: "Changes Requested", response: "Please simplify the hero copy." }, { version: 2, createdAt: "2026-09-29T07:00:00.000Z", status: "Awaiting Response" }] },
    { id: "a2", clientId: "c2", projectId: "p2", taskId: "t3", title: "Mobile Checkout QA", description: "Review the revised mobile checkout flow before release.", status: "Draft", version: 1, dueDate: "2026-10-04", assignedEmployeeId: "u3", createdAt: "2026-10-01T06:10:00.000Z", attachments: [], versions: [{ version: 1, createdAt: "2026-10-01T06:10:00.000Z", status: "Draft" }] },
    { id: "a3", clientId: "c1", projectId: "p1", title: "Navigation Design", description: "Final navigation design and responsive behaviour.", status: "Approved", version: 1, dueDate: "2026-09-26", assignedEmployeeId: "u4", createdAt: "2026-09-24T04:30:00.000Z", viewedAt: "2026-09-25T06:00:00.000Z", attachments: [], versions: [{ version: 1, createdAt: "2026-09-24T04:30:00.000Z", status: "Approved", response: "Approved for development." }] },
  ],
  notifications: [
    { id: "n1", userId: "u2", title: "Approval waiting", message: "Aura Living has an approval due tomorrow.", type: "approval", read: false, createdAt: "2026-10-01T05:30:00.000Z", link: "/approvals" },
    { id: "n2", userId: "u3", title: "Task review", message: "Mobile checkout is ready for internal review.", type: "task", read: false, createdAt: "2026-10-01T06:15:00.000Z", link: "/tasks" },
    { id: "n3", userId: "u1", title: "Client message", message: "Aura Living requested a hero wording change.", type: "message", read: false, createdAt: "2026-10-01T06:45:00.000Z", link: "/workspace" },
  ],
};
