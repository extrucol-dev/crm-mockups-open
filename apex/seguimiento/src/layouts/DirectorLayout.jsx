import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar, Topbar } from '@/shared/components'

const BREADCRUMBS = {
  '/director/dashboard':  ['Inicio'],
  '/director/pipeline':   ['Pipeline global'],
  '/director/equipo':     ['Equipo comercial'],
  '/director/reportes':   ['Reportes'],
  '/director/sectores':   ['Análisis sectores'],
  '/director/forecasting':['Forecasting'],
}

function getBreadcrumb(pathname) {
  return BREADCRUMBS[pathname] || [pathname.split('/').pop()]
}

export function DirectorLayout() {
  const location = useLocation()
  const user = { nombre: window.apex?.env?.APP_USER || 'Carlos Muñoz' }
  const activeItem = location.pathname.split('/').pop()
  const breadcrumb = getBreadcrumb(location.pathname)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeItem={activeItem} role="director" user={user} />
      <div className="flex-1 flex flex-col">
        <Topbar breadcrumb={breadcrumb} />
        <main className="flex-1 p-10 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}