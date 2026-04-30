import { useState } from 'react'
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core'
import { COLUMNAS_KANBAN } from '../mocks'
import { LeadCard } from './LeadCard'

function KanbanColumn({ col, leads, onDragEnd }) {
  return (
    <div
      id={col.id}
      className="bg-gray-50 rounded-lg p-3 min-h-[400px] flex flex-col"
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: col.color }} />
        <span className="text-sm font-semibold text-gray-700">{col.label}</span>
        <span className="text-xs text-gray-400 ml-auto">{leads.length}</span>
      </div>
      <div className="flex-1 space-y-2">
        {leads.length === 0 && (
          <div className="text-center text-gray-400 text-xs py-8">Sin leads</div>
        )}
        {leads.map(lead => (
          <LeadCard key={lead.id_lead} lead={lead} />
        ))}
      </div>
    </div>
  )
}

export function LeadsKanban({ leads, onMover }) {
  const [activeId, setActiveId] = useState(null)
  const [activeLead, setActiveLead] = useState(null)

  const byEstado = COLUMNAS_KANBAN.reduce((acc, col) => {
    acc[col.id] = leads.filter(l => l.id_estado_lead === col.id)
    return acc
  }, {})

  const handleDragStart = ({ active }) => {
    setActiveId(active.id)
    setActiveLead(leads.find(l => l.id_lead == active.id))
  }

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      const leadId = Number(active.id)
      const newEstadoId = COLUMNAS_KANBAN.find(c => c.id === over.id)?.id
      if (newEstadoId) onMover(leadId, newEstadoId)
    }
    setActiveId(null)
    setActiveLead(null)
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-4 gap-4">
        {COLUMNAS_KANBAN.map(col => (
          <KanbanColumn
            key={col.id}
            col={col}
            leads={byEstado[col.id] || []}
          />
        ))}
      </div>
      <DragOverlay>
        {activeLead ? <LeadCard lead={activeLead} overlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}