# Asmiee OS — Phase 1 Frontend

A Vercel-ready Next.js frontend for the Phase 1 Asmiee OS MVP. It is intentionally frontend-first: all visible workflows work with browser-persisted demo data, while backend-only responsibilities are isolated for later Node/NestJS + PostgreSQL integration.

## Included Phase 1 functionality

- Demo authentication and role-based UI for Super Admin, Admin, Project Manager, Developer, Designer, Finance and Client.
- Team / role management and a visible permission matrix.
- Client CRM: searchable client list, client profiles, contacts, services and connected project/approval views.
- Projects: create/edit projects, team assignment, status, priority, progress, files and connected work.
- Tasks: create tasks, multi-assignee support, priorities, tags, Kanban drag/drop, comments, checklist, hours and small demo attachments.
- Workspace: channels, messages, replies/threads, mentions, reactions, pinning, message search and project message → task conversion.
- Client Portal: client-specific dashboard, projects, services, approvals and messages.
- Approval workflow: draft → send → client view → approve / request changes / ask question → employee notification; resubmission creates version history.
- In-app notifications with read/unread state.
- Responsive desktop/tablet/mobile UI.
- Browser persistence through `localStorage`, with a Reset Demo Data control.

## Demo accounts

- `admin@asmiee.demo` — Super Admin
- `pm@asmiee.demo` — Project Manager
- `developer@asmiee.demo` — Developer
- `designer@asmiee.demo` — Designer
- `finance@asmiee.demo` — Finance
- `client@asmiee.demo` — Aura Living Client

No password is required in the frontend-only demo. Production authentication belongs in the backend/security phase.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel choose **Add New → Project** and import the repository.
3. Vercel should auto-detect **Next.js**.
4. Keep the root directory as the repository root and deploy.
5. No environment variables are required for the frontend-only demo.

When the backend exists, set:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

## Backend integration path

The current persistent demo layer is in `src/services/demo-repository.ts`. UI actions are centralized in `src/context/app-context.tsx`, and the future API contract is reserved in `src/services/api-contract.ts`.

Recommended backend stack:

- Node.js + NestJS
- PostgreSQL
- REST API initially
- WebSocket / Socket.IO for real-time messages and notifications
- Object storage for files
- Background queue for email, reminders and other scheduled jobs

Production backend must enforce authorization and client data isolation independently of the frontend. Real authentication, transactional email, audit integrity, cross-device persistence and multi-user real-time state are deliberately not faked as security guarantees in this frontend build.

## Search / SEO note

Asmiee OS is an internal authenticated business application, so root metadata is clean and semantic but robots are set to `noindex, nofollow`. This is intentional: internal client/project data should not appear in public search engines. If a public marketing site is later added, that public surface should use normal indexable SEO metadata separately.

## Demo file uploads

Small files (up to ~750 KB) are stored as browser data URLs so they can survive refresh in the same browser. Larger files retain metadata only. Replace this with signed object-storage uploads when the backend is connected.
