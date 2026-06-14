import { useAuth } from '../context/AuthContext.jsx'
import { RotateCcw, Users, MapPin, PenLine, Zap, CalendarDays } from 'lucide-react'

export default function Landing() {
  const { login } = useAuth()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Nav */}
      <header className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-accent">
            <PenLine size={13} className="text-ink" />
          </div>
          <span className="font-bold text-lg text-ink tracking-tight">Chalk</span>
        </div>
        <button onClick={login} className="btn-dark text-sm">Sign in</button>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 sm:pt-16 pb-16 sm:pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-soft border border-accent/40 text-xs font-semibold text-ink mb-6 sm:mb-8">
          <Zap size={11} className="text-ink" /> Built for NextGenHacks 2026
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-ink tracking-tight leading-[1.1] sm:leading-[1.05] mb-6">
          Practice scheduling<br />
          <span className="relative inline-block">
            that never repeats.
            <span className="absolute -bottom-1 left-0 w-full h-3 rounded-full bg-accent/40 -z-10" />
          </span>
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-xl mx-auto mb-10 leading-relaxed">
          Chalk auto-rotates your lesson plans by visit count - not calendar date.
          Every session gets the right drill, exactly when it's due.
        </p>
        <button onClick={login}
          className="btn-accent text-base px-8 py-3 rounded-xl shadow-card-hover mx-auto">
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
        <p className="text-xs text-muted mt-4">Free. No credit card. Your data, your account.</p>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="card p-8 mb-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
              <RotateCcw size={18} className="text-ink" />
            </div>
            <div>
              <h3 className="font-bold text-ink text-lg mb-1">The rotation engine</h3>
              <p className="text-muted leading-relaxed">
                Each team × block type has a playlist. When you generate a practice,
                Chalk picks <code className="bg-accent-soft px-1.5 py-0.5 rounded text-xs font-semibold">plan[visitCount % length]</code> - so plans rotate automatically across sessions, never repeating until the full cycle completes.
              </p>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: Users,
              title: 'Multi-team, one view',
              body: 'Manage multiple teams and coaches. Assign different schedules, rotations, and gym areas - all in the same dashboard.',
            },
            {
              icon: MapPin,
              title: 'Gym map',
              body: 'Visual coach × time-slot grid. Click to assign each coach to a gym area for any day. See coverage at a glance.',
            },
            {
              icon: CalendarDays,
              title: 'Calendar view',
              body: 'Month view shows which teams practice on which days. Click any date to generate or review the practice plan.',
            },
            {
              icon: Zap,
              title: 'One-click generation',
              body: 'Hit "Generate Today" and Chalk creates a full practice plan for every team - blocks timed, plans assigned, rotations advanced.',
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="card p-5">
              <div className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center"
                   style={{ background: 'var(--bg)' }}>
                <Icon size={15} className="text-muted" />
              </div>
              <h4 className="font-semibold text-ink mb-1">{title}</h4>
              <p className="text-sm text-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-20 text-center">
        <div className="card p-10" style={{ background: 'var(--accent)' }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3 tracking-tight">Ready to get started?</h2>
          <p className="text-ink/60 mb-6">Sign in with Google - takes 10 seconds.</p>
          <button onClick={login} className="btn-dark mx-auto px-8 py-3 text-base rounded-xl">
            Sign in with Google
          </button>
        </div>
      </section>

      <footer className="flex flex-col items-center gap-4 pb-8 text-xs text-muted">
        <a href="https://orynth.dev/projects/chalk" target="_blank" rel="noopener noreferrer">
          <img src="https://orynth.dev/api/badge/chalk?theme=light&style=default"
               alt="Featured on Orynth" width="260" height="80" />
        </a>
        <span>Chalk - Practice Scheduling for Coaches · NextGenHacks 2026</span>
      </footer>

    </div>
  )
}
