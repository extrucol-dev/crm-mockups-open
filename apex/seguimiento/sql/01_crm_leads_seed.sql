-- ================================================================
-- CRM EXTRUCOL: Seed data para feature LEADS
-- Ejecutar en: APEX SQL Workshop > SQL Commands
-- ================================================================

-- Limpiar datos existentes
DELETE FROM CRM_LEAD_INTERES;
DELETE FROM CRM_HIST_ESTADO_LEAD;
DELETE FROM CRM_LEAD;

-- Reset sequences to start at 1 for explicit ID inserts
BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE CRM_LEAD_SEQ';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
CREATE SEQUENCE CRM_LEAD_SEQ START WITH 1 INCREMENT BY 1 NOCACHE;

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE CRM_LEAD_INTERES_SEQ';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
CREATE SEQUENCE CRM_LEAD_INTERES_SEQ START WITH 1 INCREMENT BY 1 NOCACHE;

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE CRM_HIST_ESTADO_LEAD_SEQ';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
CREATE SEQUENCE CRM_HIST_ESTADO_LEAD_SEQ START WITH 1 INCREMENT BY 1 NOCACHE;

-- ================================================================
-- LEAD 1: Nuevo, WhatsApp, score 60
-- ================================================================
INSERT INTO CRM_LEAD (id_lead, titulo, descripcion, score, id_estado_lead, id_origen_lead,
    nombre_empresa, nombre_contacto, telefono_contacto, email_contacto, id_usuario,
    fecha_creacion, fecha_actualizacion)
