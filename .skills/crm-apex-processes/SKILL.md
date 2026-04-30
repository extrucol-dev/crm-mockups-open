---
name: crm-apex-processes
description: >-
  CRM Extrucol APEX On-Demand Application Processes. SIEMPRE USA cuando: crear proceso APEX,
  escribir PL/SQL para el CRM, agregar Application Process, conectar React a Oracle, definir
  endpoint APEX, escribir APEX_JSON, leer parámetros x01 x02 xN, crear package PL/SQL para
  el CRM. Trigger on: "proceso APEX", "application process", "APEX_JSON", "PL/SQL proceso",
  "callProcess", "conectar frontend", "G_X01", "proceso on-demand", "crear proceso",
  "LEADS_LIST", "OPP_", "DASH_", cualquier nombre de proceso en mayúsculas.
---

# CRM Extrucol — APEX On-Demand Processes

Crea Application Processes en Oracle APEX que el frontend React consume via `callProcess()`.

---

## Cómo crear un proceso en APEX Builder

```
App Builder → Tu Aplicación → Shared Components → Application Processes → Create
```

| Campo | Valor |
|---|---|
| **Name** | `FEATURE_ACCION` en MAYÚSCULAS (ej: `LEADS_LIST`) |
| **Sequence** | 10, 20, 30... (cualquier número) |
| **Point** | **On Demand — Run this application process when requested by a page** |
| **Type** | PL/SQL Anonymous Block |
| **Source** | El PL/SQL del proceso |

---

## Convención de nombres

```
{FEATURE}_{ACCION}

LEADS_LIST          LEADS_GET           LEADS_CREATE
LEADS_UPDATE        LEADS_DESCALIFICAR  LEADS_CONVERTIR
OPP_LIST            OPP_GET             OPP_CREATE
OPP_CERRAR_GANADA   OPP_CERRAR_PERDIDA
DASH_EJECUTIVO_KPIS DASH_DIRECTOR_KPIS
CLIENTES_LIST       CLIENTES_CREATE     CLIENTES_UPDATE
AUTH_SESSION        SESSION_INFO
```

---

## Patrón de paquetes del proyecto

Cada feature tiene un paquete `CRM_{FEATURE}_API` con procedimientos que:
1. Aceptan `p_result OUT SYS_REFCURSOR` como primer parámetro
2. Aceptan `p_x01..p_xN IN VARCHAR2` para los parámetros del frontend
3. Siempre devuelven datos por el cursor — incluso mutaciones devuelven `{success, id}`

```
CRM_LEADS_API         → procedimientos LEADS_*
CRM_OPP_API           → procedimientos OPP_*
CRM_CLIENTES_API      → procedimientos CLIENTES_*
CRM_ACTIVIDADES_API   → procedimientos ACTIVIDADES_*
CRM_PROYECTOS_API     → procedimientos PROYECTOS_*
CRM_DASHBOARD_API     → procedimientos DASH_*
CRM_ADMIN_API         → procedimientos ADMIN_*
```

---

## Template: Application Process en APEX Builder

**Para todos los procesos** — lectura y escritura usan el mismo patrón:

```sql
-- Process Name: LEADS_LIST
-- Point: On Demand - Run this application process when requested by a page
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  CRM_LEADS_API.LEADS_LIST(
    p_result => l_cur,
    p_x01    => APEX_APPLICATION.G_X01,   -- id_estado_lead (filtro)
    p_x02    => APEX_APPLICATION.G_X02    -- id_usuario (filtro)
  );
  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
```

```sql
-- Process Name: LEADS_CREATE
DECLARE
  l_cur SYS_REFCURSOR;
BEGIN
  CRM_LEADS_API.LEADS_CREATE(
    p_result => l_cur,
    p_x01    => APEX_APPLICATION.G_X01,   -- titulo
    p_x02    => APEX_APPLICATION.G_X02,   -- descripcion
    p_x03    => TO_NUMBER(APEX_APPLICATION.G_X03),  -- score
    p_x04    => TO_NUMBER(APEX_APPLICATION.G_X04),  -- id_estado_lead
    p_x05    => TO_NUMBER(APEX_APPLICATION.G_X05),  -- id_origen_lead
    p_x06    => TO_NUMBER(APEX_APPLICATION.G_X06)   -- id_usuario
  );
  APEX_JSON.OPEN_OBJECT;
  APEX_JSON.WRITE('data', l_cur);
  APEX_JSON.CLOSE_OBJECT;
END;
```

