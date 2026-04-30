const COLORS = [
  'bg-primary text-white',
  'bg-accent text-white',
  'bg-success text-white',
  'bg-error text-white',
  'bg-purple-500 text-white',
  'bg-teal-500 text-white',
]

export function Avatar({ initials, color = 1, size = 'md' }) {
  const cls = COLORS[(color - 1) % COLORS.length]
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' }
  return (
    <div className={`${cls} ${sizes[size]} rounded-full flex items-center justify-center font-semibold`}>
      {initials}
    </div>
  )
}