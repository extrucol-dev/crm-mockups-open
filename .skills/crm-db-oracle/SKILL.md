---
name: crm-db-oracle
description: >-
  CRM Extrucol Oracle DB y APEX configuration. SIEMPRE USA cuando: crear tabla Oracle,
  escribir package PL/SQL, crear vista analítica, agregar secuencia trigger, configurar
  esquema CRM, script SQL para el CRM, crear procedimiento PL/SQL, diseñar entidad nueva,
  consultar el modelo de datos CRM_ER_v6, agregar campo a tabla, crear índice, configurar
  APEX aplicación. Trigger on: "tabla", "package", "procedimiento", "vista", "secuencia",
  "trigger", "schema", "sql script", "entidad", "CRM_ER", "Oracle", "PL/SQL", "APEX app",
  "configurar APEX", "Application", "Static Files".
---

# CRM Extrucol — Oracle DB & APEX Configuration

Configura el esquema Oracle y la aplicación APEX para el CRM Extrucol.

**Modelo de datos canónico:** `CRM_ER_v6.md` en la raíz del proyecto de mockups.
**Docs de referencia:** `docs/02-base-de-datos.md`, `docs/03-apex-configuracion.md`

---

## Entidades principales (CRM_ER_v6)

| Entidad | PK | Descripción |
|---|---|---|
| `CRM_PAIS` | id_pais | Países |
| `CRM_DEPARTAMENTO` | id_departamento | Departamentos (FK: id_pais) |
| `CRM_MUNICIPIO` | id_municipio | Municipios (FK: id_departamento) |
| `CRM_USUARIO` | id_usuario | Usuarios del sistema (EJECUTIVO\|COORDINADOR\|DIRECTOR\|ADMINISTRADOR) |
| `CRM_EMPRESA` | id_empresa | Clientes/empresas |
| `CRM_CONTACTO` | id_contacto | Personas de contacto (FK: id_empresa) |
| `CRM_EMAIL` | id_email | Emails de contacto |
| `CRM_TELEFONO` | id_telefono | Teléfonos de contacto |
| `CRM_SECTOR` | id_sector | Sectores de negocio (agua, gas, industria...) |
| `CRM_ORIGEN_LEAD` | id_origen_lead | Orígenes (Web, Email, Facebook, Instagram, WhatsApp) |
| `CRM_ESTADO_LEAD` | id_estado_lead | Estados lead (ABIERTO\|CALIFICADO\|DESCALIFICADO) |
| `CRM_INTERES` | id_interes | Intereses del lead |
| `CRM_MOTIVO_DESCALIFICACION` | id_motivo_descalificacion | Motivos de descalificación |
| `CRM_LEAD` | id_lead | Leads (score 0-100, FK: estado, origen, empresa, contacto, usuario) |
| `CRM_LEAD_INTERES` | id_lead_interes | Intereses asociados a un lead |
| `CRM_HISTORIAL_ESTADO_LEAD` | id_historial_lead | Historial de cambios de estado de leads |
| `CRM_TIPO_OPORTUNIDAD` | id_tipo_oportunidad | Tipos (Licitación, Suministro, Proyecto, Contrato) |
| `CRM_ESTADO_OPORTUNIDAD` | id_estado | Estados opp (ABIERTO\|GANADO\|PERDIDO) |
| `CRM_MOTIVO_CIERRE` | id_motivo_cierre | Motivos de cierre (GANADO\|PERDIDO) |
| `CRM_OPORTUNIDAD` | id_oportunidad | Oportunidades (valor_estimado, valor_final, probabilidad 0-100%) |
| `CRM_OPORTUNIDAD_PRODUCTO` | id_oportunidad_producto | Productos asociados a oportunidad |
| `CRM_PRODUCTO` | id_producto | Catálogo de productos |
| `CRM_ACTIVIDAD` | id_actividad | Actividades (VISITA\|LLAMADA\|REUNION\|EMAIL) |
| `CRM_UBICACION` | id_ubicacion | Coordenadas GPS de una actividad |
| `CRM_PROYECTO` | id_proyecto | Proyectos (PLANIFICACION\|EN_EJECUCION\|EN_PAUSA\|ENTREGADO) |
| `CRM_PROYECTO_HITO` | id_hito | Hitos de proyecto (COMPLETADO\|EN_CURSO\|PENDIENTE) |
| `CRM_HISTORIAL_ESTADO` | id_historial | Historial cambios estado oportunidad |
| `CRM_META` | id_meta | Metas (VENTAS_MES\|OPP_ABIERTAS\|ACTIVIDADES_SEMANA\|...) |
| `CRM_CUMPLIMIENTO_META` | id_cumplimiento | Cumplimiento mensual por usuario |
| `CRM_NOTIFICACION` | id_notificacion | Notificaciones (CRITICA\|ADVERTENCIA\|INFO\|EXITO) |
| `CRM_AUDITORIA` | id_auditoria | Log de auditoría (INSERT\|UPDATE\|DELETE) |
| `CRM_CONFIGURACION_SISTEMA` | id_configuracion | Configuración clave-valor |

