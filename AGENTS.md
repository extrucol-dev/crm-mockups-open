# AGENTS.md — CRM Extrucol Mockups

## What this repo is

Pure HTML/CSS/JS mockups at 1440px desktop width. No build system, no package manager. Open `index.html` in a browser to navigate all screens.

## Design system

- **Design tokens**: `shared/tokens.css` (CSS custom properties — colors, typography, radii, shadows)
- **Component library**: `shared/components.css` (40+ CSS component classes)
- **Shared JS**: `shared/components.js` (Heroicons v2 outline SVGs + `renderSidebar()`, `renderTopbar()`)
- **Icons**: Heroicons v2, used as inline SVG strings in the `Icons` object

## Role directories

| Directory | Role | Files |
|-----------|------|-------|
| `ejecutivo/` | Ejecutivo Comercial | 17 |
| `coordinador/` | Coordinador de Seguimiento | 7 |
| `director/` | Director Comercial | 6 |
| `admin/` | Administrador | 2 |
| `auth/` | Auth (Login/Reset) | 2 |

## Sidebar path resolution

`renderSidebar()` in `shared/components.js` auto-detects its role from `window.location.pathname`. Don't move HTML files between role directories without updating their sidebar calls.

## Key token values

- Primary: `#24388C` (Extrucol blue)
- Accent: `#F39610` (orange)
- Success: `#1A8754`
- Error: `#C0392B`
- Font: Roboto (Google Fonts via `tokens.css`)

## Local skills

- `.skills/crm-ui-builder/SKILL.md` — comprehensive page and modal patterns, templates, component examples, and workflow guides for all roles. **Use this for any UI work.**