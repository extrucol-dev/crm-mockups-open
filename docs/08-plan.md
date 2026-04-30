# Plan: Migración de Mockups HTML → React + Vite + Oracle APEX

## Contexto

Los 42 archivos HTML estáticos del CRM Extrucol se convierten en una SPA React conectada a Oracle APEX exclusivamente mediante procesos On-Demand (`callProcess`). El boilerplate mínimo existe en `apex/seguimiento/`.

**Decisiones confirmadas:**
- ❌ Sin login propio — APEX gestiona autenticación. React asume sesión activa, lee rol de `window.apex.env`
- ❌ Sin ORDS — solo `callProcess()` → `POST /apex/wwv_flow.ajax`. `axios` disponible para llamadas internas si se necesita
- ✅ Tailwind CSS 3.4 con `tailwind.config.js` que incorpora tokens del CRM
- ✅ `@dnd-kit/core` para drag-and-drop de kanbans
- ✅ `Chart.js + react-chartjs-2` para gráficas
- ✅ `VITE_USE_MOCKS=true` en desarrollo sin APEX

---

## Package.json final (`apex/seguimiento/package.json`)

Reemplazar el package.json existente con exactamente:
```json
{
  "name": "crm-extrucol",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "axios": "^1.13.6",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.3"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.3.1"
  }
}
```

Además instalar con npm (no en el json aún):
```bash
npm install chart.js react-chartjs-2
```

---

## Fase 0 — Fundación

### 0.1 `npm install` + Chart.js
```bash
cd apex/seguimiento
npm install
npm install chart.js react-chartjs-2
```

### 0.2 `tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:   '#24388C',
        accent:    '#F39610',
        success:   '#1A8754',
        error:     '#C0392B',
      },
      borderRadius: { sm:'6px', md:'8px', lg:'12px' },
      fontFamily:   { sans:['Roboto','sans-serif'] },
      boxShadow:    { card:'0 1px 3px rgba(0,0,0,.08)', modal:'0 8px 32px rgba(0,0,0,.18)' },
    },
  },
  plugins: [],
}
```

### 0.3 `vite.config.js`
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',    // sin hash para APEX Static Files
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
  // Sin proxy — no ORDS
})
```

### 0.4 Variables de entorno
- `.env.development` → `VITE_USE_MOCKS=true`
- `.env.production`  → `VITE_USE_MOCKS=false`

### 0.5 `src/shared/apex/apexClient.js`
```js
// getApexEnv():
//   Lee window.apex?.env → { APP_ID, APP_PAGE_ID, APP_SESSION, APP_USER }
//   Fallback: inputs hidden #pFlowId, #pFlowStepId, #pInstance para APEX 20.x
//
// callProcess(processName, extras = {}):
//   POST /apex/wwv_flow.ajax
//   Content-Type: application/x-www-form-urlencoded
//   Body: p_request=APPLICATION_PROCESS=${processName}, p_flow_id, p_flow_step_id,
//         p_instance, x01..xN (del objeto extras)
//   credentials: 'include'
//   Retorna: JSON.parse(responseText)
//
// export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'
```

### 0.6 `src/shared/utils/dataUtils.js`
- `toLower(val)` — normaliza claves UPPERCASE de Oracle recursivamente
- `unwrap(payload)` — extrae array de `{data:[]}` / `{items:[]}` / `{rows:[]}` / array plano; aplica `toLower`

### 0.7 `src/shared/utils/format.js`
- `fmtCurrency(n)` → `$ 450.000` con `Intl.NumberFormat('es-CO', {currency:'COP'})`
- `fmtCompact(n)` → `$ 187 M` (lógica manual: `n/1_000_000 + ' M'`)
- `fmtPercent(n)`, `fmtDate(str)`, `fmtDateShort(str)` — locale `es-CO`

