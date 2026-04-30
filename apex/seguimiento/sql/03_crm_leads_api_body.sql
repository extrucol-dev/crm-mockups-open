-- ================================================================
-- CRM EXTRUCOL: Package BODY - CRM_LEADS_API
-- Ejecutar en: APEX SQL Workshop > SQL Commands
-- ================================================================

CREATE OR REPLACE PACKAGE BODY CRM_LEADS_API AS

-- ================================================================
-- HELPERS PRIVADOS
-- ================================================================

PROCEDURE INSERTAR_HISTORIAL(
    p_id_lead IN NUMBER,
    p_id_estado_anterior IN NUMBER,
    p_id_estado_nuevo IN NUMBER,
    p_id_usuario IN NUMBER,
    p_comentario IN VARCHAR2 DEFAULT NULL
) IS
BEGIN
    INSERT INTO CRM_HIST_ESTADO_LEAD
        (id_lead, id_estado_anterior, id_estado_nuevo, fecha_cambio, id_usuario, comentario)
    VALUES
        (p_id_lead, p_id_estado_anterior, p_id_estado_nuevo, SYSTIMESTAMP, p_id_usuario, p_comentario);
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END;

-- ================================================================
-- CATALOGOS
-- ================================================================
PROCEDURE LEADS_CATALOGOS(p_result OUT SYS_REFCURSOR) IS
BEGIN
    OPEN p_result FOR
    SELECT * FROM (
        SELECT 'ESTADO' AS catalogo_tipo, e.id_estado_lead AS catalogo_id, e.nombre AS catalogo_label, e.tipo AS estado_tipo, e.orden AS catalogo_orden FROM CRM_ESTADO_LEAD e
        UNION ALL
        SELECT 'ORIGEN', o.id_origen_lead, o.nombre, NULL, NULL FROM CRM_ORIGEN_LEAD o
        UNION ALL
        SELECT 'INTERES', i.id_interes, i.nombre, NULL, NULL FROM CRM_INTERES i
        UNION ALL
        SELECT 'MOTIVO_DESCALIF', m.id_motivo_descalificacion, m.nombre, NULL, NULL FROM CRM_MOTIVO_DESCALIFICACION m
        UNION ALL
        SELECT 'SCORE', 20, 'Frío', NULL, NULL FROM DUAL
        UNION ALL SELECT 'SCORE', 40, 'Tibio', NULL, NULL FROM DUAL
        UNION ALL SELECT 'SCORE', 60, 'Cálido', NULL, NULL FROM DUAL
        UNION ALL SELECT 'SCORE', 80, 'Caliente', NULL, NULL FROM DUAL
        UNION ALL SELECT 'SCORE', 100, 'Muy caliente', NULL, NULL FROM DUAL
    ) ORDER BY 1, 2;
END;

-- ================================================================
-- LIST
-- ================================================================
PROCEDURE LEADS_LIST(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN VARCHAR2 DEFAULT NULL,
    p_x02 IN VARCHAR2 DEFAULT NULL
) IS
BEGIN
    OPEN p_result FOR
    SELECT
        l.id_lead,
        l.titulo,
        l.descripcion,
        l.score,
        l.id_estado_lead,
        e.nombre            AS estado_nombre,
        l.id_origen_lead,
        o.nombre            AS origen_nombre,
        l.fecha_creacion,
        l.fecha_actualizacion,
        l.nombre_empresa,
        l.nombre_contacto,
        l.telefono_contacto,
        l.email_contacto,
        l.id_usuario,
        l.id_oportunidad_generada,
        l.id_motivo_descalificacion,
        l.motivo_descalificacion_obs,
        u.nombre            AS ejecutivo_nombre,
        (SELECT LISTAGG(li.id_interes, ',') WITHIN GROUP (ORDER BY li.id_interes)
         FROM CRM_LEAD_INTERES li WHERE li.id_lead = l.id_lead) AS intereses_csv
    FROM CRM_LEAD l
    JOIN CRM_ESTADO_LEAD e ON e.id_estado_lead = l.id_estado_lead
    JOIN CRM_ORIGEN_LEAD o ON o.id_origen_lead = l.id_origen_lead
    LEFT JOIN CRM_USUARIO u ON u.id_usuario = l.id_usuario
    WHERE (p_x01 IS NULL OR l.id_estado_lead = TO_NUMBER(p_x01))
      AND (p_x02 IS NULL OR l.id_usuario = TO_NUMBER(p_x02))
    ORDER BY l.fecha_creacion DESC;
END;

