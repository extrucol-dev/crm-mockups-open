-- ================================================================
-- CRM EXTRUCOL: Catálogos base para feature LEADS
-- Ejecutar ANTES de 00_crm_leads_ddl.sql
-- Estos son loscatlogos minimos que existen en el ER
-- y son referenciados por CRM_LEAD como FK
-- ================================================================

-- ================================================================
-- Tabla CRM_ESTADO_LEAD (estados de leads)
-- ================================================================
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE CRM_ESTADO_LEAD CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

CREATE TABLE CRM_ESTADO_LEAD (
    id_estado_lead   NUMBER NOT NULL,
    nombre           VARCHAR2(100) NOT NULL,
    tipo             VARCHAR2(20) NOT NULL CHECK (tipo IN ('ABIERTO', 'CALIFICADO', 'DESCALIFICADO')),
    orden            NUMBER NOT NULL,
    color_hex        VARCHAR2(7),
    activo          NUMBER DEFAULT 1,
    CONSTRAINT CRM_ESTADO_LEAD_PK PRIMARY KEY (id_estado_lead),
    CONSTRAINT CRM_ESTADO_LEAD_UK UNIQUE (nombre)
);

INSERT INTO CRM_ESTADO_LEAD (id_estado_lead, nombre, tipo, orden, color_hex) VALUES
    (1, 'Nuevo', 'ABIERTO', 1, '#3B82F6');
INSERT INTO CRM_ESTADO_LEAD (id_estado_lead, nombre, tipo, orden, color_hex) VALUES
    (2, 'Contactado', 'ABIERTO', 2, '#A855F7');
INSERT INTO CRM_ESTADO_LEAD (id_estado_lead, nombre, tipo, orden, color_hex) VALUES
    (3, 'Interesado', 'CALIFICADO', 3, '#F39610');
INSERT INTO CRM_ESTADO_LEAD (id_estado_lead, nombre, tipo, orden, color_hex) VALUES
    (4, 'Calificado', 'CALIFICADO', 4, '#10B981');
INSERT INTO CRM_ESTADO_LEAD (id_estado_lead, nombre, tipo, orden, color_hex) VALUES
    (5, 'No Interesado', 'DESCALIFICADO', 5, '#EF4444');

-- ================================================================
-- Tabla CRM_ORIGEN_LEAD (origenes de leads)
-- ================================================================
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE CRM_ORIGEN_LEAD CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

CREATE TABLE CRM_ORIGEN_LEAD (
    id_origen_lead   NUMBER NOT NULL,
    nombre           VARCHAR2(100) NOT NULL,
    color_hex        VARCHAR2(7),
    descripcion      VARCHAR2(500),
    activo          NUMBER DEFAULT 1,
    CONSTRAINT CRM_ORIGEN_LEAD_PK PRIMARY KEY (id_origen_lead),
    CONSTRAINT CRM_ORIGEN_LEAD_UK UNIQUE (nombre)
);

INSERT INTO CRM_ORIGEN_LEAD (id_origen_lead, nombre, color_hex) VALUES
    (1, 'Web', '#6B7280');
INSERT INTO CRM_ORIGEN_LEAD (id_origen_lead, nombre, color_hex) VALUES
    (2, 'Email', '#3B82F6');
INSERT INTO CRM_ORIGEN_LEAD (id_origen_lead, nombre, color_hex) VALUES
    (3, 'Facebook', '#1877F2');
INSERT INTO CRM_ORIGEN_LEAD (id_origen_lead, nombre, color_hex) VALUES
    (4, 'Instagram', '#E4405F');
INSERT INTO CRM_ORIGEN_LEAD (id_origen_lead, nombre, color_hex) VALUES
    (5, 'WhatsApp', '#25D366');
INSERT INTO CRM_ORIGEN_LEAD (id_origen_lead, nombre, color_hex) VALUES
    (6, 'Referido', '#8B5CF6');
INSERT INTO CRM_ORIGEN_LEAD (id_origen_lead, nombre, color_hex) VALUES
    (7, 'Feria', '#F59E0B');

-- ================================================================
-- Tabla CRM_INTERES (intereses/productos)
-- ================================================================
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE CRM_INTERES CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

CREATE TABLE CRM_INTERES (
    id_interes   NUMBER NOT NULL,
    nombre      VARCHAR2(200) NOT NULL,
    descripcion  VARCHAR2(500),
    activo      NUMBER DEFAULT 1,
    CONSTRAINT CRM_INTERES_PK PRIMARY KEY (id_interes),
    CONSTRAINT CRM_INTERES_UK UNIQUE (nombre)
);

INSERT INTO CRM_INTERES (id_interes, nombre) VALUES
    (1, 'Tubería PE100');
INSERT INTO CRM_INTERES (id_interes, nombre) VALUES
    (2, 'Tubería PVC');