### 0.8 Patrón de cada `features/X/api.js`
```js
import { callProcess, USE_MOCKS } from '@/shared/apex/apexClient'
import { unwrap } from '@/shared/utils/dataUtils'
import { mocks } from './mocks'

export const leadsApi = {
  list: (params) => USE_MOCKS
    ? Promise.resolve(mocks.leads)
    : callProcess('LEADS_LIST', params).then(unwrap),
}
```

### 0.9 Componentes compartidos (`src/shared/components/`)

| Archivo | Descripción |
|---|---|
| `Icons.jsx` | SVGs de `shared/components.js` como FC con props `className, size` |
| `Sidebar.jsx` | `<NavLink>` react-router-dom para estado activo; nav items por rol como constante |
| `Topbar.jsx` | Props `{title, breadcrumb, actions}` |
| `Modal.jsx` | `ReactDOM.createPortal` a `document.body`. `fixed inset-0 z-50 flex items-center justify-center bg-black/40` |
| `Badge.jsx` | Variantes: prospecto, calificacion, propuesta, negociacion, ganada, perdida, info, success, error, warning |
| `Avatar.jsx` | Props `{initials, color(1-6), size}` — 6 colores deterministas |
| `KpiCard.jsx` | Props `{label, value, hint, icon, loading}` — skeleton con `animate-pulse` |
| `index.js` | Re-exporta todos |

### 0.10 Layouts (`src/layouts/`)
```jsx
// EjecutivoLayout.jsx (patrón igual para los 4 roles)
// user = { nombre: window.apex?.env?.APP_USER, role: 'ejecutivo' }
// activeItem derivado de useLocation()
<div className="flex min-h-screen bg-gray-100">
  <Sidebar activeItem={activeItem} role="ejecutivo" user={user} />
  <div className="flex-1 flex flex-col">
    <Topbar ... />
    <main className="flex-1 p-10 max-w-[1440px] mx-auto w-full">
      <Outlet />
    </main>
  </div>
</div>
```
Sin `ProtectedRoute` — APEX garantiza sesión activa.

### 0.11 `src/router/index.jsx`
```
/                    → redirect al dashboard del rol (leído de window.apex.env)
/ejecutivo/*         → EjecutivoLayout
  dashboard, leads/*, oportunidades/*, clientes/*,
  actividades/*, proyectos/*, metas
/coordinador/*       → CoordinadorLayout
  dashboard, estancados, monitoreo, mapa-actividades,
  alertas, log-notificaciones, cumplimiento, ejecutivo/:id, variables
/director/*          → DirectorLayout
  dashboard, pipeline, analisis/sectores, analisis/forecasting,
  equipo/*, reportes, oportunidades/:id
/admin/*             → AdminLayout
  dashboard, usuarios, catalogos/*, auditoria, variables
```

### 0.12 `src/main.jsx` + `src/App.jsx`
```jsx
// main.jsx: importa '@/shared/styles/globals.css' (Tailwind directives + @import Roboto)
// App.jsx: <RouterProvider router={router} />
//   Lee window.apex?.env para el redirect inicial según rol
```

**Entregable Fase 0:** `npm run dev` → muestra layout ejecutivo con sidebar/topbar y datos mock.

---

## Fase 1 — Leads (4 páginas + 3 modales)

**Reemplaza:** `ejecutivo/03-leads-kanban`, `ejecutivo/09-lead-form`, `ejecutivo/10-lead-detalle`, `ejecutivo/16-lead-conversion`

**DnD con @dnd-kit:**
```jsx
// LeadsKanban.jsx
<DndContext onDragEnd={handleDragEnd}>
  {columns.map(col => (
    <KanbanColumn key={col.id} id={col.id}>
      {col.leads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
    </KanbanColumn>
  ))}
  <DragOverlay>{active ? <LeadCard lead={activeItem} /> : null}</DragOverlay>
</DndContext>
// KanbanColumn: useDroppable({ id })
// LeadCard: useDraggable({ id })
// handleDragEnd: llama leadsApi.update({ id, id_estado_lead: over.id })
```

