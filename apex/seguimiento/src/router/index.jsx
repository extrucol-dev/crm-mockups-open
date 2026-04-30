import { Navigate } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import { EjecutivoLayout } from '@/layouts/EjecutivoLayout'
import { CoordinadorLayout } from '@/layouts/CoordinadorLayout'
import { DirectorLayout } from '@/layouts/DirectorLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { LeadsKanbanPage, LeadsFormPage, LeadsDetallePage, LeadConversionPage } from '@/features/leads'
import { OportunidadesKanbanPage, OportunidadesFormPage, OportunidadesDetallePage } from '@/features/oportunidades'

function RedirectToDashboard() {
  return <Navigate to="/ejecutivo/dashboard" replace />
}

export const router = createBrowserRouter([
  { path: '/', element: <RedirectToDashboard /> },
  {
    path: '/ejecutivo',
    element: <EjecutivoLayout />,
    children: [
      { path: 'dashboard', element: <div className="text-gray-700">Dashboard Ejecutivo - Mock</div> },
      { path: 'leads', element: <LeadsKanbanPage /> },
      { path: 'leads/nuevo', element: <LeadsFormPage /> },
      { path: 'leads/:id', element: <LeadsDetallePage /> },
      { path: 'leads/:id/convertir', element: <LeadConversionPage /> },
      { path: 'oportunidades', element: <OportunidadesKanbanPage /> },
      { path: 'oportunidades/nuevo', element: <OportunidadesFormPage /> },
      { path: 'oportunidades/:id', element: <OportunidadesDetallePage /> },
      { path: 'clientes', element: <div className="text-gray-700">Clientes - Mock</div> },
      { path: 'actividades', element: <div className="text-gray-700">Actividades - Mock</div> },
      { path: 'proyectos', element: <div className="text-gray-700">Proyectos - Mock</div> },
      { path: 'metas', element: <div className="text-gray-700">Mis metas - Mock</div> },
    ],
  },
  {
    path: '/coordinador',
    element: <CoordinadorLayout />,
    children: [
      { path: 'dashboard', element: <div className="text-gray-700">Dashboard Coordinador - Mock</div> },
      { path: 'alertas', element: <div className="text-gray-700">Alertas - Mock</div> },
      { path: 'variables', element: <div className="text-gray-700">Variables - Mock</div> },
      { path: 'monitoreo', element: <div className="text-gray-700">Monitoreo - Mock</div> },
      { path: 'estancados', element: <div className="text-gray-700">Estancados - Mock</div> },
      { path: 'mapa-actividades', element: <div className="text-gray-700">Mapa - Mock</div> },
      { path: 'notificaciones', element: <div className="text-gray-700">Notificaciones - Mock</div> },
      { path: 'cumplimiento', element: <div className="text-gray-700">Cumplimiento - Mock</div> },
    ],
  },
  {
    path: '/director',
    element: <DirectorLayout />,
    children: [
      { path: 'dashboard', element: <div className="text-gray-700">Dashboard Director - Mock</div> },
      { path: 'pipeline', element: <div className="text-gray-700">Pipeline - Mock</div> },
      { path: 'equipo', element: <div className="text-gray-700">Equipo - Mock</div> },
      { path: 'reportes', element: <div className="text-gray-700">Reportes - Mock</div> },
      { path: 'sectores', element: <div className="text-gray-700">Sectores - Mock</div> },
      { path: 'forecasting', element: <div className="text-gray-700">Forecasting - Mock</div> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <div className="text-gray-700">Dashboard Admin - Mock</div> },
      { path: 'usuarios', element: <div className="text-gray-700">Usuarios - Mock</div> },
      { path: 'catalogos', element: <div className="text-gray-700">Catálogos - Mock</div> },
      { path: 'ubicaciones', element: <div className="text-gray-700">Territorios - Mock</div> },
      { path: 'productos', element: <div className="text-gray-700">Productos - Mock</div> },
      { path: 'estados', element: <div className="text-gray-700">Estados - Mock</div> },
      { path: 'auditoria', element: <div className="text-gray-700">Auditoría - Mock</div> },
      { path: 'sistema', element: <div className="text-gray-700">Sistema - Mock</div> },
    ],
  },
])