INSERT INTO CRM_INTERES (id_interes, nombre) VALUES
    (3, 'Accesorios PE');
INSERT INTO CRM_INTERES (id_interes, nombre) VALUES
    (4, 'Válvulas y fittings');
INSERT INTO CRM_INTERES (id_interes, nombre) VALUES
    (5, 'Sistema de riego');
INSERT INTO CRM_INTERES (id_interes, nombre) VALUES
    (6, 'Equipos de termofusión');

-- ================================================================
-- Tabla CRM_MOTIVO_DESCALIFICACION
-- ================================================================
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE CRM_MOTIVO_DESCALIFICACION CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

CREATE TABLE CRM_MOTIVO_DESCALIFICACION (
    id_motivo_descalificacion   NUMBER NOT NULL,
    nombre      VARCHAR2(200) NOT NULL,
    descripcion  VARCHAR2(500),
    activo      NUMBER DEFAULT 1,
    CONSTRAINT CRM_MOTIVO_DESCALIF_PK PRIMARY KEY (id_motivo_descalificacion),
    CONSTRAINT CRM_MOTIVO_DESCALIF_UK UNIQUE (nombre)
);

INSERT INTO CRM_MOTIVO_DESCALIFICACION (id_motivo_descalificacion, nombre) VALUES
    (1, 'No responde');
INSERT INTO CRM_MOTIVO_DESCALIFICACION (id_motivo_descalificacion, nombre) VALUES
    (2, 'Presupuesto insuficiente');
INSERT INTO CRM_MOTIVO_DESCALIFICACION (id_motivo_descalificacion, nombre) VALUES
    (3, 'No es el responsable');
INSERT INTO CRM_MOTIVO_DESCALIFICACION (id_motivo_descalificacion, nombre) VALUES
    (4, 'Trasladado a distribuidor');
INSERT INTO CRM_MOTIVO_DESCALIFICACION (id_motivo_descalificacion, nombre) VALUES
    (5, 'Lead duplicado');

-- ================================================================
-- Tabla CRM_USUARIO (usuarios/ejecutivos) - minima para tests
-- ================================================================
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE CRM_USUARIO CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

CREATE TABLE CRM_USUARIO (
    id_usuario    NUMBER NOT NULL,
    nombre        VARCHAR2(200) NOT NULL,
    email         VARCHAR2(200),
    password      VARCHAR2(500),
    rol           VARCHAR2(50) DEFAULT 'EJECUTIVO',
    activo        NUMBER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT SYSTIMESTAMP,
    ultimo_acceso TIMESTAMP,
    id_departamento NUMBER,
    CONSTRAINT CRM_USUARIO_PK PRIMARY KEY (id_usuario)
);

INSERT INTO CRM_USUARIO (id_usuario, nombre, email, rol) VALUES
    (1, 'Paola Executiva', 'paola@extrucol.com', 'EJECUTIVO');
INSERT INTO CRM_USUARIO (id_usuario, nombre, email, rol) VALUES
    (2, 'Coordinador Demo', 'coord@extrucol.com', 'COORDINADOR');

-- ================================================================
-- Tabla CRM_OPORTUNIDAD (requerida para FK id_oportunidad_generada)
-- ================================================================
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE CRM_OPORTUNIDAD CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

CREATE TABLE CRM_OPORTUNIDAD (
    id_oportunidad       NUMBER NOT NULL,
    titulo               VARCHAR2(500) NOT NULL,
    descripcion          VARCHAR2(2000),
    id_tipo_oportunidad  NUMBER,
    id_estado_oportunidad NUMBER,
    valor_estimado       NUMBER(15,2),
    valor_final          NUMBER(15,2),
    probabilidad_cierre  NUMBER(3,0),
    id_sector            NUMBER,
    fecha_cierre_estimada DATE,
    fecha_creacion       TIMESTAMP DEFAULT SYSTIMESTAMP,
    fecha_actualizacion  TIMESTAMP DEFAULT SYSTIMESTAMP,
    id_empresa           NUMBER,
    id_usuario           NUMBER,
    id_lead_origen       NUMBER,
    id_motivo_cierre     NUMBER,
    descripcion_cierre   VARCHAR2(1000),
    CONSTRAINT CRM_OPORTUNIDAD_PK PRIMARY KEY (id_oportunidad)
);

-- ================================================================
-- Tabla CRM_TIPO_OPORTUNIDAD (para convertir lead)
-- ================================================================
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE CRM_TIPO_OPORTUNIDAD CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

CREATE TABLE CRM_TIPO_OPORTUNIDAD (
    id_tipo_oportunidad  NUMBER NOT NULL,
    nombre                VARCHAR2(200) NOT NULL,
    descripcion           VARCHAR2(500),
    CONSTRAINT CRM_TIPO_OPORTUNIDAD_PK PRIMARY KEY (id_tipo_oportunidad),
    CONSTRAINT CRM_TIPO_OPORTUNIDAD_UK UNIQUE (nombre)
);

