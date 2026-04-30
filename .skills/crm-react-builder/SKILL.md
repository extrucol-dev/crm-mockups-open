---
name: crm-react-builder
description: >-
  CRM Extrucol React feature builder. SIEMPRE USA cuando: crear feature, agregar página,
  construir componente, implementar hook, escribir service, configurar ruta, hacer kanban,
  agregar gráfica, construir modal, migrar mockup HTML a React. Proyecto en
  Desktop/crm-desarollo/front/crm_extrucol/. Trigger on: "nueva feature", "nueva página",
  "componente de", "hook para", "service para", "ruta de", "migrar", "implementar",
  "kanban", "drag", "gráfica", "chart", "modal", "formulario React".
---

# CRM Extrucol — React Feature Builder

Construye features completas para el CRM Extrucol React app.

**Proyecto:** `c:\Users\PRACT.SISTEMAS\Desktop\crm-desarollo\front\crm_extrucol\`
**Stack:** React 18 · React Router DOM 6 · Tailwind 3 · @dnd-kit/core · Chart.js · Axios

---

## Anatomía de un Feature

```
src/features/{nombre}/
├── components/          ← UI components (cards, tablas, modales internos)
├── hooks/               ← useState + llamadas a services
├── pages/               ← Route components (montan hooks + renderizan)
└── services/            ← Llamadas a callProcess o API (abstractas)
```

Regla: pages importan hooks. hooks importan services. components reciben props. **Nunca** features importan de otras features — solo de `@/shared/`.

---

## Tokens Tailwind (tailwind.config.js)

```
bg-primary       → #24388C    text-primary
bg-accent        → #F39610    text-accent
bg-success       → #1A8754    text-success
bg-error         → #C0392B    text-error
shadow-card      → sombra sutil de tarjeta
shadow-modal     → sombra de modal
rounded-sm/md/lg → 6/8/12px
font-sans        → Roboto
```

---

## Service Pattern (callProcess + mock)

**`src/shared/apex/apexClient.js`** es el cliente base. Cada feature tiene su propio service:

```js
// features/leads/services/leadsService.js
import { callProcess, USE_MOCKS } from '@/shared/apex/apexClient'
import { unwrap } from '@/shared/utils/dataUtils'
import { MOCKS } from './mocks'

export const leadsService = {
  list: (params = {}) =>
    USE_MOCKS
      ? Promise.resolve(MOCKS.leads)
      : callProcess('LEADS_LIST', params).then(unwrap),

  get: (id) =>
    USE_MOCKS
      ? Promise.resolve(MOCKS.leads.find(l => l.id_lead == id))
      : callProcess('LEADS_GET', { x01: id }).then(unwrap),

  create: (data) =>
    USE_MOCKS
      ? Promise.resolve({ id_lead: Date.now(), success: true })
      : callProcess('LEADS_CREATE', {
          x01: data.titulo, x02: data.descripcion,
          x03: data.score,  x04: data.id_estado_lead,
          x05: data.id_origen_lead,
        }).then(r => r),

  update: (id, data) =>
    USE_MOCKS
      ? Promise.resolve({ success: true })
      : callProcess('LEADS_UPDATE', { x01: id, ...mapParams(data) }).then(r => r),
}
```

**`callProcess` firma:**
```js
callProcess(processName, extras = {})
// POST /apex/wwv_flow.ajax
// p_request=APPLICATION_PROCESS={processName}
// x01..xN = extras
// credentials: 'include'
```

---

## Hook Pattern

```js
// features/leads/hooks/useLeads.js
import { useState, useEffect } from 'react'
import { leadsService } from '../services/leadsService'

export function useLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const data = await leadsService.list()
      setLeads(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const createLead = async (data) => {
    await leadsService.create(data)
    await load()   // recarga la lista
  }

  return { leads, loading, error, createLead, reload: load }
}
```

**Hook para detalle con AbortController:**
```js
export function useLeadDetalle(id) {
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    leadsService.get(id).then(setLead).finally(() => setLoading(false))
    return () => controller.abort()
  }, [id])

  return { lead, loading }
}
```

---

## Page Pattern

```jsx
// features/leads/pages/LeadsKanbanPage.jsx
import { useLeads } from '../hooks/useLeads'
import { LeadsKanban } from '../components/LeadsKanban'

export default function LeadsKanbanPage() {
  const { leads, loading, createLead } = useLeads()

  if (loading) return <div className="flex-1 flex items-center justify-center text-gray-400">Cargando...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
        <button onClick={() => /* navigate */} className="btn-primary">Nuevo lead</button>
      </div>
      <LeadsKanban leads={leads} />
    </div>
  )
}
```

---

## Kanban con @dnd-kit

```jsx
// features/leads/components/LeadsKanban.jsx
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core'
import { useState } from 'react'

const COLUMNAS = ['Nuevo', 'Contactado', 'Interesado', 'Calificado', 'Descalificado']

