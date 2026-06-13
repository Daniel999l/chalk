import 'dotenv/config'
import express    from 'express'
import cors       from 'cors'
import mongoose   from 'mongoose'
import session    from 'express-session'
import MongoStore from 'connect-mongo'
import passport   from 'passport'

import authRouter     from './routes/auth.js'
import userDataRouter from './routes/userData.js'
import sharedRouter   from './routes/shared.js'

const app = express()

app.set('trust proxy', 1)

// In production (single Vercel deploy) frontend + API share the same origin,
// so CORS isn't needed. It's here only for local dev where they run on different ports.
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json({ limit: '2mb' }))

// ── Lazy DB connection — cached across serverless warm invocations ─────────────
let _dbConn = null
async function connectDB() {
  if (_dbConn && mongoose.connection.readyState === 1) return _dbConn
  _dbConn = await mongoose.connect(process.env.MONGODB_URI)
  return _dbConn
}

// Connect before every request (no-op once warm)
app.use(async (_req, _res, next) => {
  try { await connectDB(); next() }
  catch (err) { next(err) }
})

// ── Sessions ──────────────────────────────────────────────────────────────────
app.use(session({
  secret:            process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave:            false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    httpOnly:  true,
    secure:    process.env.NODE_ENV === 'production',
    sameSite:  process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge:    30 * 24 * 60 * 60 * 1000,
  },
}))

app.use(passport.initialize())
app.use(passport.session())

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRouter)
app.use('/api/user-data', userDataRouter)
app.use('/api/shared',    sharedRouter)

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', app: 'Chalk', time: new Date().toISOString() })
)

// ── Local dev only: start HTTP server ─────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`Chalk API on :${PORT}`)))
    .catch(err => { console.error(err.message); process.exit(1) })
}

// Vercel imports this and calls it as a serverless handler
export default app