INSERT INTO CRM_TIPO_OPORTUNIDAD (id_tipo_oportunidad, nombre) VALUES
    (1, 'Licitación pública');
INSERT INTO CRM_TIPO_OPORTUNIDAD (id_tipo_oportunidad, nombre) VALUES
    (2, 'Suministro directo');
INSERT INTO CRM_TIPO_OPORTUNIDAD (id_tipo_oportunidad, nombre) VALUES
    (3, 'Proyecto a medida');
INSERT INTO CRM_TIPO_OPORTUNIDAD (id_tipo_oportunidad, nombre) VALUES
    (4, 'Contrato marco');

-- ================================================================
-- Tabla CRM_SECTOR (para convertir lead)
-- ================================================================
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE CRM_SECTOR CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

CREATE TABLE CRM_SECTOR (
    id_sector    NUMBER NOT NULL,
    nombre       VARCHAR2(200) NOT NULL,
    descripcion  VARCHAR2(500),
    color_hex    VARCHAR2(7),
    CONSTRAINT CRM_SECTOR_PK PRIMARY KEY (id_sector),
    CONSTRAINT CRM_SECTOR_UK UNIQUE (nombre)
);

INSERT INTO CRM_SECTOR (id_sector, nombre) VALUES
    (1, 'Agua potable');
INSERT INTO CRM_SECTOR (id_sector, nombre) VALUES
    (2, 'Gas natural');
INSERT INTO CRM_SECTOR (id_sector, nombre) VALUES
    (3, 'Agricultura / Riego');
INSERT INTO CRM_SECTOR (id_sector, nombre) VALUES
    (4, 'Industria');

-- ================================================================
-- Tabla CRM_ESTADO_OPORTUNIDAD (para convertir lead)
-- ================================================================
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE CRM_ESTADO_OPORTUNIDAD CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

CREATE TABLE CRM_ESTADO_OPORTUNIDAD (
    id_estado       NUMBER NOT NULL,
    nombre          VARCHAR2(100) NOT NULL,
    tipo            VARCHAR2(20) CHECK (tipo IN ('ABIERTO', 'GANADO', 'PERDIDO')),
    orden           NUMBER,
    color_hex       VARCHAR2(7),
    CONSTRAINT CRM_ESTADO_OPORTUNIDAD_PK PRIMARY KEY (id_estado),
    CONSTRAINT CRM_ESTADO_OPORTUNIDAD_UK UNIQUE (nombre)
);

INSERT INTO CRM_ESTADO_OPORTUNIDAD (id_estado, nombre, tipo, orden) VALUES
    (1, 'Prospección', 'ABIERTO', 1);
INSERT INTO CRM_ESTADO_OPORTUNIDAD (id_estado, nombre, tipo, orden) VALUES
    (2, 'Calificación', 'ABIERTO', 2);
INSERT INTO CRM_ESTADO_OPORTUNIDAD (id_estado, nombre, tipo, orden) VALUES
    (3, 'Especificación', 'ABIERTO', 3);
INSERT INTO CRM_ESTADO_OPORTUNIDAD (id_estado, nombre, tipo, orden) VALUES
    (4, 'Negociación', 'ABIERTO', 4);
INSERT INTO CRM_ESTADO_OPORTUNIDAD (id_estado, nombre, tipo, orden) VALUES
    (5, 'Ganada', 'GANADO', 5);
INSERT INTO CRM_ESTADO_OPORTUNIDAD (id_estado, nombre, tipo, orden) VALUES
    (6, 'Perdida', 'PERDIDO', 6);

COMMIT;

-- Verificar
SELECT 'CRM_ESTADO_LEAD' AS tabla, COUNT(*) AS cnt FROM CRM_ESTADO_LEAD UNION ALL
SELECT 'CRM_ORIGEN_LEAD', COUNT(*) FROM CRM_ORIGEN_LEAD UNION ALL
SELECT 'CRM_INTERES', COUNT(*) FROM CRM_INTERES UNION ALL
SELECT 'CRM_MOTIVO_DESCALIFICACION', COUNT(*) FROM CRM_MOTIVO_DESCALIFICACION UNION ALL
SELECT 'CRM_USUARIO', COUNT(*) FROM CRM_USUARIO UNION ALL
SELECT 'CRM_OPORTUNIDAD', COUNT(*) FROM CRM_OPORTUNIDAD UNION ALL
SELECT 'CRM_TIPO_OPORTUNIDAD', COUNT(*) FROM CRM_TIPO_OPORTUNIDAD UNION ALL
SELECT 'CRM_SECTOR', COUNT(*) FROM CRM_SECTOR UNION ALL
SELECT 'CRM_ESTADO_OPORTUNIDAD', COUNT(*) FROM CRM_ESTADO_OPORTUNIDAD;