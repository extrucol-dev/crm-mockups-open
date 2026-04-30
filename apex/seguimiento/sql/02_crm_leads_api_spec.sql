-- ================================================================
-- CRM EXTRUCOL: Package SPEC - CRM_LEADS_API
-- Ejecutar en: APEX SQL Workshop > SQL Commands (todo junto)
-- ================================================================

CREATE OR REPLACE PACKAGE CRM_LEADS_API AS

    -- Catalogo general (estados, origenes, intereses, motivos, scores)
    PROCEDURE LEADS_CATALOGOS(p_result OUT SYS_REFCURSOR);

    -- Lista leads con filtros opcionales
    -- p_x01 = id_estado_lead (opcional)
    -- p_x02 = id_usuario (opcional)
    PROCEDURE LEADS_LIST(
        p_result OUT SYS_REFCURSOR,
        p_x01 IN VARCHAR2 DEFAULT NULL,
        p_x02 IN VARCHAR2 DEFAULT NULL
    );

    -- Detalle de un lead por ID
    -- p_x01 = id_lead
    PROCEDURE LEADS_GET(p_result OUT SYS_REFCURSOR, p_x01 IN NUMBER);

    -- Crea un nuevo lead
    -- x01=titulo, x02=descripcion, x03=score, x04=id_estado_lead,
    -- x05=id_origen_lead, x06=id_usuario, x07=nombre_empresa,
    -- x08=nombre_contacto, x09=telefono_contacto, x10=email_contacto,
    -- x11=fecha_creacion, x12=fecha_actualizacion
    PROCEDURE LEADS_CREATE(
        p_result OUT SYS_REFCURSOR,
        p_x01 IN VARCHAR2,
        p_x02 IN VARCHAR2 DEFAULT NULL,
        p_x03 IN NUMBER DEFAULT 60,
        p_x04 IN NUMBER DEFAULT 1,
        p_x05 IN NUMBER DEFAULT 1,
        p_x06 IN NUMBER DEFAULT 1,
        p_x07 IN VARCHAR2 DEFAULT NULL,
        p_x08 IN VARCHAR2 DEFAULT NULL,
        p_x09 IN VARCHAR2 DEFAULT NULL,
        p_x10 IN VARCHAR2 DEFAULT NULL,
        p_x11 IN VARCHAR2 DEFAULT NULL,
        p_x12 IN VARCHAR2 DEFAULT NULL
    );

    -- Actualiza un lead existente
    -- x01=id_lead, x02=titulo, x03=descripcion, x04=score,
    -- x05=id_estado_lead, x06=id_origen_lead, x07=id_usuario,
    -- x08=nombre_empresa, x09=nombre_contacto, x10=telefono_contacto,
    -- x11=email_contacto, x12=fecha_actualizacion
    PROCEDURE LEADS_UPDATE(
        p_result OUT SYS_REFCURSOR,
        p_x01 IN NUMBER,
        p_x02 IN VARCHAR2 DEFAULT NULL,
        p_x03 IN VARCHAR2 DEFAULT NULL,
        p_x04 IN NUMBER DEFAULT NULL,
        p_x05 IN NUMBER DEFAULT NULL,
        p_x06 IN NUMBER DEFAULT NULL,
        p_x07 IN NUMBER DEFAULT NULL,
        p_x08 IN VARCHAR2 DEFAULT NULL,
        p_x09 IN VARCHAR2 DEFAULT NULL,
        p_x10 IN VARCHAR2 DEFAULT NULL,
        p_x11 IN VARCHAR2 DEFAULT NULL,
        p_x12 IN VARCHAR2 DEFAULT NULL
    );

    -- Descalifica un lead
    -- x01=id_lead, x02=id_motivo_descalificacion, x03=motivo_descalificacion_obs
    PROCEDURE LEADS_DESCALIFICAR(
        p_result OUT SYS_REFCURSOR,
        p_x01 IN NUMBER,
        p_x02 IN NUMBER,
        p_x03 IN VARCHAR2 DEFAULT NULL
    );

    -- Convierte lead en oportunidad
    -- x01=id_lead, x02=titulo, x03=id_tipo_oportunidad, x04=id_sector,
    -- x05=descripcion, x06=id_empresa, x07=id_contacto, x08=id_usuario,
    -- x09=valor_estimado, x10=fecha_cierre_estimada, x11=probabilidad_cierre,
    -- x12=id_estado_oportunidad, x13=id_lead_origen
    PROCEDURE LEADS_CONVERTIR(
        p_result OUT SYS_REFCURSOR,
        p_x01 IN NUMBER,
        p_x02 IN VARCHAR2,
        p_x03 IN NUMBER DEFAULT 1,
        p_x04 IN NUMBER DEFAULT 1,
        p_x05 IN VARCHAR2 DEFAULT NULL,
        p_x06 IN NUMBER DEFAULT NULL,
        p_x07 IN NUMBER DEFAULT NULL,
        p_x08 IN NUMBER DEFAULT NULL,
        p_x09 IN VARCHAR2 DEFAULT NULL,
        p_x10 IN VARCHAR2 DEFAULT NULL,
        p_x11 IN NUMBER DEFAULT 50,
        p_x12 IN NUMBER DEFAULT 1,
        p_x13 IN NUMBER DEFAULT NULL
    );

    -- Historial de cambios de estado de un lead
    -- x01=id_lead
    PROCEDURE LEADS_HISTORIAL(p_result OUT SYS_REFCURSOR, p_x01 IN NUMBER);

    -- Agrega un interes a un lead
    -- x01=id_lead, x02=id_interes
    PROCEDURE LEADS_AGREGAR_INTERES(
        p_result OUT SYS_REFCURSOR,
        p_x01 IN NUMBER,
        p_x02 IN NUMBER
    );

    -- Quita un interes de un lead
    -- x01=id_lead, x02=id_interes
    PROCEDURE LEADS_QUITAR_INTERES(
        p_result OUT SYS_REFCURSOR,
        p_x01 IN NUMBER,
        p_x02 IN NUMBER
    );

END CRM_LEADS_API;