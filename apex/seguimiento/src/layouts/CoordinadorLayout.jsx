import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar, Topbar } from '@/shared/components'

const BREADCRUMBS = {
  '/coordinador/dashboard':       ['Inicio'],
  '/coordinador/alertas':          ['Alertas activas'],
  '/coordinador/variables':        ['Variables y catálogos'],
  '/coordinador/monitoreo':        ['Monitoreo ejecutivos'],
  '/coordinador/estancados':       ['Leads/Opp estancados'],
  '/coordinador/mapa-actividades': ['Mapa actividades'],
  '/coordinador/notificaciones':   ['Log notificaciones'],
  '/coordinador/cumplimiento':    ['Cumplimiento'],
}

function getBreadcrumb(pathname) {
  return BREADCRUMBS[pathname] || [pathname.split('/').pop()]
}

export function CoordinadorLayout() {
  const location = useLocation()
  const user = { nombre: window.apex?.env?.APP_USER || 'Diana Ruiz' }
  const activeItem = location.pathname.split('/').pop()
  const breadcrumb = getBreadcrumb(location.pathname)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeItem={activeItem} role="coordinador" user={user} />
      <div className="flex-1 flex flex-col">
        <Topbar breadcrumb={breadcrumb} />
        <main className="flex-1 p-10 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}