import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, Badge, Avatar } from '@/shared/components'
import { Modal } from '@/shared/components'
import { mocks } from '../mocks'

function EditarLeadModal({ lead, open, onClose, onSave }) {
  const [form, setForm] = useState({
    titulo: lead?.titulo || '',
    descripcion: lead?.descripcion || '',
    score: lead?.score || 60,
    id_estado_lead: lead?.id_estado_lead || 1,
    id_origen_lead: lead?.id_origen_lead || 1,
    nombre_empresa: lead?.nombre_empresa || '',
    nombre_contacto: lead?.nombre_contacto || '',
    telefono_contacto: lead?.telefono_contacto || '',
    email_contacto: lead?.email_contacto || '',
    intereses: lead?.intereses || [],
  })

  const toggleInteres = (id_interes) => {
    setForm(prev => ({
      ...prev,
      intereses: prev.intereses.includes(id_interes)
        ? prev.intereses.filter(i => i !== id_interes)
        : [...prev.intereses, id_interes],
    }))
  }

  const handleSave = () => {
    onSave(form)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Editar lead">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
            Título del lead <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            value={form.titulo}
            onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Descripción</label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            rows={3}
            value={form.descripcion}
            onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Estado</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
              value={form.id_estado_lead}
              onChange={e => setForm(f => ({ ...f, id_estado_lead: Number(e.target.value) }))}
            >
              {mocks.catalogos.estados.map(e => (
                <option key={e.id_estado_lead} value={e.id_estado_lead}>{e.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Origen</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
              value={form.id_origen_lead}
              onChange={e => setForm(f => ({ ...f, id_origen_lead: Number(e.target.value) }))}
            >
              {mocks.catalogos.origenes.map(o => (
                <option key={o.id_origen_lead} value={o.id_origen_lead}>{o.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Nombre empresa</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              value={form.nombre_empresa}
              onChange={e => setForm(f => ({ ...f, nombre_empresa: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Nombre contacto</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              value={form.nombre_contacto}
              onChange={e => setForm(f => ({ ...f, nombre_contacto: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Teléfono</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              value={form.telefono_contacto}
              onChange={e => setForm(f => ({ ...f, telefono_contacto: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              value={form.email_contacto}
              onChange={e => setForm(f => ({ ...f, email_contacto: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Icon name="fire" size={14} className="text-primary" /> Score
          </div>
          <div className="grid grid-cols-5 gap-2">
            {mocks.catalogos.scores.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, score: s.value }))}
                className={`
                  relative flex flex-col items-center pt-3 pb-2 px-1 rounded-lg border text-center transition-all text-xs
                  ${form.score === s.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
                `}
              >
                <div className={`text-sm font-extrabold ${form.score === s.value ? 'text-primary' : 'text-gray-700'}`}>{s.value}%</div>
                <div className="text-[10px] font-semibold text-gray-500">{s.label}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Icon name="tag" size={14} className="text-primary" /> Intereses
          </div>
          <div className="flex flex-wrap gap-2">
            {mocks.catalogos.intereses.map(interes => (
              <button
                key={interes.id_interes}
                type="button"
                onClick={() => toggleInteres(interes.id_interes)}
                className={`
                  px-2.5 py-1 rounded-full border text-xs font-semibold transition-all
                  ${form.intereses.some(i => i.id_interes === interes.id_interes) ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-600'}
                `}
              >
                {form.intereses.some(i => i.id_interes === interes.id_interes) ? '✓ ' : ''}{interes.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
          Cancelar
        </button>
        <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 flex items-center gap-2">
          <Icon name="check" size={16} /> Guardar cambios
        </button>
      </div>
    </Modal>
  )
}

function DescalificarLeadModal({ lead, open, onClose, onDescalificar }) {
  const [observaciones, setObservaciones] = useState('')
  const [id_motivo_descalificacion, setMotivo] = useState(null)

  const motivos = mocks.catalogos.motivos_descalificacion

  return (
    <Modal open={open} onClose={onClose} title="Descalificar lead">
      <div className="space-y-3">
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="font-bold text-sm text-gray-900">{lead?.titulo}</div>
          <div className="text-xs text-gray-500">{lead?.nombre_empresa || '—'} · Score {lead?.score}%</div>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
            Motivo de descalificación <span className="text-red-500">*</span>
          </div>
          <div className="space-y-1.5">
            {motivos.map(m => (
              <button
                key={m.id_motivo_descalificacion}
                onClick={() => setMotivo(m.id_motivo_descalificacion)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all
                  ${id_motivo_descalificacion === m.id_motivo_descalificacion ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-red-300'}
                `}
              >
                <div className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${id_motivo_descalificacion === m.id_motivo_descalificacion ? 'border-red-500' : 'border-gray-300'}
                `}>
                  {id_motivo_descalificacion === m.id_motivo_descalificacion && <div className="w-2 h-2 rounded-full bg-red-500" />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{m.nombre}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Observaciones</label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 resize-none"
            rows={2}
            placeholder="Detalles adicionales..."
            value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
          Cancelar
        </button>
        <button
          onClick={() => { onDescalificar(lead.id_lead, id_motivo_descalificacion, observaciones); onClose() }}
          disabled={!id_motivo_descalificacion}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-60 flex items-center gap-2"
        >
          <Icon name="xCircle" size={16} /> Descalificar
        </button>
      </div>
    </Modal>
  )
}

export function LeadDetalle({ lead, onActualizar }) {
  const navigate = useNavigate()
  const [showEditar, setShowEditar] = useState(false)
  const [showDescalificar, setShowDescalificar] = useState(false)
  const [showConvertir, setShowConvertir] = useState(false)

  if (!lead) return <div className="text-center text-gray-400 py-12">Cargando...</div>

  const estadoItem = mocks.catalogos.estados.find(e => e.id_estado_lead === lead.id_estado_lead)
  const origenItem = mocks.catalogos.origenes.find(o => o.id_origen_lead === lead.id_origen_lead)

  const estadoVariant = {
    1: 'nuevo',
    2: 'info',
    3: 'interesado',
    4: 'calificado',
    5: 'descalificado',
  }[lead.id_estado_lead] || 'info'

  const interesLabels = (lead.intereses || []).map(i => {
    if (typeof i === 'object' && i.id_interes) {
      const item = mocks.catalogos.intereses.find(x => x.id_interes === i.id_interes)
      return item ? item.nombre : `Interés #${i.id_interes}`
    }
    return i
  })

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <button onClick={() => navigate('/ejecutivo/leads')} className="text-primary hover:underline">Leads</button>
          <span>/</span>
          <span>LEAD-{lead.id_lead}</span>
        </div>
        <div className="flex justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant={estadoVariant}>{estadoItem?.nombre || lead.id_estado_lead}</Badge>
              <Badge variant="info">{origenItem?.nombre || '—'}</Badge>
              <Badge variant="warning">
                <Icon name="fire" size={12} /> Score {lead.score}%
              </Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">{lead.titulo}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {lead.nombre_empresa || '—'} · Recibido hace {lead.age} · Asesor: Paola
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setShowEditar(true)} className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-1.5">
              <Icon name="pencil" size={15} /> Editar
            </button>
            <button onClick={() => setShowDescalificar(true)} className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 flex items-center gap-1.5">
              <Icon name="xCircle" size={15} /> Descalificar
            </button>
            <button onClick={() => setShowConvertir(true)} className="px-3 py-1.5 text-sm font-medium text-white bg-success rounded-md hover:bg-success/90 flex items-center gap-1.5">
              <Icon name="arrowRight" size={15} /> Convertir
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-900">Descripción e intereses</h2>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {lead.descripcion || 'Sin descripción registrada.'}
              </p>
              <div className="border-t border-gray-100 pt-3">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Intereses</div>
                <div className="flex flex-wrap gap-2">
                  {interesLabels.map((label, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full flex items-center gap-1">
                      <Icon name="tag" size={11} /> {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {(lead.actividades || []).length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Actividades</h2>
                  <p className="text-xs text-gray-400">{lead.actividades.length} registradas</p>
                </div>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <Icon name="plus" size={16} />
                </button>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  {lead.actividades.map(act => (
                    <div key={act.id} className="flex gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${act.estado === 'Completada' ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900">{act.titulo}</span>
                          <span className="text-xs text-gray-400">{act.fecha}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{act.desc}</p>
                        <div className="flex gap-1.5 mt-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{act.tipo}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${act.estado === 'Completada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {act.estado}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(lead.historial || []).length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-sm font-bold text-gray-900">Historial de estados</h2>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  {lead.historial.map((h, i) => {
                    const estadoAnt = mocks.catalogos.estados.find(e => e.id_estado_lead === h.id_estado_anterior)
                    const estadoNuevo = mocks.catalogos.estados.find(e => e.id_estado_lead === h.id_estado_nuevo)
                    const fechaStr = h.fecha_cambio ? new Date(h.fecha_cambio).toLocaleDateString('es-CO') : h.fecha
                    return (
                      <div key={i} className="flex gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${i === 0 ? 'bg-primary' : 'bg-gray-300'}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {estadoNuevo?.nombre || h.id_estado_nuevo}
                              {estadoAnt && ` (desde ${estadoAnt.nombre})`}
                            </span>
                            <span className="text-xs text-gray-400">{fechaStr}</span>
                          </div>
                          {h.comentario && <p className="text-xs text-gray-500 mt-0.5">{h.comentario}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-900">Información de contacto</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar initials={(lead.nombre_contacto || '??').substring(0, 2).toUpperCase()} color={lead.color || 1} size="md" />
                <span className="font-bold text-sm text-gray-900">{lead.nombre_contacto || 'N/A'}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon name="building" size={14} /> {lead.nombre_empresa || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon name="phone" size={14} /> {lead.telefono_contacto || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon name="envelope" size={14} /> {lead.email_contacto || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-900">Información</h2>
            </div>
            <div className="p-5">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Origen</dt><dd className="font-medium text-gray-900">{origenItem?.nombre || '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Empresa</dt><dd className="font-medium text-gray-900">{lead.nombre_empresa || 'N/A'}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Score</dt><dd className="font-bold text-accent">{lead.score}%</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Edad</dt><dd className="font-medium text-gray-900">{lead.age}</dd></div>
              </dl>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-900">Acciones</h2>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => setShowConvertir(true)}
                className="w-full px-3 py-2 text-sm font-medium text-white bg-success rounded-md hover:bg-success/90 flex items-center justify-center gap-2"
              >
                <Icon name="arrowRight" size={15} /> Convertir a oportunidad
              </button>
              <button
                onClick={() => setShowDescalificar(true)}
                className="w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 flex items-center justify-center gap-2"
              >
                <Icon name="xCircle" size={15} /> Descalificar lead
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditarLeadModal lead={lead} open={showEditar} onClose={() => setShowEditar(false)} onSave={onActualizar} />
      <DescalificarLeadModal lead={lead} open={showDescalificar} onClose={() => setShowDescalificar(false)} onDescalificar={() => {}} />
      {showConvertir && (
        <LeadConversionModal
          lead={lead}
          open={showConvertir}
          onClose={() => setShowConvertir(false)}
        />
      )}
    </div>
  )
}

function LeadConversionModal({ lead, open, onClose }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    titulo: lead?.titulo ? `Contrato #${lead.id_empresa} - ${lead.titulo}` : '',
    id_tipo_oportunidad: 1,
    id_sector: 1,
    descripcion: lead?.descripcion || '',
    id_empresa: lead?.id_empresa || null,
    id_contacto: lead?.id_contacto || null,
    id_usuario: 1,
    id_lead_origen: lead?.id_lead || null,
    valor_estimado: '',
    fecha_cierre_estimada: '',
    probabilidad_cierre: 65,
    id_estado_oportunidad: 1,
  })

  const TIPOS = [{ id: 1, nombre: 'Licitación pública' }, { id: 2, nombre: 'Suministro directo' }, { id: 3, nombre: 'Proyecto a medida' }, { id: 4, nombre: 'Contrato marco' }]
  const SECTORES = [{ id: 1, nombre: 'Agua potable' }, { id: 2, nombre: 'Gas natural' }, { id: 3, nombre: 'Agricultura / Riego' }, { id: 4, nombre: 'Industria' }]

  return (
    <Modal open={open} onClose={onClose} title="Convertir a oportunidad">
      <div className="space-y-4">
        <div className="p-3 bg-primary/5 border border-dashed border-primary rounded-lg">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
            <Icon name="funnel" size={12} /> Lead origen
          </div>
          <div className="font-bold text-sm text-gray-900">{lead?.titulo}</div>
          <div className="text-xs text-gray-500">{lead?.nombre_empresa || '—'} · Score {lead?.score}%</div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
            Título de la oportunidad <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            value={form.titulo}
            onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Tipo</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
              value={form.id_tipo_oportunidad}
              onChange={e => setForm(f => ({ ...f, id_tipo_oportunidad: Number(e.target.value) }))}
            >
              {TIPOS.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Sector</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
              value={form.id_sector}
              onChange={e => setForm(f => ({ ...f, id_sector: Number(e.target.value) }))}
            >
              {SECTORES.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Valor estimado (COP)</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              value={form.valor_estimado}
              onChange={e => setForm(f => ({ ...f, valor_estimado: e.target.value }))}
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
        </div>

        <div className="p-3 bg-blue-50 rounded-lg flex gap-2">
          <Icon name="sparkles" size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600">
            Se creará una nueva oportunidad y este lead pasará a estado <strong>Interesado</strong>.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
          Cancelar
        </button>
        <button
          onClick={() => { onClose(); navigate(`/ejecutivo/oportunidades/${Date.now()}`) }}
          className="px-4 py-2 text-sm font-medium text-white bg-success rounded-md hover:bg-success/90 flex items-center gap-2"
        >
          <Icon name="check" size={16} /> Convertir a oportunidad
        </button>
      </div>
    </Modal>
  )
}