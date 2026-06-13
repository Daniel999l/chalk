import { useApp } from '../context/AppContext.jsx'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export default function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  const isError = toast.type === 'error'
  return (
    <div className={`fixed bottom-6 right-6 z-[200] card flex items-center gap-2.5 px-4 py-3 text-sm font-semibold
      ${isError ? 'text-red-600' : 'text-ink'}`}
         style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
      {isError
        ? <AlertCircle size={15} className="text-red-500" />
        : <CheckCircle2 size={15} className="text-accent" style={{ filter: 'brightness(0.75)' }} />
      }
      {toast.msg}
    </div>
  )
}
