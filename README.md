# StreakED: A Gamified Attendance Tracking System

> **Research / Capstone Project**  
> **Institution:** John Paul College, Roxas, Oriental Mindoro  
> **Course:** Bachelor of Science in Computer Science (2026)  
> **Proponents:** Lucky Lawrence C. Fernandez & Jemuel Delos Reyes  

---

## 🎯 Project Overview
**StreakED** transforms obligatory classroom attendance into a compelling daily engagement mechanic inspired by behavioral gamification (TikTok/Snapchat streaks).

This repository converts the original ASP.NET MVC/C# proposal into a **modern fullstack TypeScript/Next.js 14+ web application** featuring:
- 🔥 **Consecutive Streak Engine**: Evaluates school-day attendance, weekend skips, late penalties, and unexcused absence resets.
- 🏆 **Tiered Milestone Badges**: Progress from Starter Flame (3 days) to StreakED Legend (100 days).
- 📷 **Live Camera QR & Barcode Scanner**: Browser-based scanning with `html5-qrcode` and instant audio feedback.
- 📺 **Classroom Projector Mode**: Fullscreen, high-contrast live leaderboard for classroom screens.
- 💬 **Curated Academic Chat**: Strict topic filtering (`[Announcement]`, `[Question]`, `[Assignment Help]`, `[Study Material]`).
- 👥 **Multi-Role Portals**: Student HUD, Teacher Console, Admin Analytics, and Parent/Guardian view.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database & Push Schema
This project uses SQLite with Prisma for zero-config local running:
```bash
npx prisma db push
```

### 3. Seed Mock Data & Badges
Populates sample students (including proponents Lucky & Jemuel), teachers, classrooms, streaks, and badges:
```bash
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🔑 Mock Credentials for Testing

| Role | Email | Password | Student ID / Description |
| :--- | :--- | :--- | :--- |
| **Student** | `lucky@streak.edu` | `password123` | `2026-00101-SHS` (Lucky Lawrence C. Fernandez) |
| **Student** | `jemuel@streak.edu` | `password123` | `2026-00102-SHS` (Jemuel Delos Reyes) |
| **Student** | `maria@streak.edu` | `password123` | `2026-00103-SHS` (Gold Vanguard Tier) |
| **Teacher** | `adviser@streak.edu`| `password123` | Prof. Alberto Mendoza (CS 301) |
| **Admin** | `admin@streak.edu` | `password123` | Dr. Ronald Vance (Dean / Admin) |
| **Parent** | `parent@streak.edu` | `password123` | Mrs. Erlinda Fernandez |

---

## 📂 Architecture Overview
```
├── prisma/
│   ├── schema.prisma          # Complete data models (User, Classroom, Attendance, Streak, Badge, Chat)
│   └── seed.ts                # Rich seed data with sample students, teachers, classes, and records
├── src/
│   ├── app/
│   │   ├── page.tsx           # Interactive Role Switcher & System Launchpad
│   │   ├── layout.tsx         # Global Shell with Header & Footer
│   │   ├── dashboard/
│   │   │   ├── student/       # Gamified HUD, Streak Flame, Scannable Pass, Trophy Room
│   │   │   ├── teacher/
│   │   │   │   ├── page.tsx   # Roster, Attendance Table & Manual Overrides
│   │   │   │   ├── scanner/   # Optical Camera Scanner with Web Audio feedback
│   │   │   │   └── projector/ # Fullscreen TV/Projector live leaderboard
│   │   │   ├── admin/         # School-wide attendance rate & CSV export
│   │   │   └── parent/        # Guardian consistency tracker & absence SMS alerts
│   │   ├── chat/              # Academic-only discussion board with pinned notices
│   │   └── api/
│   │       ├── attendance/scan/route.ts
│   │       ├── attendance/manual/route.ts
│   │       └── chat/route.ts
│   ├── components/
│   │   ├── FlameStreak.tsx    # Animated SVG flame scaling with streak count
│   │   ├── BadgeCard.tsx      # Tiered milestone card with progress bars
│   │   ├── StudentIdCard.tsx  # Dynamic QR Code & Barcode pass
│   │   └── AttendanceHeatmap.tsx
│   └── lib/
│       ├── streakEngine.ts    # Pure functions for streak calculations & badge progression
│       ├── soundEffects.ts    # HTML5 Web Audio API synthesizer for scan chimes
│       └── prisma.ts          # Prisma client instance
```
