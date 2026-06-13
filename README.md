# Chalk

> The only coaching app that assigns lesson plans by *visit count*, not the calendar.

Built for NextGenHacks 2026.

---

## What It Does

Chalk is a practice scheduling OS for coaches who run multiple teams.

**Problem:** No app understands occurrence-based rotation. A coach might visit "Area 2, Bars" every 8th practice, but that is not every Tuesday. It depends on how many times that block has actually come up. Existing tools index on dates, so they cannot express it.

**Solution:** A rotation engine that tracks how many times each team has visited each block type and assigns the correct lesson plan automatically:

```
planIndex = visitCount % playlistLength
```

Warm-ups cycle every 8 visits, areas every 4 to 5, strength playlists swap monthly. The calendar never enters the math.

---

## Features

- **Dashboard** — today's schedule at a glance, one-click practice generation for all teams
- **Calendar** — month view with team indicators, click any day to generate or view practices
- **Practice Detail** — block-by-block breakdown with rotation-assigned plans and progress bars
- **Gym Map** — a coach by time-slot grid, click to assign gym areas, with a coverage summary
- **Lesson Plans** — full CRUD library grouped by block type, with rotation playlist visibility
- **Teams & Coaches** — manage teams, coaches, practice schedules, and rotation resets
- **Share & Import** — share one team's schedule with a public read-only link (no login needed to view); other coaches can import the team, its schedule, plans, and rotations into their own account in one click

---

## Tech Stack

| Layer     | Stack                                      |
|-----------|--------------------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS             |
| Design    | Neobrutalism                               |
| State     | React Context, autosaved to the API        |
| Auth      | Google OAuth (Passport), Mongo-backed sessions |
| Backend   | Node.js ESM + Express                      |
| Database  | MongoDB + Mongoose                         |
| Deploy    | Vercel (single project, static + serverless) |

---

## Project Structure

```
chalk/
├── api/index.js      # Vercel serverless entry, re-exports the Express app
├── server/           # Express API (models, routes, lib)
├── frontend/         # React + Vite single-page app
├── vercel.json       # single-deploy config: frontend build + /api function
└── package.json      # root dev scripts
```

On Vercel the frontend builds to static files and the whole Express app runs as **one** serverless function under `/api`. Rewrites serve the SPA and the API from the same origin, so no CORS is needed in production.

---

## The Rotation Engine

```js
// frontend/src/lib/rotationEngine.js
function peekNextPlan(teamId, blockType, rotations, lessonPlans) {
  const rotation = rotations[`${teamId}_${blockType}`]
  const planId   = rotation.playlist[rotation.visitCount % rotation.playlist.length]
  return lessonPlans.find(lp => lp.id === planId)
}
```

`visitCount` increments only when a practice is generated for a new date. Over any window of `n` consecutive visits every plan appears exactly once, and a given plan recurs with period `n`. That is why "every 8th warm-up" falls out of an 8-plan playlist for free, fully decoupled from the date.

---

## Local Development

You need a MongoDB connection string and a Google OAuth client for full functionality (the app is auth-gated and persists per user).

**API:**
```bash
cd server
cp ../.env.example .env      # then fill in the values below
npm install
npm run dev                  # http://localhost:3001
```

**Frontend:**
```bash
cd frontend
echo "VITE_API_URL=http://localhost:3001" > .env
npm install
npm run dev                  # http://localhost:5173
```

For local dev, set these in `server/.env`:
```
NODE_ENV=development
APP_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
```

---

## Deployment (Vercel)

Deploy from the repo root. Set the following environment variables in the Vercel dashboard:

| Variable               | Notes                                              |
|------------------------|----------------------------------------------------|
| `MONGODB_URI`          | MongoDB Atlas connection string                    |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                             |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret                        |
| `SESSION_SECRET`       | random 64-char string                              |
| `APP_URL`              | your deployed URL, **no trailing slash**           |

Do not set `NODE_ENV`; Vercel manages it.

In the Google Cloud Console, add this authorized redirect URI (single slash, no trailing slash):
```
https://YOUR_DOMAIN/api/auth/google/callback
```

---

## Demo Data

New accounts are seeded with 3 teams, 6 coaches, 26 lesson plans across 6 block types, and realistic schedules:

- **Team Apex** (Advanced), Mon/Wed/Fri 4 to 7pm
- **Team Nova** (Intermediate), Tue/Thu 4 to 6:30pm
- **Team Rise** (Beginner), Mon/Wed 5 to 6:30pm

---

Built by the Chalk team for NextGenHacks 2026.