**El cursor de mutaciones devuelve siempre una fila:**
```json
{ "data": [{ "id_lead": 15, "success": "true" }] }
```
El frontend hace `unwrap(resp)` → `[{ id_lead: 15, success: "true" }]` → `result[0]`.

---

## Template: Spec del paquete

```sql
CREATE OR REPLACE PACKAGE CRM_{FEATURE}_API AS

  -- Lectura: cursor con filas
  PROCEDURE {FEATURE}_LIST(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  VARCHAR2 DEFAULT NULL,   -- filtro 1
    p_x02    IN  VARCHAR2 DEFAULT NULL    -- filtro 2
  );

  -- Mutación: cursor con {id, success} o {success, err_msg}
  PROCEDURE {FEATURE}_CREATE(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  VARCHAR2,               -- campo requerido
    p_x02    IN  VARCHAR2 DEFAULT NULL,
    p_x03    IN  NUMBER   DEFAULT NULL
  );

END CRM_{FEATURE}_API;
/
```

---

## Template: Body del paquete

```sql
CREATE OR REPLACE PACKAGE BODY CRM_{FEATURE}_API AS

  PROCEDURE {FEATURE}_LIST(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  VARCHAR2 DEFAULT NULL,
    p_x02    IN  VARCHAR2 DEFAULT NULL
  ) IS
  BEGIN
    OPEN p_result FOR
      SELECT t.id, t.nombre, ...
      FROM   crm_{entidad} t
      WHERE  (p_x01 IS NULL OR t.id_estado = TO_NUMBER(p_x01))
        AND  (p_x02 IS NULL OR t.id_usuario = TO_NUMBER(p_x02))
      ORDER BY t.fecha_creacion DESC;
  END;

  PROCEDURE {FEATURE}_CREATE(
    p_result OUT SYS_REFCURSOR,
    p_x01    IN  VARCHAR2,
    p_x02    IN  VARCHAR2 DEFAULT NULL,
    p_x03    IN  NUMBER   DEFAULT NULL
  ) IS
    v_id NUMBER;
  BEGIN
    INSERT INTO crm_{entidad} (nombre, descripcion, ...)
    VALUES (p_x01, p_x02, ...)
    RETURNING id INTO v_id;

    OPEN p_result FOR
      SELECT v_id AS id, 'true' AS success FROM DUAL;
  EXCEPTION
    WHEN OTHERS THEN
      OPEN p_result FOR
        SELECT '0' AS id, 'false' AS success,
               DBMS_UTILITY.FORMAT_ERROR_STACK AS err_msg FROM DUAL;
  END;

END CRM_{FEATURE}_API;
/
```

---

## Cómo leer parámetros (G_X01..G_X10)

| Parámetro frontend | Variable APEX | Conversión |
|---|---|---|
| `x01: 'texto'` | `APEX_APPLICATION.G_X01` | VARCHAR2, usar directo |
| `x01: 42` | `TO_NUMBER(APEX_APPLICATION.G_X01)` | Convertir a NUMBER |
| `x01: '2026-04-30'` | `TO_DATE(APEX_APPLICATION.G_X01,'YYYY-MM-DD')` | Convertir a DATE |
| `x01: 'true'` | `APEX_APPLICATION.G_X01 = 'true'` | Comparar string |

Default con NVL:
```sql
l_limit NUMBER := NVL(TO_NUMBER(APEX_APPLICATION.G_X01), 10);
```

---

## Cómo el frontend llama el proceso

```js
// En React — callProcess en shared/apex/apexClient.js
callProcess('LEADS_LIST', { x01: userId })

// Genera este POST:
POST /apex/wwv_flow.ajax
  p_request      = APPLICATION_PROCESS=LEADS_LIST
  p_flow_id      = {APEX APP_ID}
  p_flow_step_id = {APEX PAGE_ID}
  p_instance     = {APEX SESSION}
  x01            = {userId}
```

---

## Formato de respuesta estándar