-- ================================================================
-- GET
-- ================================================================
PROCEDURE LEADS_GET(p_result OUT SYS_REFCURSOR, p_x01 IN NUMBER) IS
BEGIN
    OPEN p_result FOR
    SELECT
        l.id_lead,
        l.titulo,
        l.descripcion,
        l.score,
        l.id_estado_lead,
        e.nombre            AS estado_nombre,
        l.id_origen_lead,
        o.nombre            AS origen_nombre,
        l.fecha_creacion,
        l.fecha_actualizacion,
        l.nombre_empresa,
        l.nombre_contacto,
        l.telefono_contacto,
        l.email_contacto,
        l.id_usuario,
        l.id_oportunidad_generada,
        l.id_motivo_descalificacion,
        l.motivo_descalificacion_obs,
        u.nombre            AS ejecutivo_nombre
    FROM CRM_LEAD l
    JOIN CRM_ESTADO_LEAD e ON e.id_estado_lead = l.id_estado_lead
    JOIN CRM_ORIGEN_LEAD o ON o.id_origen_lead = l.id_origen_lead
    LEFT JOIN CRM_USUARIO u ON u.id_usuario = l.id_usuario
    WHERE l.id_lead = p_x01;
END;

-- ================================================================
-- CREATE
-- ================================================================
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
) IS
    v_id_lead NUMBER;
    v_now TIMESTAMP := SYSTIMESTAMP;
BEGIN
    INSERT INTO CRM_LEAD (
        titulo, descripcion, score, id_estado_lead, id_origen_lead,
        id_usuario, nombre_empresa, nombre_contacto, telefono_contacto, email_contacto,
        fecha_creacion, fecha_actualizacion
    ) VALUES (
        p_x01, p_x02, p_x03, p_x04, p_x05,
        p_x06, p_x07, p_x08, p_x09, p_x10,
        COALESCE(TO_TIMESTAMP(p_x11), v_now),
        COALESCE(TO_TIMESTAMP(p_x12), v_now)
    ) RETURNING id_lead INTO v_id_lead;

    INSERTAR_HISTORIAL(v_id_lead, NULL, p_x04, p_x06, 'Lead creado');

    OPEN p_result FOR
    SELECT v_id_lead AS id_lead, 'true' AS success FROM DUAL;
EXCEPTION
    WHEN OTHERS THEN
        OPEN p_result FOR
        SELECT '0' AS id_lead, 'false' AS success, DBMS_UTILITY.FORMAT_ERROR_STACK AS err_msg FROM DUAL;
END;

-- ================================================================
-- UPDATE
-- ================================================================
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
) IS
    v_estado_anterior NUMBER;
BEGIN
    SELECT id_estado_lead INTO v_estado_anterior FROM CRM_LEAD WHERE id_lead = p_x01;

    UPDATE CRM_LEAD SET
        titulo              = NVL(p_x02, titulo),
        descripcion         = NVL(p_x03, descripcion),
        score               = NVL(p_x04, score),
        id_estado_lead      = NVL(p_x04, id_estado_lead),
        id_origen_lead      = NVL(p_x05, id_origen_lead),
        id_usuario          = NVL(p_x07, id_usuario),
        nombre_empresa      = NVL(p_x08, nombre_empresa),
        nombre_contacto     = NVL(p_x09, nombre_contacto),
        telefono_contacto   = NVL(p_x10, telefono_contacto),
        email_contacto      = NVL(p_x11, email_contacto),
        fecha_actualizacion = NVL(TO_TIMESTAMP(p_x12), SYSTIMESTAMP)
    WHERE id_lead = p_x01;

    IF p_x04 IS NOT NULL AND v_estado_anterior != p_x04 THEN
        INSERTAR_HISTORIAL(p_x01, v_estado_anterior, p_x04, p_x07, 'Lead actualizado');
    END IF;

    OPEN p_result FOR SELECT 'true' AS success FROM DUAL;
EXCEPTION
    WHEN OTHERS THEN
        OPEN p_result FOR
        SELECT 'false' AS success, DBMS_UTILITY.FORMAT_ERROR_STACK AS err_msg FROM DUAL;
END;

-- ================================================================
-- DESCALIFICAR
-- ================================================================
PROCEDURE LEADS_DESCALIFICAR(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER,
    p_x02 IN NUMBER,
    p_x03 IN VARCHAR2 DEFAULT NULL
) IS
    v_estado_descalif NUMBER;
    v_estado_anterior NUMBER;
    v_usuario NUMBER;
BEGIN
    SELECT id_estado_lead, id_usuario INTO v_estado_anterior, v_usuario
    FROM CRM_LEAD WHERE id_lead = p_x01;

    SELECT id_estado_lead INTO v_estado_descalif
    FROM CRM_ESTADO_LEAD WHERE tipo = 'DESCALIFICADO' AND ROWNUM = 1;

    UPDATE CRM_LEAD SET
        id_estado_lead            = v_estado_descalif,
        id_motivo_descalificacion = p_x02,
        motivo_descalificacion_obs = p_x03,
        fecha_actualizacion       = SYSTIMESTAMP
    WHERE id_lead = p_x01;

    INSERTAR_HISTORIAL(p_x01, v_estado_anterior, v_estado_descalif, v_usuario,
        'Lead descalificado: ' || p_x03);

    OPEN p_result FOR SELECT 'true' AS success FROM DUAL;