**Archivos:**
- `src/features/leads/api.js` — 8 procesos, patrón mock/real
- `src/features/leads/mocks.js` — datos estáticos de los HTML
- `src/features/leads/hooks/useLeads.js` — agrupa por `id_estado_lead`, actualización optimista
- `src/features/leads/hooks/useLeadDetalle.js`
- `src/features/leads/components/LeadsKanban.jsx` — 5 columnas (Nuevo→Descalificado)
- `src/features/leads/components/LeadCard.jsx` — badge origen, score footer, `useDraggable`
- `src/features/leads/components/LeadForm.jsx` — origin cards grid, interest chips, score cards (5 niveles)
- `src/features/leads/components/LeadDetalle.jsx` — timeline + 3 `useState` booleans de modal
- `EditarLeadModal.jsx`, `DescalificarLeadModal.jsx` (internos, no exportados)
- `src/features/leads/components/LeadConversion.jsx` — wizard → navega a `/ejecutivo/oportunidades/:id`
- `src/features/leads/index.js`

**Procesos APEX:** `LEADS_CATALOGOS`, `LEADS_LIST`, `LEADS_GET`, `LEADS_CREATE`, `LEADS_UPDATE`, `LEADS_DESCALIFICAR`, `LEADS_CONVERTIR`, `LEADS_HISTORIAL` (8)

---

## Fase 2 — Oportunidades (7 páginas + 7 modales)

**Reemplaza:** `ejecutivo/02, 04, 05, 11, 17` · `coordinador/05-estancados` · `director/07-oportunidad-detalle`

**Archivos:**
- `src/features/oportunidades/api.js` — 12 procesos
- `src/features/oportunidades/hooks/useOportunidades.js` — DnD con dnd-kit, `moverOportunidad()` optimista
- `src/features/oportunidades/hooks/useOportunidadDetalle.js` — `Promise.all([OPP_GET, OPP_ACTIVIDADES])` con `AbortController`
- `OportunidadesKanban.jsx` — 6 columnas. GANADA y PERDIDA: `useDroppable` no activo (isOver no dispara update)
- `OportunidadCard.jsx`, `OportunidadForm.jsx`
- `OportunidadDetalle.jsx` — 7 `useState` booleans de modal; `valor_estimado` en `text-accent font-bold`
- Modales internos (no exportados): `EditarOportunidadModal`, `AvanzarEstadoModal`, `AgregarProductoModal`, `RegistrarActividadModal`, `ContactoModal`, `CierreGanadaModal`, `CierrePerdidaModal`
- `EstancadosList.jsx` — reutilizado en `/coordinador/estancados`
- `src/features/oportunidades/index.js`

**Procesos APEX:** `OPP_LIST`, `OPP_GET`, `OPP_CREATE`, `OPP_UPDATE`, `OPP_AVANZAR_ESTADO`, `OPP_AGREGAR_PRODUCTO`, `OPP_QUITAR_PRODUCTO`, `OPP_REGISTRAR_ACTIVIDAD`, `OPP_CERRAR_GANADA`, `OPP_CERRAR_PERDIDA`, `OPP_PRODUCTOS_CATALOGO`, `OPP_ESTANCADOS` (12)

---

## Fase 3 — Dashboard (4 roles)

**Reemplaza:** `ejecutivo/01`, `coordinador/01`, `director/01`, `admin/01`

**Chart.js pattern:**
```jsx
import { Bar } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

// Cada chart file registra solo los elementos que usa
// Wrapper: <div className="relative h-[280px]"><Bar data={...} options={{responsive:true, maintainAspectRatio:false}} /></div>
// maintainAspectRatio:false + altura fija en el div padre = siempre visible en flex/grid
```

