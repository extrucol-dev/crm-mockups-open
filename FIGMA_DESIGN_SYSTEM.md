# Design System — CRM Extrucol
> Extraído del código fuente. Úsalo como referencia exacta para recrear el UI en Figma.

---

## 1. Paleta de colores

### Colores base
| Token | Hex | Uso |
|---|---|---|
| `primary` | `#24388C` | Sidebar, botón primario, links activos, bordes focus |
| `primary-dark` | `#1B2C6B` | Hover de botón primario |
| `accent` | `#F39610` | Logo "Extrucol", valor pipeline, avatar del usuario activo |
| `page-bg` | `#F7F7F7` | Fondo de toda la página |
| `surface` | `#FFFFFF` | Cards, Topbar, formularios, sidebar (no — ver sidebar) |
| `border` | `#F0F0F0` | Borde de cards, separadores internos, Topbar |
| `border-input` | `#D5D5D5` | Borde de inputs en estado normal |

### Texto
| Token | Hex | Uso |
|---|---|---|
| `text-primary` | `#1A1A1A` | Títulos, valores numéricos, texto bold |
| `text-secondary` | `#4A4A4A` | Labels de formulario, texto cuerpo |
| `text-muted` | `#6B6B6B` | Subtítulos, hints, breadcrumbs, fechas |
| `text-disabled` | `#ABABAB` | Placeholders, empty states, loading label |

### Feedback
| Token | Hex | Uso |
|---|---|---|
| `error` | `#C0392B` | Texto de error, asterisco requerido |
| `error-bg` | `#FDECEA` | Fondo de alerta de error |
| `error-border` | `#F5C6C6` | Borde de alerta de error |
| `success` | `#1A8754` | Badge verde, actividades completadas |
| `success-bg` | `#E8F5EE` | Fondo de badge verde |
| `green-bright` | `#22C55E` | Indicador actividad completada, oportunidad ganada |

### Kanban / Estados
| Estado | Dot color | Badge bg | Badge text |
|---|---|---|---|
| PROSPECTO | `#3B82F6` | `#EEF1FA` | `#24388C` |
| CALIFICACION | `#F97316` | `#FFF4E0` | `#C7770D` |
| PROPUESTA | `#A855F7` | `#F3E8FF` | `#7C3AED` |
| NEGOCIACION | `#EAB308` | `#F3E8FF` | `#7C3AED` |
| GANADA | `#22C55E` | `#E8F5EE` | `#1A8754` |
| PERDIDA | `#EF4444` | `#FDECEA` | `#C0392B` |

### Sidebar
| Elemento | Valor |
|---|---|
| Background | `#24388C` |
| Nav item activo bg | `rgba(255,255,255,0.12)` |
| Nav item activo borde izquierda | `#F39610` (3px) |
| Nav item hover bg | `rgba(255,255,255,0.07)` |
| Texto item normal | `rgba(255,255,255,0.60)` |
| Texto item activo | `#FFFFFF` |
| Texto secundario | `rgba(255,255,255,0.40)` |
| Separadores | `rgba(255,255,255,0.10)` |

---

## 2. Tipografía

**Font family:** `Roboto` (importada vía Google Fonts)

| Escala | px | Weight | Tracking | Uso |
|---|---|---|---|---|
| `heading-xl` | 32px | 800 | -0.04em | Título panel izquierdo Login |
| `heading-lg` | 24px | 800 | -0.03em | Título "Bienvenido de nuevo" en Login |
| `heading-md` | 17px | 700 | tight | Título de página (Topbar) |
| `heading-sm` | 15px | 700 | normal | Título de card/sección |
| `heading-xs` | 14px | 700 | normal | Subencabezados de card |
| `body` | 13.5px | 400 | normal | Texto de inputs, contenido |
| `label` | 13px | 600 | normal | Labels de formulario |
| `small` | 12–12.5px | 400 | normal | Info secundaria, fechas |
| `xs` | 11.5px | 400/600 | normal | Badges, hints, errores |
| `xxs` | 10.5–11px | 600–700 | wide | Contadores de kanban, labels uppercase |

---

## 3. Espaciado y layout

