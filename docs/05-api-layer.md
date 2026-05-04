# 05 - Capa de API (api/)

La carpeta `vite-project/src/api/` contiene toda la logica de comunicacion entre el frontend y el servidor. Esta separacion es una buena practica: los componentes solo llaman funciones, sin saber como se hace la peticion HTTP.

```
api/
├── utils.js        — toLower(), unwrap()
├── apexClient.js   — Cliente para APEX On-Demand Processes
├── dashboardApi.js — API del dashboard via APEX
└── clientesApi.js  — API de clientes CRUD via APEX
```

---

## `utils.js`

Las dos exportaciones mas importantes del proyecto.

### `toLower(val)`

```js
export const toLower = (val) => {
  if (Array.isArray(val)) return val.map(toLower)
  if (val !== null && typeof val === 'object') {
    return Object.fromEntries(
      Object.entries(val).map(([k, v]) => [k.toLowerCase(), toLower(v)])
    )
  }
  return val
}
```

Convierte **recursivamente** todas las claves de un objeto a minusculas. Funciona con objetos anidados y arrays de objetos.

**Ejemplo:**
```js
toLower({ INGRESOS_TOTAL: 450000, VENTAS: [{ ID: 1 }] })
// → { ingresos_total: 450000, ventas: [{ id: 1 }] }
```

**Por que es necesario?**
Oracle devuelve nombres de columna en MAYUSCULAS por defecto. Sin esta funcion, el componente tendria que escribir `k.INGRESOS_TOTAL` en vez de `k.ingresos_total`.

### `unwrap(payload)`

```js
export const unwrap = (payload) => {
  if (!payload) return null
  const p = toLower(payload)
  if (Array.isArray(p))       return p
  if (Array.isArray(p.data))  return p.data
  if (Array.isArray(p.items)) return p.items
  if (Array.isArray(p.rows))  return p.rows
  return p
}
```

Extrae el array de datos del payload, sin importar como lo envuelva el servidor.

| Payload recibido | Lo que devuelve `unwrap` |
|-----------------|--------------------------|
| `[{...}, {...}]` | `[{...}, {...}]` — ya es un array |
| `{ "data": [{...}] }` | `[{...}]` — extrae `data` |
| `{ "items": [{...}] }` | `[{...}]` — extrae `items` |
| `{ "rows": [{...}] }` | `[{...}]` — extrae `rows` |
| `{ "kpi": 42 }` | `{ "kpi": 42 }` — objeto plano, lo devuelve tal cual |

---

## `apexClient.js`

Unico archivo que sabe como hablar con el motor APEX.

### `getApexEnv()`

```js
const getApexEnv = () => {
  const env = window.apex?.env || {}

  const appId = String(env.APP_ID || '')
             || document.querySelector('[name="p_flow_id"]')?.value
             || ''
  // ... similar para pageId y session
  return { appId, pageId, session }
}
```

Lee tres valores que APEX inyecta en la pagina:
- `APP_ID` — ID de la aplicacion APEX (ej. `100`)
- `APP_PAGE_ID` — ID de la pagina actual (ej. `1`)
- `APP_SESSION` — ID de sesion del usuario (token de autenticacion)

Primero intenta `window.apex.env` (objeto JS que APEX expone). Si no esta disponible, busca los campos ocultos del DOM que APEX siempre incluye. Esta doble estrategia garantiza compatibilidad con APEX 20.1 y versiones posteriores.

### `callProcess(processName, extras)`

```js
const callProcess = async (processName, extras = {}) => {
  const { appId, pageId, session } = getApexEnv()

  const body = new URLSearchParams({
    p_request:      `APPLICATION_PROCESS=${processName}`,
    p_flow_id:      appId,
    p_flow_step_id: pageId,
    p_instance:     session,
  })

  // Agregar parametros extras (x01, x02, etc.)
  Object.entries(extras).forEach(([k, v]) => {
    if (v !== undefined && v !== null) body.append(k, String(v))
  })

  const res = await fetch('/apex/wwv_flow.ajax', {
    method:      'POST',
    body,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept':       'application/json',
    },
  })

  if (!res.ok) throw new Error(`APEX process ${processName} HTTP ${res.status}`)
  return JSON.parse(await res.text())
}
```

