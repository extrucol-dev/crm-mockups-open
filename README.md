# CRM Extrucol · Mockups HTML v1.0

Sistema Comercial completo maquetado en HTML/CSS fiel al design system definido en `FIGMA_DESIGN_SYSTEM.md` y al modelo de datos de `CRM_ER_v4.md`.

## 🚀 Cómo usar

1. Descomprime el ZIP en cualquier carpeta
2. Abre `index.html` en tu navegador (doble click)
3. Desde el índice puedes acceder a cualquier pantalla

Cada archivo HTML muestra los **3 breakpoints responsive** lado a lado (Desktop 1440, Tablet 768, Mobile 375), renderizados como artboards tipo Figma sobre un fondo gris.

## 📁 Estructura

```
crm-mockups/
├── index.html                               ← Entry point (navegación)
├── shared/
│   ├── tokens.css                           ← Design tokens (colores, fuentes, spacing)
│   ├── components.css                       ← Librería de 40+ componentes CSS
│   └── components.js                        ← Íconos Heroicons + renderers de shell
├── auth/
│   ├── 01-login.html                        ← Login + Recuperar contraseña
│   └── 02-reset-password.html               ← Reset Password + éxito + expirado
├── director/
│   ├── 01-dashboard.html                    ← Dashboard ejecutivo estratégico
│   ├── 02-pipeline-global.html              ← Pipeline agregado del equipo
│   ├── 03-analisis-sectores.html            ← Análisis por sectores (NUEVO)
│   ├── 04-forecasting.html                  ← Forecasting detallado (NUEVO)
│   ├── 05-equipo-comercial.html             ← Equipo con metas vs ventas
│   └── 06-reportes.html                     ← Biblioteca de reportes
├── ejecutivo/
│   ├── 01-dashboard.html                    ← Dashboard personal
│   ├── 02-oportunidades-kanban.html         ← Kanban oportunidades (6 estados)
│   ├── 03-leads-kanban.html                 ← Kanban leads (5 estados)
│   ├── 04-oportunidad-detalle.html          ← Detalle con tabs
│   ├── 05-oportunidad-form.html             ← Formulario nueva oportunidad
│   ├── 06-clientes.html                     ← Grid + Detalle de empresa
│   ├── 07-actividades.html                  ← Lista + Registro GPS
│   ├── 08-proyectos.html                    ← Lista + Detalle con progreso
│   ├── 09-lead-form.html                    ← Formulario nuevo Lead
│   ├── 10-lead-detalle-conversion.html      ← Detalle Lead + conversión a Opp
│   ├── 11-cierre-oportunidad.html           ← Modales cierre Ganada/Perdida
│   └── 12-mis-metas.html                    ← Mis metas personales (NUEVO)
├── coordinador/
│   ├── 01-dashboard.html                    ← Panel de seguimiento
│   ├── 02-variables-sistema.html            ← CRUD variables (14 en 4 categorías)
│   └── 03-monitoreo-mapa-notif.html         ← Monitoreo + Mapa GPS + Notif (3 vistas)
├── director/
│   ├── 01-dashboard.html                    ← Dashboard ejecutivo estratégico
│   └── 02-pipeline-equipo-reportes.html     ← Pipeline global + Equipo + Reportes (3 vistas)
└── admin/
    ├── 01-usuarios-catalogos-auditoria.html ← Usuarios + Catálogos + Auditoría (3 vistas)
    └── 02-forms-detalles.html               ← Form Usuario + Detalle Catálogo + Detalle Auditoría
```

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| Archivos HTML | 23 |
| Pantallas únicas | 40+ |
| Vistas totales | 115+ |
| Roles cubiertos | 4 + Auth |
| Componentes CSS | 40+ |
| Íconos Heroicons | 40+ |
| Breakpoints | Desktop 1440 / Tablet 768 / Mobile 375 |

## 🎨 Design System aplicado

**Colores principales:**
- Primary: `#24388C` (azul Extrucol)
- Primary Dark: `#1B2C6B`
- Accent: `#F39610` (naranja destacado)
- Success: `#1A8754` / Green bright: `#22C55E`
- Error: `#C0392B`

**Tipografía:** Roboto 400/500/600/700/800

**Radii:** sm 6px / md 8px / lg 12px / full 9999px

**Shadows:** sm / md / lg definidos por tokens

## 👥 Roles del sistema

### 👔 Ejecutivo Comercial
Rol operativo del personal de campo. Gestiona leads, oportunidades, clientes, actividades con GPS y proyectos. Incluye pantalla de **Mis Metas personales** con progreso visual y sistema de logros. Flujo completo de captura → calificación → conversión → cierre. **12 archivos cubriendo todo el flujo.**

### ⭐ Coordinador de Seguimiento (rol intermedio)
Supervisa a los ejecutivos, configura las variables del sistema (umbrales de alertas, metas, montos mínimos), monitorea actividades GPS consolidadas y gestiona notificaciones automáticas. 3 pantallas.

### 📊 Director Comercial
Rol estratégico. Dashboards analíticos, pipeline global, análisis por sectores (con insights automáticos), forecasting detallado (gauge de confianza, escenarios trimestrales), equipo y biblioteca de reportes. **6 archivos independientes solo desktop.**

### 🛠️ Administrador
Configuración del sistema. Gestiona usuarios y roles, los 13 catálogos maestros y revisa el log de auditoría completo. 1 archivo con 3 vistas.

## 🔗 Mapeo a Base de Datos

Los mockups referencian directamente las tablas del modelo ER:

| Módulo | Tablas principales |
|--------|-------------------|
| Leads | `CRM_LEAD`, `CRM_ESTADO_LEAD`, `CRM_ORIGEN_LEAD`, `CRM_INTERES`, `CRM_LEAD_INTERES` |
| Oportunidades | `CRM_OPORTUNIDAD`, `CRM_ESTADO_OPORTUNIDAD`, `CRM_OPORTUNIDAD_PRODUCTO` |
| Empresas | `CRM_EMPRESA`, `CRM_CONTACTO`, `CRM_EMAIL`, `CRM_TELEFONO` |
| Actividades | `CRM_ACTIVIDAD`, `CRM_UBICACION` (GPS) |
| Proyectos | `CRM_PROYECTO` (FK a oportunidad ganada) |
| Usuarios | `CRM_USUARIO`, `CRM_ROL`, `CRM_DEPARTAMENTO` |
| Variables | `CRM_CONFIGURACION_SISTEMA` |
| Auditoría | `CRM_AUDITORIA` |
| Catálogos | `CRM_PAIS`, `CRM_MUNICIPIO`, `CRM_SECTOR`, etc. |

## 🔄 Responsive Strategy

- **Desktop (1440px)**: Layout completo con sidebar expandido, múltiples columnas, tablas completas.
- **Tablet (768px)**: Sidebar colapsado a íconos (72px), 2 columnas, tablas con scroll horizontal.
- **Mobile (375px)**: Sidebar oculto, bottom navigation, 1 columna, kanban con tabs scrollables.

## ⏭️ Próximos pasos sugeridos

1. **Revisar** cada pantalla abriendo `index.html`
2. **Feedback** sobre layouts, componentes, contenido
3. **Migración a Figma** usando el MCP de Figma — el HTML sirve como referencia visual 1:1

**Cobertura actual: 100% de los flujos principales** del CRM en los 4 roles + auth completo.

---

**Versión:** v1.0 · **Fecha:** Abril 2026 · **Cliente:** Extrucol S.A.S