### Layout principal
```
┌─────────────────────────────────────────────┐
│  Sidebar 240px (fixed)  │  Main area (flex) │
│                         │  ┌─── Topbar 60px ┤
│                         │  └─── Content p-6 ┤
└─────────────────────────────────────────────┘
```

| Elemento | Valor |
|---|---|
| Sidebar width (desktop) | `240px` (w-60) |
| Topbar height | `60px` |
| Content padding desktop | `24px` (p-6) |
| Content padding mobile | `16px` (p-4) |
| Gap entre cards | `12px` (gap-3) o `16px` (gap-4) |
| Padding interno card | `20px` (p-5) o `24px` (p-6) |

### Grid de cards
| Contexto | Columnas |
|---|---|
| Stat cards (Dashboard) | 2 cols mobile → 4 cols desktop |
| Cliente cards | 1 col → 2 cols sm → 3 cols xl |
| Kanban activo | 2 cols → 4 cols lg |
| Kanban cerrado | 2 cols |
| Secciones dashboard | 1 col → 2 cols lg |

---

## 4. Componentes

### Card base
```
bg: #FFFFFF
border: 1px solid #F0F0F0
border-radius: 12px (rounded-xl)
box-shadow: 0 1px 2px rgba(0,0,0,0.05) (shadow-sm)
```

**Card con header y body separados:**
- Header: `px-20 py-16, border-bottom: 1px solid #F0F0F0`
- Body: `px-20 py-16`

---

### StatCard (dashboard)
```
┌──────────────────────────┐
│ LABEL EN MAYÚSCULAS      │  11px, 600w, #ABABAB, tracking-wider
│                          │
│ 42                       │  26px, 800w, color variable
│ subtexto opcional        │  12px, #6B6B6B
└──────────────────────────┘
```
- Colores de valor: `#24388C` (default), `#F39610` (dinero), `#1A8754` (verde), `#22C55E` (ganadas)

---

### Badge
```
border-radius: 9999px (rounded-full)
padding: 2px 10px (py-0.5 px-2.5)
font-size: 11.5px
font-weight: 600
```
Variantes: ver tabla de colores → sección Kanban/Estados

---

### Input / Select / Textarea
```
height: ~38px (py-[9px])
padding horizontal: 12px (px-3)
font-size: 13.5px
color: #1A1A1A
background: #FFFFFF
border-radius: 6px (rounded-md)
border normal: 1px solid #D5D5D5
border focus: 1px solid #24388C + ring 2px #24388C/15
border error: 1px solid #C0392B + ring 2px #C0392B/10
placeholder color: #ABABAB
```

**Label de campo:**
- `13px, 600w, #4A4A4A`
- Asterisco requerido: `#C0392B`
- Margin bottom label→input: `6px`

---

### Botón primario
```
background: #24388C
hover: #1B2C6B
border-radius: 6px (rounded-md)
padding: 10px 20px (py-2.5 px-5)
font-size: 13px
font-weight: 600
color: #FFFFFF
disabled: opacity 60%
```

### Botón secundario (cancelar)
```
background: transparent
border: 1px solid #D5D5D5
hover background: #F7F7F7
color: #4A4A4A
(mismos border-radius y padding que primario)
```

### Botón de texto (link)
```
color: #24388C
hover: underline o color #1B2C6B
font-size: 12–13px, 600w
```

---

### FormCard (contenedor de formulario)
```
max-width: 672px (max-w-2xl)
centrado horizontalmente
bg: #FFFFFF
border: 1px solid #F0F0F0
border-radius: 12px
shadow-sm
título: 15px, 700w, #1A1A1A en header con border-bottom
```

---

### Topbar
```
bg: #FFFFFF
border-bottom: 1px solid #F0F0F0
height: 60px (desktop)
padding: 0 24px (px-6)
position: sticky top-0
z-index: 30
título: 17px, 700w, #1A1A1A
```

---

### Avatar de usuario (iniciales)
```
size: 32x32px (w-8 h-8) — sidebar
size: 40x40px (w-10 h-10) — cliente card
border-radius: 50%
background: #F39610 (usuario activo en sidebar)
background: variable por nombre (cliente cards) — colores: #24388C #7C3AED #1A8754 #C2410C #0369A1 #B45309
font-size: 12–13px, 700w, #FFFFFF
```

