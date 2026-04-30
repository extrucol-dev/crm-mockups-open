const variants = {
  prospecto:    'bg-blue-100 text-blue-700',
  calificacion: 'bg-green-100 text-green-700',
  propuesta:    'bg-purple-100 text-purple-700',
  negociacion:  'bg-orange-100 text-orange-700',
  ganada:       'bg-green-100 text-green-700',
  perdida:      'bg-red-100 text-red-700',
  info:         'bg-blue-100 text-blue-700',
  success:      'bg-green-100 text-green-700',
  error:        'bg-red-100 text-red-700',
  warning:      'bg-yellow-100 text-yellow-700',
  nuevo:        'bg-blue-100 text-blue-700',
  contactado:   'bg-yellow-100 text-yellow-700',
  interesado:   'bg-purple-100 text-purple-700',
  calificado:   'bg-green-100 text-green-700',
  descalificado:'bg-gray-100 text-gray-500',
}

export function Badge({ children, variant = 'info' }) {
  const cls = variants[variant] || 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {children}
    </span>
  )
}