**Listas:**
```json
{ "data": [ { "id_lead": 1, "titulo": "..." }, ... ] }
```

**Objeto único:**
```json
{ "data": [{ "id_lead": 1, "titulo": "...", "empresa": "..." }] }
```

**Mutación exitosa:**
```json
{ "id": 9, "success": true }
```

**Error:**
```json
{ "success": false, "error": "ORA-00001: unique constraint violated" }
```

---

## Registro completo de procesos CRM

### Auth / Sesión
| Proceso | x01 | x02 | Devuelve |
|---|---|---|---|
| `SESSION_INFO` | — | — | `{id_usuario, nombre, rol, id_departamento}` |

### Leads
| Proceso | Params | Devuelve |
|---|---|---|
| `LEADS_CATALOGOS` | — | `{estados, origenes, intereses, motivos_descalificacion}` |
| `LEADS_LIST` | x01=id_usuario? | array leads |
| `LEADS_GET` | x01=id_lead | objeto lead |
| `LEADS_CREATE` | x01=titulo, x02=descripcion, x03=score, x04=id_estado, x05=id_origen, x06=id_usuario | `{id_lead, success}` |
| `LEADS_UPDATE` | x01=id_lead + mismos campos | `{success}` |
| `LEADS_DESCALIFICAR` | x01=id_lead, x02=id_motivo, x03=observacion | `{success}` |
| `LEADS_CONVERTIR` | x01=id_lead, x02=titulo_opp, x03=valor_estimado, x04=id_tipo, x05=id_sector, x06=fecha_cierre | `{id_oportunidad, success}` |
| `LEADS_HISTORIAL` | x01=id_lead | array historial_estado |

### Oportunidades
| Proceso | Params | Devuelve |
|---|---|---|
| `OPP_LIST` | x01=id_usuario? | array oportunidades |
| `OPP_GET` | x01=id_oportunidad | objeto oportunidad |
| `OPP_CREATE` | x01=titulo, x02=id_tipo, x03=id_estado, x04=valor_estimado, x05=probabilidad, x06=id_sector, x07=id_empresa, x08=fecha_cierre, x09=id_usuario | `{id_oportunidad, success}` |
| `OPP_UPDATE` | x01=id + mismos campos | `{success}` |
| `OPP_AVANZAR_ESTADO` | x01=id_oportunidad, x02=id_estado_nuevo, x03=comentario | `{success}` |
| `OPP_AGREGAR_PRODUCTO` | x01=id_oportunidad, x02=id_producto | `{success}` |
| `OPP_QUITAR_PRODUCTO` | x01=id_oportunidad_producto | `{success}` |
| `OPP_REGISTRAR_ACTIVIDAD` | x01=id_opp, x02=tipo, x03=asunto, x04=descripcion, x05=fecha, x06=virtual | `{id_actividad, success}` |
| `OPP_CERRAR_GANADA` | x01=id_opp, x02=valor_final, x03=id_motivo, x04=descripcion | `{success}` |
| `OPP_CERRAR_PERDIDA` | x01=id_opp, x02=id_motivo, x03=descripcion | `{success}` |
| `OPP_PRODUCTOS_CATALOGO` | — | array productos |
| `OPP_ESTANCADOS` | x01=id_usuario? | array opp estancadas |
| `OPP_ACTIVIDADES` | x01=id_oportunidad | array actividades |

### Dashboard
| Proceso | Params | Devuelve |
|---|---|---|
| `DASH_EJECUTIVO_KPIS` | x01=id_usuario | `{leads_activos, opp_activas, pipeline_valor, actividades_hoy}` |
| `DASH_EJECUTIVO_OPP` | x01=id_usuario | últimas 5 oportunidades |
| `DASH_EJECUTIVO_ACT` | x01=id_usuario | próximas actividades |
| `DASH_COORDINADOR_KPIS` | — | KPIs de supervisión |
| `DASH_COORDINADOR_EQUIPO` | — | array ejecutivos con mini-stats |
| `DASH_COORDINADOR_ALERTAS` | — | alertas recientes |
| `DASH_DIRECTOR_KPIS` | — | KPIs estratégicos |
| `DASH_DIRECTOR_FUNNEL` | — | pipeline por etapa para funnel chart |
| `DASH_DIRECTOR_EQUIPO` | — | comparativo ejecutivos |
| `DASH_ADMIN_KPIS` | — | métricas sistema |

