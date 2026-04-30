-- ================================================================
-- CRM EXTRUCOL: DDL para feature LEADS
-- Ejecutar EN BLOQUES SEPARADOS en SQL Commands
-- ================================================================

-- ================================================================
-- BLOQUE 1: Eliminar objetos existentes (si ya existen)
-- IMPORTANTE: ejecutar cada DROP solo si el objeto existe
-- ================================================================
BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE CRM_LEAD_SEQ';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE CRM_LEAD_INTERES_SEQ';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE CRM_HIST_ESTADO_LEAD_SEQ';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE CRM_OPORTUNIDAD_SEQ';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE CRM_LEAD_INTERES CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE CRM_HISTORIAL_ESTADO_LEAD CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE CRM_LEAD CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

-- ================================================================
-- BLOQUE 2: Secuencias
-- ================================================================
CREATE SEQUENCE CRM_LEAD_SEQ START WITH 100 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE CRM_LEAD_INTERES_SEQ START WITH 100 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE CRM_HIST_ESTADO_LEAD_SEQ START WITH 100 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE CRM_OPORTUNIDAD_SEQ START WITH 1 INCREMENT BY 1 NOCACHE;

-- ================================================================
-- BLOQUE 3: Tabla CRM_LEAD (sin IDENTITY para compatibilidad)
-- ================================================================
CREATE TABLE CRM_LEAD (
    id_lead                     NUMBER NOT NULL,
    titulo                      VARCHAR2(500) NOT NULL,
    descripcion                 VARCHAR2(2000),
    score                       NUMBER(3,0) NOT NULL CHECK (score >= 0 AND score <= 100),
    id_estado_lead              NUMBER NOT NULL,
    id_origen_lead              NUMBER NOT NULL,
    fecha_creacion              TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    fecha_actualizacion         TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    nombre_empresa              VARCHAR2(300),
    nombre_contacto             VARCHAR2(200),
    telefono_contacto           VARCHAR2(50),
    email_contacto              VARCHAR2(200),
    id_usuario                  NUMBER NOT NULL,
    id_oportunidad_generada     NUMBER,
    id_motivo_descalificacion   NUMBER,
    motivo_descalificacion_obs  VARCHAR2(1000),
    CONSTRAINT CRM_LEAD_PK PRIMARY KEY (id_lead)
);

-- ================================================================
-- BLOQUE 4: Tabla CRM_LEAD_INTERES
-- ================================================================
CREATE TABLE CRM_LEAD_INTERES (
    id_lead_interes    NUMBER NOT NULL,
    id_lead            NUMBER NOT NULL,
    id_interes         NUMBER NOT NULL,
    fecha_registro     TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT CRM_LEAD_INTERES_PK PRIMARY KEY (id_lead_interes),
    CONSTRAINT CRM_LEAD_INTERES_UK UNIQUE (id_lead, id_interes)
);

-- ================================================================
-- BLOQUE 5: Tabla CRM_HISTORIAL_ESTADO_LEAD
-- ================================================================
CREATE TABLE CRM_HIST_ESTADO_LEAD (
    id_historial_lead      NUMBER NOT NULL,
    id_lead                NUMBER NOT NULL,
    id_estado_anterior     NUMBER,
    id_estado_nuevo        NUMBER NOT NULL,
    fecha_cambio           TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    id_usuario             NUMBER NOT NULL,
    comentario             VARCHAR2(1000),
    CONSTRAINT CRM_HIST_LEAD_PK PRIMARY KEY (id_historial_lead)
);

-- ================================================================
-- BLOQUE 6: Foreign Keys
-- ================================================================
ALTER TABLE CRM_LEAD ADD CONSTRAINT CRM_LEAD_FK_ESTADO
    FOREIGN KEY (id_estado_lead) REFERENCES CRM_ESTADO_LEAD(id_estado_lead);

ALTER TABLE CRM_LEAD ADD CONSTRAINT CRM_LEAD_FK_ORIGEN
    FOREIGN KEY (id_origen_lead) REFERENCES CRM_ORIGEN_LEAD(id_origen_lead);

ALTER TABLE CRM_LEAD ADD CONSTRAINT CRM_LEAD_FK_USUARIO
    FOREIGN KEY (id_usuario) REFERENCES CRM_USUARIO(id_usuario);

ALTER TABLE CRM_LEAD ADD CONSTRAINT CRM_LEAD_FK_OPORTUNIDAD
    FOREIGN KEY (id_oportunidad_generada) REFERENCES CRM_OPORTUNIDAD(id_oportunidad);

ALTER TABLE CRM_LEAD ADD CONSTRAINT CRM_LEAD_FK_MOTIVO_DESC
    FOREIGN KEY (id_motivo_descalificacion) REFERENCES CRM_MOTIVO_DESCALIFICACION(id_motivo_descalificacion);

ALTER TABLE CRM_LEAD_INTERES ADD CONSTRAINT CRM_LI_FK_LEAD
    FOREIGN KEY (id_lead) REFERENCES CRM_LEAD(id_lead) ON DELETE CASCADE;

ALTER TABLE CRM_LEAD_INTERES ADD CONSTRAINT CRM_LI_FK_INTERES
    FOREIGN KEY (id_interes) REFERENCES CRM_INTERES(id_interes);

ALTER TABLE CRM_HIST_ESTADO_LEAD ADD CONSTRAINT CRM_HE_FK_LEAD
    FOREIGN KEY (id_lead) REFERENCES CRM_LEAD(id_lead) ON DELETE CASCADE;

ALTER TABLE CRM_HIST_ESTADO_LEAD ADD CONSTRAINT CRM_HE_FK_ESTADO_ANT
    FOREIGN KEY (id_estado_anterior) REFERENCES CRM_ESTADO_LEAD(id_estado_lead);

ALTER TABLE CRM_HIST_ESTADO_LEAD ADD CONSTRAINT CRM_HE_FK_ESTADO_NVO
    FOREIGN KEY (id_estado_nuevo) REFERENCES CRM_ESTADO_LEAD(id_estado_lead);

ALTER TABLE CRM_HIST_ESTADO_LEAD ADD CONSTRAINT CRM_HE_FK_USUARIO
    FOREIGN KEY (id_usuario) REFERENCES CRM_USUARIO(id_usuario);

-- ================================================================
-- BLOQUE 7: Indices
-- ================================================================
CREATE INDEX CRM_LEAD_I_ESTADO ON CRM_LEAD(id_estado_lead);
CREATE INDEX CRM_LEAD_I_ORIGEN ON CRM_LEAD(id_origen_lead);
CREATE INDEX CRM_LEAD_I_USUARIO ON CRM_LEAD(id_usuario);
CREATE INDEX CRM_LEAD_I_OPORTUNIDAD ON CRM_LEAD(id_oportunidad_generada);
CREATE INDEX CRM_LEAD_INTERES_I_LEAD ON CRM_LEAD_INTERES(id_lead);
CREATE INDEX CRM_HIST_ESTADO_LEAD_I_LEAD ON CRM_HIST_ESTADO_LEAD(id_lead);