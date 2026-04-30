import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar, Topbar } from '@/shared/components'

const BREADCRUMBS = {
  '/admin/dashboard':  ['Inicio'],
  '/admin/usuarios':    ['Usuarios'],
  '/admin/catalogos':   ['Catálogos'],
  '/admin/ubicaciones': ['Territorios'],
  '/admin/productos':   ['Productos'],
  '/admin/estados':     ['Estados'],
  '/admin/auditoria':   ['Auditoría'],
  '/admin/sistema':     ['Sistema'],
}

function getBreadcrumb(pathname) {
  return BREADCRUMBS[pathname] || [pathname.split('/').pop()]
}

export function AdminLayout() {
  const location = useLocation()
  const user = { nombre: window.apex?.env?.APP_USER || 'Admin Sistema' }
  const activeItem = location.pathname.split('/').pop()
  const breadcrumb = getBreadcrumb(location.pathname)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeItem={activeItem} role="admin" user={user} />
      <div className="flex-1 flex flex-col">
        <Topbar breadcrumb={breadcrumb} />
        <main className="flex-1 p-10 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}