import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/shared/components'
import { mocks } from '../mocks'

const TIPOS = mocks.catalogos.tipos
const SECTORES = mocks.catalogos.sectores
const ESTADOS = mocks.catalogos.estados.slice(0, 4)

export function OportunidadForm({ onSubmit, loading }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    titulo: '',
    id_tipo_oportunidad: 'Suministro directo',
    id_sector: 'Agua potable',
    descripcion: '',
    empresa: '',
    id_contacto: '',
    ciudad: '',
    id_lead_origen: '',
    valor: '',
    fecha_cierre_estimada: '',
    probabilidad: 50,
    id_ejecutivo: 1,
    id_estado_oportunidad: 'PROSPECTO',
    productos: [],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Icon name="briefcase" size={16} className="text-primary" />
            Información básica
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
              Título de la oportunidad <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Describe brevemente la oportunidad de negocio"
              value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Tipo</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                value={form.id_tipo_oportunidad}
                onChange={e => setForm(f => ({ ...f, id_tipo_oportunidad: e.target.value }))}
              >
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Sector</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                value={form.id_sector}
                onChange={e => setForm(f => ({ ...f, id_sector: e.target.value }))}
              >
                {SECTORES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Descripción</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              rows={3}
              placeholder="Detalles de la oportunidad..."
              value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
            />
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
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Empresa <span className="text-red-500">*</span></label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Nombre de la empresa"
              value={form.empresa}
              onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Ciudad</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                value={form.ciudad}
                onChange={e => setForm(f => ({ ...f, ciudad: e.target.value }))}
              >
                <option>Bogotá</option>
                <option>Medellín</option>
                <option>Cartagena</option>
                <option>Barranquilla</option>
                <option>Piedecuesta</option>
                <option>Bucaramanga</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Estado</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                value={form.id_estado_oportunidad}
                onChange={e => setForm(f => ({ ...f, id_estado_oportunidad: e.target.value }))}
              >
                {ESTADOS.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Icon name="currency" size={16} className="text-primary" />
            Valores y fechas
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Valor estimado (COP)</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="$ 0"
                value={form.valor}
                onChange={e => setForm(f => ({ ...f, valor: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Fecha cierre estimada</label>
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
                value={form.probabilidad}
                onChange={e => setForm(f => ({ ...f, probabilidad: Number(e.target.value) }))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pb-4">
        <button
          type="button"
          onClick={() => navigate('/ejecutivo/oportunidades')}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {loading ? 'Guardando...' : <><Icon name="check" size={16} /> Guardar oportunidad</>}
        </button>
      </div>
    </form>
  )
}