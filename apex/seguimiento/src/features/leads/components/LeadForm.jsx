import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/shared/components'
import { mocks } from '../mocks'

const ORIGENES = mocks.catalogos.origenes.map(o => ({
  id: o.id_origen_lead,
  label: o.nombre,
  icon: { 1: 'globe', 2: 'envelope', 3: 'chartBar', 4: 'sparkles', 5: 'phone', 6: 'user', 7: 'star' }[o.id_origen_lead] || 'globe',
}))

const SCORES = mocks.catalogos.scores

export function LeadForm({ onSubmit, loading }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    score: 60,
    id_estado_lead: 1,
    id_origen_lead: 1,
    nombre_empresa: '',
    nombre_contacto: '',
    telefono_contacto: '',
    email_contacto: '',
    intereses: [],
    id_usuario: 1,
  })

  const toggleInteres = (id_interes) => {
    setForm(prev => ({
      ...prev,
      intereses: prev.intereses.includes(id_interes)
        ? prev.intereses.filter(i => i !== id_interes)
        : [...prev.intereses, id_interes],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const now = new Date().toISOString()
    const payload = {
      ...form,
      fecha_creacion: now,
      fecha_actualizacion: now,
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Icon name="funnel" size={16} className="text-primary" />
            Información básica
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
              Título del lead <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Un resumen breve de la necesidad del prospecto"
              value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
              Descripción
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              rows={3}
              placeholder="Detalles sobre la necesidad del cliente..."
              value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                Estado inicial
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                value={form.id_estado_lead}
                onChange={e => setForm(f => ({ ...f, id_estado_lead: Number(e.target.value) }))}
              >
                {mocks.catalogos.estados.map(est => (
                  <option key={est.id_estado_lead} value={est.id_estado_lead}>{est.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Icon name="globe" size={16} className="text-primary" />
            Origen del lead
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-5 gap-2">
            {ORIGENES.map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => setForm(f => ({ ...f, id_origen_lead: o.id }))}
                className={`
                  flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all
                  ${form.id_origen_lead === o.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-primary/50'}
                `}
              >
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center
                  ${form.id_origen_lead === o.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}
                `}>
                  <Icon name={o.icon} size={16} />
                </div>
                <span className="text-[11.5px] font-semibold">{o.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Icon name="building" size={16} className="text-primary" />
            Empresa y contacto
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Nombre empresa</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="Nombre de la empresa"
                value={form.nombre_empresa}
                onChange={e => setForm(f => ({ ...f, nombre_empresa: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Nombre del contacto</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="Nombre del contacto"
                value={form.nombre_contacto}
                onChange={e => setForm(f => ({ ...f, nombre_contacto: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Teléfono</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="+57 300 000 0000"
                value={form.telefono_contacto}
                onChange={e => setForm(f => ({ ...f, telefono_contacto: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Email del contacto</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="cliente@empresa.com"
                value={form.email_contacto}
                onChange={e => setForm(f => ({ ...f, email_contacto: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Icon name="tag" size={16} className="text-primary" />
            Intereses
          </h3>
          <p className="text-xs text-gray-500 mt-1">Selecciona todos los productos o servicios de interés</p>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {mocks.catalogos.intereses.map(interes => (
              <button
                key={interes.id_interes}
                type="button"
                onClick={() => toggleInteres(interes.id_interes)}
                className={`
                  px-3 py-1.5 rounded-full border text-sm font-semibold transition-all
                  ${form.intereses.includes(interes.id_interes)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-primary/50'}
                `}
              >
                {form.intereses.includes(interes.id_interes) && '✓ '}
                {interes.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Icon name="fire" size={16} className="text-primary" />
            Scoring inicial
          </h3>
          <p className="text-xs text-gray-500 mt-1">Calificación prospectiva — ayuda a priorizar seguimiento</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-5 gap-2">
            {SCORES.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, score: s.value }))}
                className={`
                  relative flex flex-col items-center pt-4 pb-3 px-2 rounded-xl border transition-all
                  ${form.score === s.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50 hover:-translate-y-0.5'}
                `}
              >
                <div
                  className={`
                    absolute top-0 left-0 right-0 h-[3px] rounded-t-xl
                    ${s.value === 20 ? 'bg-blue-300' : ''}
                    ${s.value === 40 ? 'bg-indigo-300' : ''}
                    ${s.value === 60 ? 'bg-yellow-400' : ''}
                    ${s.value === 80 ? 'bg-orange-400' : ''}
                    ${s.value === 100 ? 'bg-green-400' : ''}
                  `}
                />
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold mb-1
                    ${s.value === 20 ? 'bg-blue-50 text-primary' : ''}
                    ${s.value === 40 ? 'bg-indigo-50 text-indigo-600' : ''}
                    ${s.value === 60 ? 'bg-yellow-50 text-amber-700' : ''}
                    ${s.value === 80 ? 'bg-orange-50 text-orange-600' : ''}
                    ${s.value === 100 ? 'bg-green-50 text-green-700' : ''}
                  `}
                >
                  {s.value}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-gray-700">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pb-4">
        <button
          type="button"
          onClick={() => navigate('/ejecutivo/leads')}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {loading ? 'Guardando...' : (
            <><Icon name="check" size={16} /> Guardar lead</>
          )}
        </button>
      </div>
    </form>
  )
}