---

### Kanban Column
```
Header:
  - Dot de color: 8x8px, rounded-full
  - Label: 12px, 700w, #4A4A4A
  - Contador: rounded-full, bg #F0F0F0, text #6B6B6B, 10.5px, 600w
  - Línea de color debajo del header: 2px, opacity 40%

Drop zone activa:
  - bg: #EEF1FA
  - ring: 2px #24388C/30
  - border dashed activa: #24388C

Empty state:
  - border: 1px dashed #E5E5E5
  - border-radius: 8px
  - texto: 11.5px, #ABABAB
```

---

### KanbanCard
```
bg: #FFFFFF
border: 1px solid #F0F0F0
border-radius: 12px
padding: 16px
shadow-sm
hover: border #24388C, shadow-md

Estructura:
  1. Badge de estado (top)
  2. Nombre oportunidad: 13.5px, 700w, #1A1A1A
  3. Empresa: 12px, #6B6B6B
  4. Valor: 14px, 700w, #1A1A1A
  5. Footer separado con border-top #F0F0F0
     - fecha: 11px, #ABABAB
     - avatar empresa: 20x20px
```

---

### Cliente Card (grid)
```
bg: #FFFFFF
border: 1px solid #F0F0F0  →  hover: #24388C
border-radius: 12px
padding: 16px (p-4)
cursor: pointer

Estructura:
  Header: avatar (40px) + nombre (14px 700w) + empresa (12.5px #6B6B6B) + badge sector
  Info: filas con ícono (14px #ABABAB) + texto (12.5px #4A4A4A)
  Footer (border-top): fecha registro (11.5px #ABABAB) + chevron
```

---

### Alerta de error (API)
```
bg: #FDECEA
border: 1px solid #F5C6C6
border-radius: 6px
padding: 12px 16px
color: #C0392B
font-size: 14px
ícono warning: w-4 h-4
```

---

### Loading Spinner
```
color: #ABABAB
ícono SVG animate-spin: 16x16px
texto: 14px
centrado con padding vertical 64px
```

---

### Empty State
```
ícono en círculo: 48x48px, bg #F0F0F0, ícono #ABABAB (24px)
título: 15px, 700w, #4A4A4A
descripción: 13px, #6B6B6B, max-width 320px
acción: botón primario
centrado, padding vertical 64px
```

---

## 5. Pantallas del sistema

### Login (`/login`) — split layout full-screen
```
Grid 2 columnas (solo desktop):
  Columna izquierda (50%):
    bg: #24388C
    Decoración: radial gradient naranja top-right, blanco bottom-left
    Título: "Seguimiento Comercial\nExtrucol" — 32px, 800w, blanco / naranja
    Subtítulo: 15px, rgba(255,255,255,0.6)
    3 features: ícono en bg rgba(255,255,255,0.10) rounded-xl + texto 14px rgba(255,255,255,0.75)

  Columna derecha (50%):
    bg: #FFFFFF
    Contenido centrado, max-width 380px
    - Ícono usuario en cuadrado #EEF1FA rounded-xl (40x40px)
    - Título 24px, 800w
    - Subtítulo 14px, #6B6B6B
    - Campos Email + Contraseña
    - Link "¿Olvidaste tu contraseña?" right-aligned, #24388C
    - Botón "Ingresar al sistema" full-width
    - Botón "Continuar con Google" (borde gris, logo Google)
    - Footer: "Sistema CRM · Extrucol S.A.S · v1.0" 12px, #ABABAB, centrado
```

---

### Layout general (páginas autenticadas)
```
Sidebar fijo izquierda 240px:
  - Logo "CRM Extrucol" blanco/naranja, 17px 800w
  - "Sistema Comercial" 11px rgba(255,255,255,0.40)
  - Avatar usuario + nombre + rol
  - Nav items por rol
  - Botón logout fondo

Main area:
  - Topbar sticky (título o breadcrumb + acciones)
  - Content: bg #F7F7F7, padding p-6
```

---

