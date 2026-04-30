import { callProcess, USE_MOCKS } from '@/shared/apex/apexClient'
import { unwrap } from '@/shared/utils/dataUtils'
import { mocks } from './mocks'

export const oportunidadesApi = {
  list: (params) =>
    USE_MOCKS
      ? Promise.resolve(mocks.oportunidades)
      : callProcess('OPP_LIST', params).then(unwrap),

  get: (id) =>
    USE_MOCKS
      ? Promise.resolve(mocks.oportunidadDetalle)
      : callProcess('OPP_GET', { x01: id }).then(unwrap),

  create: (data) =>
    USE_MOCKS
      ? Promise.resolve({ id_oportunidad: Date.now(), success: true })
      : callProcess('OPP_CREATE', data).then(r => r),

  update: (id, data) =>
    USE_MOCKS
      ? Promise.resolve({ success: true })
      : callProcess('OPP_UPDATE', { x01: id, ...data }).then(r => r),

  avanzarEstado: (id, id_estado, probabilidad, comentario) =>
    USE_MOCKS
      ? Promise.resolve({ success: true })
      : callProcess('OPP_AVANZAR_ESTADO', {
          x01: id, x02: id_estado, x03: probabilidad, x04: comentario,
        }).then(r => r),

  agregarProducto: (id_oportunidad, id_producto) =>
    USE_MOCKS
      ? Promise.resolve({ success: true })
      : callProcess('OPP_AGREGAR_PRODUCTO', {
          x01: id_oportunidad, x02: id_producto,
        }).then(r => r),

  quitarProducto: (id_oportunidad, id_producto) =>
    USE_MOCKS
      ? Promise.resolve({ success: true })
      : callProcess('OPP_QUITAR_PRODUCTO', {
          x01: id_oportunidad, x02: id_producto,
        }).then(r => r),

  registrarActividad: (id_oportunidad, data) =>
    USE_MOCKS
      ? Promise.resolve({ id_actividad: Date.now(), success: true })
      : callProcess('OPP_REGISTRAR_ACTIVIDAD', {
          x01: id_oportunidad, x02: data.tipo, x03: data.asunto, x04: data.fecha,
          x05: data.hora, x06: data.virtual,
        }).then(r => r),

  cerrarGanada: (id, id_motivo, valor_final, observaciones) =>
    USE_MOCKS
      ? Promise.resolve({ success: true })
      : callProcess('OPP_CERRAR_GANADA', {
          x01: id, x02: id_motivo, x03: valor_final, x04: observaciones,
        }).then(r => r),

  cerrarPerdida: (id, id_motivo, observaciones) =>
    USE_MOCKS
      ? Promise.resolve({ success: true })
      : callProcess('OPP_CERRAR_PERDIDA', {
          x01: id, x02: id_motivo, x03: observaciones,
        }).then(r => r),

  productosCatalogo: () =>
    USE_MOCKS
      ? Promise.resolve([
          { id: 1, nombre: 'Tubería PE100 SDR 11 - 4"', tipo: 'Tubería', presion: '16 bar', ref: 'PE100-SDR11-4' },
          { id: 2, nombre: 'Tubería PE100 SDR 17 - 6"', tipo: 'Tubería', presion: '10 bar', ref: 'PE100-SDR17-6' },
          { id: 3, nombre: 'Accesorios electrofusión 4"', tipo: 'Accesorio', presion: '16 bar', ref: 'EF-4IN' },
          { id: 4, nombre: 'Válvula de compuerta 4" AWWA', tipo: 'Válvula', presion: '16 bar', ref: 'VC-AWWA-4' },
          { id: 5, nombre: 'Codo 90° PE100 4"', tipo: 'Accesorio', presion: '16 bar', ref: 'CODO-90-4' },
        ])
      : callProcess('OPP_PRODUCTOS_CATALOGO').then(unwrap),

  estancados: () =>
    USE_MOCKS
      ? Promise.resolve(mocks.oportunidades.filter(o => o.id_estado_oportunidad === 'PROSPECTO'))
      : callProcess('OPP_ESTANCADOS').then(unwrap),
}