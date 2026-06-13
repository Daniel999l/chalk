import { NavLink }  from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboard, CalendarDays, Grid3X3, BookOpen, Users, PenLine, LogOut, Trash2, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useApp }  from '../context/AppContext.jsx'

const NAV = [
  { to: '/',             label: 'Dashboard', icon: LayoutDashboard },
  { to: '/calendar',     label: 'Calendar',  icon: CalendarDays },
  { to: '/gym-map',      label: 'Gym Map',   icon: Grid3X3 },
  { to: '/lesson-plans', label: 'Plans',     icon: BookOpen },
  { to: '/teams',        label: 'Teams',     icon: Users },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { clearAllData } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleClearData() {
    setMenuOpen(false)
    if (!window.confirm('Clear all your data and reset to defaults? This cannot be undone.')) return
    await clearAllData()
  }

  async function handleLogout() {
    setMenuOpen(false)
    await logout()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 sm:px-6 gap-4"
         style={{ background: 'var(--bg)' }}>

      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
          <PenLine size={13} strokeWidth={2.5} className="text-ink" />
        </div>
        <span className="font-bold text-base text-ink tracking-tight hidden sm:block">chalk</span>
      </NavLink>

      {/* Nav links */}
      <div className="flex items-center gap-0.5 flex-1 overflow-x-auto no-scrollbar">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium
               transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? 'bg-ink text-white'
                  : 'text-muted hover:text-ink hover:bg-black/5'
              }`
            }
          >
            <Icon size={14} />
            <span className="hidden md:block">{label}</span>
          </NavLink>
        ))}
      </div>

      {/* User menu */}
      {user && (
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-black/5 transition-colors"
          >
            {user.picture
              ? <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
              : <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-ink">
                  {user.name?.[0] || '?'}
                </div>
            }
            <span className="text-xs font-semibold text-ink hidden sm:block max-w-[100px] truncate">
              {user.name?.split(' ')[0]}
            </span>
            <ChevronDown size={12} className="text-muted" />
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-1.5 w-48 card z-50 overflow-hidden py-1"
                   style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-semibold text-ink truncate">{user.name}</p>
                  <p className="text-[10px] text-muted truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleClearData}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-ink hover:bg-[var(--bg)] transition-colors text-left"
                >
                  <Trash2 size={13} /> Clear all data
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-ink hover:bg-[var(--bg)] transition-colors text-left"
                >
                  <LogOut size={13} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