Es la funcion central del cliente APEX. Hace el POST a `wwv_flow.ajax` con los parametros correctos y devuelve el JSON parseado.

**`credentials: 'include'`** es importante: envia las cookies de sesion APEX en la peticion. Sin esto, APEX rechazaria la llamada por no estar autenticado.

### APIs exportadas

```js
export const apexDashboardApi = {
  kpis:            ()           => callProcess('DASH_KPIS'),
  ventasMensuales: ()           => callProcess('DASH_VENTAS_MENSUALES'),
  topProductos:    (limit = 5)  => callProcess('DASH_TOP_PRODUCTOS', { x01: limit }),
  ventasCategoria: ()           => callProcess('DASH_VENTAS_CATEGORIA'),
  ventasRegion:    ()           => callProcess('DASH_VENTAS_REGION'),
  ultimasVentas:   (limit = 10) => callProcess('DASH_ULTIMAS_VENTAS', { x01: limit }),
}

export const apexClientesApi = {
  list:   ()     => callProcess('CLIENTES_LIST'),
  create: (data) => callProcess('CLIENTES_CREATE', {
    x01: data.nombre, x02: data.email, x03: data.ciudad, x04: data.pais,
  }),
  update: (data) => callProcess('CLIENTES_UPDATE', {
    x01: data.id, x02: data.nombre, x03: data.email, x04: data.ciudad, x05: data.pais,
  }),
  delete: (id) => callProcess('CLIENTES_DELETE', { x01: id }),
}
```

Cada funcion devuelve una Promesa con el JSON crudo del servidor.

---

## `dashboardApi.js`

Exporta un objeto `dashboardApi` que llama a `apexClient` y normaliza la respuesta con `unwrap`.

```js
export const dashboardApi = {
  kpis:            ()           => apexGet(apexDashboardApi.kpis),
  ventasMensuales: ()           => apexGet(apexDashboardApi.ventasMensuales),
  topProductos:    (limit = 5)  => apexGet(() => apexDashboardApi.topProductos(limit)),
  ventasCategoria: ()           => apexGet(apexDashboardApi.ventasCategoria),
  ventasRegion:    ()           => apexGet(apexDashboardApi.ventasRegion),
  ultimasVentas:   (limit = 10) => apexGet(() => apexDashboardApi.ultimasVentas(limit)),
}
```

**Funcion `apexGet(apexFn)`:**
```js
const apexGet = async (apexFn) => {
  try {
    const data = await apexFn()
    return unwrap(data)
  } catch (err) {
    console.warn('[dashboardApi] Error en proceso APEX:', err.message)
    throw err
  }
}
```

Llama a la funcion APEX y normaliza con `unwrap`. Los componentes (como `Dashboard.jsx`) siempre reciben un array normalizado.

---

## `clientesApi.js`

Mismo patron que `dashboardApi.js`, pero para el CRUD de clientes.

```js
export const clientesApi = {
  list:   () => apexClientesApi.list().then(fromApex),
  create: (data) => apexClientesApi.create(data).then(toLower),
  update: (data) => apexClientesApi.update(data).then(toLower),
  delete: (id)   => apexClientesApi.delete(id).then(toLower),
}
```

---

## Como fluye una llamada completa (ejemplo: crear cliente)

```
ClientesCrud.jsx
  handleSave({ nombre: 'Acme', email: 'info@acme.com', ciudad: 'CDMX', pais: 'MX' })
    |
    v
clientesApi.create(data)
    |
    v  [APEX_MODE=true]
apexClientesApi.create(data)
    |
    v
callProcess('CLIENTES_CREATE', { x01: 'Acme', x02: 'info@acme.com', x03: 'CDMX', x04: 'MX' })
    |
    v
POST /apex/wwv_flow.ajax
  p_request=APPLICATION_PROCESS=CLIENTES_CREATE
  x01=Acme
  x02=info@acme.com
  x03=CDMX
  x04=MX
    |
    v
APEX ejecuta CLIENTES_CREATE -> pkg_clientes.p_create(...)
    |
    v
INSERT INTO clientes (nombre, email, ciudad, pais) VALUES (...)
RETURNING id INTO l_id
    |
    v
APEX_JSON: { "id": 9, "success": true }
    |
    v
toLower({ id: 9, success: true })
    |
    v
ClientesCrud.jsx: closeModal() + load()  -> recarga la lista
```
