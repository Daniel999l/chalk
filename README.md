# Chalk - Practice Scheduling OS

> The only coaching app that auto-assigns lesson plans based on *visit count*, not calendar dates.

Built for NextGenHacks 2026.

---

## What It Does

Chalk solves a real problem for multi-team sports coaches:

**Problem:** No app understands occurrence-based rotation. A coach might visit "Area 2 — Bars" every 8th practice, but that's not every Tuesday — it depends on how many times that block appears in the schedule. Existing tools can't handle this.

**Solution:** A rotation engine that tracks how many times each team has visited each block type, and automatically assigns the correct lesson plan. `planIndex = visitCount % playlistLength`. Simple, powerful, works perfectly.

---

## Features

- **Dashboard** — Today's schedule at a glance, one-click practice generation for all teams
- **Calendar** — Month view with team indicators, click any day to generate/view practices
- **Practice Detail** — Full block-by-block breakdown with rotation-assigned lesson plans, rotation progress bars
- **Gym Map** — Visual grid (coaches × time slots), click to assign gym areas, coverage summary
- **Lesson Plans** — Full CRUD library, grouped by block type, rotation playlist visibility
- **Teams & Coaches** — Manage teams, coaches, practice schedules, rotation resets

---

## Quick Start (Frontend Only — No Backend Needed)

The frontend is fully self-contained with localStorage persistence.

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

Demo data loads automatically on first run.

---

## Full Stack Setup

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env — set MONGODB_URI
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Tech Stack

| Layer     | Stack                              |
|-----------|-----------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS     |
| Design    | Neobrutalism                       |
| State     | React Context + localStorage       |
| Backend   | Node.js ESM + Express              |
| Database  | MongoDB + Mongoose                 |
| Deploy    | Railway (monorepo)                 |

---

## The Rotation Engine

```js
// Core algorithm — src/lib/rotationEngine.js
function getNextPlan(teamId, blockType, rotations, lessonPlans) {
  const key = `${teamId}_${blockType}`
  const rotation = rotations[key]
  const planId = rotation.playlist[rotation.visitCount % rotation.playlist.length]
  const plan = lessonPlans.find(lp => lp.id === planId)
  // visitCount increments on practice generation
  return plan
}
```

This is what no other app has. Warm-ups cycle every 8 visits. Areas cycle every 4-5. Strength playlists swap monthly. It all just works.

---

## Demo Data

Includes 3 teams, 6 coaches, 26 lesson plans across 6 block types, and realistic practice schedules:

- **Team Apex** (Advanced) — Mon/Wed/Fri 4-7pm
- **Team Nova** (Intermediate) — Tue/Thu 4-6:30pm
- **Team Rise** (Beginner) — Mon/Wed 5-6:30pm

---

Built by the Chalk team for NextGenHacks 2026.