---

## Orden de ejecución de scripts SQL

```sql
-- Siempre en este orden (dependencias)
@sql/01_ddl_geo_catalogs.sql        -- Países, departamentos, municipios, sectores, modalidades
@sql/02_ddl_usuarios.sql            -- CRM_USUARIO
@sql/03_ddl_empresa_contacto.sql    -- CRM_EMPRESA, CRM_CONTACTO, CRM_EMAIL, CRM_TELEFONO
@sql/04_ddl_leads.sql               -- CRM_ORIGEN_LEAD, CRM_ESTADO_LEAD, CRM_INTERES,
                                    --   CRM_MOTIVO_DESCALIFICACION, CRM_LEAD, CRM_LEAD_INTERES,
                                    --   CRM_HISTORIAL_ESTADO_LEAD
@sql/05_ddl_oportunidades.sql       -- CRM_TIPO_OPORTUNIDAD, CRM_ESTADO_OPORTUNIDAD,
                                    --   CRM_MOTIVO_CIERRE, CRM_PRODUCTO, CRM_OPORTUNIDAD,
                                    --   CRM_OPORTUNIDAD_PRODUCTO, CRM_HISTORIAL_ESTADO
@sql/06_ddl_actividades.sql         -- CRM_ACTIVIDAD, CRM_UBICACION
@sql/07_ddl_proyectos.sql           -- CRM_PROYECTO, CRM_PROYECTO_HITO
@sql/08_ddl_metas_notif.sql         -- CRM_META, CRM_CUMPLIMIENTO_META, CRM_NOTIFICACION
@sql/09_ddl_auditoria_config.sql    -- CRM_AUDITORIA, CRM_CONFIGURACION_SISTEMA
@sql/10_data_seed.sql               -- Datos maestros (sectores, estados, orígenes, etc.)
@sql/11_packages.sql                -- Todos los packages PL/SQL
@sql/12_views.sql                   -- Vistas analíticas
```

---

## Convención DDL del proyecto

- Secuencias con `START WITH 100` (deja IDs bajos para datos de catálogo/seed)
- `TIMESTAMP` (no `DATE`) para `fecha_creacion`, `fecha_actualizacion` — usa `SYSTIMESTAMP`
- FKs con `ALTER TABLE` separado (facilita DROP/recrear en desarrollo)
- Drops envueltos en `BEGIN/EXCEPTION WHEN OTHERS THEN NULL END;` (idempotente)
- Índices explícitos en columnas FK
- Nombre del constraint: `CRM_{TABLA}_{PK|FK|UK}_{CAMPO}`

## Template: Tabla con secuencia (patrón real del proyecto)

