# 06 - Variables de entorno y despliegue

---

## Variables de entorno

Vite carga archivos `.env` automaticamente segun el modo de ejecucion:

| Archivo | Cuando se carga |
|---------|-----------------|
| `.env` | Siempre (base) |
| `.env.development` | Solo con `npm run dev` |
| `.env.production` | Solo con `npm run build` |
| `.env.local` | Siempre, ignorado por git (secretos locales) |

> Solo las variables que empiezan con `VITE_` son accesibles en el codigo React. Las demas son privadas del proceso de build.

### Variables de este proyecto

#### `VITE_APEX_MODE`

| Valor | Descripcion |
|-------|-------------|
| `true` | Usa APEX On-Demand Processes (POST a wwv_flow.ajax) |

```bash
# .env.production
VITE_APEX_MODE=true
```

---

## Archivos `.env` del proyecto

### `.env.example`

```env
# En produccion (.env.production):
VITE_APEX_MODE=true
```

### `.env.production` (para el build de APEX)

```env
VITE_APEX_MODE=true
```

---

## Como funciona el build de produccion

```bash
cd vite-project
npm run build
```

Vite genera la carpeta `dist/` con:

```
dist/
├── index.html
└── assets/
    ├── app.js       <- Bundle principal (JS)
    ├── app.css      <- Estilos (CSS)
    └── index.js     <- Chunks de librerias
```

Los nombres son fijos (sin hash en el nombre del archivo), configurado en `vite.config.js`:

```js
build: {
  rollupOptions: {
    output: {
      entryFileNames: 'assets/app.js',      // sin hash tipo app.abc123.js
      chunkFileNames: 'assets/[name].js',
      assetFileNames: 'assets/[name][extname]',
    },
  },
},
```

Esto es intencional: facilita referenciar los archivos desde APEX sin tener que actualizar las rutas cada vez que se hace un build.

---

## Despliegue en Oracle APEX

### Opcion A: Static Application Files (recomendada)

1. Hacer `npm run build` en `vite-project/`.

2. En APEX Builder:
   ```
   App Builder → Tu Aplicacion → Shared Components → Static Application Files
   ```

3. Subir todos los archivos de `dist/assets/` y el `dist/index.html`.

4. En la pagina APEX donde quieres mostrar la app React, agregar una region de tipo **Static Content** con este HTML:

   ```html
   <div id="root"></div>
   <link rel="stylesheet" href="#APP_FILES#assets/app.css">
   <script type="module" src="#APP_FILES#assets/app.js"></script>
   ```

   `#APP_FILES#` es una sustitucion de APEX que apunta al directorio de archivos estaticos de la aplicacion.

### Opcion B: Static Workspace Files

Igual que la opcion A pero en:
```
APEX Builder → Workspace Utilities → Static Workspace Files
```

Util si varias aplicaciones del workspace comparten el mismo frontend.

### Opcion C: Servidor web externo

Servir los archivos de `dist/` desde un servidor web (Apache, Nginx) en el mismo dominio que APEX. En este caso, la app React hace las llamadas APEX al mismo origen, sin problemas de CORS.

---

## Diagrama de despliegue completo

```
┌─────────────────────────────────────────────────────────────┐
│  Tu PC (desarrollo)                                         │
│                                                              │
│  npm run dev → localhost:5173                               │
└───────────────────────────┬─────────────────────────────────┘
                            |
                            | Cuando está listo:
                            v
┌─────────────────────────────────────────────────────────────┐
│  npm run build                                              │
│  Genera dist/ con assets/app.js, assets/app.css            │
└───────────────────────────┬─────────────────────────────────┘
                            |
                            v
┌─────────────────────────────────────────────────────────────┐
│  Oracle APEX (servidor)                                     │
│                                                              │
│  Static Application Files:                                  │
│    /f?p=APP:1 → index.html (con div#root)                  │
│    #APP_FILES#assets/app.js                                 │
│    #APP_FILES#assets/app.css                                │
│                                                              │
│  Application Processes (10 procesos On-Demand):             │
│    DASH_KPIS, DASH_VENTAS_MENSUALES, ...                   │
│    CLIENTES_LIST, CLIENTES_CREATE, ...                      │
│                                                              │
│  Base de datos Oracle:                                      │
│    Tablas, vistas, pkg_dashboard, pkg_clientes              │
└─────────────────────────────────────────────────────────────┘
```

---

## Checklist de despliegue

Antes de subir a produccion, verificar:

- [ ] `sql/01_tables.sql` ejecutado en el esquema correcto
- [ ] `sql/02_views_package.sql` ejecutado sin errores (`SHOW ERRORS` no muestra nada)
- [ ] `sql/07_crud_clientes.sql` ejecutado sin errores
- [ ] Los 10 Application Processes creados en APEX Builder (ver [03-apex-configuracion.md](03-apex-configuracion.md))
- [ ] `.env.production` tiene `VITE_APEX_MODE=true`
- [ ] `npm run build` completado sin errores
- [ ] Archivos de `dist/` subidos a Static Application Files
- [ ] La pagina APEX referencia `app.js` y `app.css` correctamente
- [ ] La pagina APEX tiene el div `<div id="root"></div>`
- [ ] La aplicacion APEX esta publicada y el usuario tiene sesion activa

---

## Errores comunes y soluciones

### "APEX process DASH_KPIS HTTP 404"

El Application Process no existe o el nombre esta mal escrito. Verificar en Shared Components → Application Processes.

### "window.apex is undefined"

La app React se esta ejecutando fuera de una sesion APEX (ej. abriendo el HTML directamente). Debe cargarse desde una pagina APEX activa.

### Los KPIs muestran 0 o null

El proceso existe pero devuelve datos vacios. Verificar:
1. Las tablas tienen datos: `SELECT COUNT(*) FROM ventas WHERE estado='PAGADA'`
2. El paquete `pkg_dashboard` esta compilado sin errores: `SHOW ERRORS PACKAGE BODY pkg_dashboard`

### "No se pudo cargar el dashboard" (banner rojo)

Abrir la consola del navegador (F12) y revisar el error en la pestana Network o Console. Busca el request fallido a `/api/dashboard/kpis` o al endpoint APEX.