VALUES (1,
    'Solicitud cotización tubería para alcantarillado',
    NULL, 60, 1, 5,
    'RB DE COLOMBIA SA', 'Diego Castellanos', '+57 310 456 7890', 'dcastellanos@rbcolombia.com', 1,
    TO_TIMESTAMP('2026-04-29 10:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    TO_TIMESTAMP('2026-04-29 10:00:00', 'YYYY-MM-DD HH24:MI:SS'));

-- ================================================================
-- LEAD 2: Nuevo, WhatsApp, score 40
-- ================================================================
INSERT INTO CRM_LEAD (id_lead, titulo, descripcion, score, id_estado_lead, id_origen_lead,
    nombre_empresa, nombre_contacto, telefono_contacto, email_contacto, id_usuario,
    fecha_creacion, fecha_actualizacion)
VALUES (2,
    'Oferta tubería PE100 para proyecto VIS',
    NULL, 40, 1, 5,
    'INGEOMEGA', 'Diana Imbachi', NULL, NULL, 1,
    TO_TIMESTAMP('2026-04-28 10:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    TO_TIMESTAMP('2026-04-28 10:00:00', 'YYYY-MM-DD HH24:MI:SS'));

-- ================================================================
-- LEAD 3: Nuevo, WhatsApp, score 60
-- ================================================================
INSERT INTO CRM_LEAD (id_lead, titulo, descripcion, score, id_estado_lead, id_origen_lead,
    nombre_empresa, nombre_contacto, telefono_contacto, email_contacto, id_usuario,
    fecha_creacion, fecha_actualizacion)
VALUES (3,
    'Cotización tubería 315mm PN10 para vivienda',
    NULL, 60, 1, 5,
    'GAMO INGENIEROS SAS', 'Andrés García', NULL, NULL, 1,
    TO_TIMESTAMP('2026-04-30 10:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    TO_TIMESTAMP('2026-04-30 10:00:00', 'YYYY-MM-DD HH24:MI:SS'));

-- ================================================================
-- LEAD 4: Contactado, WhatsApp, score 60
-- ================================================================
INSERT INTO CRM_LEAD (id_lead, titulo, descripcion, score, id_estado_lead, id_origen_lead,
    nombre_empresa, nombre_contacto, telefono_contacto, email_contacto, id_usuario,
    fecha_creacion, fecha_actualizacion)
VALUES (4,
    'Cotización accesorio PE para Tocancipa',
    NULL, 60, 2, 5,
    'UNION TEMPORAL BALSA 3', NULL, NULL, NULL, 1,
    TO_TIMESTAMP('2026-04-26 10:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    TO_TIMESTAMP('2026-04-26 10:00:00', 'YYYY-MM-DD HH24:MI:SS'));

-- ================================================================
-- LEAD 5: Contactado, WhatsApp, score 40
-- ================================================================
INSERT INTO CRM_LEAD (id_lead, titulo, descripcion, score, id_estado_lead, id_origen_lead,
    nombre_empresa, nombre_contacto, telefono_contacto, email_contacto, id_usuario,
    fecha_creacion, fecha_actualizacion)
VALUES (5,
    'Oferta tubería 315mm para proyecto VIS',
    NULL, 40, 2, 5,
    'GAMO INGENIEROS', NULL, NULL, NULL, 1,
    TO_TIMESTAMP('2026-04-25 10:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    TO_TIMESTAMP('2026-04-25 10:00:00', 'YYYY-MM-DD HH24:MI:SS'));

-- ================================================================
-- LEAD 6: Interesado, WhatsApp, score 100
-- ================================================================
INSERT INTO CRM_LEAD (id_lead, titulo, descripcion, score, id_estado_lead, id_origen_lead,
    nombre_empresa, nombre_contacto, telefono_contacto, email_contacto, id_usuario,
    fecha_creacion, fecha_actualizacion)
VALUES (6,
    'Solicitud tubería industrial para planta',
    NULL, 100, 3, 5,
    'SOLUCIONES HIDRAULICAS', 'Carlos Mendoza', '+57 315 987 6543', 'cmendoza@solucionhidraulicas.com', 1,
    TO_TIMESTAMP('2026-04-25 10:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    TO_TIMESTAMP('2026-04-25 10:00:00', 'YYYY-MM-DD HH24:MI:SS'));

-- ================================================================
-- LEAD 7: Interesado, Instagram, score 80
-- ================================================================
INSERT INTO CRM_LEAD (id_lead, titulo, descripcion, score, id_estado_lead, id_origen_lead,
    nombre_empresa, nombre_contacto, telefono_contacto, email_contacto, id_usuario,
    fecha_creacion, fecha_actualizacion)
VALUES (7,
    'Cotización manifold para estación',
    NULL, 80, 3, 4,
    'INGENIERIA DEL OCCIDENTE', NULL, NULL, NULL, 1,
    TO_TIMESTAMP('2026-04-27 10:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    TO_TIMESTAMP('2026-04-27 10:00:00', 'YYYY-MM-DD HH24:MI:SS'));

-- ================================================================
-- LEAD 8: Descalificado, Instagram, score 20
-- ================================================================
INSERT INTO CRM_LEAD (id_lead, titulo, descripcion, score, id_estado_lead, id_origen_lead,
    nombre_empresa, nombre_contacto, telefono_contacto, email_contacto, id_usuario,
    id_motivo_descalificacion, motivo_descalificacion_obs,
    fecha_creacion, fecha_actualizacion)
VALUES (8,
    'Proyecto alcantarillado EMSERPRE',
    NULL, 20, 5, 4,
    'EMSERPRE', NULL, NULL, NULL, 1,
    1, 'Sin respuesta después de 3 intentos',
    TO_TIMESTAMP('2026-04-15 10:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    TO_TIMESTAMP('2026-04-15 10:00:00', 'YYYY-MM-DD HH24:MI:SS'));

-- ================================================================
-- LEAD 9: Descalificado, WhatsApp, score 20
-- ================================================================
INSERT INTO CRM_LEAD (id_lead, titulo, descripcion, score, id_estado_lead, id_origen_lead,
    nombre_empresa, nombre_contacto, telefono_contacto, email_contacto, id_usuario,
    id_motivo_descalificacion, motivo_descalificacion_obs,
    fecha_creacion, fecha_actualizacion)
VALUES (9,
    'Tubería HDPE para San Marcos Sucre',
    NULL, 20, 5, 5,
    'GEOCOR', NULL, NULL, NULL, 1,
    2, 'Presupuesto muy bajo para el alcance',
    TO_TIMESTAMP('2026-04-10 10:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    TO_TIMESTAMP('2026-04-10 10:00:00', 'YYYY-MM-DD HH24:MI:SS'));

-- ================================================================
-- LEAD 10: Interesado, detalle completo
-- ================================================================
INSERT INTO CRM_LEAD (id_lead, titulo, descripcion, score, id_estado_lead, id_origen_lead,
    nombre_empresa, nombre_contacto, telefono_contacto, email_contacto, id_usuario,
    fecha_creacion, fecha_actualizacion)
VALUES (10,
    'Cotización proyecto RCI Seren del Mar',
    'Cliente solicita cotización No. 20250626 para proyecto RCI en Seren del Mar, Cartagena. Enviada información técnica de sello FM.',
    100, 3, 5,
    'FIRELINE', 'Santiago Triana', '+57 317 745 9833', 'ventas@fireline.com.co', 1,
    TO_TIMESTAMP('2026-04-18 10:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    TO_TIMESTAMP('2026-04-18 10:00:00', 'YYYY-MM-DD HH24:MI:SS'));

-- ================================================================
-- INTERESES (CRM_LEAD_INTERES)
-- ================================================================
INSERT INTO CRM_LEAD_INTERES (id_lead_interes, id_lead, id_interes)
VALUES (1, 1, 1);

INSERT INTO CRM_LEAD_INTERES (id_lead_interes, id_lead, id_interes)
VALUES (2, 2, 1);

INSERT INTO CRM_LEAD_INTERES (id_lead_interes, id_lead, id_interes)
VALUES (3, 2, 3);

INSERT INTO CRM_LEAD_INTERES (id_lead_interes, id_lead, id_interes)
VALUES (4, 3, 1);

INSERT INTO CRM_LEAD_INTERES (id_lead_interes, id_lead, id_interes)
VALUES (5, 4, 1);

INSERT INTO CRM_LEAD_INTERES (id_lead_interes, id_lead, id_interes)
VALUES (6, 5, 1);

INSERT INTO CRM_LEAD_INTERES (id_lead_interes, id_lead, id_interes)
VALUES (7, 6, 1);

INSERT INTO CRM_LEAD_INTERES (id_lead_interes, id_lead, id_interes)
VALUES (8, 6, 4);

INSERT INTO CRM_LEAD_INTERES (id_lead_interes, id_lead, id_interes)
VALUES (9, 7, 3);

INSERT INTO CRM_LEAD_INTERES (id_lead_interes, id_lead, id_interes)
VALUES (10, 8, 1);

INSERT INTO CRM_LEAD_INTERES (id_lead_interes, id_lead, id_interes)
VALUES (11, 8, 3);

INSERT INTO CRM_LEAD_INTERES (id_lead_interes, id_lead, id_interes)
VALUES (12, 9, 1);

INSERT INTO CRM_LEAD_INTERES (id_lead_interes, id_lead, id_interes)
VALUES (13, 10, 1);

INSERT INTO CRM_LEAD_INTERES (id_lead_interes, id_lead, id_interes)
VALUES (14, 10, 3);

-- ================================================================
-- HISTORIAL DE ESTADOS PARA LEAD 10
-- ================================================================
INSERT INTO CRM_HIST_ESTADO_LEAD (id_historial_lead, id_lead, id_estado_anterior, id_estado_nuevo, fecha_cambio, id_usuario, comentario)
VALUES (1, 10, NULL, 1, TO_TIMESTAMP('2026-04-18 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1, 'Lead recibido por WhatsApp desde página web');

INSERT INTO CRM_HIST_ESTADO_LEAD (id_historial_lead, id_lead, id_estado_anterior, id_estado_nuevo, fecha_cambio, id_usuario, comentario)
VALUES (2, 10, 1, 2, TO_TIMESTAMP('2026-04-20 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1, 'Primera respuesta por WhatsApp, solicita información');

INSERT INTO CRM_HIST_ESTADO_LEAD (id_historial_lead, id_lead, id_estado_anterior, id_estado_nuevo, fecha_cambio, id_usuario, comentario)
VALUES (3, 10, 2, 3, TO_TIMESTAMP('2026-04-23 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1, 'Cliente confirmado, se encuentra en revisión de oferta');

COMMIT;

-- Verificacion
SELECT 'CRM_LEAD' AS entidad, COUNT(*) AS total FROM CRM_LEAD
UNION ALL
SELECT 'CRM_LEAD_INTERES', COUNT(*) FROM CRM_LEAD_INTERES
UNION ALL
SELECT 'CRM_HIST_ESTADO_LEAD', COUNT(*) FROM CRM_HIST_ESTADO_LEAD;