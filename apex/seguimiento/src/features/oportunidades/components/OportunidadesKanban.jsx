import { useState } from 'react'
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core'
import { COLUMNAS_KANBAN } from '../mocks'
import { OportunidadCard } from './OportunidadCard'

function OportunidadColumn({ col, oportunidades, isDropDisabled }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 min-h-[400px] flex flex-col">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: col.color }} />
        <span className="text-sm font-semibold text-gray-700">{col.label}</span>
        <span className="text-xs text-gray-400 ml-auto">{oportunidades.length}</span>
      </div>
      <div className="flex-1 space-y-2">
        {oportunidades.length === 0 && (
          <div className="text-center text-gray-400 text-xs py-8">Sin oportunidades</div>
        )}
        {oportunidades.map(opp => (
          <OportunidadCard key={opp.id_oportunidad} oportunidad={opp} isDropDisabled={isDropDisabled} />
        ))}
      </div>
    </div>
  )
}

export function OportunidadesKanban({ oportunidades, onMover }) {
  const [activeId, setActiveId] = useState(null)
  const [activeOpp, setActiveOpp] = useState(null)

  const byEstado = COLUMNAS_KANBAN.reduce((acc, col) => {
    acc[col.id] = oportunidades.filter(o => o.id_estado_oportunidad === col.id)
    return acc
  }, {})

  const handleDragStart = ({ active }) => {
    setActiveId(active.id)
    setActiveOpp(oportunidades.find(o => o.id_oportunidad == active.id))
  }

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      const oppId = Number(active.id)
      const newEstado = COLUMNAS_KANBAN.find(c => c.id === over.id)?.id
      if (newEstado) onMover(oppId, newEstado)
    }
    setActiveId(null)
    setActiveOpp(null)
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-6 gap-4 overflow-x-auto">
        {COLUMNAS_KANBAN.map(col => (
          <OportunidadColumn
            key={col.id}
            col={col}
            oportunidades={byEstado[col.id] || []}
            isDropDisabled={col.id === 'GANADA' || col.id === 'PERDIDA'}
          />
        ))}
      </div>
      <DragOverlay>
        {activeOpp ? <OportunidadCard oportunidad={activeOpp} overlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}