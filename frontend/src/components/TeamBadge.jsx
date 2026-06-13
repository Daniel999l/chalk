export default function TeamBadge({ team, size = 'sm' }) {
  if (!team) return null
  const sz = size === 'lg' ? 'px-3 py-1.5 text-sm gap-2' : 'px-2 py-0.5 text-xs gap-1.5'
  return (
    <span className={`inline-flex items-center font-semibold rounded-md text-ink`}
          style={{ padding: size === 'lg' ? '6px 12px' : '2px 8px',
                   fontSize: size === 'lg' ? '14px' : '11px',
                   background: 'var(--bg)', gap: '6px' }}>
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: team.color }} />
      {team.name}
    </span>
  )
}
