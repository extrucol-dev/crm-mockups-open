import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar, Topbar } from '@/shared/components'

const BREADCRUMBS = {
  '/ejecutivo/dashboard':      ['Inicio'],
  '/ejecutivo/leads':          ['Leads'],
  '/ejecutivo/oportunidades':   ['Oportunidades'],
  '/ejecutivo/clientes':        ['Clientes'],
  '/ejecutivo/actividades':     ['Actividades'],
  '/ejecutivo/proyectos':      ['Proyectos'],
  '/ejecutivo/metas':          ['Mis metas'],
}

function getBreadcrumb(pathname) {
  return BREADCRUMBS[pathname] || [pathname.split('/').pop()]
}

export function EjecutivoLayout() {
  const location = useLocation()
  const user = { nombre: window.apex?.env?.APP_USER || 'Juan Pérez' }
  const activeItem = location.pathname.split('/').pop()
  const breadcrumb = getBreadcrumb(location.pathname)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeItem={activeItem} role="ejecutivo" user={user} />
      <div className="flex-1 flex flex-col">
        <Topbar breadcrumb={breadcrumb} />
        <main className="flex-1 p-10 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}