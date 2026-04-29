# NexusAI Hospital Management System — How to Run

## Prerequisites

- **Node.js 18+** (download from https://nodejs.org)
- **npm** (comes with Node.js)
- Two terminal windows (one for backend, one for frontend)

---

## Backend (NestJS)

```bash
cd nexusai-backend
npm install
npm run start:dev
```

Runs on: **http://localhost:3001**

---

## Frontend (Next.js 14)

```bash
cd nexusai-frontend
npm install
npm run dev
```

Runs on: **http://localhost:3000**

---

## Important URLs

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Public website (home, doctors, blog, etc.) |
| http://localhost:3000/admin | Admin panel dashboard |
| http://localhost:3000/appointment | Book an appointment |
| http://localhost:3001/api/docs | Swagger API documentation |

---

## Login Credentials

### Admin Account
- **URL:** http://localhost:3000/login → then navigate to http://localhost:3000/admin
- **Email:** `admin@hospital.com`
- **Password:** `Admin@123`

### Patient Account
- **URL:** http://localhost:3000/login
- **Email:** `patient@hospital.com`
- **Password:** `Patient@123`

---

## All API Endpoints

### Auth (`/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register new patient |
| POST | `/auth/login` | Public | Login (returns JWT + sets refresh cookie) |
| POST | `/auth/refresh` | Public | Refresh access token via HttpOnly cookie |
| POST | `/auth/logout` | Auth | Logout and invalidate refresh token |
| GET | `/auth/me` | Auth | Get current user profile |

### Doctors (`/doctors`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/doctors` | Public | List all doctors (filter: `?specialty=`, `?search=`, `?departmentId=`) |
| GET | `/doctors/:id` | Public | Get doctor by ID |
| POST | `/doctors` | Admin | Create doctor |
| PATCH | `/doctors/:id` | Admin | Update doctor |
| DELETE | `/doctors/:id` | Admin | Delete doctor |

### Appointments (`/appointments`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/appointments` | Auth | List appointments (patients see only theirs) |
| GET | `/appointments/stats` | Admin | Get appointment statistics |
| GET | `/appointments/:id` | Auth | Get single appointment |
| POST | `/appointments` | Auth | Book an appointment |
| PATCH | `/appointments/:id/status` | Auth | Update status (patients can only cancel) |
| DELETE | `/appointments/:id` | Admin | Delete appointment |

### Blogs (`/blogs`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/blogs` | Public | List blogs (filter: `?status=`, `?category=`, `?search=`) |
| GET | `/blogs/slug/:slug` | Public | Get blog by slug |
| GET | `/blogs/:id` | Public | Get blog by ID |
| POST | `/blogs` | Admin | Create blog post |
| PATCH | `/blogs/:id` | Admin | Update blog post |
| DELETE | `/blogs/:id` | Admin | Delete blog post |

### Departments (`/departments`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/departments` | Public | List all departments |
| GET | `/departments/:id` | Public | Get department by ID |
| POST | `/departments` | Admin | Create department |
| PATCH | `/departments/:id` | Admin | Update department |
| DELETE | `/departments/:id` | Admin | Delete department |

### Health Packages (`/packages`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/packages` | Public | List active packages |
| GET | `/packages/all` | Admin | List all packages (including inactive) |
| GET | `/packages/:id` | Public | Get package by ID |
| POST | `/packages` | Admin | Create package |
| PATCH | `/packages/:id` | Admin | Update package |
| DELETE | `/packages/:id` | Admin | Delete package |

### Testimonials (`/testimonials`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/testimonials` | Public | Get all active testimonials |

### Stats (`/stats`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/stats` | Public | Get hospital statistics |

### Users (`/users`) — Admin only
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users` | Admin | List all users (filter: `?role=`, `?search=`) |
| GET | `/users/dashboard` | Admin | Get dashboard statistics |
| GET | `/users/:id` | Admin | Get user by ID |
| PATCH | `/users/:id` | Admin | Update user |
| DELETE | `/users/:id` | Admin | Delete user |

---

## Data Storage

This project uses **JSON files** as the database (no external DB required):

```
nexusai-backend/src/data/
├── users.json          # User accounts
├── doctors.json        # Doctor profiles
├── appointments.json   # Booked appointments
├── blogs.json          # Blog posts
├── departments.json    # Hospital departments
├── health-packages.json # Health packages
├── stats.json          # Hospital statistics
└── testimonials.json   # Patient testimonials
```

All CRUD operations read/write directly to these JSON files.

---

## Troubleshooting

### Backend won't start
- Make sure port 3001 is free: `npx kill-port 3001` (install with `npm i -g kill-port`)
- Re-install dependencies: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (must be 18+)

### Frontend won't start
- Make sure port 3000 is free
- Re-install dependencies: `rm -rf node_modules && npm install`
- Backend must be running first for API calls to work

### Login fails (401 Unauthorized)
- Ensure you are using the exact credentials listed above
- Ensure the backend is running at http://localhost:3001
- Check browser console for CORS errors — verify `FRONTEND_URL` in backend matches your frontend port

### CORS errors in browser
- Backend allows requests from `http://localhost:3000` by default
- If frontend runs on a different port, set the environment variable:
  ```bash
  # In nexusai-backend, create .env:
  FRONTEND_URL=http://localhost:3000
  ```

### Admin panel shows login page instead of dashboard
- You must login with an **admin** account (`admin@hospital.com`)
- Patient accounts will be redirected away from `/admin`

### Build errors
```bash
# Backend
cd nexusai-backend && npm run build

# Frontend
cd nexusai-frontend && npm run build
```
