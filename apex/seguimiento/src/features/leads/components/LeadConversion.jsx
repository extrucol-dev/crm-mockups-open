import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/shared/components'
import { Modal } from '@/shared/components'

const PASOS = ['Información básica', 'Oportunidad', 'Confirmación']

const TIPOS = [
  { id: 1, nombre: 'Licitación pública' },
  { id: 2, nombre: 'Suministro directo' },
  { id: 3, nombre: 'Proyecto a medida' },
  { id: 4, nombre: 'Contrato marco' },
]

const SECTORES = [
  { id: 1, nombre: 'Agua potable' },
  { id: 2, nombre: 'Gas natural' },
  { id: 3, nombre: 'Agricultura / Riego' },
  { id: 4, nombre: 'Industria' },
]

export function LeadConversion({ lead, onConvert }) {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(0)
  const [form, setForm] = useState({
    titulo: `Contrato ${lead?.nombre_empresa || ''} - ${lead?.titulo || ''}`,
    id_tipo_oportunidad: 1,
    id_sector: 1,
    descripcion: lead?.descripcion || '',
    nombre_empresa: lead?.nombre_empresa || '',
    valor_estimado: '',
    fecha_cierre_estimada: '',
    probabilidad_cierre: 65,
    id_usuario: 1,
    id_lead_origen: lead?.id_lead || null,
  })

  const siguiente = () => setPaso(p => Math.min(p + 1, 2))
  const anterior = () => setPaso(p => Math.max(p - 1, 0))

  const handleConvertir = () => {
    onConvert(form)
    navigate(`/ejecutivo/oportunidades/${Date.now()}`)
  }

  return (
    <Modal open={true} onClose={() => {}} title="Convertir a oportunidad">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          {PASOS.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${i <= paso ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}
              `}>
                {i < paso ? <Icon name="check" size={14} /> : i + 1}
              </div>
              <span className={`text-sm font-medium ${i <= paso ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
              {i < 2 && <div className={`w-8 h-0.5 mx-1 ${i < paso ? 'bg-primary' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="p-3 bg-primary/5 border border-dashed border-primary rounded-lg">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
            <Icon name="funnel" size={12} /> Lead origen
          </div>
          <div className="font-bold text-sm text-gray-900">{lead?.titulo}</div>
          <div className="text-xs text-gray-500">{lead?.nombre_empresa || '—'} · Score {lead?.score}%</div>
        </div>

        {paso === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Título de la oportunidad *</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                value={form.titulo}
                onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Tipo *</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                  value={form.id_tipo_oportunidad}
                  onChange={e => setForm(f => ({ ...f, id_tipo_oportunidad: Number(e.target.value) }))}
                >
                  {TIPOS.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Sector *</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                  value={form.id_sector}
                  onChange={e => setForm(f => ({ ...f, id_sector: Number(e.target.value) }))}
                >
                  {SECTORES.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Descripción</label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                rows={2}
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
              />
            </div>
          </div>
        )}

        {paso === 1 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Nombre empresa</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  value={form.nombre_empresa}
                  onChange={e => setForm(f => ({ ...f, nombre_empresa: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Valor estimado (COP) *</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  value={form.valor_estimado}
                  onChange={e => setForm(f => ({ ...f, valor_estimado: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Fecha cierre estimada *</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  value={form.fecha_cierre_estimada}
                  onChange={e => setForm(f => ({ ...f, fecha_cierre_estimada: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Probabilidad (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  value={form.probabilidad_cierre}
                  onChange={e => setForm(f => ({ ...f, probabilidad_cierre: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg flex gap-2">
              <Icon name="sparkles" size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600">
                Se creará una nueva oportunidad y este lead pasará a estado <strong>Interesado</strong>.
              </p>
            </div>
          </div>
        )}

        {paso === 2 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="arrowRight" size={28} className="text-success" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Confirmar conversión</h3>
              <p className="text-sm text-gray-500">¿Deseas convertir este lead en oportunidad comercial?</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Oportunidad</span><span className="font-medium text-gray-900">{form.titulo}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Empresa</span><span className="font-medium text-gray-900">{form.nombre_empresa || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tipo</span><span className="font-medium text-gray-900">{TIPOS.find(t => t.id === form.id_tipo_oportunidad)?.nombre}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Sector</span><span className="font-medium text-gray-900">{SECTORES.find(s => s.id === form.id_sector)?.nombre}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Valor estimado</span><span className="font-medium text-accent">{form.valor_estimado || 'N/A'}</span></div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={anterior}
            disabled={paso === 0}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-40 flex items-center gap-2"
          >
            <Icon name="chevronLeft" size={16} /> Anterior
          </button>
          {paso < 2 ? (
            <button
              onClick={siguiente}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 flex items-center gap-2"
            >
              Siguiente <Icon name="chevronRight" size={16} />
            </button>
          ) : (
            <button
              onClick={handleConvertir}
              className="px-4 py-2 text-sm font-medium text-white bg-success rounded-md hover:bg-success/90 flex items-center gap-2"
            >
              <Icon name="check" size={16} /> Convertir a oportunidad
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}