### Clientes
| Proceso | Params | Devuelve |
|---|---|---|
| `CLIENTES_LIST` | — | array empresas |
| `CLIENTES_GET` | x01=id_empresa | empresa + contactos |
| `CLIENTES_CREATE` | x01=nombre, x02=no_documento, x03=id_municipio, x04=id_documento, x05=id_modalidad | `{id_empresa, success}` |
| `CLIENTES_UPDATE` | x01=id_empresa + campos | `{success}` |
| `CLIENTES_AGREGAR_CONTACTO` | x01=id_empresa, x02=nombre, x03=apellido, x04=cargo, x05=email, x06=telefono, x07=es_principal | `{id_contacto, success}` |
| `CLIENTES_DESACTIVAR` | x01=id_empresa | `{success}` |

### Actividades
| Proceso | Params | Devuelve |
|---|---|---|
| `ACTIVIDADES_LIST` | x01=id_usuario, x02=fecha_desde?, x03=fecha_hasta?, x04=tipo? | array actividades |
| `ACTIVIDADES_GET` | x01=id_actividad | objeto actividad |
| `ACTIVIDADES_CREATE` | x01=tipo, x02=asunto, x03=descripcion, x04=id_lead?, x05=id_oportunidad?, x06=fecha, x07=virtual, x08=latitud?, x09=longitud? | `{id_actividad, success}` |
| `ACTIVIDADES_COMPLETAR` | x01=id_actividad, x02=resultado | `{success}` |
| `ACTIVIDADES_ALL_FOR_COORD` | x01=fecha_desde?, x02=fecha_hasta? | array todas actividades |

### Proyectos
| Proceso | Params | Devuelve |
|---|---|---|
| `PROYECTOS_LIST` | x01=id_usuario? | array proyectos |
| `PROYECTOS_GET` | x01=id_proyecto | proyecto + hitos |
| `PROYECTOS_CREATE` | x01=nombre, x02=descripcion, x03=id_oportunidad, x04=fecha_inicio, x05=fecha_fin | `{id_proyecto, success}` |
| `PROYECTOS_UPDATE` | x01=id_proyecto + campos | `{success}` |

### Metas
| Proceso | Params | Devuelve |
|---|---|---|
| `METAS_MIS_METAS` | x01=id_usuario, x02=periodo? | `{metas:[{metrica, valor_meta, valor_actual, pct}]}` |
| `METAS_CUMPLIMIENTO` | — | array ejecutivos con pct cumplimiento |

### Admin
| Proceso | Params | Devuelve |
|---|---|---|
| `ADMIN_USUARIOS_LIST` | — | array usuarios |
| `ADMIN_USUARIOS_CREATE` | x01=nombre, x02=email, x03=rol, x04=id_departamento | `{id_usuario, success}` |
| `ADMIN_USUARIOS_TOGGLE` | x01=id_usuario, x02=activo | `{success}` |
| `ADMIN_CATALOGOS_LIST` | x01=tipo | array entradas catálogo |
| `ADMIN_AUDITORIA_LIST` | x01=pagina, x02=limite, x03=fecha_desde? | array logs |
| `ADMIN_VARIABLES_LIST` | — | array CRM_CONFIGURACION_SISTEMA |
| `ADMIN_VARIABLES_UPDATE` | x01=clave, x02=valor | `{success}` |

---

## Verificar desde el navegador

Cuando la app está cargada dentro de APEX:
```js
// Verificar sesión APEX
console.log(window.apex?.env)
// → { APP_ID: "100", APP_PAGE_ID: "1", APP_SESSION: "..." }

// Llamar un proceso manualmente
fetch('/apex/wwv_flow.ajax', {
  method: 'POST',
  body: new URLSearchParams({
    p_request:      'APPLICATION_PROCESS=LEADS_LIST',
    p_flow_id:      apex.env.APP_ID,
    p_flow_step_id: apex.env.APP_PAGE_ID,
    p_instance:     apex.env.APP_SESSION,
  }),
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  credentials: 'include',
}).then(r => r.json()).then(console.log)
```
