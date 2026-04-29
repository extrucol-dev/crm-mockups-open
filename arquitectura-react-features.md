# Arquitectura React por Features — CRM Extrucol

## Estructura propuesta

```
src/
├── shared/
│   ├── apex/
│   │   └── apexClient.js         ← callProcess, getApexEnv
│   ├── components/               ← Sidebar, Topbar, Modal, Card, Badge, Avatar
│   ├── utils/
│   │   ├── dataUtils.js          ← toLower, unwrap
│   │   └── format.js             ← moneda, fechas, porcentajes
│   └── styles/
│       ├── tokens.css
│       └── components.css
│
├── features/
│   ├── auth/                     ← login, recuperar-password, reset
│   ├── dashboard/                ← un componente por rol (ejecutivo/coordinador/director/admin)
│   ├── leads/                    ← kanban, form, detalle, conversión a oportunidad
│   ├── oportunidades/            ← kanban, form, detalle, cierre ganada/perdida
│   ├── clientes/                 ← grid, detalle, árbol de contactos
│   ├── actividades/              ← lista, detalle, registro GPS
│   ├── proyectos/                ← lista, detalle, timeline
│   ├── metas/                    ← mis metas (ejecutivo), cumplimiento (coordinador)
│   ├── pipeline/                 ← pipeline global, funnel (director)
│   ├── analisis/                 ← sectores, forecasting (director)
│   ├── reportes/                 ← librería de reportes (director)
│   ├── monitoreo/                ← mapa GPS, notificaciones en tiempo real (coordinador)
│   ├── alertas/                  ← centro de alertas, log de notificaciones (coordinador)
│   ├── equipo/                   ← perfil ejecutivo, rendimiento del equipo
│   └── admin/                    ← usuarios, catálogos maestros, auditoría
│
├── layouts/
│   ├── EjecutivoLayout.jsx
│   ├── CoordinadorLayout.jsx
│   ├── DirectorLayout.jsx
│   └── AdminLayout.jsx
│
├── router/
│   └── index.jsx                 ← rutas protegidas por rol
│
├── App.jsx
└── main.jsx
```

---

## Anatomía interna de un feature

Cada feature es autocontenido: tiene su propio API, estado, componentes y mocks.

```
features/oportunidades/
├── index.js                      ← exporta solo lo público del feature
├── api.js                        ← llama a apexClient (CLIENTES_LIST, etc.)
├── mocks.js
├── hooks/
│   └── useOportunidades.js       ← estado local + llamadas a api.js
└── components/
    ├── OportunidadesKanban.jsx
    ├── OportunidadDetalle.jsx
    ├── OportunidadForm.jsx
    ├── CierreGanadaModal.jsx
    └── CierrePerdidaModal.jsx
```

El `index.js` actúa como contrato público:

```js
// features/oportunidades/index.js
export { OportunidadesKanban } from './components/OportunidadesKanban'
export { OportunidadDetalle }  from './components/OportunidadDetalle'
export { oportunidadesApi }    from './api'
// CierreGanadaModal NO se exporta — es detalle interno
```

---

## Mapa mockups → features

| Carpeta actual (mockups) | Feature React |
|---|---|
| `auth/` | `features/auth/` |
| `ejecutivo/01`, `coordinador/01`, `director/01`, `admin/01` | `features/dashboard/` |
| `ejecutivo/02,04,05,11,17` + `coordinador/05-estancados` | `features/oportunidades/` |
| `ejecutivo/03,09,10,16` | `features/leads/` |
| `ejecutivo/06,14` | `features/clientes/` |
| `ejecutivo/07,13,18` + `coordinador/07-actividades` | `features/actividades/` |
| `ejecutivo/08,15` | `features/proyectos/` |
| `ejecutivo/12` + `coordinador/04` | `features/metas/` |
| `director/02` | `features/pipeline/` |
| `director/03,04` | `features/analisis/` |
| `director/06` | `features/reportes/` |
| `coordinador/03,06` | `features/monitoreo/` |
| `coordinador/08` + `coordinador/07-log` | `features/alertas/` |
| `coordinador/05-perfil` + `director/05,05-equipo` | `features/equipo/` |
| `coordinador/02` + `admin/02` | `features/admin/` |

---

## Reglas de importación

```
features/X  →  puede importar de shared/
features/X  →  NO puede importar de features/Y (evita acoplamiento)
layouts/    →  importa de features/ solo por index.js
router/     →  importa de layouts/ y features/auth/
```

---

## Agregar un módulo nuevo

1. Crear carpeta `features/nuevo-modulo/` con `index.js`, `api.js`, `mocks.js`, `hooks/`, `components/`
2. En `shared/apex/apexClient.js` agregar el bloque `export const apexNuevoModuloApi = { ... }`
3. Registrar las rutas en `router/index.jsx`
4. Crear los Application Processes correspondientes en APEX

---

## Por qué features sobre roles

Organizar por rol (`ejecutivo/`, `coordinador/`) duplica lógica porque varios roles comparten las mismas entidades:

| Entidad | Roles que la usan |
|---|---|
| Oportunidades | Ejecutivo (gestión), Coordinador (supervisión), Director (análisis) |
| Actividades | Ejecutivo (registro), Coordinador (monitoreo) |
| Perfil ejecutivo | Coordinador, Director |

Con features por capacidad de negocio, el componente existe una sola vez y los permisos se controlan en el router o con props de rol.
