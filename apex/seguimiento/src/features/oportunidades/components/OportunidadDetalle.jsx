import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, Badge, Avatar } from '@/shared/components'
import { Modal } from '@/shared/components'
import { fmtCurrency } from '@/shared/utils/format'
import { ESTADO_LABELS } from '../mocks'

function EditarOportunidadModal({ opp, open, onClose, onSave }) {
  const [form, setForm] = useState({
    titulo: opp?.titulo || '',
    id_tipo_oportunidad: opp?.tipo || 'Suministro directo',
    id_sector: opp?.sector || 'Agua potable',
    descripcion: opp?.descripcion || '',
    empresa: opp?.empresa || '',
    ciudad: opp?.ciudad || '',
    valor: opp?.valor || '',
    fecha_cierre_estimada: opp?.fecha_cierre || '',
    probabilidad: opp?.prob || 50,
  })

  const handleSave = () => {
    onSave(form)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Editar oportunidad">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Título *</label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            value={form.titulo}
            onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Tipo</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" value={form.id_tipo_oportunidad} onChange={e => setForm(f => ({ ...f, id_tipo_oportunidad: e.target.value }))}>
              <option>Licitación pública</option><option>Suministro directo</option><option>Proyecto a medida</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Sector</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" value={form.id_sector} onChange={e => setForm(f => ({ ...f, id_sector: e.target.value }))}>
              <option>Agua potable</option><option>Gas natural</option><option>Agricultura / Riego</option><option>Industria</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Valor (COP)</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Fecha cierre</label>
            <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={form.fecha_cierre_estimada} onChange={e => setForm(f => ({ ...f, fecha_cierre_estimada: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Probabilidad (%)</label>
            <input type="number" min="0" max="100" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={form.probabilidad} onChange={e => setForm(f => ({ ...f, probabilidad: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Ciudad</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" value={form.ciudad} onChange={e => setForm(f => ({ ...f, ciudad: e.target.value }))}>
              <option>Bogotá</option><option>Medellín</option><option>Piedecuesta</option><option>Cartagena</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Descripción</label>
          <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none" rows={2} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">Cancelar</button>
        <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 flex items-center gap-2">
          <Icon name="check" size={16} /> Guardar cambios
        </button>
      </div>
    </Modal>
  )
}

function AvanzarEstadoModal({ opp, open, onClose, onAvanzar }) {
  const [id_estado, setIdEstado] = useState('NEGOCIACION')
  const [probabilidad, setProbabilidad] = useState(opp?.prob || 65)
  const [comentario, setComentario] = useState('')

  return (
    <Modal open={open} onClose={onClose} title="Avanzar estado">
      <div className="space-y-4">
        <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
          <Badge variant="propuesta">Propuesta</Badge>
          <span className="text-gray-400">→</span>
          <Badge variant="negociacion">Negociación</Badge>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Nuevo estado</label>
          <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" value={id_estado} onChange={e => setIdEstado(e.target.value)}>
            <option>NEGOCIACION</option><option>GANADA</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Probabilidad (%)</label>
          <input type="number" min="0" max="100" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={probabilidad} onChange={e => setProbabilidad(Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Comentario</label>
          <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none" rows={2} placeholder="..." value={comentario} onChange={e => setComentario(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">Cancelar</button>
        <button onClick={() => { onAvanzar(opp.id_oportunidad, id_estado, probabilidad, comentario); onClose() }} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 flex items-center gap-2">
          <Icon name="check" size={16} /> Confirmar
        </button>
      </div>
    </Modal>
  )
}

function CerrarGanadaModal({ opp, open, onClose, onCerrar }) {
  const [id_motivo, setIdMotivo] = useState(null)
  const [valor_final, setValorFinal] = useState(opp?.valor || '')
  const [observaciones, setObservaciones] = useState('')

  const motivos = [
    { id: 1, label: 'Adjudicación directa', desc: 'Cliente seleccionó a Extrucol como proveedor' },
    { id: 2, label: 'Licitación ganada', desc: 'Proceso competitivo favorable' },
    { id: 3, label: 'Mejor precio', desc: 'Cliente eligió por precio competitivo' },
  ]

  return (
    <Modal open={open} onClose={onClose} title="¡Oportunidad ganada!">
      <div className="space-y-4">
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="font-bold text-sm text-gray-900">{opp?.titulo}</div>
          <div className="text-xs text-gray-500 mt-0.5">{opp?.empresa} · {fmtCurrency(opp?.valor)}</div>
        </div>
        <div className="space-y-1.5">
          {motivos.map(m => (
            <button key={m.id} onClick={() => setIdMotivo(m.id)} className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left ${id_motivo === m.id ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${id_motivo === m.id ? 'border-green-500' : 'border-gray-300'}`}>
                {id_motivo === m.id && <div className="w-2 h-2 rounded-full bg-green-500" />}
              </div>
              <div><div className="text-sm font-semibold text-gray-900">{m.label}</div><div className="text-xs text-gray-500">{m.desc}</div></div>
            </button>
          ))}
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Valor final (COP)</label>
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={valor_final} onChange={e => setValorFinal(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Observaciones</label>
          <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none" rows={2} value={observaciones} onChange={e => setObservaciones(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">Cancelar</button>
        <button onClick={() => { onCerrar(opp.id_oportunidad, id_motivo, valor_final, observaciones); onClose() }} disabled={!id_motivo} className="px-4 py-2 text-sm font-medium text-white bg-success rounded-md hover:bg-success/90 disabled:opacity-60 flex items-center gap-2">
          <Icon name="check" size={16} /> Confirmar cierre
        </button>
      </div>
    </Modal>
  )
}

function CerrarPerdidaModal({ opp, open, onClose, onCerrar }) {
  const [id_motivo, setIdMotivo] = useState(null)
  const [observaciones, setObservaciones] = useState('La competencia ofreció un precio 12% menor con tiempos de entrega similares.')

  const motivos = [
    { id: 1, label: 'Precio no competitivo', desc: 'Cliente encontró mejor precio en competencia' },
    { id: 2, label: 'Competencia ganó licitação', desc: 'Otro proveedor fue adjudicado' },
    { id: 3, label: 'Cliente pospuso decisión', desc: 'Proyecto aplazado indefinidamente' },
    { id: 4, label: 'Requerimientos técnicos no coinciden', desc: 'No tenemos producto para esta necesidad' },
  ]

  return (
    <Modal open={open} onClose={onClose} title="Cerrar como perdida">
      <div className="space-y-4">
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="font-bold text-sm text-gray-900">{opp?.titulo}</div>
          <div className="text-xs text-gray-500 mt-0.5">{opp?.empresa} · {fmtCurrency(opp?.valor)}</div>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Motivo de pérdida <span className="text-red-500">*</span></div>
          <div className="space-y-1.5">
            {motivos.map(m => (
              <button key={m.id} onClick={() => setIdMotivo(m.id)} className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left ${id_motivo === m.id ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${id_motivo === m.id ? 'border-red-500' : 'border-gray-300'}`}>
                  {id_motivo === m.id && <div className="w-2 h-2 rounded-full bg-red-500" />}
                </div>
                <div><div className="text-sm font-semibold text-gray-900">{m.label}</div><div className="text-xs text-gray-500">{m.desc}</div></div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Observaciones detalladas <span className="text-red-500">*</span></label>
          <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none" rows={3} value={observaciones} onChange={e => setObservaciones(e.target.value)} />
        </div>
        <div className="p-3 bg-blue-50 rounded-lg flex gap-2">
          <Icon name="chartBar" size={14} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600">Los motivos de pérdida se analizan en los reportes del director para mejorar la estrategia.</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">Cancelar</button>
        <button onClick={() => { onCerrar(opp.id_oportunidad, id_motivo, observaciones); onClose() }} disabled={!id_motivo} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-60 flex items-center gap-2">
          <Icon name="xCircle" size={16} /> Confirmar cierre perdido
        </button>
      </div>
    </Modal>
  )
}

export function OportunidadDetalle({ opp, onActualizar }) {
  const navigate = useNavigate()
  const [showEditar, setShowEditar] = useState(false)
  const [showAvanzar, setShowAvanzar] = useState(false)
  const [showCerrarGanada, setShowCerrarGanada] = useState(false)
  const [showCerrarPerdida, setShowCerrarPerdida] = useState(false)
  const [showActividad, setShowActividad] = useState(false)
  const [showProducto, setShowProducto] = useState(false)

  if (!opp) return <div className="text-center text-gray-400 py-12">Cargando...</div>

  const estadoVariant = { PROSPECTO: 'prospecto', CALIFICACION: 'calificacion', PROPUESTA: 'propuesta', NEGOCIACION: 'negociacion', GANADA: 'ganada', PERDIDA: 'perdida' }[opp.id_estado_oportunidad] || 'info'
  const estadoLabel = { PROSPECTO: 'Prospección', CALIFICACION: 'Calificación', PROPUESTA: 'Propuesta', NEGOCIACION: 'Negociación', GANADA: 'Ganada', PERDIDA: 'Perdida' }[opp.id_estado_oportunidad] || opp.id_estado_oportunidad

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <button onClick={() => navigate('/ejecutivo/oportunidades')} className="text-primary hover:underline">Oportunidades</button>
          <span>/</span>
          <span>OPP-{opp.id_oportunidad}</span>
        </div>
        <div className="flex justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant={estadoVariant}>{estadoLabel}</Badge>
              <Badge variant="info">{opp.tipo}</Badge>
              <Badge variant="info">{opp.sector}</Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">{opp.titulo}</h1>
            <p className="text-sm text-gray-500 mt-1">{opp.empresa} · {opp.ciudad}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setShowEditar(true)} className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-1.5"><Icon name="pencil" size={15} /> Editar</button>
            <button onClick={() => setShowActividad(true)} className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-1.5"><Icon name="plus" size={15} /> Actividad</button>
            <button onClick={() => setShowAvanzar(true)} className="px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 flex items-center gap-1.5"><Icon name="arrowRight" size={15} /> Avanzar</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-8 mt-4 pt-4 border-t border-gray-100">
          <div><span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wide block">Valor estimado</span><span className="text-lg font-bold text-accent">{fmtCurrency(opp.valor)}</span></div>
          <div><span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wide block">Cierre estimado</span><span className="text-sm font-semibold text-gray-900">{opp.fecha_cierre}</span></div>
          <div><span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wide block">Ejecutivo</span><span className="text-sm font-semibold text-gray-900">Juan Pérez</span></div>
          <div><span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wide block">Probabilidad</span><span className="text-sm font-semibold text-gray-900">{opp.prob}%</span></div>
          <div><span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wide block">Edad</span><span className="text-sm font-semibold text-gray-900">{opp.edad}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4 min-w-0">
          {(opp.productos || []).length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                <div><h2 className="text-sm font-bold text-gray-900">Productos asociados</h2><p className="text-xs text-gray-400">{opp.productos.length} productos</p></div>
                <button onClick={() => setShowProducto(true)} className="px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20">+ Agregar</button>
              </div>
              <div className="divide-y divide-gray-100">
                {opp.productos.map(p => (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Icon name="archive" size={18} /></div>
                    <div className="flex-1"><div className="text-sm font-semibold text-gray-900">{p.nombre}</div><div className="text-xs text-gray-500">{p.tipo} · Presión {p.presion}</div></div>
                    {p.principal && <Badge variant="info">Principal</Badge>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(opp.actividades || []).length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-200"><h2 className="text-sm font-bold text-gray-900">Actividades recientes</h2></div>
              <div className="p-5 space-y-4">
                {opp.actividades.map(a => (
                  <div key={a.id} className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.estado === 'Completada' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <div className="flex items-center gap-2"><span className="text-sm font-semibold text-gray-900">{a.titulo}</span><span className="text-xs text-gray-400">{a.fecha}</span></div>
                      <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
                      <div className="flex gap-1.5 mt-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{a.tipo}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${a.estado === 'Completada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{a.estado}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(opp.historial || []).length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-200"><h2 className="text-sm font-bold text-gray-900">Historial de estados</h2></div>
              <div className="p-5 space-y-4">
                {opp.historial.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${i === 0 ? 'bg-primary' : 'bg-gray-300'}`} />
                    <div><div className="flex items-center gap-2"><span className="text-sm font-semibold text-gray-900">{h.estado}</span><span className="text-xs text-gray-400">{h.fecha}</span></div><p className="text-xs text-gray-500">{h.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200"><h2 className="text-sm font-bold text-gray-900">Empresa</h2></div>
            <div className="p-5">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-4">
                <Avatar initials={opp.avatar || '??'} color={opp.color || 1} size="lg" />
                <div><div className="font-bold text-sm text-gray-900">{opp.empresa}</div><div className="text-xs text-gray-400">Recurrente</div></div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Municipio</span><span className="font-medium text-gray-900">{opp.ciudad}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Departamento</span><span className="font-medium text-gray-900">Santander</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200"><h2 className="text-sm font-bold text-gray-900">Contacto</h2></div>
            <div className="p-5">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100 mb-3">
                <Avatar initials={opp.contacto_nombre?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??'} color={2} size="md" />
                <div><div className="font-bold text-sm text-gray-900">{opp.contacto_nombre}</div><div className="text-xs text-gray-500">{opp.contacto_rol}</div></div>
              </div>
              <div className="space-y-2 text-sm">
                <a className="flex items-center gap-2 text-primary" href={`tel:${opp.contacto_telefono}`}><Icon name="phone" size={14} /> {opp.contacto_telefono}</a>
                <a className="flex items-center gap-2 text-primary" href={`mailto:${opp.contacto_email}`}><Icon name="envelope" size={14} /> {opp.contacto_email}</a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200"><h2 className="text-sm font-bold text-gray-900">Cierre de oportunidad</h2></div>
            <div className="p-4 space-y-2">
              <button onClick={() => setShowCerrarGanada(true)} className="w-full px-3 py-2 text-sm font-medium text-white bg-success rounded-md hover:bg-success/90 flex items-center justify-center gap-2">
                <Icon name="check" size={15} /> Marcar como Ganada
              </button>
              <button onClick={() => setShowCerrarPerdida(true)} className="w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 flex items-center justify-center gap-2">
                <Icon name="xCircle" size={15} /> Marcar como Perdida
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditarOportunidadModal opp={opp} open={showEditar} onClose={() => setShowEditar(false)} onSave={onActualizar} />
      <AvanzarEstadoModal opp={opp} open={showAvanzar} onClose={() => setShowAvanzar(false)} onAvanzar={() => {}} />
      <CerrarGanadaModal opp={opp} open={showCerrarGanada} onClose={() => setShowCerrarGanada(false)} onCerrar={() => {}} />
      <CerrarPerdidaModal opp={opp} open={showCerrarPerdida} onClose={() => setShowCerrarPerdida(false)} onCerrar={() => {}} />
    </div>
  )
}