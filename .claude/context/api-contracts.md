# API Contracts

Base URL: `http://localhost:3001/api`
Swagger UI: `http://localhost:3001/api` (when backend is running)

## Auth Headers
```
Authorization: Bearer <access_token>
```

## Response Envelope
Successful responses return data directly (no wrapper).
Error responses:
```json
{ "statusCode": 400, "message": "Error description" }
```

---

## Auth Endpoints

### POST /auth/login
**Body:** `{ email: string, password: string }`
**Response:**
```json
{
  "accessToken": "jwt...",
  "refreshToken": "jwt...",
  "user": { "id": "uuid", "name": "string", "email": "string", "role": "admin|patient" }
}
```

### POST /auth/register
**Body:** `{ name: string, email: string, password: string, role?: "patient" }`
**Response:** Same as login

### POST /auth/refresh
**Headers:** Bearer token
**Body:** `{ refreshToken: string }`
**Response:** `{ accessToken: string, refreshToken: string }`

---

## Doctors Endpoints

### GET /doctors
**Auth:** None
**Response:** `Doctor[]`

### GET /doctors/:id
**Auth:** None
**Response:** `Doctor`

### POST /doctors
**Auth:** Admin
**Body:** `CreateDoctorDto`
**Response:** `Doctor`

### PUT /doctors/:id
**Auth:** Admin
**Body:** `UpdateDoctorDto` (partial)
**Response:** `Doctor`

### DELETE /doctors/:id
**Auth:** Admin
**Response:** `{ success: true }`

---

## Appointments Endpoints

### POST /appointments
**Auth:** Patient or Admin
**Body:**
```json
{
  "doctorId": "uuid",
  "date": "2024-01-15",
  "time": "10:00",
  "reason": "string",
  "patientName": "string",
  "patientEmail": "string",
  "patientPhone": "string"
}
```
**Response:** `Appointment`

### GET /appointments
**Auth:** Admin only
**Response:** `Appointment[]`

### GET /appointments/my
**Auth:** Patient (own appointments)
**Response:** `Appointment[]`

### PATCH /appointments/:id/status
**Auth:** Admin
**Body:** `{ status: "pending"|"confirmed"|"cancelled"|"completed" }`
**Response:** `Appointment`

---

## Blogs Endpoints

### GET /blogs
**Auth:** None
**Response:** `Blog[]` (published only)

### GET /blogs/:id
**Auth:** None
**Response:** `Blog`

### POST /blogs
**Auth:** Admin
**Body:** `CreateBlogDto`
**Response:** `Blog`

### PUT /blogs/:id
**Auth:** Admin
**Response:** `Blog`

### DELETE /blogs/:id
**Auth:** Admin
**Response:** `{ success: true }`

---

## Other Endpoints

### GET /departments
**Auth:** None → `Department[]`

### GET /packages
**Auth:** None → `HealthPackage[]`

### GET /testimonials
**Auth:** None → `Testimonial[]`

### GET /stats/dashboard
**Auth:** Admin
**Response:**
```json
{
  "totalDoctors": 0,
  "totalPatients": 0,
  "totalAppointments": 0,
  "pendingAppointments": 0,
  "totalBlogs": 0,
  "monthlyAppointments": [{ "month": "Jan", "count": 0 }]
}
```

### GET /users
**Auth:** Admin → `User[]` (no passwords)

### DELETE /users/:id
**Auth:** Admin → `{ success: true }`
