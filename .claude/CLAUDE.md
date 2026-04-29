# NexusAI Hospital Management System

## Project Overview
Full-stack hospital management system built with Next.js 14 (frontend, port 3000) and NestJS (backend, port 3001). JSON file-based data storage. Pixel-perfect clone of Unity Hospital reference site.

## Stack
- **Frontend:** Next.js 14 App Router, TypeScript, CSS Variables theming, Zustand, Axios
- **Backend:** NestJS, TypeScript, JSON file storage (no DB), JWT auth
- **Testing:** Jest (frontend + backend)

## Credentials
- Admin: `admin@hospital.com` / `Admin@123`
- Patient: `patient@hospital.com` / `Patient@123`

## How to Run
```bash
# Backend (port 3001)
cd nexusai-backend && npm run start:dev

# Frontend (port 3000)
cd nexusai-frontend && npm run dev
```

## Critical Rules — NEVER BREAK THESE

### Frontend
- All theme colors must use CSS variables (`var(--accent)`, `var(--bg-card)`, etc.) — no hardcoded hex
- Theme toggle uses `[data-theme="dark"]` on `document.documentElement`, localStorage key `"theme"`
- Every component with event handlers (`onClick`, `onChange`, etc.) MUST have `'use client'` at top
- API calls use typed client at `nexusai-frontend/src/lib/api.ts` — never call fetch directly
- Auth state lives in Zustand store at `nexusai-frontend/src/store/authStore.ts`
- Protected pages use `withAuth` HOC from `nexusai-frontend/src/components/layout/withAuth.tsx`

### Backend
- All modules follow pattern: `module.ts` → `controller.ts` → `service.ts`
- Data files live in `nexusai-backend/src/data/*.json`
- JWT secret from `process.env.JWT_SECRET`, fallback `'nexusai-secret-key'`
- All endpoints need `@ApiTags` and `@ApiOperation` decorators for Swagger

### General
- TypeScript strict mode — no `any` types
- Shared types defined in `.claude/context/types.ts` — use them everywhere
- No `console.log` in production code

## Project Structure
```
assessment/
├── .claude/               ← Claude Code config (this folder)
│   ├── agents/            ← Specialized agent definitions
│   ├── context/           ← Project context, API contracts & shared types
│   ├── hooks/             ← Pre/post action hooks
│   ├── pipeline/          ← Agentic workflow & build pipeline
│   ├── rules/             ← Coding standards
│   └── skills/            ← Reusable task skills
├── nexusai-backend/       ← NestJS API server
└── nexusai-frontend/      ← Next.js 14 app
```
