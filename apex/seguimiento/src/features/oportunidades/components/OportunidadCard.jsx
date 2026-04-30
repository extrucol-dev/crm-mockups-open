import { useDraggable } from '@dnd-kit/core'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/shared/components'
import { ESTADO_LABELS } from '../mocks'
import { fmtCompact } from '@/shared/utils/format'

export function OportunidadCard({ oportunidad, overlay, isDropDisabled }) {
  const navigate = useNavigate()
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: oportunidad.id_oportunidad,
    disabled: isDropDisabled,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  const estado = ESTADO_LABELS[oportunidad.id_estado_oportunidad] || {}
  const variantMap = {
    PROSPECTO: 'prospecto',
    CALIFICACION: 'calificacion',
    PROPUESTA: 'propuesta',
    NEGOCIACION: 'negociacion',
    GANADA: 'ganada',
    PERDIDA: 'perdida',
  }
  const variant = variantMap[oportunidad.id_estado_oportunidad] || 'info'

  const handleClick = (e) => {
    if (!overlay && !isDragging) {
      navigate(`/ejecutivo/oportunidades/${oportunidad.id_oportunidad}`)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`
        bg-white rounded-xl border border-gray-200 p-3.5 shadow-card cursor-grab active:cursor-grabbing
        flex flex-col gap-2 transition-all
        ${isDragging && !overlay ? 'opacity-50' : ''}
        ${overlay ? 'shadow-modal rotate-3' : ''}
        ${isDropDisabled ? 'cursor-default' : 'hover:border-primary hover:shadow-md'}
      `}
    >
      <div className="flex flex-wrap gap-1.5 mb-1">
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
          variant === 'prospecto' ? 'bg-blue-100 text-blue-700' :
          variant === 'calificacion' ? 'bg-orange-100 text-orange-700' :
          variant === 'propuesta' ? 'bg-purple-100 text-purple-700' :
          variant === 'negociacion' ? 'bg-yellow-100 text-yellow-700' :
          variant === 'ganada' ? 'bg-green-100 text-green-700' :
          'bg-red-100 text-red-700'
        }`}>
          {estado.label}
        </span>
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">
          {oportunidad.sector}
        </span>
      </div>

      <p className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2">
        {oportunidad.titulo}
      </p>
      <p className="text-[11.5px] text-gray-500">{oportunidad.empresa}</p>

      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-accent">{fmtCompact(oportunidad.valor)}</span>
        <span className="text-[11px] text-gray-400 font-semibold">{oportunidad.prob}%</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="flex items-center gap-1 text-[10.5px] text-gray-400">
          <Icon name="calendar" size={11} /> {oportunidad.fecha}
        </span>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-primary`}>
          {oportunidad.avatar}
        </div>
      </div>
    </div>
  )
}