EXCEPTION
    WHEN OTHERS THEN
        OPEN p_result FOR
        SELECT 'false' AS success, DBMS_UTILITY.FORMAT_ERROR_STACK AS err_msg FROM DUAL;
END;

-- ================================================================
-- CONVERTIR
-- ================================================================
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
) IS
    v_id_oportunidad NUMBER;
    v_estado_anterior NUMBER;
    v_usuario_lead NUMBER;
BEGIN
    SELECT id_estado_lead, id_usuario INTO v_estado_anterior, v_usuario_lead
    FROM CRM_LEAD WHERE id_lead = p_x01;

    INSERT INTO CRM_OPORTUNIDAD (id_oportunidad, titulo, descripcion, id_tipo_oportunidad, id_sector, id_empresa, id_usuario, valor_estimado, fecha_cierre_estimada, probabilidad_cierre, id_estado_oportunidad, id_lead_origen, fecha_creacion, fecha_actualizacion)
    VALUES (CRM_OPORTUNIDAD_SEQ.NEXTVAL, p_x02, p_x05, p_x03, p_x04, p_x06, p_x08, TO_NUMBER(p_x09), TO_DATE(p_x10, 'YYYY-MM-DD'), p_x11, p_x12, NVL(p_x13, p_x01), SYSTIMESTAMP, SYSTIMESTAMP);

    SELECT CRM_OPORTUNIDAD_SEQ.CURRVAL INTO v_id_oportunidad FROM DUAL;

    UPDATE CRM_LEAD SET
        id_oportunidad_generada = v_id_oportunidad,
        id_estado_lead          = 3,
        fecha_actualizacion     = SYSTIMESTAMP
    WHERE id_lead = p_x01;

    INSERTAR_HISTORIAL(p_x01, v_estado_anterior, 3, NVL(p_x08, v_usuario_lead),
        'Lead convertido a oportunidad #' || v_id_oportunidad);

    OPEN p_result FOR
    SELECT v_id_oportunidad AS id_oportunidad, 'true' AS success FROM DUAL;
EXCEPTION
    WHEN OTHERS THEN
        OPEN p_result FOR
        SELECT '0' AS id_oportunidad, 'false' AS success, DBMS_UTILITY.FORMAT_ERROR_STACK AS err_msg FROM DUAL;
END;

-- ================================================================
-- HISTORIAL
-- ================================================================
PROCEDURE LEADS_HISTORIAL(p_result OUT SYS_REFCURSOR, p_x01 IN NUMBER) IS
BEGIN
    OPEN p_result FOR
    SELECT
        h.id_historial_lead,
        h.id_lead,
        h.id_estado_anterior,
        ea.nombre AS estado_anterior_nombre,
        h.id_estado_nuevo,
        en.nombre AS estado_nuevo_nombre,
        h.fecha_cambio,
        h.id_usuario,
        u.nombre AS usuario_nombre,
        h.comentario
    FROM CRM_HIST_ESTADO_LEAD h
    LEFT JOIN CRM_ESTADO_LEAD ea ON ea.id_estado_lead = h.id_estado_anterior
    JOIN CRM_ESTADO_LEAD en ON en.id_estado_lead = h.id_estado_nuevo
    LEFT JOIN CRM_USUARIO u ON u.id_usuario = h.id_usuario
    WHERE h.id_lead = p_x01
    ORDER BY h.fecha_cambio DESC;
END;

-- ================================================================
-- AGREGAR_INTERES
-- ================================================================
PROCEDURE LEADS_AGREGAR_INTERES(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER,
    p_x02 IN NUMBER
) IS
BEGIN
    INSERT INTO CRM_LEAD_INTERES (id_lead, id_interes)
    VALUES (p_x01, p_x02);
    OPEN p_result FOR SELECT 'true' AS success FROM DUAL;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        OPEN p_result FOR SELECT 'true' AS success, 'ya existe' AS info FROM DUAL;
    WHEN OTHERS THEN
        OPEN p_result FOR SELECT 'false' AS success, DBMS_UTILITY.FORMAT_ERROR_STACK AS err_msg FROM DUAL;
END;

-- ================================================================
-- QUITAR_INTERES
-- ================================================================
PROCEDURE LEADS_QUITAR_INTERES(
    p_result OUT SYS_REFCURSOR,
    p_x01 IN NUMBER,
    p_x02 IN NUMBER
) IS
BEGIN
    DELETE FROM CRM_LEAD_INTERES WHERE id_lead = p_x01 AND id_interes = p_x02;
    OPEN p_result FOR SELECT 'true' AS success FROM DUAL;
EXCEPTION
    WHEN OTHERS THEN
        OPEN p_result FOR SELECT 'false' AS success, DBMS_UTILITY.FORMAT_ERROR_STACK AS err_msg FROM DUAL;
END;

END CRM_LEADS_API;