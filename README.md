# ServeX

ServeX is a full-stack service request platform built with a strong focus on **backend architecture, security, and real-world workflows**.  
The project demonstrates how customers, specialists, and admins interact through controlled request lifecycles, role-based access, transactional integrity, and abuse protection.

## Overview

ServeX is a service request platform built with Next.js and Prisma, featuring role-based access (Customer, Specialist, Admin), secure authentication, rate limiting, and transactional business logic.

---

## 🚀 Key Features

### 👥 Authentication & Authorization

- Secure authentication using **JWT stored in HttpOnly cookies**
- Role-based access control:
  - CUSTOMER
  - SPECIALIST
  - ADMIN
- Centralized middleware enforcing:
  - Authentication
  - Onboarding flow
  - Role-based route protection

---

### 🧠 Request Lifecycle (State-Driven)

Requests follow a controlled lifecycle with explicit state validation:

OPEN
↓ (accepted by specialist)
ASSIGNED
↓ (completed)
COMPLETED

Additional terminal states:

- `CANCELLED_BY_CUSTOMER`
- `CANCELLED_BY_SPECIALIST`

Invalid transitions are strictly prevented at the service layer.

---

### 🔄 Transactional Operations (Prisma)

Critical flows are protected using **Prisma transactions** to guarantee data consistency and prevent race conditions:

- Specialist accepts a job
- Specialist cancels an assigned job
- Customer cancels a request
- Specialist completes a job

All operations are atomic and safe under concurrent access.

---

### ⚡ Rate Limiting (Redis)

The backend is protected against abuse using **Redis-based rate limiting**:

- Login attempts (anti brute-force)
- Signup attempts
- Customer request creation (user-based limiting)

This elevates the project beyond basic CRUD systems toward production-grade backend architecture.

---

## 🔐 Validation & Error Handling

### Zod – Schema-based Validation

All incoming data is validated using **Zod schemas** before reaching the service layer.

Validation is applied to:

- Authentication (login / signup)
- Request creation
- Request update
- Any user-provided input

This ensures:

- Strong runtime type safety
- Clear separation between validation and business logic
- Predictable and consistent API behavior

Invalid data is rejected early with explicit error codes such as:

- `INVALID_INPUT`
- `EMAIL_ALREADY_EXISTS`
- `INVALID_CREDENTIALS`

---

### Sonner – User Feedback & Notifications

The frontend uses **Sonner** for toast-based notifications to provide clear and immediate feedback for user actions.

Used for:

- Validation errors
- Authentication failures
- Rate limit warnings
- Successful actions (create, update, cancel, complete)

This results in:

- Better UX through instant feedback
- Clean separation between backend error logic and UI messaging
- Production-ready error handling flow

---

### Error Handling Philosophy

- Backend returns **explicit error codes**
- Frontend maps error codes to user-friendly messages
- No silent failures
- No generic or unclear error responses

This approach ensures the system is:

- Debuggable
- Predictable
- Easy to maintain and extend

### 🧑‍💼 Admin Panel (Read-Only, Observability-Focused)

Admin access is intentionally designed as a **viewer/supervisory role**, not a CRUD controller.

Admin features:

- Dashboard with real-time statistics:
  - Total users
  - Total specialists
  - Total requests
- Users table
- Requests table

This mirrors real-world systems where admins monitor rather than directly manipulate core data.

---

## 🧱 Tech Stack

### Frontend

- Next.js (App Router)
- React
- Tailwind CSS
- Sonner

### Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL

### Security & Infrastructure

- JWT authentication (`jose`)
- Redis (rate limiting)
- bcrypt (password hashing)
- Zod

---

## 🗂️ Project Structure (Simplified)

app/
├─ api/
│ ├─ auth/
│ ├─ customer/
│ ├─ specialist/
│ └─ admin/
├─ customer/
├─ specialist/
├─ admin/
└─ middleware.js

lib/
├─ auth/
├─ requests/
├─ specialist/
├─ admin/
├─ db/
└─ rate-limit/

---

## 🎯 Design Philosophy

This project intentionally avoids unnecessary features such as:

- Full admin CRUD over users
- Profile management
- Feature duplication already demonstrated in previous projects

ServeX focuses on **backend correctness, system safety, and realistic workflows**, rather than UI-heavy or repetitive functionality.

---

## ✅ What This Project Demonstrates

- Real-world request lifecycle management
- Transaction-safe backend logic
- Role-based system design
- Redis-based rate limiting
- Clean separation of responsibilities
- Production-oriented backend decision making

---

## 🧠 Notes

ServeX is designed as a **portfolio-grade backend showcase**, highlighting architectural thinking and system reliability rather than surface-level features.
