# 🔍 Sherlock

Sherlock is a full-stack **Next.js** application with **role-based access control (RBAC)**, secure authentication, and protected dashboards.  
It’s built with modern security best practices and designed to scale cleanly.

---

## 🚀 Features

- ⚡ **Next.js (App Router)**
- 🔐 **Authentication & Authorization**
  - Role-based access control (Admin & User)
  - Protected routes and dashboards
- 🛡️ **Security**
  - Middleware-level route protection
  - CSRF protection
  - Zod schema validation
  - Rate limiting
- 🗄️ **Database**
  - Neon PostgreSQL
- 📊 **Dashboards**
  - Admin dashboard
  - User dashboard

---

## 🏗️ Tech Stack

- **Frontend:** Next.js, Shadcn-ui
- **Backend:** Next.js API Routes / Server Actions
- **Database:** Neon PostgreSQL
- **Validation:** Zod
- **Auth & Security:** Middleware, CSRF, Rate Limiting

---

## 📁 ▶️ Running the App (locally)
- npm install (install requirements.txt dependancies)
- npm run dev

Open:
👉 http://localhost:3000

## 🔑 Sample Credentials
These are demo credentials for local development only.

👑 Admin User
- Email: admin@gmail.com
- Password: 123456789

👤 Normal User
- Email: user@sherlock.dev
- Password: 123456789

🔒 Access Control

Admin
- Full access to admin dashboard
- Can manage users and system data

User
- Access to user dashboard only
- Restricted from admin routes

Unauthorized access attempts are blocked at the middleware level.