```sql
-- ============================================================
-- DROP idempotente
-- ============================================================
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE CRM_{ENTIDAD}_SEQ'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE CRM_{ENTIDAD} CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

-- ============================================================
-- Secuencia — START WITH 100 reserva IDs 1-99 para seed
-- ============================================================
CREATE SEQUENCE CRM_{ENTIDAD}_SEQ START WITH 100 INCREMENT BY 1 NOCACHE;

-- ============================================================
-- Tabla
-- ============================================================
CREATE TABLE CRM_{ENTIDAD} (
    id_{entidad}         NUMBER          NOT NULL,
    titulo               VARCHAR2(500)   NOT NULL,
    descripcion          VARCHAR2(2000),
    score                NUMBER(3,0)     DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
    id_estado_{entidad}  NUMBER          NOT NULL,
    id_usuario           NUMBER          NOT NULL,
    fecha_creacion       TIMESTAMP       DEFAULT SYSTIMESTAMP NOT NULL,
    fecha_actualizacion  TIMESTAMP       DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT CRM_{ENTIDAD}_PK PRIMARY KEY (id_{entidad})
);

-- ============================================================
-- FKs separadas (fácil de drop/re-add en desarrollo)
-- ============================================================
ALTER TABLE CRM_{ENTIDAD} ADD CONSTRAINT CRM_{ENTIDAD}_FK_ESTADO
    FOREIGN KEY (id_estado_{entidad}) REFERENCES CRM_ESTADO_{ENTIDAD}(id_estado_{entidad});

ALTER TABLE CRM_{ENTIDAD} ADD CONSTRAINT CRM_{ENTIDAD}_FK_USUARIO
    FOREIGN KEY (id_usuario) REFERENCES CRM_USUARIO(id_usuario);

-- ============================================================
-- Índices en columnas FK
-- ============================================================
CREATE INDEX CRM_{ENTIDAD}_I_ESTADO  ON CRM_{ENTIDAD}(id_estado_{entidad});
CREATE INDEX CRM_{ENTIDAD}_I_USUARIO ON CRM_{ENTIDAD}(id_usuario);

-- ============================================================
-- Trigger PK — usa la secuencia
-- ============================================================
CREATE OR REPLACE TRIGGER CRM_{ENTIDAD}_TRG_BI
BEFORE INSERT ON CRM_{ENTIDAD} FOR EACH ROW
BEGIN
  IF :new.id_{entidad} IS NULL THEN
    :new.id_{entidad} := CRM_{ENTIDAD}_SEQ.NEXTVAL;
  END IF;
  :new.fecha_actualizacion := SYSTIMESTAMP;
END;
/

-- Trigger updated_at
CREATE OR REPLACE TRIGGER CRM_{ENTIDAD}_TRG_BU
BEFORE UPDATE ON CRM_{ENTIDAD} FOR EACH ROW
BEGIN
  :new.fecha_actualizacion := SYSTIMESTAMP;
END;
/
```

---

## Template: Package PL/SQL (patrón real del proyecto)

Nomenclatura: `CRM_{FEATURE}_API`. Todos los procedimientos tienen `p_result OUT SYS_REFCURSOR` como primer parámetro. Ver **skill `crm-apex-processes`** para los templates completos de spec y body.

Ejemplo real (feature LEADS → `apex/seguimiento/sql/02_crm_leads_api_spec.sql` + `03_crm_leads_api_body.sql`):

