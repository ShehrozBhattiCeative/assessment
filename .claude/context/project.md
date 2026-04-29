# NexusAI Project Context

## What is This?
NexusAI is a hospital management system built as a full-stack assessment. It is a pixel-perfect clone of the Unity Hospital reference site (https://nirravv.github.io/Hospital-Management-Html/) with a functional admin dashboard.

## Architecture
```
Client (port 3000)          Server (port 3001)
Next.js 14 App Router  ──►  NestJS REST API
Zustand + Axios        ◄──  JWT Auth + JSON storage
CSS Variables theme
```

## Key Design Decisions
1. **No database** — JSON files in `nexusai-backend/src/data/` act as the data store. Simple reads/writes via Node.js `fs` module.
2. **No Tailwind** — Pure CSS with custom properties for theming. All colors are CSS variables.
3. **App Router** — Next.js 14 App Router (not Pages Router). Route groups: `(public)`, `(auth)`, `admin/`.
4. **Shared types** — `.claude/context/types.ts` is the single source of truth for TypeScript interfaces.
5. **JWT rotation** — Access token (15min) + Refresh token (7d). Axios interceptors auto-refresh.

## User Roles
| Role | Can Do |
|------|--------|
| `admin` | All CRUD, manage doctors/blogs/packages/users |
| `patient` | View public pages, book appointments, view own appointments |
| `doctor` | (Future) View own schedule (not yet implemented) |

## Test Accounts
- Admin: `admin@hospital.com` / `Admin@123`
- Patient: `patient@hospital.com` / `Patient@123`

## Public Pages (no auth)
- `/` — Home (hero, stats, doctors, packages, testimonials)
- `/doctors` — Doctor listing
- `/doctors/[id]` — Doctor profile
- `/appointment` — Book appointment form
- `/services` — Hospital services
- `/health-packages` — Health packages listing
- `/blog` — Blog listing
- `/blog/[id]` — Single blog post
- `/about` — About hospital
- `/contact` — Contact form
- `/gallery` — Photo gallery with lightbox

## Admin Pages (admin role only)
- `/admin` — Dashboard with stats
- `/admin/doctors` — Manage doctors
- `/admin/appointments` — All appointments
- `/admin/blogs` — Manage blog posts
- `/admin/departments` — Manage departments
- `/admin/packages` — Manage health packages
- `/admin/patients` — Patient list
- `/admin/settings` — System settings

## Environment Variables
```bash
# nexusai-backend/.env (optional — has fallbacks)
JWT_SECRET=nexusai-secret-key
PORT=3001

# nexusai-frontend/.env.local (optional — has fallbacks)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```
