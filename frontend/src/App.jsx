import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth }                  from './context/AuthContext.jsx'
import { AppProvider, useApp }                    from './context/AppContext.jsx'
import Navbar         from './components/Navbar.jsx'
import Toast          from './components/Toast.jsx'
import Landing        from './pages/Landing.jsx'
import Dashboard      from './pages/Dashboard.jsx'
import Calendar       from './pages/Calendar.jsx'
import GymMap         from './pages/GymMap.jsx'
import PracticeDetail from './pages/PracticeDetail.jsx'
import LessonPlans    from './pages/LessonPlans.jsx'
import Teams          from './pages/Teams.jsx'

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-center">
        <div className="w-9 h-9 rounded-xl bg-accent mx-auto mb-3 animate-pulse" />
        <p className="text-sm font-semibold text-muted">Loading…</p>
      </div>
    </div>
  )
}

function AppInner() {
  const { dataLoading } = useApp()
  if (dataLoading) return <LoadingScreen />
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <main className="pt-14 px-4 sm:px-6 py-8 max-w-5xl mx-auto">
        <Routes>
          <Route path="/"                         element={<Dashboard />} />
          <Route path="/calendar"                 element={<Calendar />} />
          <Route path="/gym-map"                  element={<GymMap />} />
          <Route path="/practice/:teamId/:date"   element={<PracticeDetail />} />
          <Route path="/lesson-plans"             element={<LessonPlans />} />
          <Route path="/teams"                    element={<Teams />} />
          <Route path="*"                         element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Toast />
    </div>
  )
}

function AppShell() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Landing />} />
      </Routes>
    )
  }

  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