**Archivos:**
- `src/features/dashboard/api.js` — 10 procesos
- `EjecutivoDashboard.jsx` — 4 KPIs + oportunidades recientes + actividades próximas + acciones rápidas
- `CoordinadorDashboard.jsx` — alertas + tabla ejecutivos + KPIs
- `DirectorDashboard.jsx` — KPIs + `PipelineFunnelChart` (Bar horizontal) + `ForecastChart` (Line+Bar) + tabla equipo
- `AdminDashboard.jsx` — KPIs sistema
- `src/features/dashboard/components/charts/` — `PipelineFunnelChart.jsx`, `CumplimientoDonutChart.jsx`, `ForecastChart.jsx`

**Procesos APEX:** `DASH_EJECUTIVO_KPIS/OPP/ACT`, `DASH_COORDINADOR_KPIS/EQUIPO/ALERTAS`, `DASH_DIRECTOR_KPIS/FUNNEL/EQUIPO`, `DASH_ADMIN_KPIS` (10)

---

## Fase 4 — Clientes + Actividades + Proyectos (7 páginas)

**Reemplaza:** `ejecutivo/06, 14` · `ejecutivo/07, 13, 18` · `ejecutivo/08, 15`

### Clientes
- `ClientesList.jsx` — grid/tabla + `NuevoClienteModal` + `AgregarContactoModal`
- `ClienteDetalle.jsx` — árbol contactos, historial oportunidades, 3 modales
- Procesos: `CLIENTES_LIST`, `CLIENTES_GET`, `CLIENTES_CREATE`, `CLIENTES_UPDATE`, `CLIENTES_AGREGAR_CONTACTO`, `CLIENTES_DESACTIVAR` (6)

### Actividades
- `ActividadesList.jsx` — filtros: tipo, fecha, estado. Coordinador usa `ACTIVIDADES_ALL_FOR_COORD`
- `ActividadDetalle.jsx` — `ejecutivo/13` y `ejecutivo/18` son el mismo componente
- Procesos: `ACTIVIDADES_LIST`, `ACTIVIDADES_GET`, `ACTIVIDADES_CREATE`, `ACTIVIDADES_COMPLETAR`, `ACTIVIDADES_ALL_FOR_COORD` (5)

### Proyectos
- `ProyectosList.jsx` — card grid con estado badge
- `ProyectoDetalle.jsx` — hitos timeline + `EditarProyectoModal`
- Procesos: `PROYECTOS_LIST`, `PROYECTOS_GET`, `PROYECTOS_CREATE`, `PROYECTOS_UPDATE` (4)

---

## Fase 5 — Metas (2 páginas)

**Reemplaza:** `ejecutivo/12-mis-metas`, `coordinador/04-cumplimiento`

- `MisMetas.jsx` — donut Chart.js para anillo de cumplimiento, progress bars por categoría
- `CumplimientoPage.jsx` — tabla ejecutivos: % cumplimiento, estancados, última actividad
- Procesos: `METAS_MIS_METAS`, `METAS_CUMPLIMIENTO` (2)

---

## Fase 6 — Pipeline + Análisis + Reportes (4 páginas)

**Reemplaza:** `director/02, 03, 04, 06`

- `PipelineGlobal.jsx` — barras horizontales Chart.js por etapa, filtros ejecutivo/sector
- `AnalisisSectores.jsx` — cards sector + Bar Chart comparativo
- `Forecasting.jsx` — Chart.js mixed (Bar actuals + Line forecast + Line meta)
- `ReportesPage.jsx` — grid cards reportes, date picker, descarga CSV vía blob URL
- Procesos: `PIPELINE_GLOBAL`, `PIPELINE_BY_EJECUTIVO`, `ANALISIS_SECTORES`, `ANALISIS_FORECASTING`, `REPORTES_GENERATE` (5)

---

## Fase 7 — Monitoreo + Alertas + Equipo (8 páginas)

**Reemplaza:** `coordinador/03, 06, 07-log, 08, 05-perfil` · `director/05-perfil, 05-equipo`