```sql
-- SPEC
CREATE OR REPLACE PACKAGE CRM_LEADS_API AS
  PROCEDURE LEADS_LIST(p_result OUT SYS_REFCURSOR,
                       p_x01 IN VARCHAR2 DEFAULT NULL,   -- id_estado_lead
                       p_x02 IN VARCHAR2 DEFAULT NULL);  -- id_usuario
  PROCEDURE LEADS_GET(p_result OUT SYS_REFCURSOR, p_x01 IN NUMBER);
  PROCEDURE LEADS_CREATE(p_result OUT SYS_REFCURSOR,
                         p_x01 IN VARCHAR2,              -- titulo (requerido)
                         p_x02 IN VARCHAR2 DEFAULT NULL, -- descripcion
                         p_x03 IN NUMBER   DEFAULT 60,   -- score
                         p_x04 IN NUMBER   DEFAULT 1,    -- id_estado_lead
                         p_x05 IN NUMBER   DEFAULT 1,    -- id_origen_lead
                         p_x06 IN NUMBER   DEFAULT 1);   -- id_usuario
END CRM_LEADS_API;
/

-- BODY — mutaciones devuelven fila con {id, success} o {success, err_msg}
CREATE OR REPLACE PACKAGE BODY CRM_LEADS_API AS
  PROCEDURE LEADS_CREATE(...) IS
    v_id NUMBER;
  BEGIN
    INSERT INTO CRM_LEAD (...) VALUES (...) RETURNING id_lead INTO v_id;
    INSERTAR_HISTORIAL(v_id, NULL, p_x04, p_x06, 'Lead creado');
    OPEN p_result FOR SELECT v_id AS id_lead, 'true' AS success FROM DUAL;
  EXCEPTION
    WHEN OTHERS THEN
      OPEN p_result FOR
        SELECT '0' AS id_lead, 'false' AS success,
               DBMS_UTILITY.FORMAT_ERROR_STACK AS err_msg FROM DUAL;
  END;
END CRM_LEADS_API;
/
```

**Scripts existentes como referencia:**
- `apex/seguimiento/sql/00_crm_catalogos_base.sql` — catálogos base (estados, orígenes)
- `apex/seguimiento/sql/00_crm_leads_ddl.sql` — DDL de CRM_LEAD con patrón de secuencia
- `apex/seguimiento/sql/01_crm_leads_seed.sql` — datos de prueba
- `apex/seguimiento/sql/02_crm_leads_api_spec.sql` — spec completo CRM_LEADS_API
- `apex/seguimiento/sql/03_crm_leads_api_body.sql` — body completo CRM_LEADS_API
- `apex/seguimiento/sql/04_crm_leads_apex_procesos.sql` — guía de procesos APEX
- `apex/seguimiento/sql/05_crm_leads_test_suite.sql` — suite de pruebas

---

## Template: Vista analítica

```sql
-- Oportunidades abiertas con pipeline por ejecutivo
CREATE OR REPLACE VIEW v_pipeline_ejecutivo AS
SELECT
  u.id_usuario,
  u.nombre                     AS ejecutivo,
  eo.nombre                    AS estado,
  eo.orden                     AS estado_orden,
  COUNT(o.id_oportunidad)      AS num_oportunidades,
  SUM(o.valor_estimado)        AS valor_total,
  ROUND(AVG(o.probabilidad_cierre), 1) AS prob_promedio
FROM   crm_oportunidad      o
       JOIN crm_usuario          u  ON u.id_usuario = o.id_usuario
       JOIN crm_estado_oportunidad eo ON eo.id_estado = o.id_estado_oportunidad
WHERE  eo.tipo = 'ABIERTO'
GROUP  BY u.id_usuario, u.nombre, eo.nombre, eo.orden
ORDER  BY u.nombre, eo.orden;
/
```

---

## Template: Datos maestros (seed)

