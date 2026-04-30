import { callProcess, USE_MOCKS } from '@/shared/apex/apexClient'
import { unwrap } from '@/shared/utils/dataUtils'
import { mocks } from './mocks'

export const leadsApi = {
  catalogos: () =>
    USE_MOCKS
      ? Promise.resolve(mocks.catalogos)
      : callProcess('LEADS_CATALOGOS').then(unwrap),

  list: (params) =>
    USE_MOCKS
      ? Promise.resolve(mocks.leads)
      : callProcess('LEADS_LIST', params).then(unwrap),

  get: (id) =>
    USE_MOCKS
      ? Promise.resolve(mocks.leadDetalle)
      : callProcess('LEADS_GET', { x01: id }).then(unwrap),

  create: (data) =>
    USE_MOCKS
      ? Promise.resolve({ id_lead: Date.now(), success: true })
      : callProcess('LEADS_CREATE', {
          x01: data.titulo,
          x02: data.descripcion,
          x03: data.score,
          x04: data.id_estado_lead,
          x05: data.id_origen_lead,
          x06: data.id_usuario,
          x07: data.nombre_empresa,
          x08: data.nombre_contacto,
          x09: data.telefono_contacto,
          x10: data.email_contacto,
          x11: data.fecha_creacion,
          x12: data.fecha_actualizacion,
        }).then(r => r),

  update: (id, data) =>
    USE_MOCKS
      ? Promise.resolve({ success: true })
      : callProcess('LEADS_UPDATE', {
          x01: id,
          x02: data.titulo,
          x03: data.descripcion,
          x04: data.score,
          x05: data.id_estado_lead,
          x06: data.id_origen_lead,
          x07: data.id_usuario,
          x08: data.nombre_empresa,
          x09: data.nombre_contacto,
          x10: data.telefono_contacto,
          x11: data.email_contacto,
          x12: data.fecha_actualizacion,
        }).then(r => r),

  descalificar: (id, id_motivo_descalificacion, motivo_descalificacion_obs) =>
    USE_MOCKS
      ? Promise.resolve({ success: true })
      : callProcess('LEADS_DESCALIFICAR', {
          x01: id,
          x02: id_motivo_descalificacion,
          x03: motivo_descalificacion_obs,
        }).then(r => r),

  convertir: (id_lead, data) =>
    USE_MOCKS
      ? Promise.resolve({ id_oportunidad: Date.now(), success: true })
      : callProcess('LEADS_CONVERTIR', {
          x01: id_lead,
          x02: data.titulo,
          x03: data.id_tipo_oportunidad,
          x04: data.id_sector,
          x05: data.descripcion,
          x06: data.id_empresa,
          x07: data.id_contacto,
          x08: data.id_usuario,
          x09: data.valor_estimado,
          x10: data.fecha_cierre_estimada,
          x11: data.probabilidad_cierre,
          x12: data.id_estado_oportunidad,
          x13: data.id_lead_origen,
        }).then(r => r),

  historial: (id) =>
    USE_MOCKS
      ? Promise.resolve(mocks.leadDetalle.historial)
      : callProcess('LEADS_HISTORIAL', { x01: id }).then(unwrap),

  agregarInteres: (id_lead, id_interes) =>
    USE_MOCKS
      ? Promise.resolve({ success: true })
      : callProcess('LEADS_AGREGAR_INTERES', {
          x01: id_lead,
          x02: id_interes,
        }).then(r => r),

  quitarInteres: (id_lead, id_interes) =>
    USE_MOCKS
      ? Promise.resolve({ success: true })
      : callProcess('LEADS_QUITAR_INTERES', {
          x01: id_lead,
          x02: id_interes,
        }).then(r => r),
}