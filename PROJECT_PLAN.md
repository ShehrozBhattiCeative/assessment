# NexusAI Hospital Management System — Project Plan

## Overview
Pixel-perfect clone of Unity Hospital (https://nirravv.github.io/Hospital-Management-Html/) built as a full-stack application.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, React Hook Form + Zod
- **Backend**: NestJS, JWT Auth, JSON file-based DB, Swagger
- **Auth**: JWT Access Token (15min) + Refresh Token (7 days, HttpOnly cookie)

## Folder Structure
```
assessment/
├── agents/
│   ├── main-agent/
│   ├── backend-agent/
│   ├── frontend-agent/
│   └── qa-agent/
├── nexusai-backend/          # NestJS API
│   └── src/
│       ├── data/             # JSON mock data (database)
│       ├── auth/
│       ├── doctors/
│       ├── appointments/
│       ├── blogs/
│       ├── departments/
│       ├── packages/
│       ├── testimonials/
│       ├── stats/
│       ├── users/
│       └── common/
└── nexusai-frontend/         # Next.js 14
    └── src/
        ├── app/
        │   ├── (public)/
        │   ├── (auth)/
        │   └── admin/
        ├── components/
        │   ├── ui/
        │   └── layout/
        ├── lib/
        ├── store/
        ├── hooks/
        ├── constants/
        └── styles/
```

## Agent Execution Plan

### Agent 1 - Main Agent ✅
- PROJECT_PLAN.md
- agents/types.ts (TypeScript interfaces)
- nexusai-backend/src/data/*.json (all mock data)

### Agent 2 - UI/UX Agent
- nexusai-frontend/src/styles/design-tokens.css
- nexusai-frontend/src/components/ui/ (all reusable components)

### Agent 3 - Backend Agent
- Full NestJS app with all modules
- JWT auth, guards, interceptors, Swagger

### Agent 4 - Auth Agent
- JWT token rotation + blacklist
- Zustand auth store, axios interceptors
- withAuth HOC, useAuth hook

### Agent 5 - Frontend Agent
- 20 pages (10 public + 2 auth + 8 admin)
- Pixel-perfect clone with all features

### Agent 6 - Code Cleaning Agent
- Remove unused code, fix TypeScript types
- Centralized API client, constants, shared utilities

### Agent 7 - QA Agent
- Unit tests, e2e tests
- QA_REPORT.md

## Color Palette (Unity Hospital)
- Primary: #0f4c81 (deep navy blue)
- Accent: #e8734a (warm orange)
- Secondary: #f0f7ff (light blue tint)
- Text Dark: #1a1a2e
- Text Muted: #6b7280
- Success: #10b981
- Warning: #f59e0b
- Error: #ef4444
- White: #ffffff
- Background: #f8fafc

## Typography
- Headings: 'Playfair Display', serif
- Body: 'Inter', sans-serif

## Key Stats
- Beds: 300+
- Specialties: 45+
- Operation Theatres: 17
- Emergency: 24/7
- ICU Beds: 96

## API Endpoints Summary
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET/POST/PATCH/DELETE /doctors
- GET/POST/PATCH/DELETE /appointments
- GET/POST/PATCH/DELETE /blogs
- GET/POST/PATCH/DELETE /departments
- GET/POST/PATCH/DELETE /packages
- GET /testimonials
- GET /stats
- GET/POST/PATCH/DELETE /users (admin)