```sql
-- Estados de lead (catálogo inicial)
INSERT INTO crm_estado_lead (nombre, tipo, orden, color_hex) VALUES ('Nuevo',         'ABIERTO',         1, '#3B82F6');
INSERT INTO crm_estado_lead (nombre, tipo, orden, color_hex) VALUES ('Contactado',    'ABIERTO',         2, '#EAB308');
INSERT INTO crm_estado_lead (nombre, tipo, orden, color_hex) VALUES ('Interesado',    'ABIERTO',         3, '#A855F7');
INSERT INTO crm_estado_lead (nombre, tipo, orden, color_hex) VALUES ('Calificado',    'CALIFICADO',      4, '#22C55E');
INSERT INTO crm_estado_lead (nombre, tipo, orden, color_hex) VALUES ('Descalificado', 'DESCALIFICADO',   5, '#6B7280');
COMMIT;

-- Estados de oportunidad
INSERT INTO crm_estado_oportunidad (nombre, tipo, orden, color_hex) VALUES ('Prospección',  'ABIERTO', 1, '#3B82F6');
INSERT INTO crm_estado_oportunidad (nombre, tipo, orden, color_hex) VALUES ('Propuesta',    'ABIERTO', 2, '#A855F7');
INSERT INTO crm_estado_oportunidad (nombre, tipo, orden, color_hex) VALUES ('Negociación',  'ABIERTO', 3, '#F97316');
INSERT INTO crm_estado_oportunidad (nombre, tipo, orden, color_hex) VALUES ('Ganada',       'GANADO',  4, '#22C55E');
INSERT INTO crm_estado_oportunidad (nombre, tipo, orden, color_hex) VALUES ('Perdida',      'PERDIDO', 5, '#EF4444');
COMMIT;
```

---

## Template: Auditoría automática

```sql
-- Trigger de auditoría para cualquier tabla sensible
CREATE OR REPLACE TRIGGER trg_oportunidad_audit
AFTER INSERT OR UPDATE OR DELETE ON crm_oportunidad
FOR EACH ROW
DECLARE
  l_tipo VARCHAR2(10);
BEGIN
  IF    INSERTING THEN l_tipo := 'INSERT';
  ELSIF UPDATING  THEN l_tipo := 'UPDATE';
  ELSE                 l_tipo := 'DELETE';
  END IF;

  INSERT INTO crm_auditoria (
    id_usuario, nombre_tabla, id_registro,
    valor_antiguo, valor_nuevo, tipo_operacion
  ) VALUES (
    SYS_CONTEXT('APEX$SESSION','APP_USER_ID'),
    'CRM_OPORTUNIDAD',
    NVL(:new.id_oportunidad, :old.id_oportunidad),
    CASE WHEN DELETING OR UPDATING THEN 'titulo:' || :old.titulo END,
    CASE WHEN INSERTING OR UPDATING THEN 'titulo:' || :new.titulo END,
    l_tipo
  );
END;
/
```

---

## Configuración APEX — pasos esenciales

### 1. Crear la aplicación
```
App Builder → Create → New Application
  Name: CRM Extrucol
  Theme: Universal Theme (vacío, la UI la pone React)
```

### 2. Configurar autenticación
```
Shared Components → Authentication Schemes → APEX Accounts
  (o LDAP/SSO según el entorno)
```

### 3. Crear página host para React
```
Create Page → Blank Page
  Page ID: 1
  En HTML Header agregar:
    <link rel="stylesheet" href="#APP_FILES#assets/app.css">
  En Execute when Page Loads:
    <div id="root"></div>
    <script type="module" src="#APP_FILES#assets/app.js"></script>
```

### 4. Subir archivos estáticos
```
Shared Components → Static Application Files
  Upload: dist/assets/app.js
  Upload: dist/assets/app.css
  (sin hash en nombres → vite.config.js build.rollupOptions ya lo configura)
```

### 5. Crear los Application Processes
Ver skill `crm-apex-processes` para el detalle de cada proceso.

---

## Verificación de conexión DB ↔ APEX

```sql
-- Confirmar que el schema tiene las tablas
SELECT table_name FROM user_tables WHERE table_name LIKE 'CRM_%' ORDER BY 1;

-- Confirmar que los packages compilan
SELECT object_name, status FROM user_objects
WHERE object_type = 'PACKAGE BODY' AND status != 'VALID';

-- Probar un package directamente
DECLARE
  l_cur SYS_REFCURSOR;
  l_id  NUMBER;
BEGIN
  pkg_leads.p_create(
    p_titulo         => 'Test lead',
    p_score          => 50,
    p_id_estado_lead => 1,
    p_id_usuario     => 1,
    p_id             => l_id
  );
  DBMS_OUTPUT.PUT_LINE('Lead creado con ID: ' || l_id);
END;
/
```
