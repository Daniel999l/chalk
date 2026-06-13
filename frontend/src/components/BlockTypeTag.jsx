const BLOCK_COLORS = {
  'Warm Up':     { bg: '#FFF0E6', text: '#C2410C' },
  'Flexibility': { bg: '#E8F7FF', text: '#0369A1' },
  'Strength':    { bg: '#F5EEFF', text: '#7E22CE' },
  'Area 1':      { bg: '#FEFCE8', text: '#854D0E' },
  'Area 2':      { bg: '#FFF0F8', text: '#9D174D' },
  'Area 3':      { bg: '#EDFFF4', text: '#14532D' },
}

export default function BlockTypeTag({ blockType, size = 'sm' }) {
  const c = BLOCK_COLORS[blockType] || { bg: 'var(--bg)', text: 'var(--muted)' }
  const sz = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'
  return (
    <span className={`inline-flex items-center font-semibold rounded-md ${sz}`}
          style={{ background: c.bg, color: c.text }}>
      {blockType}
    </span>
  )
}

export { BLOCK_COLORS }
