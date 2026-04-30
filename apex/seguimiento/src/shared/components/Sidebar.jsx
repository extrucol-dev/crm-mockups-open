import { NavLink } from 'react-router-dom'
import Icon from './Icons'

const NAV_ITEMS = {
  ejecutivo: [
    { id: 'dashboard',      label: 'Dashboard',       icon: 'home' },
    { id: 'leads',           label: 'Leads',            icon: 'funnel' },
    { id: 'oportunidades',   label: 'Oportunidades',    icon: 'briefcase' },
    { id: 'clientes',        label: 'Clientes',         icon: 'users' },
    { id: 'actividades',     label: 'Actividades',     icon: 'clipboard' },
    { id: 'proyectos',       label: 'Proyectos',       icon: 'folder' },
    { id: 'metas',           label: 'Mis metas',        icon: 'trophy' },
  ],
  coordinador: [
    { id: 'dashboard',       label: 'Panel seguimiento', icon: 'home' },
    { id: 'alertas',         label: 'Alertas activas',  icon: 'bell' },
    { id: 'variables',       label: 'Variables y catálogos', icon: 'adjustments' },
    { id: 'monitoreo',       label: 'Monitoreo ejecutivos', icon: 'view' },
    { id: 'estancados',      label: 'Leads/Opp estancados', icon: 'clock' },
    { id: 'mapa-actividades',label: 'Mapa actividades', icon: 'gps' },
    { id: 'notificaciones',  label: 'Log notificaciones', icon: 'inbox' },
    { id: 'cumplimiento',    label: 'Cumplimiento',     icon: 'clipboardCheck' },
  ],
  director: [
    { id: 'dashboard',       label: 'Dashboard',       icon: 'chartBar' },
    { id: 'pipeline',        label: 'Pipeline global',  icon: 'funnel' },
    { id: 'equipo',          label: 'Equipo comercial', icon: 'users' },
    { id: 'reportes',        label: 'Reportes',         icon: 'chartPie' },
    { id: 'sectores',        label: 'Análisis sectores', icon: 'building' },
    { id: 'forecasting',     label: 'Forecasting',      icon: 'trendingUp' },
  ],
  admin: [
    { id: 'dashboard',       label: 'Dashboard',       icon: 'home' },
    { id: 'usuarios',        label: 'Usuarios',         icon: 'users' },
    { id: 'catalogos',       label: 'Catálogos',        icon: 'tag' },
    { id: 'ubicaciones',     label: 'Territorios',      icon: 'mapPin' },
    { id: 'productos',       label: 'Productos',        icon: 'archive' },
    { id: 'estados',         label: 'Estados',          icon: 'flag' },
    { id: 'auditoria',       label: 'Auditoría',         icon: 'shieldCheck' },
    { id: 'sistema',         label: 'Sistema',           icon: 'settings' },
  ],
}

const ROLE_LABELS = { ejecutivo: 'Ejecutivo', coordinador: 'Coordinador', director: 'Director', admin: 'Administrador' }

function getInitials(name) {
  if (!name) return '??'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export function Sidebar({ activeItem, role = 'ejecutivo', user }) {
  const items = NAV_ITEMS[role] || NAV_ITEMS.ejecutivo
  const initials = getInitials(user?.nombre)
  const roleLabel = ROLE_LABELS[role] || role

  return (
    <aside className="w-64 min-h-screen bg-primary flex flex-col">
      <div className="px-5 py-6">
        <div className="text-white text-xl font-bold">CRM <span className="text-accent">Extrucol</span></div>
        <div className="text-white/60 text-xs mt-0.5">Sistema Comercial</div>
      </div>
      <div className="px-4 py-3 flex items-center gap-3 border-t border-white/10">
        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white text-sm font-semibold">
          {initials}
        </div>
        <div>
          <div className="text-white text-sm font-medium">{user?.nombre || 'Usuario'}</div>
          <div className="text-white/60 text-xs">{roleLabel}</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(item => (
          <NavLink
            key={item.id}
            to={`/${role}/${item.id}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white w-full transition-colors">
          <Icon name="logout" size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}