- `MonitoreoPage.jsx` — tabla ejecutivos + mapa placeholder (div con pins SVG por GPS; mapa real = post-MVP)
- `MapaActividadesPage.jsx`
- `AlertasPage.jsx` — cards por severidad (crítica/advertencia/info/éxito) + tabs + botón "Resolver"
- `LogNotificacionesPage.jsx` — tabla paginada + config thresholds
- `EquipoComercial.jsx` — tabla ordenable ejecutivos
- `EjecutivoPerfil.jsx` — un componente, prop `readOnly` (coordinador puede enviar notificaciones, director no)
- Procesos: 9 (`MONITOREO_*`, `ALERTAS_*`, `EQUIPO_*`)

---

## Fase 8 — Admin (3 páginas)

**Reemplaza:** `admin/01, 02-usuarios, 02-forms` · `coordinador/02-variables-sistema`

- `UsuariosPage.jsx` — tabla con role badges, toggle activo, modales crear/editar
- `CatalogosPage.jsx` — grid de cards por tipo de catálogo
- `AuditoriaPage.jsx` — tabla paginada, filtro fecha, export CSV
- `VariablesSistema.jsx` — tabla `CRM_CONFIGURACION_SISTEMA` editable inline
- Procesos: 9 (`ADMIN_USUARIOS_*`, `ADMIN_CATALOGOS_*`, `ADMIN_AUDITORIA_*`, `ADMIN_VARIABLES_*`)

---

## Archivos críticos a crear/modificar

| Archivo | Cambio |
|---|---|
| `apex/seguimiento/package.json` | Reemplazar con el JSON definido arriba |
| `apex/seguimiento/tailwind.config.js` | Crear con tokens CRM |
| `apex/seguimiento/vite.config.js` | Reemplazar: alias `@`, build sin hash |
| `apex/seguimiento/postcss.config.js` | `{ plugins: { tailwindcss:{}, autoprefixer:{} } }` |
| `src/shared/apex/apexClient.js` | Crear: `callProcess`, `getApexEnv`, `USE_MOCKS` |
| `src/shared/utils/dataUtils.js` | `toLower`, `unwrap` |
| `src/shared/styles/globals.css` | `@tailwind base/components/utilities` + `@import Roboto` |
| `src/router/index.jsx` | Árbol completo de rutas |

## Registro total de procesos APEX

| Feature | Procesos |
|---|---|
| Leads | 8 |
| Oportunidades | 12 |
| Dashboard | 10 |
| Clientes + Actividades + Proyectos | 15 |
| Metas | 2 |
| Pipeline + Análisis + Reportes | 5 |
| Monitoreo + Alertas + Equipo | 9 |
| Admin | 9 |
| **Total** | **~70 procesos** |

Nomenclatura: `{FEATURE}_{ACCION}` UPPERCASE. Respuesta estándar listas: `APEX_JSON.WRITE('data', cursor)`. Mutaciones: `{success:true, id:N}`.

## Decisiones técnicas

- **@dnd-kit/core** — `DndContext` + `useDraggable`/`useDroppable` + `DragOverlay` para ambos kanbans
- **Chart.js** — registrar solo los elementos necesarios por archivo para reducir bundle; `maintainAspectRatio:false` + div con altura fija siempre
- **Sin auth en React** — `window.apex.env` provee `APP_USER` y rol
- **Modales en portal** — `ReactDOM.createPortal` a `document.body` evita clipping en APEX shell
- **AbortController** en detail views — evita setState en componentes desmontados
- **Moneda** — `Intl.NumberFormat('es-CO', {currency:'COP'})` + compacto manual `/ 1_000_000 + ' M'`

## Verificación por fase

1. `npm run dev` → layout renderiza con datos mock (`VITE_USE_MOCKS=true`), sin errores consola
2. Kanban: arrastrar card entre columnas actualiza estado local y llama a la API
3. Modales abren/cierran correctamente, sin overflow z-index
4. Charts: visibles en viewport 1440px, sin altura cero (div padre con `h-[280px]`)
5. `npm run build` → genera `dist/assets/app.js` + `dist/assets/app.css` sin hash
