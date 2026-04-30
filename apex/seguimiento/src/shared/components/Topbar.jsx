import Icon from './Icons'

export function Topbar({ title, breadcrumb, actions }) {
  return (
    <header className="h-14 bg-white border-b flex items-center px-6 gap-4">
      <div className="flex-1">
        {breadcrumb ? (
          <div className="flex items-center gap-2 text-sm">
            {breadcrumb.map((b, i) => (
              <span key={i} className={i < breadcrumb.length - 1 ? 'text-gray-400' : 'text-gray-700 font-medium'}>
                {b}
                {i < breadcrumb.length - 1 && <span className="mx-2">/</span>}
              </span>
            ))}
          </div>
        ) : (
          <h1 className="text-base font-semibold text-gray-900">{title}</h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions || (
          <>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
              <Icon name="bell" size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
              <Icon name="search" size={18} />
            </button>
          </>
        )}
      </div>
    </header>
  )
}