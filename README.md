# Glory Educational Consultancy — International Admissions Fair Frontend 🎓

Production-ready web application built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **TypeScript**, **Zustand**, and **IndexedDB** for offline multi-step drafts.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your Backend API Gateway URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 🛠️ Available Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local development server on `http://localhost:3000` with Turbopack |
| `npm run build` | Builds an optimized production bundle with prerendered static routes |
| `npm run start` | Runs the production build server on `http://localhost:3000` |
| `npm run lint` | Runs ESLint 9 validation across all TypeScript & TSX source files |
| `npm run typecheck` | Validates TypeScript types across the entire project (`tsc --noEmit`) |

---

## 🚢 Production Deployment

### Option A: Standard Node.js Production Server
```bash
# 1. Install clean dependencies
npm ci

# 2. Build the production application
npm run build

# 3. Start production server
npm run start
```
To run on a custom port:
```bash
PORT=8080 npm run start
```

### Option B: Process Manager (PM2)
```bash
npm install -g pm2
npm run build
pm2 start npm --name "glory-frontend" -- start -- -p 3000
```

### Option C: Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🏛️ Application Architecture & Routes

### 🌐 Public Routes
- `/` — Landing Page (Event overview, 6-step journey, CTA)
- `/login` — User authentication & role-based redirect
- `/register` — Account registration

### 📝 Multi-Step Application (IndexedDB Offline-Resilient)
- `/apply/profile` — Step 1: Academic profile & background
- `/apply/documents` — Step 2: Local document staging (PDF/JPEG)
- `/apply/payment` — Step 3: Telebirr / Bank / Cash verification & backend sync
- `/apply/review` — Step 4: Final submission review

### 🧑‍🎓 Student Dashboard (`/dashboard`)
- `/dashboard` — Overview & Progress Tracker
- `/dashboard/profile` — Update Profile Details
- `/dashboard/payments` — 500 ETB Pass verification history
- `/dashboard/documents` — Cloud-stored academic credentials
- `/dashboard/results` — Official Green / Yellow / Red admissions assessment
- `/dashboard/events` — Assigned sessions, Google Meet links & QR check-in
- `/dashboard/messages` — Direct inbox communication with staff

### ⚙️ Admin & Staff Desk (`/admin`)
- `/admin/analytics` — KPI cards, conversion funnel & CSV export
- `/admin/students` — 100-Point scoring engine, university matching & CRM pipeline
- `/admin/universities` — Institution directory & degree program configuration
- `/admin/events` — Fair scheduling & destination breakout tracks
- `/admin/users` — Staff & Representative user management

### 🏛️ University Representative Portal (`/rep`)
- `/rep/assigned` — Matched student roster
- `/rep/portal` — Student academic evaluation & decision console (Green / Yellow / Red)

---

## 🔒 Security & Best Practices
- **Security Headers & Compression**: Configured in [`next.config.ts`](file:///home/newowner/ermi_p/GloryEducationFrontend/next.config.ts).
- **JWT Interceptor**: Automatic token attachment and 401 redirect handling in [`src/lib/api.ts`](file:///home/newowner/ermi_p/GloryEducationFrontend/src/lib/api.ts).
- **Zero Linter / Typecheck Errors**: Checked via `npm run lint` and `npm run typecheck`.

