# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Static HTML/CSS/JS mockups of the **CRM Extrucol** commercial system. Pure frontend artifacts designed for client review and later migration to Figma — **no build system, no package manager, no tests, no server**. Every page is a fully self-contained HTML file.



## Architecture

### Three-layer structure

1. **Shared design system** (`shared/`) — loaded by every page:
   - `tokens.css` — CSS custom properties (colors, typography, radii, shadows). Loads Roboto from Google Fonts.
   - `components.css` — 40+ component classes (buttons, cards, kanban, tables, modals, badges, etc.).
   - `components.js` — Heroicons v2 outline SVGs exposed as the global `Icons` object, plus `renderSidebar(activeId, role)` and `renderTopbar({title, actions, breadcrumb})`.

2. **Role directories** — one per user role, each file is an independent screen:
   - `ejecutivo/` — Ejecutivo Comercial (field sales, 18 files)
   - `coordinador/` — Coordinador de Seguimiento (supervisor, 10 files)
   - `director/` — Director Comercial (strategic, 8 files)
   - `admin/` — Administrador (system config, 2 files)
   - `auth/` — Login/Reset (2 files)

### Page skeleton convention

Every page follows the same pattern: load `tokens.css` + `components.css`, render inside a 1440px-wide container, inject sidebar + topbar + content via `components.js` helpers. See `.skills/crm-ui-builder/SKILL.md` for the canonical skeleton.

### Sidebar path resolution is role-directory-coupled

`renderSidebar()` in `shared/components.js` auto-detects the role from `window.location.pathname` (checks for `/ejecutivo/`, `/director/`, `/coordinador/`, `/admin/`). **Moving an HTML file between role directories will break its sidebar routes** — update the directory or the sidebar call accordingly.

### Modals are inline, not files

Modals live inside their parent page's `<script>` block and render into `modalRoot`. The common pattern (used across Ejecutivo pages): `openModal(html)` appends to `#shell`, `closeModal()` removes the last `.modal-overlay`. Coordinador pages use a separate `#modal-root` div with `position: relative` wrapper. See AGENTS.md and `.skills/crm-ui-builder/SKILL.md` for full modal patterns.

### File naming

`{XX}-{slug}.html` inside the role directory, where `XX` is a zero-padded sequence number. The number is per-directory, not global.

## Design tokens (canonical values)

- **Primary**: `#24388C` (Extrucol blue) · **Accent**: `#F39610` (orange)
- **Success**: `#1A8754` · **Error**: `#C0392B`
- **Font**: Roboto 400/500/600/700/800
- **Radii**: `--radius-sm: 6px` · `--radius-md: 8px` · `--radius-lg: 12px` · `--radius-full: 9999px`

When building new UI, always reference `var(--primary)` etc. rather than hex literals — tokens are the source of truth.

## Reference documents

- **`CRM_ER_v4.md`** — the entity-relationship model. Mockups reference these tables (`CRM_LEAD`, `CRM_OPORTUNIDAD`, `CRM_EMPRESA`, `CRM_ACTIVIDAD`, `CRM_PROYECTO`, `CRM_USUARIO`, `CRM_CONFIGURACION_SISTEMA`, etc.). Consult it when a screen needs new fields or entities.
- **`FIGMA_DESIGN_SYSTEM.md`** — full design system spec (colors, typography, spacing scale, component specs). The CSS in `shared/` is the implementation of this spec.
- **`AGENTS.md`** — condensed architecture notes + per-role button→modal/target mapping tables. Check this before adding navigation or modals to avoid duplicating existing flows.

## Local skills

The `.skills/` directory contains project-specific skills loaded on demand:

- **`crm-ui-builder`** — comprehensive patterns for building pages and modals in this design system (page skeleton, layout patterns, component snippets, per-role file maps and button→target mappings). Invoke this whenever the task involves creating or modifying a screen/modal.
- **`skill-creator`** — create, improve, evaluate, and optimize Claude skills. Use when the user wants to create a new skill from scratch, edit an existing skill, run evals, benchmark performance, or optimize a skill's description. Invoke via `/skill-creator` or whenever the user mentions creating/improving a skill.

## Working conventions

- **Responsive**: README claims 3 breakpoints (1440/768/375) but current mockups are desktop-only at 1440px. Confirm scope before adding responsive variants.
- **Icons**: use `${Icons.iconName}` in template strings — never inline SVG directly. See the `Icons` object in `shared/components.js` for the full list.
- **Badges for opportunity/lead states**: use the canonical classes `badge--prospecto`, `badge--calificacion`, `badge--propuesta`, `badge--negociacion`, `badge--ganada`, `badge--perdida` (see AGENTS.md "State Colors" table).
- **Avatar color variants**: `avatar--color-1` through `avatar--color-6` plus `avatar--accent` — deterministic per user/entity, not random.
- **Language**: all user-facing copy is in Spanish (Colombian business context — Extrucol S.A.S).