export function LeadsKanban({ leads, onMover }) {
  const [activeId, setActiveId] = useState(null)

  const byEstado = COLUMNAS.reduce((acc, est) => {
    acc[est] = leads.filter(l => l.estado === est)
    return acc
  }, {})

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      onMover(active.id, over.id)   // over.id = nombre de columna (droppable id)
    }
    setActiveId(null)
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-5 gap-4 overflow-x-auto">
        {COLUMNAS.map(col => (
          <KanbanColumn key={col} id={col} title={col} leads={byEstado[col]} />
        ))}
      </div>
      <DragOverlay>
        {activeId ? <LeadCard lead={leads.find(l => l.id_lead == activeId)} overlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}

// KanbanColumn: useDroppable({ id })
import { useDroppable } from '@dnd-kit/core'
function KanbanColumn({ id, title, leads }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-50 rounded-lg p-3 min-h-[400px] transition-colors ${isOver ? 'bg-blue-50 ring-2 ring-primary/30' : ''}`}
    >
      <h3 className="text-sm font-semibold text-gray-500 mb-3">{title} <span className="ml-1 text-gray-400">{leads.length}</span></h3>
      <div className="space-y-2">
        {leads.map(lead => <LeadCard key={lead.id_lead} lead={lead} />)}
      </div>
    </div>
  )
}

// LeadCard: useDraggable({ id })
import { useDraggable } from '@dnd-kit/core'
function LeadCard({ lead, overlay }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id_lead })
  const style = transform ? { transform: `translate(${transform.x}px,${transform.y}px)` } : undefined
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white rounded-md p-3 shadow-card cursor-grab active:cursor-grabbing ${isDragging && !overlay ? 'opacity-40' : ''}`}
    >
      <p className="text-sm font-medium text-gray-900 line-clamp-2">{lead.titulo}</p>
      <p className="text-xs text-gray-500 mt-1">{lead.empresa}</p>
    </div>
  )
}
```

---

## Chart.js Pattern

```jsx
// Registro mínimo — solo los elementos que usa el chart
import { Bar } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export function PipelineBarChart({ data }) {
  const config = {
    labels: data.map(d => d.estado),
    datasets: [{
      label: 'Valor (COP)',
      data: data.map(d => d.valor),
      backgroundColor: '#24388C',
      borderRadius: 6,
    }],
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,   // CRÍTICO: permite altura controlada por CSS
    plugins: { legend: { display: false } },
    scales: { y: { ticks: { callback: v => `$${(v/1e6).toFixed(0)}M` } } },
  }
  // SIEMPRE wrappear en div con altura fija — nunca height="100%" en flex/grid
  return (
    <div className="relative h-[280px]">
      <Bar data={config} options={options} />
    </div>
  )
}
```

**Tipos de chart disponibles:** `Bar`, `Line`, `Doughnut`, `Pie` — misma estructura.

---

## Modal Pattern

```jsx
// shared/components/Modal.jsx
import { createPortal } from 'react-dom'

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-lg shadow-modal w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t flex justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}
```

**Uso en un componente:**
```jsx
const [showModal, setShowModal] = useState(false)
<button onClick={() => setShowModal(true)}>Abrir</button>
<Modal open={showModal} onClose={() => setShowModal(false)} title="Nuevo Lead"
  footer={<><button onClick={() => setShowModal(false)}>Cancelar</button><button>Guardar</button></>}>
  <form>...</form>
</Modal>
```

---

## Agregar una ruta

En `src/router/index.jsx` (o donde estén las rutas del rol correspondiente):
```jsx
import LeadsKanbanPage from '@/features/leads/pages/LeadsKanbanPage'
// Dentro del children del EjecutivoLayout:
{ path: 'leads', element: <LeadsKanbanPage /> },
{ path: 'leads/:id', element: <LeadDetallePage /> },
```

---

## Datos Mock

```js
// features/leads/services/mocks.js
export const MOCKS = {
  leads: [
    { id_lead: 1, titulo: 'Tubería industrial Acme', estado: 'Interesado',
      empresa: 'Acme S.A.S', score: 60, origen: 'Web', fecha_creacion: '2026-04-15' },
    { id_lead: 2, titulo: 'Proyecto riego norte', estado: 'Nuevo',
      empresa: 'AgroSur Ltda', score: 40, origen: 'Email', fecha_creacion: '2026-04-20' },
    // ... copiar datos de los HTML mockups
  ],
}
```

---

## Colores de estado (Badge)

| Estado lead | Tailwind |
|---|---|
| Nuevo | `bg-blue-100 text-blue-700` |
| Contactado | `bg-yellow-100 text-yellow-700` |
| Interesado | `bg-purple-100 text-purple-700` |
| Calificado | `bg-green-100 text-green-700` |
| Descalificado | `bg-gray-100 text-gray-500` |

| Estado oportunidad | Tailwind |
|---|---|
| Prospección | `bg-blue-100 text-blue-700` |
| Propuesta | `bg-purple-100 text-purple-700` |
| Negociación | `bg-orange-100 text-orange-700` |
| Ganada | `bg-green-100 text-green-700` |
| Perdida | `bg-red-100 text-red-700` |

---

## Referencia de mockups

Los HTML de referencia están en `crm-mockups-open/`:
- `ejecutivo/` — 18 páginas del ejecutivo comercial
- `coordinador/` — 10 páginas del coordinador
- `director/` — 8 páginas del director
- `admin/` — 3 páginas del administrador