### Dashboard Ejecutivo (`/dashboard`)
```
Topbar: "Mi Dashboard"
Contenido:
  Row 1: 4 StatCards (2→4 columnas)
    - Oportunidades activas  (#24388C)
    - Pipeline activo        (#F39610)
    - Actividades semana     (#1A8754)
    - Oportunidades ganadas  (#22C55E)

  Row 2: 2 columnas
    - Card "Oportunidades por estado":
        list de estados con Badge + barra progreso (#24388C) + contador
    - Card "Mis últimas actividades":
        list items con dot (verde/azul) + tipo + descripción + fecha + badge estado
```

---

### Oportunidades Kanban (`/oportunidades`)
```
Topbar: "Mis Oportunidades" + botón "Nueva"

Desktop: 4 columnas activas (PROSPECTO / CALIFICACION / PROPUESTA / NEGOCIACION)
  + toggle "Cerradas" con contador ganadas/perdidas
  + 2 columnas cerradas al expandir

Mobile: tabs scrollables horizontales con color de estado
```

---

### Clientes Lista (`/clientes`)
```
Topbar: "Mis Clientes" + botón "Nuevo cliente"
Grid de ClienteCards (1→2→3 columnas)
```

---

### Formularios (crear/editar)
```
Topbar: breadcrumb (módulo > acción)
FormCard centrado max-w-2xl:
  Grid de campos (1 o 2 columnas según espacio)
  FormActions: [Cancelar] [Guardar]
```

---

## 6. Iconografía

Todos los íconos son **Heroicons v2 outline**, stroke 1.5–1.8px, sin fill.

| Ícono | Nombre Heroicons |
|---|---|
| Dashboard/Home | `home` |
| Usuarios/Clientes | `users` |
| Oportunidades | `briefcase` |
| Actividades | `clipboard-document-list` |
| Proyectos | `folder` |
| Director/Charts | `chart-bar` |
| Usuario único | `user` |
| Logout | `arrow-left-on-rectangle` |
| Menú hamburguesa | `bars-3` |
| Cerrar | `x-mark` |
| Chevron derecha | `chevron-right` |
| Chevron abajo | `chevron-down` |
| Ubicación | `map-pin` |
| Teléfono | `phone` |
| Email | `envelope` |
| Alerta | `exclamation-triangle` |
| Vacío | `archive-box` |

**Tamaños usados:**
- Nav sidebar: `16x16px` (w-4 h-4)
- Topbar / acciones: `20x20px` (w-5 h-5)
- Decorativo en cards: `24x24px` (w-6 h-6)
- Feature icons login: `20x20px`

---

## 7. Resumen de tokens para Figma Variables

```
── Colors ──────────────────────────────
primary/default     #24388C
primary/dark        #1B2C6B
primary/bg          #EEF1FA

accent/default      #F39610
accent/bg           #FFF4E0

surface/page        #F7F7F7
surface/card        #FFFFFF
surface/sidebar     #24388C

border/default      #F0F0F0
border/input        #D5D5D5

text/primary        #1A1A1A
text/secondary      #4A4A4A
text/muted          #6B6B6B
text/disabled       #ABABAB

feedback/error      #C0392B
feedback/error-bg   #FDECEA
feedback/success    #1A8754
feedback/success-bg #E8F5EE
feedback/green      #22C55E
feedback/blue       #3B82F6
feedback/purple     #7C3AED
feedback/orange     #F97316
feedback/yellow     #EAB308
feedback/red        #EF4444

── Typography ──────────────────────────
font-family    Roboto, sans-serif
heading-xl     32px / 800
heading-lg     24px / 800 / -0.03em
heading-md     17px / 700
heading-sm     15px / 700
heading-xs     14px / 700
body           13.5px / 400
label          13px / 600
small          12px / 400
xs             11.5px / 600
xxs            10.5px / 700

── Radii ───────────────────────────────
radius-sm      6px   (inputs, botones)
radius-md      8px   (empty state dashed)
radius-lg      12px  (cards, kanban columns)
radius-full    9999px (badges, avatares)

── Shadows ─────────────────────────────
shadow-sm      0 1px 2px rgba(0,0,0,0.05)
shadow-md      0 4px 6px rgba(0,0,0,0.07)

── Spacing ─────────────────────────────
spacing-1   4px
spacing-2   8px
spacing-3   12px
spacing-4   16px
spacing-5   20px
spacing-6   24px
```