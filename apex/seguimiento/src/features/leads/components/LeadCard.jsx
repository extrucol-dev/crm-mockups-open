import { useDraggable } from '@dnd-kit/core'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/shared/components'
import { mocks } from '../mocks'

const ORIGEN_ICONS = {
  1: 'globe',
  2: 'envelope',
  3: 'chartBar',
  4: 'sparkles',
  5: 'phone',
  6: 'user',
  7: 'star',
}

function resolveOrigenLabel(id_origen_lead) {
  const item = mocks.catalogos.origenes.find(o => o.id_origen_lead === id_origen_lead)
  return item ? item.nombre : '—'
}

function resolveEmpresaLabel(nombre_empresa) {
  return nombre_empresa || '—'
}

function resolveInteresLabels(intereses) {
  if (!intereses || !intereses.length) return []
  return intereses.map(i => {
    if (typeof i === 'object' && i.id_interes) {
      const item = mocks.catalogos.intereses.find(x => x.id_interes === i.id_interes)
      return item ? item.nombre : `Interés #${i.id_interes}`
    }
    return i
  })
}

export function LeadCard({ lead, overlay }) {
  const navigate = useNavigate()
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id_lead,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  const origenLabel = resolveOrigenLabel(lead.id_origen_lead)
  const origenIcon = ORIGEN_ICONS[lead.id_origen_lead] || 'globe'
  const empresaLabel = resolveEmpresaLabel(lead.nombre_empresa)
  const interesLabels = resolveInteresLabels(lead.intereses)
  const avatar = lead.avatar || (empresaLabel.substring(0, 2).toUpperCase())

  const handleClick = (e) => {
    if (!overlay && !isDragging) {
      navigate(`/ejecutivo/leads/${lead.id_lead}`)
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
        hover:border-primary hover:shadow-md
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Icon name={origenIcon} size={13} className="text-gray-400" />
          <span className="text-[10.5px] font-bold uppercase tracking-wide text-gray-400">
            {origenLabel}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-0.5 -mr-1 -mt-0.5">
          <Icon name="dots" size={16} />
        </button>
      </div>

      <div>
        <p className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2">
          {lead.titulo}
        </p>
        <p className="text-[11.5px] text-gray-500 mt-0.5">{empresaLabel}</p>
      </div>

      {interesLabels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {interesLabels.slice(0, 3).map((label, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div
            className={`
              w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white
              bg-primary
            `}
          >
            {avatar}
          </div>
          <span className="flex items-center gap-1 text-[11px] font-bold text-accent">
            <Icon name="fire" size={12} />
            {lead.score}%
          </span>
        </div>
        <span className="text-[10.5px] text-gray-400">{lead.age}</span>
      </div>
    </div>
  )
}